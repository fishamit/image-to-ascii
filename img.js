const sharp = require("sharp");
const fs = require("fs");

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
  let output = "";
  const width = e.info.width;
  const height = e.info.height;
  const arr = create2dArray(height);
  arr.forEach((row, index) => {
    for (let i = 0; i < width * 3; i = i + 3) {
      row.push(
        Math.floor(
          (e.data[i + width * 3 * index] +
            e.data[i + width * 3 * index + 1] +
            e.data[i + width * 3 * index + 2]) /
            3
        )
      );
    }
  });

  const resized = resize(arr, squareSize);
  for (let y = 0; y < resized.length - 1; y++) {
    for (let x = 0; x < resized[0].length; x++) {
      output += values[Math.floor((resized[y][x] * values.length) / 255)];
    }
    output += `
`;
  }

  fs.writeFile(`${process.argv[2]}.txt`, output, e => {});
};

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
      console.log(JSON.parse(data));
      init(JSON.parse(data));
    }
  });
}
