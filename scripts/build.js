const fs = require('fs');
const path = require('path')
const rollup = require('rollup')
const zlib = require('zlib')
const terser = require('terser')


if(!fs.existsSync('dist')){
    fs.mkdirSync('dist')
}


let builds = require('./config').getAllBuilds()

if(process.argv[2]){
    const filters = process.argv[2].split(',')
    builds = builds.filter(b=>{
        return filters.some(f => b.output.file.indexOf(f)>-1 || b._name.indexOf(f) > -1)
    })
}
build(builds)
function build(builds){
    let built = 0;
    const total = builds.length;
    const next = ()=>{
        buildEntry(builds[built]).then(()=>{
            built++
            if(built < total){
                next()
            }
        }).catch(logError)
    }
    next()
}

function buildEntry(config){
    const output = config.output;
    const {file,banner} = output;
    const isProd = /(min|prod)\.js$/.test(file)
    return rollup.rollup(config)
    .then(bundle => bundle.generate(output))
    .then(async ({output:[{code}]})=>{
        if(isProd){
            // 压缩和优化js代码
            const {code: minifiedCode } = await terser.minify(code,{
                toplevel:true,
                compress:{ // 控制代码压缩行为
                    pure_funcs:['makeMap'],
                },
                format:{ // 配置输出代码的格式
                    comments:false,
                    semicolons:true,
                    ascii_only:true,
                }
            })
            const minified = (banner?banner+'\n':'')+minifiedCode
            return write(file,minified,true)
        }else{
            return write(file.code)
        }
    })
}

function write(dest,code,zip){
    return new Promise((resolve,reject)=>{
        function report(extra){
            console.log(bule(path.relative(process.cwd(),dest))+' '+getSize(code)+(extra||''))
            resolve()
        }

        if(!fs.existsSync(path.dirname(dest))){
            fs.mkdirSync(path.dirname(dest),{recursive:true})// recursive自动创建所有缺失的父目录
        }
        fs.writeFile(dest,code,err=>{
          if(err) reject(err)
          if(zip){
            // 压缩文件，生成gzip格式
            zlib.gzip(code,(err,zipped)=>{
                if(err) return reject(err)
                report('(gzipped：'+getSize(zipped)+')')
            })
          }else{
            report()
          }
        })
    })
}
function logError(e){
    console.log(e)
}

function getSize(code){
    return (code.length/1024).toFixed(2)+'kb'
}

function bule(str){
    return '\x1b[1m\x1b[34m'+str+'\x1b[39m\x1b[22m'
}

