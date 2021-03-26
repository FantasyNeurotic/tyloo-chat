import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException
} from '@nestjs/common'
import { ObjectSchema, ValidationOptions } from '@hapi/joi'

@Injectable()
export class JoiValidationPipe implements PipeTransform {
  constructor(private schema: ObjectSchema) {}

  transform(
    value: any,
    metadata?: ArgumentMetadata,
    schemaOption?: ValidationOptions
  ) {
    console.log('-----------')
    const { error } = this.schema.validate(value, schemaOption)
    if (error) {
      throw new BadRequestException(error)
    }
    return value
  }
}
