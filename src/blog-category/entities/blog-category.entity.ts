import { BlogPost } from 'src/blog-post/entities/blog-post.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StatusOptions {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity()
export class BlogCategory {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  slug: string;

  @Column({ unique: true })
  uuid: string;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: StatusOptions,
    default: StatusOptions.ACTIVE,
  })
  status: StatusOptions;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  created_at: Date;

  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updated_at: Date;

  @OneToMany(() => BlogPost, (blog_post) => blog_post.blog_category)
  blog_post: BlogPost;
}
