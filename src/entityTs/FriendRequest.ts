import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { User } from './User';
import { Base } from './Base';

@Entity({ name: 'friend_request' })
@Unique(['senderId', 'receiverId'])
export class FriendRequest extends Base {
  @Column({ type: 'uuid' })
  senderId!: string;

  @Column({ type: 'uuid' })
  receiverId!: string;

  @ManyToOne(() => User, (user) => user.friendRequestAsSender, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'senderId', referencedColumnName: 'id' })
  sender!: User;

  @ManyToOne(() => User, (user) => user.friendRequestAsReceiver, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'receiverId', referencedColumnName: 'id' })
  receiver!: User;
}
