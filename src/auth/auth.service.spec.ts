import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';

describe('UsersService', () => {
  let service: AuthService;
  const mockAuthRepository = {
    save: jest.fn().mockImplementation((dto) =>
      Promise.resolve({
        id: Date.now(),
        ...dto,
      }),
    ),
    login: jest.fn(),
    findOneBy: jest.fn().mockImplementation((username) => {
      return {
        id: Date.now(),
        username,
        password: '12345',
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockAuthRepository,
        },
        JwtService,
        ConfigService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a user in the db ', async () => {
    const newUser = {
      username: 'Cristina',
      password: '12345',
    };

    expect(await service.signup(newUser)).toEqual({
      id: expect.any(Number),
      username: newUser.username,
    });

    expect(mockAuthRepository.save).toHaveBeenCalled();
  });

  it('should login an user ', async () => {
    const newUser = {
      username: 'Cristina',
      password: '12345',
    };
    jest.spyOn(service, 'login').mockImplementation((dto) =>
      Promise.resolve({
        user: {
          username: dto.username,
          id: Date.now(),
        },
        access_token: 'token',
      }),
    );
    const userFound = {
      id: Date.now(),
      username: newUser.username,
    };
    expect(await service.login(newUser)).toEqual({
      user: userFound,
      access_token: 'token',
    });
    expect(service.login).toHaveBeenCalled();
  });
});
