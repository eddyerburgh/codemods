# codemods

This repository contains a collection of codemod scripts for use with [JSCodeshift](https://github.com/facebook/jscodeshift).

## Usage

Install jscodeshift:

```
yarn global add jscodeshift
```

Run the transform in a project.

Replace `<codemod-script>` with the path to the script you're running.

Replace `path` with the path of the files to transform.

```
jscodeshift -t <codemod-script> <path>
```

## Scripts

### `remove-anonymous-default-export`

Replaces anonymous default exports using the filename. If the filename is index.js, it will use the parent directory as the filename.
