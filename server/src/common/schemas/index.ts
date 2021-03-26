import * as user from './user'
import { convert } from 'joi-to-json-schema-support'

export const User = {
  login: {
    joi: user.login,
    json: convert(user.login)
  }
}
export default {
  User
}
