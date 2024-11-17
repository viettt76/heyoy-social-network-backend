import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { NotificationType } from './NotificationType';
import { Base } from './Base';

@Entity({ name: 'notifications' })
export class Notifications extends Base {
  @Column({ type: 'uuid' })
  userId: string;

  @Column({ type: 'uuid' })
  senderId: string;

  @Column({ type: 'int' })
  type: number;

  @Column({ type: 'uuid' })
  relatedId: string;

  @Column({ type: 'text' })
  content: string;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isOpenMenu: boolean;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'userId', referencedColumnName: 'id' })
  receiver: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId', referencedColumnName: 'id' })
  sender: User;

  @ManyToOne(() => NotificationType)
  @JoinColumn({ name: 'type', referencedColumnName: 'id' })
  notificationType: NotificationType;
}
