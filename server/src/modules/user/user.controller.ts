import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  Patch,
  Delete,
  UseInterceptors,
  UseGuards,
  Req,
  UploadedFile
} from '@nestjs/common'
import { FileInterceptor } from '@webundsoehne/nest-fastify-file-upload'
import { UserService } from './user.service'
import { AuthService } from './../auth/auth.service'
import { AuthGuard } from '@nestjs/passport'

@Controller('user')
@UseGuards(AuthGuard('jwt'))
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly authService: AuthService
  ) {}

  @Get()
  getUsers(@Query('userId') userId: string) {
    return this.userService.getUser(userId)
  }

  @Post()
  postUsers(@Body('userIds') userIds: string) {
    return this.userService.postUsers(userIds)
  }

  @Patch('username')
  updateUserName(@Req() req, @Query('username') username) {
    const oldUser = this.authService.verifyUser(req.headers.token)
    return this.userService.updateUserName(oldUser, username)
  }

  @Patch('password')
  updatePassword(@Req() req, @Query('password') password) {
    const user = this.authService.verifyUser(req.headers.token)
    return this.userService.updatePassword(user, password)
  }

  @Delete()
  delUser(@Req() req, @Query() { did }) {
    const user = this.authService.verifyUser(req.headers.token)
    return this.userService.delUser(user, did)
  }

  @Get('/findByName')
  getUsersByName(@Query('username') username: string) {
    return this.userService.getUsersByName(username)
  }

  @Post('/avatar')
  @UseInterceptors(FileInterceptor('avatar'))
  setUserAvatar(@Req() req, @UploadedFile() file) {
    const user = this.authService.verifyUser(req.headers.token)
    return this.userService.setUserAvatar(user, file)
  }
}
