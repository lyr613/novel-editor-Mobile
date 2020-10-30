const path = require('path')

const cp = require('child_process')

const root = path.join(__dirname, '..')

const runsrc = path.join(root, 'android')
const resrc = path.join(root, 'android', 'app/build/outputs/apk/release')

// cp.execSync('gradlew assembleRelease', { cwd: runsrc })

const doing = cp.exec('gradlew assembleRelease', { cwd: runsrc }, (_, __, out) => {
    // console.log(out)
})

doing.stdout.on('data', (data) => {
    console.log(data)
})

doing.stdout.on('close', () => {
    cp.execSync('start .', { cwd: resrc })
})
