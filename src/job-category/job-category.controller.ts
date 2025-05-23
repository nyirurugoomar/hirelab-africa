import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CreateJobCategoryDto } from './dto/create-job-category.dto';
import { UpdateJobCategoryDto } from './dto/update-job-category.dto';
import { JobCategory } from './entities/job-category.entity';
import { JobCategoryService } from './job-category.service';

@Controller('job-categories')
export class JobCategoryController {
  constructor(private readonly jobCategoryService: JobCategoryService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('add')
  createJobCategory(
    @Body() createJobCategoryDto: CreateJobCategoryDto,
  ): Promise<JobCategory> {
    return this.jobCategoryService.createJobCategory(createJobCategoryDto);
  }

  @Get()
  getJobCategories(): Promise<JobCategory[]> {
    return this.jobCategoryService.getJobCategories();
  }

  @Get(':id')
  getJobCategory(@Param('id') id: number): Promise<JobCategory> {
    return this.jobCategoryService.getJobCategoryById(id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Patch('update/:id')
  updateJobCategory(
    @Param('id') id: number,
    @Body() updateJobCategoryDto: UpdateJobCategoryDto,
  ): Promise<JobCategory> {
    return this.jobCategoryService.updateJobCategory(+id, updateJobCategoryDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('delete/:id')
  deleteJobCategory(@Param('id') id: number): Promise<JobCategory> {
    return this.jobCategoryService.deleteJobCategory(id);
  }
}
