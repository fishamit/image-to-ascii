# image-to-ascii
Simple command-line image to ascii converter written in node. uses the Sharp library.

To run, node img.js with parameters: (filename) (resolution) (sensitivity)

resolution = size of square of pixels averaged to a single character. (1 means one characted per pixel).
sensitivity = threshold for distinguising betweeen black and white, between 0-255. the higher the brighter.
