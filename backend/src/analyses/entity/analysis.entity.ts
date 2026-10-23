import { Sector } from 'src/sectors/entity.ts/sector.entity';
import { Metric } from '../../metrics/entity/metric.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';



@Entity({ name: 'analyses' })
export class Analysis {

  @PrimaryGeneratedColumn()
  id!: number;


  @Column({
    name: 'sector_id',
    type: 'integer',
  })
  sectorId!: number;

  @ManyToOne(() => Sector, (sector) => sector.analyses, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'sector_id',
  })
  sector!: Sector;

  @Column({
    type: 'varchar',
    length: 150,
  })
  name!: string;

  @Column({
    name: 'recorded_at',
    type: 'timestamp',
  })
  recordedAt!: Date;

  @Column({
    name: 'original_filename',
    type: 'varchar',
    length: 255,
  })
  originalFilename!: string;

  @Column({
    name: 'video_duration_seconds',
    type: 'numeric',
    precision: 10,
    scale: 2,
    nullable: true,
  })
  videoDurationSeconds!: number | null;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'PENDING',
  })
  status!: string;

  @Column({
    name: 'flow_line_orientation',
    type: 'varchar',
    length: 20,
  })
  flowLineOrientation!: string;

  @Column({
    name: 'flow_line_position',
    type: 'integer',
  })
  flowLinePosition!: number;

  @Column({
    name: 'flow_tolerance_px',
    type: 'integer',
    default: 10,
  })
  flowTolerancePx!: number;

  @Column({
    name: 'processed_at',
    type: 'timestamptz',
    nullable: true,
  })
  processedAt!: Date | null;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;

  @UpdateDateColumn({
    name: 'updated_at',
    type: 'timestamptz',
  })
  updatedAt!: Date;

  @OneToOne(() => Metric, (metric) => metric.analysis)
  metric!: Metric;
}