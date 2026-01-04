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
    const outputFileName = parsedInputPath.name + ".png";
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

    const image = await sharp(inputPath);
    const meta = await image.metadata();

    const resized = image.resize({width: meta.width * 2, height: meta.height * 2, kernel: "nearest" });

    await resized.toFile(outputPath);

    console.log(`Finished '${inputPath}'.`);
}

for(let i = 0; i < files.length; i++) {
    await processFile(files[i]);
}