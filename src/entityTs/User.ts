import { Entity, Column, OneToMany, Index } from 'typeorm';
import { Relationship } from './Relationship';
import { Comment } from './Comment';
import { FriendRequest } from './FriendRequest';
import { GroupMember } from './GroupMember';
import { Message } from './Message';
import { Notifications } from './Notifications';
import { Base } from './Base';

@Entity('user')
export class User extends Base {
  @Column({ type: 'varchar' })
  firstName: string;

  @Column({ type: 'varchar' })
  lastName: string;

  @Column({ type: 'varchar' })
  username: string;

  @Column({ type: 'varchar' })
  password: string;

  @Column({ nullable: true })
  birthday: Date;

  @Column({ type: 'enum', enum: ['male', 'female', 'other'], default: 'male' })
  gender: 'male' | 'female' | 'other';

  @Column({ type: 'varchar', nullable: true })
  @Index('IDX_USER_HOME_TOWN')
  homeTown: string | null;

  @Column({ type: 'varchar', nullable: true })
  @Index('IDX_USER_SCHOOL')
  school: string | null;

  @Column({ type: 'varchar', nullable: true })
  @Index('IDX_USER_WORKPLACE')
  workplace: string | null;

  @Column({ type: 'varchar', nullable: true })
  avatar: string | null;

  @Column({ default: false })
  isPrivate: boolean;

  @OneToMany(() => Relationship, (relationship) => relationship.user1Info)
  relationshipAsUser1: Relationship[];

  @OneToMany(() => Relationship, (relationship) => relationship.user2Info)
  relationshipAsUser2: Relationship[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.sender)
  friendRequestAsSender: FriendRequest[];

  @OneToMany(() => FriendRequest, (friendRequest) => friendRequest.receiver)
  friendRequestAsReceiver: FriendRequest[];

  @OneToMany(() => Comment, (comment) => comment.commentatorInfo, {
    cascade: ['soft-remove'],
    onDelete: 'CASCADE',
  })
  comments: Comment[];

  @OneToMany(() => GroupMember, (groupMember) => groupMember.user)
  groupMembers: GroupMember[];

  @OneToMany(() => Message, (message) => message.senderInfo)
  messages: Message[];

  @OneToMany(() => Notifications, (notification) => notification.receiver)
  receiverInfo: Notification[];
}
