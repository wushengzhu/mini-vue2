const path = require('path')
const resolve = p => path.resolve(__dirname,'../',p)

module.exports = {
    vue:resolve('src/platforms/web/entry-runtime-with-compiler'),
    compiler:resolve('src/compiler'),
    core:resolve('src/core'),
    web:resolve('src/platforms/web')
}