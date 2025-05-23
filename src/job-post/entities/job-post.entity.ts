import { JobApplication } from 'src/job-application/entities/job-application.entity';
import { JobCategory } from 'src/job-category/entities/job-category.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum StatusEnum {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  PUBLISH = 'Publish',
}

export enum TypeEnum {
  FULLTIME = 'Full-time',
  PARTTIME = 'Part-time',
  CONTRACT = 'Contract',
  TEMPORARY = 'Temporary',
  VOLUNTEER = 'Volunteer',
  INTERNSHIP = 'Internship',
}

export enum WorkSpaceEnum {
  REMOTE = 'Remote',
  ONSITE = 'On-site',
}

@Entity()
export class JobPost {
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
  salary_range: string;

  @Column()
  address: string;

  @Column({
    type: 'enum',
    enum: TypeEnum,
  })
  type: TypeEnum;

  @Column({
    type: 'enum',
    enum: WorkSpaceEnum,
  })
  workspace: WorkSpaceEnum;

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
  updated_at: Date;

  @ManyToOne(() => JobCategory, (job_category) => job_category.job_post, {
    onDelete: 'CASCADE',
  }) // specify inverse side as a second parameter
  @JoinColumn({ name: 'job_category_id' })
  job_category: JobCategory;

  @ManyToOne(() => User, (user) => user.job_post, { onDelete: 'CASCADE' }) // specify inverse side as a second parameter
  @JoinColumn({ name: 'posted_by' })
  user: User;

  @OneToMany(() => JobApplication, (job_post) => job_post.job_post)
  job_application: JobApplication;
}
