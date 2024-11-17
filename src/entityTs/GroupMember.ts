import { Entity, Column, ManyToOne, JoinColumn, Unique } from 'typeorm';
import { GroupChat } from './GroupChat';
import { User } from './User';
import { Base } from './Base';

@Entity({ name: 'group_member' })
@Unique(['groupChatId', 'memberId'])
export class GroupMember extends Base {
  @Column({ type: 'uuid' })
  groupChatId!: string;

  @Column({ type: 'uuid' })
  memberId!: string;

  @Column({ type: 'varchar', nullable: true })
  nickname?: string;

  @ManyToOne(() => GroupChat)
  @JoinColumn({ name: 'groupChatId', referencedColumnName: 'id' })
  groupChat: GroupChat;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'memberId', referencedColumnName: 'id' })
  user: User;
}
