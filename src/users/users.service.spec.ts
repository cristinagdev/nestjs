import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../auth/entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  const mockUsersService = {
    getAll: jest.fn(),
  };

  const usersListMock: User[] = [
    { id: 1, username: 'Cristina', password: '12342' },
    {
      id: 2,
      username: 'Antonio',
      password: '1234',
    },
  ];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUsersService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should return an array of users', async () => {
    jest
      .spyOn(service, 'getAll')
      .mockImplementation(() => Promise.resolve(usersListMock));

    expect(await service.getAll()).toEqual(usersListMock);
    expect(service.getAll).toHaveBeenCalled();
  });
});
