const sharp = require("sharp");
const fs = require("fs");
const outToImg = require("./outToImg");

const init = config => {
  const data = sharp(process.argv[2])
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(e => {
      toAscii(e, config.squareSize, config.values);
    });
};

const create2dArray = rows => {
  const tmp = [];
  for (let i = 0; i < rows; i++) {
    tmp[i] = [];
  }
  return tmp;
};

const toAscii = (e, squareSize, values) => {
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
  fs.writeFile(`${process.argv[2]}.txt`, finalOutput, e => {});

  sharp(outToImg(finalOutput, resized[0].length, resized.length)).toFile(
    "output.png"
  );
};

/*maps array of grayscale values to a string of ascii chars based on the 'values' param*/
const getAsciiString = (input, values) => {
  let output = "";
  for (let y = 0; y < input.length - 1; y++) {
    for (let x = 0; x < input[0].length; x++) {
      if (input[y][x] === 255) {
        output += values[values.length - 1];
      } else {
        output += values[Math.floor((input[y][x] * values.length) / 255)];
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

if (!process.argv[2]) {
  console.log("Filename not specified");
} else {
  fs.readFile("config.json", "utf8", (error, data) => {
    if (error) {
      console.log(error);
    } else {
      init(JSON.parse(data));
    }
  });
}
