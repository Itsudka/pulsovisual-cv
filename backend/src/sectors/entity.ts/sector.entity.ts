import { Analysis } from 'src/analyses/entity/analysis.entity';
import { User } from 'src/users/entity/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';



@Entity({ name: 'sectors' })
export class Sector {
  // ==========================
  // IDENTIFICADOR
  // ==========================

  @PrimaryGeneratedColumn()
  id!: number;

  // ==========================
  // USUARIO
  // ==========================

  @Column({
    name: 'user_id',
    type: 'integer',
  })
  userId!: number;

  @ManyToOne(() => User, (user) => user.sectors, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'user_id',
  })
  user!: User;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name!: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  description!: string | null;

  @Column({
    type: 'varchar',
    length: 50,
  })
  type!: string;

  @Column({
    type: 'varchar',
    length: 20,
    default: 'ACTIVE',
  })
  status!: string;

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
    // ANALISIS
    // ==========================

    @OneToMany(() => Analysis, (analysis) => analysis.sector)
    analyses!: Analysis[];
}