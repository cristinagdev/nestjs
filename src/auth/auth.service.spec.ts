import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AuthService } from './auth.service';
import { User } from './entities/user.entity';
import { hash } from 'bcrypt';

describe('UsersService', () => {
  let service: AuthService;
  const mockAuthService = {
    signup: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockAuthService,
        },
        JwtService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should save a user in the db ', async () => {
    let newUser = {
      username: 'Cristina',
      password: '12345',
    };
    const hashedPassword = await hash(newUser.password, 8);
    newUser = { ...newUser, password: hashedPassword };
    jest
      .spyOn(service, 'signup')
      .mockImplementation(() => Promise.resolve({ id: 1, ...newUser }));

    expect(await service.signup(newUser)).toEqual({
      id: 1,
      ...newUser,
    });

    expect(service.signup).toHaveBeenCalled();
  });

  it('should login an user ', async () => {
    const newUser: User = {
      id: 1,
      username: 'Cristina',
      password: '12345',
    };

    jest
      .spyOn(service, 'login')
      .mockImplementation(() =>
        Promise.resolve({ user: newUser, token: 'token' }),
      );

    expect(await service.login(newUser)).toEqual({
      user: newUser,
      token: 'token',
    });
    expect(service.login).toHaveBeenCalled();
  });
});
