import { BlogCategory } from 'src/blog-category/entities/blog-category.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PUBLISH = 'Publish',
}

@Entity()
export class BlogPost {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  slug: string;

  @Column({ unique: true })
  uuid: string;

  @Column()
  title: string;

  @Column('text')
  description: string;

  @Column()
  image: string;

  @Column({
    type: 'enum',
    enum: StatusEnum,
    default: StatusEnum.INACTIVE,
  })
  status: StatusEnum;

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
  update_at: Date;

  @ManyToOne(() => BlogCategory, (blog_category) => blog_category.blog_post) // specify inverse side as a second parameter
  @JoinColumn({ name: 'blog_category_id' })
  blog_category: BlogCategory;

  @ManyToOne(() => User, (user) => user.blog_post, { onDelete: 'CASCADE' }) // specify inverse side as a second parameter
  @JoinColumn({ name: 'author' })
  user: User;
}
