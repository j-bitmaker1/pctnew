const util = require('util');
const exec = util.promisify(require('child_process').exec);
const fse = require('fs-extra');

const SRC_CORDOVA_FOLDER = 'src-cordova'
const CORDOVA_RESOURCES_FOLDER = 'cordova-resources'
const OUTPUT_DIR_PATH = `./${SRC_CORDOVA_FOLDER}/platforms/android/app/build/outputs/apk/release/`;
const OUTPUT_FILE_NAME = 'app-release.apk';

const MODES = {
    PCT: "pct",
}

const MODE_CONTENT_FOLDER = {};
MODE_CONTENT_FOLDER[MODES.PCT] = "pct";

const MODE_FILE_NAME = MODE_CONTENT_FOLDER;

const MODES_ORDER = [MODES.PCT];

var platform = function(){
    var opsys = process.platform;
    if (opsys == "darwin") {
        opsys = "MacOS";
    } else if (opsys == "win32" || opsys == "win64") {
        opsys = "Windows";
    } else if (opsys == "linux") {
        opsys = "Linux";
    }

    return opsys
}



start();

async function start() {
    try {
        for(let mode of MODES_ORDER) {
            console.log('START ', MODE_CONTENT_FOLDER[mode])
            await doStuff(mode);
            console.log('FINISHED ', MODE_CONTENT_FOLDER[mode])
        }
    } catch (e) {
        console.error(e); // should contain code (exit code) and signal (that caused the termination).
    }
}

async function doStuff(mode) {
    if(platform() == "MacOS"){
        doIos(mode)
    }
    else{
        doAndroid(mode)
    }
    
}

async function doAndroid(mode) {
    console.log('CLEANING UP');
    fse.removeSync(`./${SRC_CORDOVA_FOLDER}/platforms/android`);

    copyFolders(MODE_CONTENT_FOLDER[mode]);

    console.log('ADD PLATFORM');
    const { stdout: outRes, stderr: errRes } = await exec('cordova platform add android', {cwd: `./${SRC_CORDOVA_FOLDER}`});
    console.log('stdout:', outRes);
    console.log('stderr:', errRes);

    console.log('BUILD');
    const { stdout: outDip, stderr: errDip } = await exec(`npm run cordova-build-android`);
    console.log('stdout:', outDip);
    console.log('stderr:', errDip);

    renameOutputAndroid(MODE_FILE_NAME[mode]);
}


async function doIos(mode) {
    console.log('CLEANING UP');
    fse.removeSync(`./${SRC_CORDOVA_FOLDER}/platforms/ios`);

    copyFolders(MODE_CONTENT_FOLDER[mode]);

    console.log('ADD PLATFORM');
    const { stdout: outRes, stderr: errRes } = await exec('cordova platform add ios', {cwd: `./${SRC_CORDOVA_FOLDER}`});
    console.log('stdout:', outRes);
    console.log('stderr:', errRes);

    /*console.log('BUILD');
    const { stdout: outDip, stderr: errDip } = await exec(`npm run cordova-build-ios`);
    console.log('stdout:', outDip);
    console.log('stderr:', errDip);

    renameOutput(MODE_FILE_NAME[mode]);*/
}

const CORDOVA_BUILD_OUTPUT = 'cordova-built'

function renameOutputAndroid(newName) {
    const oldPath = `${OUTPUT_DIR_PATH}${OUTPUT_FILE_NAME}`;
    const oldPathOutputJson = `${OUTPUT_DIR_PATH}output.json`;
    let newPath = `./${CORDOVA_BUILD_OUTPUT}/${newName}.apk`;
    let newPathOutputJson = `./${CORDOVA_BUILD_OUTPUT}/output-${newName}.json`;
    checkAndCreateIfNotExist(`./${CORDOVA_BUILD_OUTPUT}/`);
    console.log(`RENAME`)
    console.log(`FROM ${oldPath}`);
    console.log(`TO ${newPath}`);
    console.log(`FROM ${oldPathOutputJson}`);
    console.log(`TO ${newPathOutputJson}`);
    fse.moveSync(oldPath, newPath, {overwrite: true});
    fse.moveSync(oldPathOutputJson, newPathOutputJson, {overwrite: true});
}

function checkAndCreateIfNotExist(path){
    if(!fse.existsSync(path)) {
        fse.mkdirSync(path);
        return true;
    }
    return false;
}

function copyFolders(CONTENT_FOLDER) {
    const srcDir = `./${CORDOVA_RESOURCES_FOLDER}`;
    const destDir = `./${SRC_CORDOVA_FOLDER}/`;
    console.log('COPYING FOLDERS:');
    console.log(`src: ${srcDir}`);
    console.log(`dest: ${destDir}`);
    try {
        fse.copySync(srcDir, destDir, {overwrite: true});
    } catch(e) {
        console.error(e);
    }
}
