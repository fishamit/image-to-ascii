# image-to-ascii

Command-line image to ascii converter written in node. uses the canvas & sharp libraries.

## How to run

Create "input" folder in root directory containing the image files to be exported, then run "node img.js".
An output folder will be created, containing the exported files.

## Configuration

In config.json, specify the following key and values:

- "squareSize": Size n of square (n x n pixels) to be averaged (nearest neighbor) into one ascii character
- "values": A string of ascii chars that map to grayscale values, from dark to bright.
- "exportOptions": an object containing:
  - "toPng": boolean
  - "toTxt": boolean

example config file:

```
{
  "values": "@%#*+=-:. ",
  "squareSize": 5,
  "exportOptions": {
    "toPng": true,
    "toTxt": true
  }
}
```
