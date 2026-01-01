import minimist from "minimist";
import { glob } from "glob";
import { promises as fs } from "node:fs";
import path from "node:path";
import svgtofont from 'svgtofont';

const args = minimist(process.argv.slice(2), {
  string: ["input", "output"],
  alias: {
    i: "input",
    o: "output"
  },
});

if (!args.input) {
  console.error("Error: --input is required");
  process.exit(1);
}
if (!args.output) {
  console.error("Error: --output is required");
  process.exit(1);
}

// Get the files
const filePaths = await glob(args.input, {
  cwd: process.cwd(),
});

if (filePaths.length === 0) {
  console.error("No files matching the input pattern.");
  process.exit(1);
}

const outputDirectory = args.output;

console.log(`Outputting to ${outputDirectory}.`);

await fs.mkdir(outputDirectory, { recursive: true });

await svgtofont({
  src: path.resolve(process.cwd(), args.input),
  dist: path.resolve(process.cwd(), args.output),
  fontName: 'icons',
  css: true,
  outSVGVue: false,
  outSVGPath: false,
  outSVGReactNative: false,
  
  svgicons2svgfont: {
    fontHeight: 1000,
    normalize: true,
  },

    // website = null, no demo html files
  // website: {
  //   title: "svgtofont",
  //   // Must be a .svg format image.
  //   // logo: path.resolve(process.cwd(), "svg", "git.svg"),
  //   version: "1.0.0",
  //   meta: {
  //     description: "Converts SVG fonts to TTF/EOT/WOFF/WOFF2/SVG format.",
  //     keywords: "svgtofont,TTF,EOT,WOFF,WOFF2,SVG"
  //   },
  //   description: ``,
  //   // Add a Github corner to your website
  //   // Like: https://github.com/uiwjs/react-github-corners
  //   corners: {
  //     url: 'https://github.com/jaywcjlove/svgtofont',
  //     width: 62, // default: 60
  //     height: 62, // default: 60
  //     bgColor: '#dc3545' // default: '#151513'
  //   },
  //   links: [
  //     {
  //       title: "GitHub",
  //       url: "https://github.com/jaywcjlove/svgtofont"
  //     },
  //     {
  //       title: "Feedback",
  //       url: "https://github.com/jaywcjlove/svgtofont/issues"
  //     },
  //     {
  //       title: "Font Class",
  //       url: "index.html"
  //     },
  //     {
  //       title: "Unicode",
  //       url: "unicode.html"
  //     }
  //   ],
  //   footerInfo: `Licensed under MIT. (Yes it's free and <a href="https://github.com/jaywcjlove/svgtofont">open-sourced</a>`
  // }

});

console.log("done");