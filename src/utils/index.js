var fs = require('fs')
const logger = require('winston-color')
const jsonminify = require("jsonminify")
const config = require("../config")
const execSync = require('child_process').execSync


const isSupportedLangauge = function (language) {
  return language == null ? false : (config.supported_languages.indexOf(language.toLowerCase()) != -1)
}

const runCommand = function (cmd, callback){
  try {
    execSync(cmd, {stdio:[0,1,2]})
  }
  catch (ex) {
    callback(ex.message)
  }
}

const readDotSplashKit = function (path) {
  const data = fs.readFileSync(`${path}/.splashkit`, 'utf8')
  return JSON.parse(JSON.minify(data))
}

const generateDotSplashKitData = function (language) {
  if (language == null) {
    throw Error('Must provide language when generating a .splashkit')
  }
  const data = {
    'version': '-1',
    'date_created': new Date(),
    'message': 'Jake',
    'status': 'initialized',
    'language': language
  }
  return data
}

const writeDotSplashKit = function (path, data) {

  console.log(`path is: ${path} and data is: ${data}\n`)

  let dataAsString = JSON.stringify(data, null, "  ")
  let contents = `//
// This file is generated by SplashKit v${config.splashkit_version}
//
// ************************ DO NOT TOUCH ************************
// *** Modifying this file may corrupt your SplashKit project ***
// ************************ DO NOT TOUCH ************************
//

${dataAsString}
`
  fs.writeFileSync(path + '/.splashkit', contents)
  logger.debug(`Saved to ${path}/.splashkit successfully.`)
}

const doespathExist = function (path) {
  logger.debug(`Checking for directory or file at: ${path}`)
  try {
    return fs.statSync(path).isDirectory() || fs.statSync(path).isFile()
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false
    } else {
      throw e
    }
  }
}

const isSplashKitDirectory = function (path) {
  const dotSKPath = `${path}/.splashkit`
  return doespathExist(dotSKPath)
}

module.exports = {
  generateDotSplashKitData: generateDotSplashKitData,
  doespathExist: doespathExist,
  isSupportedLangauge: isSupportedLangauge,
  runCommand: runCommand,
  readDotSplashKit: readDotSplashKit,
  writeDotSplashKit: writeDotSplashKit,
  isSplashKitDirectory: isSplashKitDirectory,
  isMacOS: process.platform === 'darwin',
  isWindows: process.platform === 'win32',
  isLinux: process.platform === 'win32'
}