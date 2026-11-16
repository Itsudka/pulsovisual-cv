import {
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import {
  GetObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

import { Upload } from '@aws-sdk/lib-storage';

import {
  getSignedUrl,
} from '@aws-sdk/s3-request-presigner';

import {
  createReadStream,
} from 'fs';


// ==========================
// STORAGE SERVICE
// ==========================

@Injectable()
export class StorageService {

  // ==========================
  // CONFIGURACION
  // ==========================

  private readonly bucket =
    process.env.S3_BUCKET
    ?? 'analysis-outputs';


  private readonly s3Client =
    new S3Client({
      endpoint:
        process.env.AWS_ENDPOINT_URL_S3,

      region:
        process.env.AWS_REGION
        ?? 'us-east-2',

      credentials: {
        accessKeyId:
          process.env.AWS_ACCESS_KEY_ID
          ?? '',

        secretAccessKey:
          process.env.AWS_SECRET_ACCESS_KEY
          ?? '',
      },

      forcePathStyle: true,
    });


  // ==========================
  // SUBIR VIDEO
  // ==========================

  async uploadVideo(
    filePath: string,
    key: string,
  ): Promise<string> {

    try {
      const upload =
        new Upload({
          client:
            this.s3Client,

          params: {
            Bucket:
              this.bucket,

            Key:
              key,

            Body:
              createReadStream(
                filePath,
              ),

            ContentType:
              'video/mp4',
          },
        });


      await upload.done();

      return key;

    } catch (error) {
      console.error(
        'ERROR AL SUBIR VIDEO:',
        error,
      );

      throw new InternalServerErrorException(
        'No fue posible almacenar el video procesado',
      );
    }
  }


  // ==========================
  // SUBIR TRAYECTORIAS
  // ==========================

  async uploadTrajectories(
    filePath: string,
    key: string,
  ): Promise<string> {

    try {
      const upload = new Upload({
        client: this.s3Client,

        params: {
          Bucket: this.bucket,

          Key: key,

          Body: createReadStream(
            filePath,
          ),

          ContentType: 'application/json',
        },
      });

      await upload.done();

      return key;

    } catch (error) {
      console.error(
        'ERROR AL SUBIR TRAYECTORIAS:',
        error,
      );

      throw new InternalServerErrorException(
        'No fue posible almacenar las trayectorias',
      );
    }
  }



  // ==========================
  // URL FIRMADA
  // ==========================

  async getSignedVideoUrl(
    key: string,
  ): Promise<string> {

    const command =
      new GetObjectCommand({
        Bucket:
          this.bucket,

        Key:
          key,
      });


    return getSignedUrl(
      this.s3Client,
      command,
      {
        expiresIn:
          60 * 60,
      },
    );
  }


  // ==========================
  // OBTENER TRAYECTORIAS
  // ==========================

  async getTrajectories(
    key: string,
  ): Promise<unknown> {

    try {
      const response = await this.s3Client.send(
        new GetObjectCommand({
          Bucket: this.bucket,
          Key: key,
        }),
      );

      if (!response.Body) {
        throw new Error(
          'El archivo de trayectorias está vacío',
        );
      }

      const content =
        await response.Body.transformToString();

      return JSON.parse(content) as unknown;

    } catch (error) {
      console.error(
        'ERROR AL OBTENER TRAYECTORIAS:',
        error,
      );

      throw new InternalServerErrorException(
        'No fue posible recuperar las trayectorias',
      );
    }
  }



}