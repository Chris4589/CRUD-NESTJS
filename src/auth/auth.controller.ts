import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  HttpCode,
  UseInterceptors, UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateAuthDto } from './dto/create-auth.dto';
import { UpdateAuthDto } from './dto/update-auth.dto';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Auth } from './entities/auth.entity';
import { LoginDto } from './dto/login.dto';
import { LoginResponseInterface } from '../interfaces/login-response.interface';
import { PostRequestInterceptor } from '../interceptors/postRequest.interceptor';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
    type: Auth,
  })
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAuthDto: CreateAuthDto): Promise<Auth> {
    return this.authService.create(createAuthDto);
  }

  @Post('login')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully created.',
  })
  @HttpCode(HttpStatus.CREATED)
  login(@Body() createAuthDto: LoginDto): Promise<LoginResponseInterface> {
    return this.authService.login(createAuthDto);
  }

  @Get()
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The records has been successfully found.',
    type: [Auth],
  })
  @ApiBearerAuth('access-token')
  @UseGuards(AuthGuard())
  @UseInterceptors(PostRequestInterceptor)
  findAll(): Promise<Auth[]> {
    return this.authService.findAll();
  }

  @Get(':id')
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The record has been successfully found.',
    type: Auth,
  })
  @UseGuards(AuthGuard())
  @UseInterceptors(PostRequestInterceptor)
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Auth> {
    return this.authService.findOne(id);
  }

  @Patch(':id')
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully updated.',
    type: Auth,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard())
  @UseInterceptors(PostRequestInterceptor)
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAuthDto: UpdateAuthDto,
  ): Promise<Auth> {
    return this.authService.update(id, updateAuthDto);
  }

  @Delete(':id')
  @ApiBearerAuth('access-token')
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The record has been successfully removed.',
    type: Auth,
  })
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(AuthGuard())
  @UseInterceptors(PostRequestInterceptor)
  remove(@Param('id', ParseIntPipe) id: number): Promise<Auth> {
    return this.authService.remove(id);
  }
}
