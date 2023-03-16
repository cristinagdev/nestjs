import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto/create-user-dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signup(user: CreateUserDto) {
    const { password } = user;
    const hashedPassword = await hash(password, 8);
    user = { ...user, password: hashedPassword };
    if (user.username === '' || user.password === '') {
      throw new HttpException(
        'El username o la password no pueden estar vacíos',
        HttpStatus.BAD_REQUEST,
      );
    }
    return await this.usersRepository.save(user);
  }

  async login(user: CreateUserDto) {
    const { username, password } = user;
    const userFound = await this.usersRepository.findOneBy({ username });

    if (!userFound) {
      throw new HttpException(
        'Error en usuario o contraseña',
        HttpStatus.BAD_REQUEST,
      );
    }

    const checkPassword = await compare(password, userFound.password);
    if (!checkPassword) {
      throw new HttpException(
        'Error en usuario o contraseña',
        HttpStatus.BAD_REQUEST,
      );
    }

    const payload = { id: userFound.id, username: userFound.username };
    const token = this.jwtService.sign(payload);

    return {
      user: userFound,
      token,
    };
  }
}
