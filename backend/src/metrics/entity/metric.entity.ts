import { Analysis } from '../../analyses/entity/analysis.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'metrics' })
export class Metric {

  @PrimaryGeneratedColumn()
  id!: number;

  @Column({
    name: 'analysis_id',
    type: 'integer',
    unique: true,
  })
  analysisId!: number;

  @OneToOne(() => Analysis, (analysis) => analysis.metric, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({
    name: 'analysis_id',
  })
  analysis!: Analysis;

  @Column({
    name: 'detected_track_count',
    type: 'integer',
    default: 0,
  })
  detectedTrackCount!: number;

  @Column({
    name: 'flow_up_count',
    type: 'integer',
    default: 0,
  })
  flowUpCount!: number;

  @Column({
    name: 'flow_down_count',
    type: 'integer',
    default: 0,
  })
  flowDownCount!: number;

  @Column({
    name: 'average_dwell_seconds',
    type: 'numeric',
    precision: 10,
    scale: 2,
    default: 0,
  })
  averageDwellSeconds!: number;

  @CreateDateColumn({
    name: 'created_at',
    type: 'timestamptz',
  })
  createdAt!: Date;
}