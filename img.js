const sharp = require("sharp");
const { createCanvas, loadImage } = require("canvas");
const fs = require("fs");

const toAscii = (e, squareSize, values, exportOptions, filename) => {
  const width = e.info.width;
  const height = e.info.height;
  const arr = create2dArray(height);
  const channels = e.info.channels;

  arr.forEach((row, index) => {
    for (let i = 0; i < width * channels; i += channels) {
      row.push(
        Math.floor(
          (e.data[i + width * channels * index] +
            e.data[i + width * channels * index + 1] +
            e.data[i + width * channels * index + 2]) /
            3
        )
      );
    }
  });

  const resized = resize(arr, squareSize);
  const finalOutput = getAsciiString(resized, values);

  if (exportOptions.toTxt) {
    fs.writeFile(`output//${filename}.txt`, finalOutput, e => {
      if (!e) console.log(filename + " exported to txt.");
    });
  }

  if (exportOptions.toPng) {
    sharp(
      getCanvasBuffer(finalOutput, resized[0].length, resized.length)
    ).toFile(`output//${filename}.png`, e => {
      if (!e) console.log(filename + " exported to png.");
    });
  }
};

/*maps array of grayscale values to a string of ascii chars based on the 'values' param*/
const getAsciiString = (input, values) => {
  let output = "";
  for (let y = 0; y < input.length - 1; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === 255) {
        output += values[values.length - 1];
      } else {
        output += ` ${values[Math.floor((input[y][x] * values.length) / 255)]}`;
      }
    }
    output += `
`;
  }
  return output;
};

/* lowers the resolution by n */
const resize = (arr, n) => {
  const width = arr[0].length;
  const height = arr.length;
  const squareSize = n;

  const resizedArray = create2dArray(height / n);
  for (let outerY = 0; outerY < Math.floor(height / n); outerY++) {
    for (let outerX = 0; outerX < Math.floor(width / n); outerX++) {
      let val = 0;
      let divideBy = squareSize * squareSize;
      for (
        let innerY = outerY * squareSize;
        innerY < squareSize * (outerY + 1);
        innerY++
      ) {
        for (
          let innerX = outerX * squareSize;
          innerX < squareSize * (outerX + 1);
          innerX++
        ) {
          val += arr[innerY][innerX];
        }
      }
      resizedArray[outerY].push(Math.floor(val / divideBy));
    }
  }
  return resizedArray;
};

/*Create an image and return buffer for exporting*/
const getCanvasBuffer = (input, width, height) => {
  const fontSize = 10;
  const canvas = createCanvas(
    fontSize * width + fontSize - 5,
    fontSize * 1.2 * height - 10
  );
  const ctx = canvas.getContext("2d");
  ctx.font = "10px Consolas";
  ctx.rect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "white";
  ctx.fill();
  ctx.fillStyle = "black";
  ctx.fillText(input, 0, fontSize);
  return canvas.toBuffer();
};

const init = (config, filename, shortFilename) => {
  sharp(filename)
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(e => {
      toAscii(
        e,
        config.squareSize,
        config.values,
        config.exportOptions,
        shortFilename
      );
    });
};

const create2dArray = rows => {
  const tmp = [];
  for (let i = 0; i < rows; i++) {
    tmp[i] = [];
  }
  return tmp;
};

fs.readFile("config.json", "utf8", (error, data) => {
  if (error) {
    console.log("Could not read config file.");
  } else {
    fs.readdir("input", (error, files) => {
      if (error) {
        console.log(
          "Input folder not found. Add /input folder containing your image files."
        );
      } else if (files.length === 0) {
        console.log("No files to convert.");
      } else {
        fs.mkdir("output", e => {
          files.forEach(file => {
            const validExtensions = ["jpg", "png"];
            const filenameArr = file.split(".");
            if (
              validExtensions.includes(
                filenameArr[filenameArr.length - 1].toLowerCase()
              )
            ) {
              init(JSON.parse(data), `./input/${file}`, file);
            }
          });
        });
      }
    });
  }
});
