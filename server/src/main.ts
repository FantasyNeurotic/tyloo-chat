import * as helmet from 'fastify-helmet'
//import * as csurf from 'csurf'
import * as compress from 'fastify-compress'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { NestFactory } from '@nestjs/core'
import { join } from 'path'
import { IoAdapter } from '@nestjs/platform-socket.io'
import {
  FastifyAdapter,
  NestFastifyApplication
} from '@nestjs/platform-fastify'
import { FastifyPluginCallback } from 'fastify'
import { Logger } from '@nestjs/common'
import * as multer from 'fastify-multer'
import { AppModule } from './app.module'
import { HttpExceptionFilter } from './common/filters/http-exception.filter'
import { ResponseInterceptor } from './common/interceptor/response.interceptor'

async function bootstrap() {
  const fastifyAdapter = new FastifyAdapter()
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    fastifyAdapter,
    { cors: true }
  )
  const logger = new Logger('chat')
  app.useLogger(logger)
  // 安全防护
  fastifyAdapter.register(
    (helmet as unknown) as FastifyPluginCallback,
    ({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: [`'self'`],
          styleSrc: [`'self'`, `'unsafe-inline'`],
          imgSrc: [`'self'`, 'data:', 'validator.swagger.io'],
          scriptSrc: [`'self'`, `https: 'unsafe-inline'`]
        }
      }
    } as unknown) as any
  )
  // multi-data
  fastifyAdapter.register(multer.contentParser)
  // 压缩请求
  fastifyAdapter.register((compress as unknown) as FastifyPluginCallback)
  //app.use(csurf())
  const urlPrefix = ''
  // 设置全局前缀
  app.setGlobalPrefix(urlPrefix)
  // https://github.com/vercel/ncc/issues/513
  // fix ncc打包后提示找不到该依赖问题
  app.useWebSocketAdapter(new IoAdapter(app))

  // 全局过滤器
  app.useGlobalFilters(new HttpExceptionFilter())

  // 配置全局拦截器
  app.useGlobalInterceptors(new ResponseInterceptor())

  // 配置静态资源
  app.useStaticAssets({
    root: join(__dirname, '../public', '/'),
    prefix: '/',
    maxAge: 2592000
  })

  // Swagger文档
  const options = new DocumentBuilder()
    .setBasePath(urlPrefix)
    .setTitle('接口文档')
    .setDescription('接口文档')
    .setVersion('1.0')
    .build()
  const document = SwaggerModule.createDocument(app, options)
  SwaggerModule.setup('/docs', app, document)
  await app.listen(3000)
}
bootstrap()
