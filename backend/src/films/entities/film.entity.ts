import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';

import { Schedule } from './schedule.entity';

@Entity({ name: 'films' })
export class Film {
  @PrimaryColumn('uuid')
  id: string;

  @Column('real')
  rating: number;

  @Column()
  director: string;

  @Column('text', { array: true })
  tags: string[];

  @Column()
  image: string;

  @Column()
  cover: string;

  @Column()
  title: string;

  @Column('text')
  about: string;

  @Column('text')
  description: string;

  @OneToMany(() => Schedule, (schedule) => schedule.film, {
    cascade: true,
  })
  schedule: Schedule[];
}
