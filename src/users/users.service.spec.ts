import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from './users.service';
import { User } from './users.entity';
import { IUsers } from './users.types';
import { BadRequestException } from '@nestjs/common';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  describe('getAllUsers', () => {
    it('should return an array of users', async () => {
      const users: User[] = [{ id: 1, name: 'Alice', age: 25, hasWork: false }];
      jest.spyOn(repository, 'find').mockResolvedValue(users);

      expect(await service.getAllUsers()).toEqual(users);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const newUser: IUsers = { name: 'Bob', age: 30, hasWork: true };
      const createdUser: User = { id: 2, ...newUser };
      jest.spyOn(repository, 'create').mockReturnValue(createdUser);
      jest.spyOn(repository, 'save').mockResolvedValue(createdUser);

      expect(await service.createUser(newUser)).toEqual(createdUser);
      expect(repository.create).toHaveBeenCalledWith(newUser);
      expect(repository.save).toHaveBeenCalledWith(createdUser);
    });
  });

  describe('getUser', () => {
    it('should return a user by id', async () => {
      const user: User = { id: 1, name: 'Alice', age: 25, hasWork: false };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      expect(await service.getUser(1)).toEqual(user);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('checkUserExists', () => {
    it('should return true if user exists', async () => {
      const user: User = { id: 1, name: 'Alice', age: 25, hasWork: false };
      jest.spyOn(repository, 'findOne').mockResolvedValue(user);

      expect(await service.checkUserExists(1)).toBe(true);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw BadRequestException if user does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.checkUserExists(1)).rejects.toThrow(BadRequestException);
      expect(repository.findOne).toHaveBeenCalledWith({ where: { id: 1 } });
    });
  });

  describe('updateUser', () => {
    it('should update a user by id', async () => {
      const updateParams = { name: 'Alice', age: 30, hasWork: false };
      const params = { id: 1, ...updateParams };
      jest.spyOn(repository, 'update').mockResolvedValue({ generatedMaps: [], affected: 1, raw: [] });
      jest.spyOn(repository, 'findOne').mockResolvedValue(params);
      await service.updateUser(params);
      const updatedUser = await service.getUser(1);
      expect(updatedUser).toEqual(params)
    });
  });
  })

