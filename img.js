const sharp = require("sharp");
const fs = require("fs");

const init = () => {
  const data = sharp(process.argv[2])
    .raw()
    .toBuffer({ resolveWithObject: true })
    .then(e => {
      toAscii(e, process.argv[3] || 50);
    });
};

const create2dArray = rows => {
  const tmp = [];
  for (let i = 0; i < rows; i++) {
    tmp[i] = [];
  }
  return tmp;
};

const toAscii = (e, squareSize) => {
  let output = "";
  const sensitivity = process.argv[4] || 100;
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
  for (let y = 0; y < resized.length; y++) {
    for (let x = 0; x < resized[0].length; x++) {
      if (resized[y][x] > sensitivity) output += "@";
      else output += " ";
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
  console.log("node img.fs filename squareSize sensitivity");
} else {
  init();
}
