import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { CreateUserInput } from './dto/create-user.input';
import { User, Wallet } from '@fonbnk/database';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private readonly userModel: Model<User>
  ) {}

  async create(createUserInput: CreateUserInput, wallet: Wallet) {
    const user = new this.userModel(createUserInput);
    user.wallet = wallet;
    return user.save();
  }

  findAll() {
    return this.userModel.find().exec();
  }

  async findById(id: string) {
    const user = await this.userModel.findById(id).exec();
    return user;
  }

  async findOne(condition: FilterQuery<User>): Promise<User> {
    const user = await this.userModel.findOne(condition).exec();
    return user;
  }
}
