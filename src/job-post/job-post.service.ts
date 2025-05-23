import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { slugifyConstants } from 'src/constants';
import { JobCategoryService } from 'src/job-category/job-category.service';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { JobPost } from './entities/job-post.entity';

@Injectable()
export class JobPostService {
  constructor(
    @InjectRepository(JobPost)
    private readonly jobPostRepository: Repository<JobPost>,
    private readonly userService: UserService,
    private readonly jobCategoryService: JobCategoryService,
  ) {}
  async createJobPost(createJobPostDto: CreateJobPostDto): Promise<JobPost> {
    try {
      const jobCategory = await this.jobCategoryService.getJobCategoryById(
        createJobPostDto.job_category_id,
      );

      const posted_by = await this.userService.getUserById(
        createJobPostDto.posted_by,
      );

      const newJobPost = this.jobPostRepository.create(createJobPostDto);
      newJobPost.slug = slugify(newJobPost.title, slugifyConstants);
      newJobPost.uuid = uuidv4();
      newJobPost.job_category = jobCategory;
      newJobPost.user = posted_by;
      return await this.jobPostRepository.save(newJobPost);
    } catch (error) {
      throw error;
    }
  }

  async getJobPosts(): Promise<JobPost[]> {
    try {
      return await this.jobPostRepository.find({
        order: { id: 'DESC' },
        relations: ['job_category', 'user', 'user.profile'],
      });
    } catch (error) {
      throw error;
    }
  }

  async getEmployerJobPosts(id: number): Promise<JobPost[]> {
    try {
      return await this.jobPostRepository.find({
        order: { id: 'DESC' },
        relations: ['job_category', 'user', 'user.profile'],
        where: {
          user: {
            id: id,
          },
        },
      });
    } catch (error) {
      throw error;
    }
  }

  async getJobPostById(id: number): Promise<JobPost> {
    try {
      const jobPost = await this.jobPostRepository.findOneBy({
        id: id,
      });
      if (!jobPost) throw new NotFoundException(`JobPost not found!`);
      return jobPost;
    } catch (error) {
      throw error;
    }
  }

  async getJobPostByUUID(uuid: string): Promise<JobPost> {
    try {
      const jobPost = await this.jobPostRepository.findOneBy({
        uuid: uuid,
      });
      if (!jobPost) throw new NotFoundException(`JobPost not found!`);
      return jobPost;
    } catch (error) {
      throw error;
    }
  }

  async updateJobPost(
    id: number,
    updateJobPostDto: UpdateJobPostDto,
  ): Promise<JobPost> {
    try {
      const jobCategory = await this.jobCategoryService.getJobCategoryById(
        updateJobPostDto.job_category_id,
      );
      if (!jobCategory) throw new ConflictException(`BlogCategory not found!`);

      const posted_by = await this.userService.getUserById(
        updateJobPostDto.posted_by,
      );
      if (!posted_by) throw new ConflictException(`User not found`);

      const jobPost = await this.getJobPostById(id);
      if (!jobPost) throw new NotFoundException(`JobPost not found!`);
      jobPost.title = updateJobPostDto.title;
      jobPost.slug = slugify(updateJobPostDto.title, slugifyConstants);
      jobPost.description = updateJobPostDto.description;
      jobPost.type = updateJobPostDto.type;
      jobPost.salary_range = updateJobPostDto.salary_range;
      jobPost.address = updateJobPostDto.address;
      jobPost.status = updateJobPostDto.status;
      jobPost.workspace = updateJobPostDto.workspace;
      jobPost.job_category = jobCategory;
      jobPost.user = posted_by;
      return await this.jobPostRepository.save(jobPost);
    } catch (error) {
      throw error;
    }
  }

  async deleteJobPost(id: number): Promise<JobPost> {
    try {
      const jobPost = await this.getJobPostById(id);
      if (!jobPost) throw new NotFoundException(`JobPost not found!`);
      return await this.jobPostRepository.remove(jobPost);
    } catch (error) {
      throw error;
    }
  }
}
