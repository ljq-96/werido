import { readdirSync } from 'fs'

readdirSync(__dirname).forEach(file => {
  if (file.indexOf('index') === 0 || file.indexOf('aa') === 0) return
  import(`./${file}`)
})
