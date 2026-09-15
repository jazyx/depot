/**
 * Notes/createJSONFiles.js
 * 
 * Reads the hierarchy of folders in the parent directory
 * (excluding the folder that contains this script), and
 * (re)generates a file named `images.json` in each folder,
 * containing the filepaths of each image relative to the root.
 * 
 * Example from the `animals/mammals/` folder:
 *   [ 
 *      "animals/mammals/aardvark.jpg",
 *      "animals/mammals/badger.jpg",
 *      ...,
 *      "animals/mammals/zebra.webp",
 *   ]
 * 
 * Example from the `animals/insects/` folder:
 *   [ 
 *     "animals/insects/aphid.webp",
 *     ...
 *     "animals/insects/butterflies/apollo.jpg",
 *     "animals/insects/butterflies/brimstone.jpeg",
 *     ...,
 *     "animals/insects/social/ant.webp",
 *     ...,
 *     "animals/insects/social/wasp.webp",
 *   ]
 * 
 * Also generates a folder named `tree.json` in the root of the
 * parent directory, which contains the folder hierarchy. All
 * folders, even those not at the endpoints, may contain images
 * and an `images.json` file.
 * 
 * Example: 
 *   {
 *     "animals": {
 *       "birds": 0,
 *       "dinosaurs": 0,
 *       "fish": 0
 *       "insects": {
 *         "butterflies": 0
 *         "beetles": 0,
 *         "social": 0
 *       },
 *       "mammals": 0,
 *     },
 *     "city": { ... },
 *     ...
 *   }
 * 
 * Process:
 * 1. Find the root folder
 * 2. Recursively find subfolders of the root folder which contain
 *    image files. (Intermediary folders may contain no images of
 *    their own.)
 * 3. For such folders which contain no subfolders of their own,
 *    generate an `image.json` file of their contents
 * 4. For the parent folders of such folders:
 *    * Generate an array of all the images directly in that folder
 *    * Include the contents of the `images.json` files in the
 *      children folders
 */


import {
  basename,
  dirname,
  extname,
  join,
  relative,
  resolve,
  sep
} from 'path'
import {
  existsSync,
  readdirSync,
  readFileSync,
  writeFileSync,
  statSync
} from 'fs'
import { fileURLToPath } from "url"



const __filename = fileURLToPath(import.meta.url) // this script
const root = resolve(dirname(__filename), "..")   // Depot/
console.log("root:", root)
const rootName = basename(root)

const ignore = [ ".git", "Notes" ]
const images = [ ".gif", ".jpg", ".jpeg", ".png", ".svg", ".webp" ]
// Ignore TIFF and BMP and other less web-friendly formats


const readOptions = { withFileTypes: true }
const writeOptions = { encoding: "utf8" }
function getDirectoriesByType(parent) {
  const directories = readdirSync(parent, readOptions)
    .filter( Dirent => Dirent.isDirectory() )
    .map( Dirent => Dirent.name )
    .filter( name => name[0] !== "." ) // exclude hidden files
  return directories
}


function getImageFiles(parent) {
  const imageFiles = readdirSync(parent, readOptions)
    .filter( Dirent => Dirent.isFile() )
    .map( Dirent => Dirent.name )
    .filter( name => images.indexOf(extname(name)) + 1)
  return imageFiles
}


function walk(root) {
  const stack    = [root]
  const tree     = { [rootName]: {} }
  const paths    = []

  let parent
  while (parent = stack.shift()) {
    const depth  = join(rootName, relative(root, parent))
    const branch = getBranch(tree, depth)
    const children =  getDirectoriesByType(parent)
    children.forEach(child => {
      let path = join(parent, child) 
      stack.push(path)
      path = relative(root, path)
      paths.push(path)
      branch[child] = {} // may become zero later
    })
  }

  const LUT = {} // { <folder_name>: [{ path, count}, ...], ... }
  paths.unshift("./")
  console.log("paths:", paths)

  let depth
  while (depth = paths.pop()) {
    const path = join(root, depth)
    const name = basename(path)

    const downstream = getDownstreamImages(path)
    const imageFiles = getImageFiles(path)
      .map(fileName => (
        relative(root, join(path, fileName))
      ))
    imageFiles.push(...downstream)

    const count = imageFiles.length
    if (count) {
      const json = JSON.stringify(imageFiles, null, 2)
      const fileName = join(path, 'images.json')
      writeFileSync(fileName, json, writeOptions)

      const synonyms = LUT[name] || (LUT[name] = [])
      synonyms.push({ path: relative(root, fileName), count })
    }
  }

  const file = join(root, "lut.json")
  delete LUT[rootName] // Depot
  let json = JSON.stringify(LUT).replaceAll('],"', '],\n  "')
  json = `{\n  ${json.slice(1, -1)}\n}`
  writeFileSync(file, json, writeOptions)
}


function getBranch(branch, depth) {
  depth = depth.split(sep)

  let child
  while (child = depth.shift()) {
    branch = branch[child]
  }

  return branch
}


function getDownstreamImages(path) {
  const children = getDirectoriesByType(path)
  const jsonFiles = children.map(child => (
    join(path, child, "images.json")
  ))

  const downstream = jsonFiles.reduce((images, jsonFile) => {
    try {
      const text = readFileSync(jsonFile)
      const array = JSON.parse(text)
      images.push(...array)
    } catch(error) {}
    
    return images
  }, [])

  return downstream
}


walk(root)