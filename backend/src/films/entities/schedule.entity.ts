import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryColumn,
} from 'typeorm';

import { Film } from './film.entity';

@Entity({ name: 'schedules' })
export class Schedule {
  @PrimaryColumn('uuid')
  id: string;

  @Column('timestamptz')
  daytime: string;

  @Column('int')
  hall: number;

  @Column('int')
  rows: number;

  @Column('int')
  seats: number;

  @Column('int')
  price: number;

  @Column('text', { array: true, default: () => 'ARRAY[]::text[]' })
  taken: string[];

  @Column({ name: 'film_id' })
  filmId: string;

  @ManyToOne(() => Film, (film) => film.schedule, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'film_id' })
  film: Film;
}
