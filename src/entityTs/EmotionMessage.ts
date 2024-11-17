import { Entity, Column, Unique } from 'typeorm';
import { Base } from './Base';

@Entity({ name: 'emotion_message' })
@Unique(['messageId', 'userId'])
export class EmotionMessage extends Base {
  @Column({ type: 'uuid' })
  messageId!: string;

  @Column({ type: 'uuid' })
  userId!: string;

  @Column({ type: 'varchar' })
  emo!: string;
}
