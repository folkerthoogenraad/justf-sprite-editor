import minimist from "minimist";
import { glob } from "glob";
import path from "node:path";
import { promises as fs, createReadStream, createWriteStream } from "node:fs";
import { SVGIcons2SVGFontStream } from 'svgicons2svgfont';

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

console.log(`Found ${filePaths.length} files matching pattern.`);

const files = filePaths.map(x => path.parse(x));
const unicode = assignUnicode(files);

const fontStream = new SVGIcons2SVGFontStream({
  fontName: 'icons',
});

fontStream
  .pipe(createWriteStream(path.join(outputDirectory, "font.svg")))
  .on('finish', function () {
    console.log('Font successfully created!');
  })
  .on('error', function (err) {
    console.log(err);
  });


for (let i = 0; i < files.length; i++) {
  const filePath = filePaths[i];
  const file = files[i];
  const uni = unicode.get(file.name);

  const glyph = createReadStream(filePath);

  glyph.metadata = {
    unicode: [uni.char],
    name: file.name,
  };

  fontStream.write(glyph);
}

fontStream.end();

// ================================================== //
// Helper functions
// ================================================== //
function assignUnicode(files) {
  const sorted = files.map(x => x.name).sort();
  const map = new Map();

  const PUA_START = 0xe001;

  sorted.forEach((file, index) => {
    const codePoint = PUA_START + index;
    map.set(file, {
      codePoint,
      char: String.fromCodePoint(codePoint),
      hex: "U+" + codePoint.toString(16).toUpperCase()
    });
  });

  return map;
}