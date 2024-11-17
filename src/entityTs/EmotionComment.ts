import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { EmotionType } from './EmotionType';
import { User } from './User';
import { Base } from './Base';

@Entity('emotion_comment')
@Unique(['commentId', 'userId'])
export class EmotionComment extends Base {
  @Column('uuid')
  commentId: string;

  @Column('uuid')
  userId: string;

  @Column('int')
  emotionTypeId: number;

  @ManyToOne(() => EmotionType)
  @JoinColumn({ name: 'emotionTypeId', referencedColumnName: 'id' })
  emotion: EmotionType;

  @ManyToOne(() => User, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  userInfo: User;
}
