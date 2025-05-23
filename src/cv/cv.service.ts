import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { v4 as uuidv4 } from 'uuid';
import { Repository } from 'typeorm';
import { CreateCvDto } from './dto/create-cv.dto';
import { UpdateCvDto } from './dto/update-cv.dto';
import { Cv } from './entities/cv.entity';
// import fs from 'fs';

@Injectable()
export class CvService {
  constructor(
    @InjectRepository(Cv) private readonly cvRepository: Repository<Cv>,
    private readonly userService: UserService,
  ) {}

  async createCv(createCvDto: CreateCvDto): Promise<Cv> {
    try {
      // Check if candidate exists
      const hasCV = await this.cvRepository.find({
        relations: ['user'],
        where: {
          user: {
            id: createCvDto.candidate,
          },
        },
      });
      if (hasCV && hasCV.length > 0) {
        return await this.updateCv(hasCV[0].id, {
          file: createCvDto.file,
          candidate: createCvDto.candidate,
        });
      }
      const user = await this.userService.getUserById(createCvDto.candidate);
      if (!user) throw new ConflictException(`User not found!`);
      const newCv = this.cvRepository.create(createCvDto);
      newCv.uuid = uuidv4();
      newCv.user = user;
      return await this.cvRepository.save(newCv);
    } catch (error) {
      throw error;
    }
  }

  async getCvs(): Promise<Cv[]> {
    try {
      return await this.cvRepository.find({
        order: { id: 'DESC' },
        relations: ['user', 'user.profile', 'user.role'],
      });
    } catch (error) {
      throw error;
    }
  }

  async getCandidateCvs(id: number): Promise<Cv[]> {
    try {
      return await this.cvRepository.find({
        order: { id: 'DESC' },
        relations: ['user', 'user.profile', 'user.role'],
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

  async getCvById(id: number): Promise<Cv> {
    try {
      const Cv = await this.cvRepository.findOneBy({ id: id });
      if (!Cv) throw new NotFoundException(`Cv not found!`);
      return Cv;
    } catch (error) {
      throw error;
    }
  }

  async updateCv(id: number, updateCvDto: UpdateCvDto): Promise<Cv> {
    try {
      const cv = await this.getCvById(id);
      if (!cv) {
        throw new NotFoundException(`A CV with id[${id}] could not be found!`);
      } else {
        //const path = `./uploads/${cv.file}`;
        // Delete existing file from the storage
        // fs.unlink(path, function (err: any) {
        //   if (err) throw err;
        //   // if no error, file has been deleted successfully
        //   console.log('File deleted!');
        // });
      }
      cv.file = updateCvDto.file;
      return this.cvRepository.save(cv);
    } catch (error) {
      throw error;
    }
  }

  async deleteCv(id: number): Promise<Cv> {
    try {
      const cv = await this.getCvById(id);
      if (!cv)
        throw new NotFoundException(`A CV with id[${id}] could not be found!`);
      return this.cvRepository.remove(cv);
    } catch (error) {
      throw error;
    }
  }
}
