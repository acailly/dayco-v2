const fs = require("fs");
const path = require("path");

const PROJECT_ROOT = path.join(__dirname, "..");

console.log("Project root is", PROJECT_ROOT);

const HTML_EXTENSION = ".html";

const HEAD_REGEX = /<head>[\s\S]*<\/head>/gim;

const HEAD_TEMPLATE = path.join(
  PROJECT_ROOT,
  "shared",
  "head",
  "head.template.html"
);

const HEAD_CONTENT = fs.readFileSync(HEAD_TEMPLATE, "utf8").trim();

/**
 * @param {string} directory
 */
function replaceIn(directory) {
  const files = fs.readdirSync(directory);

  files.forEach((file) => {
    const filename = path.join(directory, file);
    if (path.extname(file).toLowerCase() === HTML_EXTENSION) {
      const fileContent = fs.readFileSync(filename, "utf8");
      const newFileContent = fileContent.replace(HEAD_REGEX, HEAD_CONTENT);
      fs.writeFileSync(filename, newFileContent, "utf8");
      console.log("Replaced <head> content in", filename);
    } else {
      const stat = fs.lstatSync(filename);
      if (stat.isDirectory()) {
        replaceIn(filename);
      }
    }
  });
}

replaceIn(PROJECT_ROOT);
