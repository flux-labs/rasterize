'use strict';

/**
 * Simple conversion of 2d vectors to rasters.
 *
 * Takes in Flux lines or polylines and a gridding ratio (number of grid points
 * per vector coordinate units) and produces a couple useful raster outputs.
 *
 * Works off of this description of Bresenham's algorithm:
 * http://members.chello.at/easyfilter/bresenham.pdf
 *
 * @param {Object} polyline Flux polyline object to be rasterized. The polyline
 *     is rasterized only on the [x,y] plane. All z-coordinates are ignored.
 * @param {Number} gridRatio Ratio of grid points to every coordinate unit used
 *     to define the polylines. E.g. a gridRatio of 2 would put grid points at
 *     every half unit, and a gridRatio of 0.5 would but grid points at ever two
 *     units.
 *
 * @return {Object} A return object with a "pixels" property. The "points"
 *     property is an array of [x,y] coordinates for the grid points
 *     corresponding to the rasterized polyline.
 */
function run(polyline, gridRatio) {
  if (!polyline.primitive || !polyline.primitive === "polyline") {
    throw new Error('Input must be a Flux polyline object.')
  }
  gridRatio = gridRatio || 1;
  var points = polyline.points;
  var pixels = [];
  for (var i = 0; i < (points.length - 1); i++) {
    var point = points[i];
    var nextPoint = points[i + 1];
    var newPixels = linePixels(
        point[0] * gridRatio,
        point[1] * gridRatio,
        nextPoint[0] * gridRatio,
        nextPoint[1] * gridRatio);
    // After the first iteratin, get rid of the first pixel in newPixels, since
    // it overlaps with the last pixel in the existing pixels array. Then add
    // all those newPixels to the pixels array.
    if (i > 0) {
      newPixels.shift();
    }
    Array.prototype.push.apply(pixels, newPixels);
  }

  return {
    pixels: pixels
  }
}

function linePixels(startX, startY, endX, endY) {
  var dx = Math.abs(endX - startX),
      sx = (startX < endX ? 1 : -1),
      dy = -Math.abs(endY - startY),
      sy = (startY < endY ? 1 : -1);

  var err = dx + dy,
      e2;

  var pixels = [];
  startX = Math.round(startX);
  startY = Math.round(startY);
  endX = Math.round(endX);
  endY = Math.round(endY);
  while(1) {
    // TODO(eric): Simple rounding allows us to pass in non-integer line
    // coordinates and get out proper integer grid coordinates. See the tests,
    // however: the results seem visually consistent, but not strictly correct.
    // Beware of inconsistencies/discontinuities that may crop up.
    pixels.push([
      startX,
      startY
    ]);
    e2 = 2 * err;
    // console.log(e2, 2 * err, dx, dy);
    if (e2 >= dy) {
      if (startX === endX) { break; }
      err += dy;
      startX += sx;
    }
    if (e2 <= dx) {
      if (startY === endY) { break; }
      err += dx;
      startY += sy;
    }
  }

  return pixels;
}

module.exports = {
  run: run,
  linePixels: linePixels
};
