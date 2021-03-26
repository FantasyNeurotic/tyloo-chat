import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException
} from '@nestjs/common'

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse()
    const request = ctx.getRequest()
    const status = exception.getStatus()
    const exceptionRes: any = exception.getResponse()
    const error = exceptionRes.error
    const message = exceptionRes.messages
    console.log('--------', exceptionRes)

    response
      .code(status)
      .type('application/json')
      .send({
        code: status,
        timestamp: new Date().toISOString(),
        path: request.url,
        error,
        msg: message
      })
  }
}
