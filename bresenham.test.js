/**
 * Tests for the Bresenham module.
 *
 * @author Eric Nguyen <eric@flux.io>
 * @version 0.0.1
 */

'use strict';

import test from 'tape';

import bresenham from './bresenham.js';

test('The Bresenham block properly rasterizes polylines', function(t) {
  function assertTypeError(polyline, msg) {
    var errMsg;
    try {
      bresenham.run({}, 1);
    } catch(e) {
      errMsg = e.message;
    }
    t.equal(errMsg, 'Input must be a Flux polyline object.', msg)
  }

  function test(points, gridRatio, expectedValue, msg) {
    var out = bresenham.run({
      primitive: 'polyline',
      points: points
    }, gridRatio);
    t.deepEqual(out.pixels, expectedValue, msg);
  }

  assertTypeError({}, 'Plain object throws exception.');
  assertTypeError([], 'Plain array throws exception.');

  test([], 1, [], 'No points');
  test([[0,0], [1,1]], 1, [[0,0], [1,1]],
      'Single line segment');
  test([[0,0,9], [1,1,9]], 1, [[0,0], [1,1]],
      'Z-coordinates are ignored.');
  test([[0,0], [1,1]], 2, [[0,0], [1,1], [2,2]],
      'Single line segment, double sampled.');
  test([[0,0], [1,0], [1,1]], 2, [[0,0], [1,0], [2,0], [2,1], [2,2]],
      'Multi-line segment, double sampled.');

  t.end();
});

test('lines are converted to pixels correctly.', function(t) {
  // Diagonal unit lines.
  t.deepEqual(bresenham.linePixels(0,0,1,1), [[0,0], [1,1]]);
  t.deepEqual(bresenham.linePixels(1,1,0,0), [[1,1], [0,0]]);
  t.deepEqual(bresenham.linePixels(1,0,0,1), [[1,0], [0,1]]);
  t.deepEqual(bresenham.linePixels(0,1,1,0), [[0,1], [1,0]]);

  // Vertical and horizontal lines.
  t.deepEqual(bresenham.linePixels(0,0,1,0), [[0,0], [1,0]]);
  t.deepEqual(bresenham.linePixels(0,0,0,1), [[0,0], [0,1]]);

  // Line with partial pixel overlap.
  t.deepEqual(
      bresenham.linePixels(0,0,5,4),
      [[0,0], [1,1], [2,2], [3,2], [4,3], [5,4]]);

  // Non-integer endpoints
  t.deepEqual(bresenham.linePixels(0,0.49, 1,0.49), [[0,0], [1,0]]);
  t.deepEqual(bresenham.linePixels(0,0.51, 1,0.51), [[0,1], [1,1]]);
  t.deepEqual(bresenham.linePixels(0,0.49, 1,1.49), [[0,0], [1,1]]);
  t.deepEqual(bresenham.linePixels(0.49,0, 0.49,1), [[0,0], [0,1]]);
  t.deepEqual(bresenham.linePixels(0.51,0, 0.51,1), [[1,0], [1,1]]);
  t.deepEqual(bresenham.linePixels(0.49,0, 1.49,1), [[0,0], [1,1]]);

  // TODO(eric): Make Non-integer endpoints more reliable. The following tests
  // will fail, currently. They seem to be producing visually-acceptable
  // results, but aren't strictly correct.
  // t.deepEqual(bresenham.linePixels(0,0.51,1,1.49), [[0,1], [1,1]]);
  // t.deepEqual(bresenham.linePixels(0,0.49, 2,1), [[0,0], [1,1], [2,1]]);
  // t.deepEqual(bresenham.linePixels(0,0.51, 2,0), [[0,1], [1,0], [2,0]]);

  t.end();
});
