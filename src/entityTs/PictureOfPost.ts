import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Post } from './Post';
import { Base } from './Base';

@Entity({ name: 'picture_of_post' })
export class PictureOfPost extends Base {
  @Column({ type: 'uuid' })
  postId!: string;

  @Column({ type: 'varchar' })
  picture!: string;

  @ManyToOne(() => Post)
  @JoinColumn({ name: 'postId', referencedColumnName: 'id' })
  visibility!: Post;
}
