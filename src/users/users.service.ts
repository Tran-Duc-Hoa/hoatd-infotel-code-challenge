import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcrypt';
import { FilterQuery, Model, Types } from 'mongoose';

import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<User>) {}

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  async create(createUserDto: CreateUserDto) {
    try {
      const input = {
        ...createUserDto,
        _id: new Types.ObjectId(),
      };
      if (createUserDto.password) {
        input.password = await this.hashPassword(createUserDto.password);
      }

      const user = new this.userModel(input);
      const savedUser = (await user.save()).toObject();
      delete savedUser.password;
      return savedUser;
    } catch (error) {
      if (error.message.includes('duplicate key error')) {
        throw new BadRequestException('User already exists');
      }
      throw error;
    }
  }

  async findOne(filterQuery: FilterQuery<User>): Promise<User> {
    return await this.userModel.findOne(filterQuery).lean();
  }

  async verifyUser(email: string, password: string) {
    const user = await this.userModel.findOne({ email }).lean();
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credentials are invalid');
    }

    return user;
  }
}
