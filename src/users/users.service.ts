import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';
import { IUsers } from './users.types';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}


  getAllUsers() {
    return this.userRepository.find({});
  }

  createUser({ name, age, hasWork = false }: IUsers) {
    const user = this.userRepository.create({
      name,
      age,
      hasWork
    });

    return this.userRepository.save(user);
  }

  getUser(id: number) {
    return this.userRepository.findOne({ where: { id } })
  }

  async checkUserExists(id: number) {
    const user = await this.getUser(+id)
    if (!user) {
      throw new BadRequestException('We not have user by this id');
    }

    return true;
  }

  updateUser({ id, ...updateParams }) {
    return this.userRepository.update({ id }, { ...updateParams })
  }

  deleteUser(id: number) {
    return this.userRepository.delete({ id })
  }
}
