const { createCanvas, loadImage } = require("canvas");

module.exports = (input, width, height) => {
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
