# Rasterize Polylines

This a couple small functions for rasterizing Flux polylines. It can be used as
a Flux code block on [Flux.io](https://flux.io). NOTE: "code blocks" are only
available to a limited number of users on Flux.

It implements the popular Bresenham's algorithm for converting vector
coordinates to a grid, allowing the user to specify a gridding ratio of their
choosing. This could later be extended to support curves, as well, per this
paper: http://members.chello.at/easyfilter/bresenham.pdf

To use this module as a code block, create a new code block, Edit it, and paste
in the contents of any of the blocks in this repo. The inputs and outputs of the
code block should match that of the JSDoc for the `run` function in the source
file in question (e.g. "coordinates" in and "coordinates" & "overlaps" out for
coordinateOverlaps.js).

To run tests, fork/clone and run:
```
npm install
npm run test
```
