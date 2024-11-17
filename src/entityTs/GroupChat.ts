import { Entity, Column, OneToMany } from 'typeorm';
import { GroupMember } from './GroupMember';
import { Base } from './Base';

@Entity({ name: 'group_chat' })
export class GroupChat extends Base {
  @Column({ type: 'varchar' })
  name!: string;

  @Column({ type: 'varchar', nullable: true })
  avatar?: string;

  @Column({ type: 'uuid' })
  administratorId!: string;

  @OneToMany(() => GroupMember, (groupMember) => groupMember.groupChat)
  members: GroupMember[];
}
