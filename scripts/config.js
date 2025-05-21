const path = require('path')
const ts = require('rollup-plugin-typescript2')
const alias = require('@rollup/plugin-alias')

// mini-vue2版本
const version = process.env.VERSION || require('../package.json').version
const aliases = require('./alias')
const { default: alias } = require('@rollup/plugin-alias')

const resolve = p =>{
    const base = p.split('/')[0]
    if(aliases[base]){
        return path.resolve(aliases[base],p.slice(base.length+1))
    }else{
        return path.resolve(__dirname,'../',p)
    }
}
const banner = 
'/*!\n'+
` * Mini-Vue2 v${version}\n`+
` * Code reference based on Vue offical source.\n`+
` * For learning purpose only,not for commercial use.\n`+
` * Released under the MIT License.\n`
' */'

const builds = {
 'full-dev':{
    entry: resolve('web/entry-runtime-with-compiler.ts'),
    dest: resolve('dist/vue.runtime.min.js'),
    format:'umd',
    env:'production',
    banner
 }
}

function genConfig(name){
    const opts = builds[name]
    const isTargetingBrower = !(opts.transpile === false || opts.format === 'cjs')

    const config = {
        input:opts.entry,
        external:opts.external,
        plugins:[
          alias({
            entries:Object.assign({},aliases,opts.alias)
          }),
          ts({
            tsconfig:path.resolve(__dirname,'../','tsconfig.json'),
            cacheRoot:path.resolve(__dirname,'../','node_modules/.rts2_cache'),
            tsconfigOverride:{
              compilerOptions:{
                target:isTargetingBrower?'es5':'es2017'
              },
              include:isTargetingBrower?['src']:['src','packages/*/src'],
              exclude:['test','test-dts']
            }
          })
        ].concat(opts.plugins || []),
        output:{
            file:opts.dest,
            format:opts.format,
            banner:opts.banner,
            name:opts.moduleName || 'Vue',
            exports:'auto'
        },
        onwarn:(msg,warn)=>{
            if(!/Circular/.test(msg)){
                warn(msg)
            }
        }
    }
}

if(process.env.TARGET){
  module.exports = genConfig(process.env.TARGET)
}else{
    exports.getBuild = genConfig(process.env.TARGET)
    exports.getAllBuilds = ()=>Object.keys(builds).map(genConfig)
}