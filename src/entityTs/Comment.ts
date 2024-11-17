import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { User } from './User';
import { Base } from './Base';
import { EmotionComment } from './EmotionComment';

@Entity({ name: 'comment' })
export class Comment extends Base {
  @Column({ type: 'uuid' })
  postId!: string;

  @Column({ type: 'uuid' })
  commentator!: string;

  @Column({ type: 'uuid', nullable: true })
  parentCommentId?: string;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'commentator', referencedColumnName: 'id' })
  commentatorInfo!: User;

  @OneToMany(
    () => EmotionComment,
    (emotionComment) => emotionComment.commentId,
    { cascade: true }
  )
  emotions: EmotionComment[];
}
