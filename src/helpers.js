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

export function getFiles(src) {
  return fs.readdirSync(src)
    .filter((file) => fs.statSync(path.join(src, file)).isFile());
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

export function dirExists(src) {
  try {
    return fs.statSync(src).isDirectory();
  } catch (err) {
    return false;
  }
}

export function createDirIfNotExist(src) {
  if (!dirExists(src)) {
    fs.mkdirSync(src);
  }
}

export function getJson(src) {
  const file = getFile(src);

  if (file) {
    return JSON.parse(file); // eslint-disable-line angular/json-functions
  }

  return undefined;
}
