# README #

Images stored in this repository will be available to all projects with the path... 

[https://raw.githubusercontent.com/jazyx/depot/refs/heads/main/]()

... followed by the folder path and the image name. A JSON file at...

[https://raw.githubusercontent.com/jazyx/depot/refs/heads/main/tree.json]()

... can provide paths to all the folders and their subfolders, while ...

[https://raw.githubusercontent.com/jazyx/depot/refs/heads/main/.../flat.json]()

... in each (sub)folder provides an array of all its immediate subfolders, and ...

[https://raw.githubusercontent.com/jazyx/depot/refs/heads/main/.../images.json]()

... provides an array of all the relative paths to each image it contains.

You can thus load the `tree.json` file to know the paths to all the subfolders and the various `images.json` files to get the relative paths to each image in any given folder.

You can also step through the various `flat.json` files to home in on a specific folder, if `tree.json` ends up becoming too big.