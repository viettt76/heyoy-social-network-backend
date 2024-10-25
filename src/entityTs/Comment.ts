import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  EventSubscriber,
  EntitySubscriberInterface,
  SelectQueryBuilder,
} from 'typeorm';
import { User } from './User';

@Entity({ name: 'comment' })
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ type: 'uuid' })
  postId!: string;

  @Column({ type: 'uuid' })
  commentator!: string;

  @Column({ type: 'uuid', nullable: true })
  parentCommentId?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @CreateDateColumn()
  createdAt!: Date;

  @UpdateDateColumn()
  updatedAt!: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'commentator', referencedColumnName: 'id' })
  commentatorInfo!: User;

  entities: [];
}
