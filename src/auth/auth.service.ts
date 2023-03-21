import { ForbiddenException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { hash, compare } from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user-dto/create-user-dto';
import { User } from './entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private config: ConfigService,
  ) {}

  async signup(userDto: CreateUserDto) {
    const { password } = userDto;
    const hashedPassword = await hash(password, 8);
    userDto = { ...userDto, password: hashedPassword };
    const user = await this.usersRepository.save(userDto);
    return {
      id: user.id,
      username: user.username,
    };
  }

  async login(userDto: CreateUserDto) {
    const { username, password } = userDto;
    const userFound = await this.usersRepository.findOneBy({ username });

    if (!userFound) {
      throw new ForbiddenException('Credenciales incorrectas');
    }

    const pwMatches = await compare(password, userFound.password);
    if (!pwMatches) {
      throw new ForbiddenException('Credenciales incorrectas');
    }

    const payload = { id: userFound.id, username: userFound.username };
    const access_token = this.jwtService.sign(payload, {
      secret: this.config.get('JWT_SECRET'),
      expiresIn: '3h',
    });

    return {
      user: {
        username: userFound.username,
        id: userFound.id,
      },
      access_token,
    };
  }
}
