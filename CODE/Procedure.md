Start with `stack = [root], tree={}, paths=[]`
Remove the last item : `current = root, stack = [], tree={}, paths=[]`
Find all the folders in current, and add their relative paths to `stack`

```js
current = 'root',
stack = [ 'root/animals', 'root/bingo', ... ]
paths = [ 'root' ]
tree = { 'root': { 'animals': 0, 'bingo': 0, ... }}
```

Pop the last item and continue:
```js
current = 'root/animals',
stack = [ 'root/bingo', ..., 'root/animals/reptiles' ]
paths = [ 'root', ..., 'root/animals/reptiles' ]
tree = { 'root': { 
  'animals': { 'birds', 'insects', 'mammals', 'reptiles' },
  'bingo': 0, 
  ...
  }
}
```

Continue until `stack` is empty. We now have the full tree, as a nested map, and 'paths' as a flat array, where the last items are endpoints.

Work backwards through `paths`, listing image files. 

At each step, check if the current folder contains any subfolders. If so, read in their `image.json` files (but not their children's) and add their contents to the `image.json` file currently being created.

