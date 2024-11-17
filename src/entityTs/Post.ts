import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { PostVisibility } from './PostVisibility';
import { PictureOfPost } from './PictureOfPost';
import { EmotionPost } from './EmotionPost';
import { Base } from './Base';

@Entity({ name: 'post' })
export class Post extends Base {
  @Column({ type: 'uuid' })
  poster!: string;

  @Column({ type: 'int' })
  visibilityTypeId!: number;

  @Column({ type: 'text', nullable: true })
  content?: string;

  @ManyToOne(() => PostVisibility)
  @JoinColumn({ name: 'visibilityTypeId', referencedColumnName: 'id' })
  visibility!: PostVisibility;

  @OneToMany(() => PictureOfPost, (picture) => picture.postId, {
    cascade: true,
  })
  pictures!: PictureOfPost[];

  @OneToMany(() => EmotionPost, (emotion) => emotion.postId, { cascade: true })
  emotions!: EmotionPost[];
}
