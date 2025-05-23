import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CvService } from 'src/cv/cv.service';
import { JobPostService } from 'src/job-post/job-post.service';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { JobApplication } from './entities/job-application.entity';

@Injectable()
export class JobApplicationService {
  constructor(
    @InjectRepository(JobApplication)
    private readonly jobApplicationRepository: Repository<JobApplication>,
    private readonly userService: UserService,
    private readonly jobPostService: JobPostService,
    private readonly cvService: CvService,
  ) {}

  async createJobApplication(
    createJobApplicationDto: CreateJobApplicationDto,
  ): Promise<JobApplication> {
    try {
      const jobPost = await this.jobPostService.getJobPostByUUID(
        createJobApplicationDto.job_post_uuid,
      );

      const candidate = await this.userService.getUserById(
        createJobApplicationDto.candidate,
      );

      const newJobApplication = this.jobApplicationRepository.create({
        first_name: createJobApplicationDto.first_name,
        last_name: createJobApplicationDto.last_name,
        email: createJobApplicationDto.email,
        phone: createJobApplicationDto.phone,
        address: createJobApplicationDto.address,
        city: createJobApplicationDto.city,
        country: createJobApplicationDto.country,
        postcode: createJobApplicationDto.postcode,
        cover_letter: createJobApplicationDto.cover_letter,
      });
      newJobApplication.uuid = uuidv4();
      newJobApplication.job_post = jobPost;
      newJobApplication.user = candidate;
      if (await this.jobApplicationRepository.save(newJobApplication)) {
        if (createJobApplicationDto.cv_id === null) {
          // Add new cv
          if (
            await this.cvService.createCv({
              file: createJobApplicationDto.file,
              candidate: createJobApplicationDto.candidate,
            })
          ) {
            return newJobApplication;
          }
        } else {
          if (
            await this.cvService.updateCv(createJobApplicationDto.cv_id, {
              file: createJobApplicationDto.file,
              candidate: createJobApplicationDto.candidate,
            })
          ) {
            return newJobApplication;
          }
        }
      }
    } catch (error) {
      throw error;
    }
  }

  async getJobApplications(): Promise<JobApplication[]> {
    try {
      return await this.jobApplicationRepository.find({
        order: { id: 'DESC' },
        relations: ['job_post', 'user', 'user.cv', 'user.profile'],
      });
    } catch (error) {
      throw error;
    }
  }

  async getEmployerJobApplications(id: number): Promise<JobApplication[]> {
    try {
      return await this.jobApplicationRepository.find({
        order: { id: 'DESC' },
        relations: ['job_post', 'user', 'user.cv', 'user.profile'],
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

  async getCandidateJobApplications(id: number): Promise<JobApplication[]> {
    try {
      return await this.jobApplicationRepository.find({
        order: { id: 'DESC' },
        relations: ['job_post', 'user', 'user.cv', 'user.profile'],
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

  async getJobApplicationById(id: number): Promise<JobApplication> {
    try {
      const jobApplication = await this.jobApplicationRepository.findOneBy({
        id: id,
      });
      if (!jobApplication)
        throw new NotFoundException(`JobApplication not found!`);
      return jobApplication;
    } catch (error) {
      throw error;
    }
  }

  async updateJobApplication(
    id: number,
    updateJobApplicationDto: UpdateJobApplicationDto,
  ): Promise<JobApplication> {
    try {
      const jobApplication = await this.getJobApplicationById(id);
      if (!jobApplication)
        throw new NotFoundException(`JobApplication not found!`);
      jobApplication.status = updateJobApplicationDto.status;
      return this.jobApplicationRepository.save(jobApplication);
    } catch (error) {
      throw error;
    }
  }

  async deleteJobApplication(id: number): Promise<JobApplication> {
    try {
      const jobApplication = await this.getJobApplicationById(id);
      if (!jobApplication)
        throw new NotFoundException(`JobApplication not found!`);
      return this.jobApplicationRepository.remove(jobApplication);
    } catch (error) {
      throw error;
    }
  }
}
