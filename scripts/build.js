const fs = require('fs');
const path = require('path')
const rollup = require('rollup')


if(!fs.existsSync('dist')){
    fs.mkdirSync('dist')
}


let builds = require('./config').getAllBuilds()