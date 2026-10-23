import { Sector } from 'src/sectors/entity.ts/sector.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity({ name: 'users' })
export class User {
  // ==========================
  // IDENTIFICADOR
  // ==========================

  @PrimaryGeneratedColumn()
  id!: number;

  // ==========================
  // INFORMACION DEL USUARIO
  // ==========================

  @Column({
    type: 'varchar',
    length: 100,
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: 150,
    unique: true,
  })
  email!: string;

  // ==========================
  // AUTENTICACION
  // ==========================

  @Column({
    name: 'password_hash',
    type: 'varchar',
    length: 255,
  })
  passwordHash!: string;

  // ==========================
  // ESTADO
  // ==========================

  @Column({
    name: 'is_active',
    type: 'boolean',
    default: true,
  })
  isActive!: boolean;

  // ==========================
  // FECHAS
  // ==========================

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

// ==========================
// SECTORES
// ==========================

@OneToMany(() => Sector, (sector) => sector.user)
sectors!: Sector[];
}