import fs from 'fs';
import path from 'path';

export function removeExt(string) {
  const parts = string.split('.');
  return parts[0];
}

export function getFolders(src) {
  return fs.readdirSync(src)
    .filter((file) => fs.statSync(path.join(src, file)).isDirectory());
}

export function getFiles(src, ext) {
  return fs.readdirSync(src)
    .filter((file) =>
      fs.statSync(path.join(src, file)).isFile()
      && path.extname(file) === `.${ext}`);
}

export function getFile(src) {
  let file;

  try {
    file = fs.readFileSync(src, 'utf8');
  } catch (err) {
    //
  }

  return file;
}

export function convertJsonToPhpString(src) {
  let string = getFile(src);
  string = string.replace(/{/g, '[');
  string = string.replace(/}/g, ']');
  string = string.replace(/":/g, '" =>');
  return string;
}

export function dirExists(src) {
  try {
    return fs.statSync(src).isDirectory();
  } catch (err) {
    return false;
  }
}

export function createDirIfNotExist(src) {
  src.split('/').forEach((dir, index, splits) => {
    const parent = splits.slice(0, index).join('/');
    const dirPath = path.resolve(parent, dir);
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath);
    }
  });
}

export function getJson(src) {
  const file = getFile(src);

  if (file) {
    try {
      return JSON.parse(file); // eslint-disable-line angular/json-functions
    } catch (error) {
      console.error(`Error: Invalid JSON in ${src}`);
    }
  }

  return {};
}

export function removePrefix(string) {
  if (string.indexOf('_') > -1) {
    const split = string.split('_');
    return split[1];
  }

  return string;
}

export function formatVariantFile(string) {
  const withoutExt = removeExt(string);
  const withoutPrefix = removePrefix(withoutExt);
  return withoutPrefix;
}
