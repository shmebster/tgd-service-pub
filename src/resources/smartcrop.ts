// eslint-disable-next-line @typescript-eslint/no-var-requires
const sharp = require('sharp');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const smartcrop = require('smartcrop-sharp');

import * as canvas from 'canvas';

import * as faceapi from 'face-api.js';

export async function applySmartCrop(src, dest, width, height) {
  const { Canvas, Image, ImageData } = canvas;
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
  const img = await canvas.loadImage(src);
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const detection = await faceapi.detectAllFaces(img);
  const options = {
    width: width,
    height: height,
    boost: [],
    minScale: 0.5,
  };
  options.boost = detection.map((face) => {
    return {
      x: face.box.x,
      y: face.box.y,
      width: face.box.width,
      height: face.box.height,
      weight: 1.0,
    };
  });

  return smartcrop.crop(src, options).then(function (result) {
    const crop = result.topCrop;
    return sharp(src)
      .extract({
        width: crop.width,
        height: crop.height,
        left: crop.x,
        top: crop.y,
      })
      .resize(width, height)
      .jpeg()
      .toBuffer();
  });
}
