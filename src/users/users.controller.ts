import { Controller, Get, Post, Put, Delete, Body, Param, BadRequestException } from '@nestjs/common';
import { UsersService } from './users.service';
import { IUsers } from './users.types';
import { checkValidId } from '../helpers';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  get() {
    return this.usersService.getAllUsers()
  }

  @Get('/:id')
  getById(@Param() { id } : { id: string }) {
    checkValidId(id);
    return this.usersService.getUser(+id)
  }

  @Post('add')
  create(@Body() { name, age, hasWork }: IUsers) {
    if (!name || !age) {
      throw new BadRequestException('All fields are required!');
    }

    return this.usersService.createUser({ name, age, hasWork })
  }

  @Put('update/:id')
  async update(@Param() { id }: { id: string }, @Body() { name, age, hasWork }: IUsers) {
    checkValidId(id);

    await this.usersService.checkUserExists(+id);

    const updateParams: Partial<IUsers> = {};

    if (typeof name === 'string') {
      updateParams.name = name;
    }
    if (Number.isNaN(age)) {
      updateParams.age = age;
    }
    if (typeof hasWork === 'boolean') {
      updateParams.hasWork = hasWork;
    }

    if (Object.keys(updateParams).length === 0) {
      throw new BadRequestException('You need to update at lest one field!');
    }

    return this.usersService.updateUser({ id, ...updateParams })
  }

  @Delete('delete/:id')
  async delete(@Param() { id } : { id: string }) {
    checkValidId(id);

    await this.usersService.checkUserExists(+id);

    return this.usersService.deleteUser(+id);
  }
}
