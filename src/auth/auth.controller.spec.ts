import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

describe('AuthController', () => {
  let controller: AuthController;
  const mockAuthService = {
    signup: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
    login: jest.fn((dto) => {
      return {
        id: Date.now(),
        ...dto,
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [AuthService],
    })
      .overrideProvider(AuthService)
      .useValue(mockAuthService)
      .compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create an user and signup', () => {
    const newUserDto = {
      username: 'Cristina',
      password: '12345',
    };

    expect(controller.signup(newUserDto)).toEqual({
      id: expect.any(Number),
      ...newUserDto,
    });
    expect(mockAuthService.signup).toHaveBeenCalled();
  });

  it('should login correctly', () => {
    const userLogged = {
      username: 'Cristina',
      password: '12345',
    };
    expect(controller.login(userLogged)).toEqual({
      id: expect.any(Number),
      ...userLogged,
    });

    expect(mockAuthService.login).toHaveBeenCalled();
  });
});
