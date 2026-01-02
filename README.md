# JustF Sprite Editor
This is a simple tool for annotating sprite atlasses and extract sprites and animations from it, including adding additional data to it.

## Core Pillars
 - **Ease of implementation for developers**. Not only should the program be very easy to use, the implementation into a custom engine should be very simple. Whatever you don't need should be ignored.

## Roadmap
 - Texture explorer allow for directories
 - Update the readme with needed information
 - Adding collision shapes to frames
 - Additional types of sprite properties
    - Positions on frame
    - Directions
 - Nine slice sprite offsets
 - Exporting and packing (maybe seperate cli tooling)
 - Search in Sprite explorer

## Building and contribution
Building this project has two steps: 
 1. Building the icons
 2. Building the angular project


### Building: Icons
Because the icons are pixel art, they are created as png files. These png files are then converted to SVG, to compile into TTF, so that can finally be used as a recoloured pixel font instead of an image. It's a bit of a hastle, but it works. It is setup in the `pixel-art-icons` folder, with a seperate project. That can be used with:
 - `cd pixel-art-icons`
 - `npm install`
 - `npm run convert`

This needs to be done at least once, and the `npm run convert` every time there is an update to the icons.

### Building: Angular project
This project was build with angular 21, so `ng serve` and `ng build` can be used for building and serving the project locally.
