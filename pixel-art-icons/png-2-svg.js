import minimist from "minimist";
import { glob } from "glob";
import sharp from "sharp";
import path from "node:path";
import { promises as fs } from "node:fs";

// Get the arugments
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
const files = await glob(args.input, {
    cwd: process.cwd(),
});

if(files.length === 0) {
  console.error("No files matching the input pattern.");
  process.exit(1);
}

const outputDirectory = args.output;

console.log(`Outputting to ${outputDirectory}.`);

await fs.mkdir(outputDirectory, { recursive: true });

console.log(`Found ${files.length} files matching pattern.`);

async function processFile(inputPath) {
    const parsedInputPath = path.parse(inputPath);
    const outputFileName = parsedInputPath.name + ".svg";
    const outputPath = path.join(outputDirectory, outputFileName);

    try {
        const inputLastModified = await fs.stat(inputPath);
        const outputLastModified = await fs.stat(outputPath);
    
        if(outputLastModified.mtimeMs >= inputLastModified.mtimeMs) {
            console.log(`Skipping '${inputPath}', not modified.`);
            return;
        }
    }
    catch(e){ 
        // Lets just do the nice assumption here that the file does not exist yet.
    }

    const { data, info } = await sharp(inputPath).raw().toBuffer({resolveWithObject: true});

    if(info.channels !== 4) {
        console.error(`${inputPath} has unsupported amount of channels ${info.channels}`);
    }

    let paths = [];
    paths.push(`<svg width="${info.width}" height="${info.height}" viewBox="0 0 ${info.width} ${info.height}" xmlns="http://www.w3.org/2000/svg">`);

    for(let x = 0; x < info.width; x += 1) {
        for(let y = 0; y < info.height; y += 1) {
            const index = (x + y * info.width) * info.channels;
            const alpha = data[index + 3];

            if(alpha <= 0) {
                continue;
            }

            // <rect width="1" height="1" x="${x}" y="${y}" style="fill:rgb(0,0,0)" />
            paths.push(`<rect x="${x}" y="${y}" width="1" height="1" style="fill:rgb(255,255,255);" />`);
        }
    }
    paths.push(`</svg>`);
    
    const svg = paths.join();

    await fs.writeFile(outputPath, svg);

    console.log(`Finished '${inputPath}'.`);
}

for(let i = 0; i < files.length; i++) {
    await processFile(files[i]);
}