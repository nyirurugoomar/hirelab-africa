import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/auth.service';
import { CreateJobApplicationDto } from './dto/create-job-application.dto';
import { UpdateJobApplicationDto } from './dto/update-job-application.dto';
import { JobApplication } from './entities/job-application.entity';
import { JobApplicationService } from './job-application.service';

@Controller('job-applications')
export class JobApplicationController {
  constructor(
    private readonly jobApplicationService: JobApplicationService,
    private readonly authService: AuthService,
  ) {}

  @Post('apply')
  createJobApplication(
    @Body() createJobApplicationDto: CreateJobApplicationDto,
  ): Promise<JobApplication> {
    return this.jobApplicationService.createJobApplication(
      createJobApplicationDto,
    );
  }

  @Get()
  async getJobApplications(): Promise<JobApplication[]> {
    return this.jobApplicationService.getJobApplications();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('employer')
  async getEmployerJobApplications(
    @Headers('Authorization') auth: string,
  ): Promise<JobApplication[]> {
    const userInfo = await Object(
      this.authService.decodeToken(auth).then((data) => {
        return data;
      }),
    );
    if (userInfo.role === 'Employer') {
      return this.jobApplicationService.getEmployerJobApplications(
        userInfo.sub,
      );
    } else {
      throw new UnauthorizedException('Not Allowed');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('candidate')
  async getCandidateJobApplications(
    @Headers('Authorization') auth: string,
  ): Promise<JobApplication[]> {
    const userInfo = await Object(
      this.authService.decodeToken(auth).then((data) => {
        return data;
      }),
    );
    if (userInfo.role === 'Candidate') {
      return this.jobApplicationService.getCandidateJobApplications(
        userInfo.sub,
      );
    } else {
      throw new UnauthorizedException('Not Allowed');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  getJobApplication(@Param('id') id: number): Promise<JobApplication> {
    return this.jobApplicationService.getJobApplicationById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:id')
  updateJobApplication(
    @Param('id') id: number,
    @Body() updateJobApplicationDto: UpdateJobApplicationDto,
  ): Promise<JobApplication> {
    return this.jobApplicationService.updateJobApplication(
      +id,
      updateJobApplicationDto,
    );
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteJobApplication(@Param('id') id: number): Promise<JobApplication> {
    return this.jobApplicationService.deleteJobApplication(id);
  }
}
