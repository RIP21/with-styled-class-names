var path = require('path')
var fse = require('fs-extra')
var fs = require('fs')

const files = ['README.md', 'LICENSE']

Promise.all(files.map(file => copyFile(file))).then(() =>
  createPackageFile().then(renameLibraryToReadme(files[0])),
)

function copyFile(file) {
  const libPath = resolveBuildPath(file)
  return new Promise(resolve => {
    fse.copy(file, libPath, err => {
      if (err) throw err
      resolve()
    })
  }).then(() => console.log(`Copied ${file} to ${libPath}`))
}

function renameLibraryToReadme(file) {
  const libPath = resolveBuildPath(file)
  fs.rename(
    `${libPath}`,
    path.resolve(__dirname, '../lib/', 'README.md'),
    err => {
      if (err) throw err
      console.log(`Renamed ${file} to README.md`)
    },
  )
}

function resolveBuildPath(file) {
  return path.resolve(__dirname, '../lib/', path.basename(file))
}

function createPackageFile() {
  return new Promise(resolve => {
    fse.readFile(
      path.resolve(__dirname, '../package.json'),
      'utf8',
      (err, data) => {
        if (err) {
          throw err
        }

        resolve(data)
      },
    )
  })
    .then(data => JSON.parse(data))
    .then(packageData => {
      const {
        name,
        author,
        version,
        description,
        main,
        keywords,
        repository,
        license,
        bugs,
        homepage,
        peerDependencies,
        dependencies,
      } = packageData

      const minimalPackage = {
        name,
        author,
        version,
        description,
        main,
        keywords,
        repository,
        license,
        bugs,
        homepage,
        peerDependencies,
        dependencies,
      }

      return new Promise(resolve => {
        const libPath = path.resolve(__dirname, '../lib/package.json')
        const data = JSON.stringify(minimalPackage, null, 2)
        fse.writeFile(libPath, data, err => {
          if (err) throw err
          console.log(`Created package.json in ${libPath}`)
          resolve()
        })
      })
    })
}
