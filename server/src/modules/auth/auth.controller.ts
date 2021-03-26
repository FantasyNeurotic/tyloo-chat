/*
 * @file: 权限登陆模块
 * @author: BoBo
 * @copyright: NanJing Anshare Tech .Com
 * @Date: 2020-11-18 09:18:10
 */
import { Body, Controller, Post, UsePipes } from '@nestjs/common'
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger'
import { User } from '../../common/schemas'
import { JoiValidationPipe } from 'src/common/transforms/joi-validation'
import { AuthService } from './auth.service'
import { SchemaObject } from '@nestjs/swagger/dist/interfaces/open-api-spec.interface'
import { UserLogin } from 'src/interfaces/user-login'

@ApiTags('登录服务')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  // 登录测试
  @Post('/login')
  @ApiOperation({ summary: '人员登录' })
  @ApiResponse({
    schema: User.login.json as SchemaObject,
    status: 200,
    description: '登录'
  })
  @ApiBody({ schema: User.login.json as SchemaObject })
  @UsePipes(new JoiValidationPipe(User.login.joi))
  async login(
    @Body()
    body: UserLogin
  ) {
    const result = await this.authService.login(body as UserLogin)
    return result
  }

  @Post('/register')
  async register(@Body() body) {
    return this.authService.register(body)
  }
}
