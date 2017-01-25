import fs from 'fs';
import path from 'path';
import { humanize } from 'underscore.string';

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
    try {
      return JSON.parse(file); // eslint-disable-line angular/json-functions
    } catch(error) {
      console.error(`Invalid JSON in ${src}`);
    }
  }

  return undefined;
}

export function removePrefix(string) {
  if (string.indexOf('_') > -1) {
    const split = string.split('_');
    return split[1];
  }

  return string;
}

export function formatVariantHeading(string) {
  const withoutExt = removeExt(string);
  const withoutPrefix = removePrefix(withoutExt);
  return humanize(withoutPrefix);
}
