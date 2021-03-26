import * as Joi from '@hapi/joi'

export const login = Joi.object()
  .keys({
    userId: Joi.string().optional(),
    username: Joi.string(),
    password: Joi.string().required()
  })
  .xor('userId', 'username')
