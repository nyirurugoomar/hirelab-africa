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
import { CreateJobPostDto } from './dto/create-job-post.dto';
import { UpdateJobPostDto } from './dto/update-job-post.dto';
import { JobPost } from './entities/job-post.entity';
import { JobPostService } from './job-post.service';

@Controller('job-posts')
export class JobPostController {
  constructor(
    private readonly jobPostService: JobPostService,
    private readonly authService: AuthService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  createJobPost(@Body() createJobPostDto: CreateJobPostDto): Promise<JobPost> {
    return this.jobPostService.createJobPost(createJobPostDto);
  }

  @Get()
  getJobPosts(): Promise<JobPost[]> {
    return this.jobPostService.getJobPosts();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('employer')
  async getEmployerJobPosts(
    @Headers('Authorization') auth: string,
  ): Promise<JobPost[]> {
    const userInfo = await Object(
      this.authService.decodeToken(auth).then((data) => {
        return data;
      }),
    );
    if (userInfo.role === 'Employer') {
      return this.jobPostService.getEmployerJobPosts(userInfo.sub);
    } else {
      throw new UnauthorizedException('Not Allowed');
    }
  }

  @Get(':id')
  getJobPost(@Param('id') id: number): Promise<JobPost> {
    return this.jobPostService.getJobPostById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:id')
  async updateJobPost(
    @Param('id') id: number,
    @Body() updateJobPostDto: UpdateJobPostDto,
    @Headers('Authorization') auth: string,
  ): Promise<JobPost> {
    const userInfo = await Object(
      this.authService.decodeToken(auth).then((data) => {
        return data;
      }),
    );
    if (userInfo.role === 'Admin' || userInfo.role === 'Employer') {
      return this.jobPostService.updateJobPost(+id, updateJobPostDto);
    } else {
      throw new UnauthorizedException('Not Allowed');
    }
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteJobPost(@Param('id') id: number): Promise<JobPost> {
    return this.jobPostService.deleteJobPost(id);
  }
}
