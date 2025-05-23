import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import slugify from 'slugify';
import { slugifyConstants } from 'src/constants';
import { v4 as uuidv4 } from 'uuid';
import { Like, Repository } from 'typeorm';
import { CreateJobCategoryDto } from './dto/create-job-category.dto';
import { UpdateJobCategoryDto } from './dto/update-job-category.dto';
import { JobCategory } from './entities/job-category.entity';

@Injectable()
export class JobCategoryService {
  constructor(
    @InjectRepository(JobCategory)
    private readonly jobCategoryRepository: Repository<JobCategory>,
  ) {}
  async createJobCategory(
    createJobCategoryDto: CreateJobCategoryDto,
  ): Promise<JobCategory> {
    try {
      const exists = await this.jobCategoryRepository.findBy({
        name: Like(`%${createJobCategoryDto.name}%`),
      });

      if (exists.length > 0)
        throw new ConflictException(`This category already exists!`);

      const newJobCategory =
        this.jobCategoryRepository.create(createJobCategoryDto);
      newJobCategory.slug = slugify(newJobCategory.name, slugifyConstants);
      newJobCategory.uuid = uuidv4();
      return await this.jobCategoryRepository.save(newJobCategory);
    } catch (error) {
      throw error;
    }
  }

  async getJobCategories(): Promise<JobCategory[]> {
    try {
      return await this.jobCategoryRepository.find({
        order: { id: 'ASC' },
        relations: ['job_post'],
      });
    } catch (error) {
      throw error;
    }
  }

  async getJobCategoryById(id: number): Promise<JobCategory> {
    try {
      const jobCategory = await this.jobCategoryRepository.findOneBy({
        id: id,
      });
      if (!jobCategory) throw new NotFoundException(`JobCategory not found!`);
      return jobCategory;
    } catch (error) {
      throw error;
    }
  }

  async updateJobCategory(
    id: number,
    updateJobCategoryDto: UpdateJobCategoryDto,
  ): Promise<JobCategory> {
    try {
      const jobCategory = await this.getJobCategoryById(id);
      if (!jobCategory) throw new NotFoundException(`JobCategory not found!`);
      jobCategory.name = updateJobCategoryDto.name;
      jobCategory.slug = slugify(jobCategory.name, slugifyConstants);
      jobCategory.status = updateJobCategoryDto.status;
      return await this.jobCategoryRepository.save(jobCategory);
    } catch (error) {
      throw error;
    }
  }

  async deleteJobCategory(id: number): Promise<JobCategory> {
    try {
      const jobCategory = await this.getJobCategoryById(id);
      if (!jobCategory) throw new NotFoundException(`JobCategory not found!`);
      return await this.jobCategoryRepository.remove(jobCategory);
    } catch (error) {
      throw error;
    }
  }
}
