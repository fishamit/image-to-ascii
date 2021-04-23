# image-to-ascii

Command-line image to ascii converter written in node. uses the canvas & sharp libraries.

## How to run

"node img.js filename.jpg"

## Configuration

In config.json, specify the following key and values:

- "squareSize": Size n of square (n x n pixels) to be averaged into one ascii character
- "values": An array of grayscale values, from dark to bright
- "exportOptions": an object containing:
  - "toPng": boolean
  - "toTxt": boolean

example config file:

```
{
  "values": ["@", "%", "#", "*", "+", "=", "-", ":", ".", " "],
  "squareSize": 5,
  "toTxt": true,
  "exportOptions": {
    "toPng": true,
    "toTxt": true
  }
}
```
