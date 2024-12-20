import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { EmotionType } from './EmotionType';
import { User } from './User';
import { Base } from './Base';

@Entity('emotion_post')
@Unique(['postId', 'userId'])
export class EmotionPost extends Base {
  @Column('uuid')
  postId: string;

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
