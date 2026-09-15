# README #

Images stored in this repository will be available to all projects, starting with the path... 

[https://raw.githubusercontent.com/jazyx/depot/refs/heads/main/]()

... followed by the folder path and the image name. These images are accessible from anywhere.

For example, the image below has the path [https://raw.githubusercontent.com/jazyx/depot/refs/heads/main/animals/birds/sparrow.jpg](https://raw.githubusercontent.com/jazyx/depot/refs/heads/main/animals/birds/sparrow.jpg)

![sparrow](https://raw.githubusercontent.com/jazyx/depot/refs/heads/main/animals/birds/sparrow.jpg)


## JSON files

Each folder that contains an image or that contains subfolders that contain images contains an `images.json` file.

**These files are not accessible from outside the GitHub site.**

A JSON file at...

[https://raw.githubusercontent.com/jazyx/depot/refs/heads/main/lut.json]()

... provides a look-up table to all the folders, by topic, plus the number of images available from that folder. Files such as...

[https://raw.githubusercontent.com/jazyx/depot/refs/heads/main/.../images.json]()

... provide an array of all the relative paths to each image it contains.


## Creating the JSON files automatically

After adding, editing or deleting image files, you can recreate all the `image.json` files and the `lut.json` file, by running:

```js
node createJSONFiles.js
```

This will not change any of the files in the `_special` folder, so these may become out-of-date.