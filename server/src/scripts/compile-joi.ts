import { compile } from 'json-schema-to-typescript'
import * as fs from 'fs'
import { camelize } from 'humps'

import * as schemas from '../common/schemas'

const compileJoi = () => {
  Object.keys(schemas.default).forEach(s => {
    Object.keys(schemas.default[s]).forEach(item => {
      const name = `${s.toLowerCase()}-${item}`
      compile(schemas.default[s][item].json, camelize(name), {
        style: { semi: false, singleQuote: true }
      }).then(res => {
        fs.writeFileSync(`${__dirname}/../interfaces/${name}.d.ts`, res)
      })
    })
  })
}
compileJoi()
