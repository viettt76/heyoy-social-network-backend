import { Entity, Column, ManyToOne, JoinColumn, Index } from 'typeorm';
import { User } from './User';
import { Base } from './Base';

@Entity({ name: 'message' })
@Index('IDX_MESSAGE_SENDER_RECEIVER', ['sender', 'receiver'])
export class Message extends Base {
  @Column({ type: 'uuid' })
  sender!: string;

  @Column({ type: 'uuid', nullable: true })
  receiver?: string;

  @Column({ type: 'uuid', nullable: true })
  recipientGroup?: string;

  @Column({ type: 'text', nullable: true })
  message?: string;

  @Column({ type: 'varchar', nullable: true })
  picture?: string;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'sender', referencedColumnName: 'id' })
  senderInfo: User;
}
