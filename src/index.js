import gulp from 'gulp';
import fs from 'fs';
import marked from 'marked';
import Twig from 'twig';
import * as helpers from './helpers';

let config = {
  styleguideSrc: 'node_modules/twig-pattern-docs/lib/assets',
};

function getProperties(src) {
  const json = helpers.getJson(src);
  const properties = [];

  Object.keys(json.properties).forEach((key) => {
    const property = json.properties[key];

    properties.push({
      name: key,
      type: property.type,
      required: json.required.includes(key),
      description: property.description,
    });
  });

  return properties;
}

function getVariants(src, name) {
  const files = helpers.getFiles(src);
  const fileId = helpers.removeExt(name).replace('/', '-');

  return files.map((file) => ({
    name,
    heading: helpers.removeExt(file),
    data: helpers.getJson(`${src}/${file}`),
    data_raw: helpers.getFile(`${src}/${file}`),
    file_id: fileId,
  }));
}

function getDocs(src) {
  const file = helpers.getFile(src);
  return marked(file);
}

function getComponent(src, name, type) {
  return {
    name,
    type,
    properties: getProperties(`${src}/${name}.schema.json`),
    variants: getVariants(`${src}/data`, `${type}/${name}`),
    docs: getDocs(`${src}/Readme.md`),
  };
}

function getComponents(src, type) {
  const components = helpers.getFolders(src);
  return components.map((component) => getComponent(`${src}/${component}`, component, type));
}

function outputPage(data, name, template, tabs = []) {
  const templatePath = `${config.styleguideSrc}/components/templates/${template}/${template}.twig`;
  return Twig.renderFile(templatePath, {
    settings: {
      views: `${config.src}`,
    },
    site: {
      name: 'Pattern Library',
      tabs,
    },
    data,
  }, (err, html) => {
    helpers.createDirIfNotExist(config.dest);
    fs.writeFileSync(`${config.dest}/${name}.html`, html);
  });
}

function shapeComponentData(component) {
  return {
    page_header: {
      heading: component.name,
      sub_heading: component.type,
    },
    sections: [
      {
        components: component.variants.map((variant) => (
          {
            name: 'molecules/sg-variant',
            data: variant,
          }
        )),
      },
      {
        heading: 'Properties',
        components: [
          {
            name: 'molecules/sg-properties',
            data: {
              properties: component.properties,
            },
          },
        ],
      },
      {
        heading: 'Documentation',
        components: [
          {
            name: 'molecules/sg-text',
            data: {
              text: component.docs,
            },
          },
        ],
      },
    ],
  };
}

function generateSinglePages(components, tabs) {
  components.map((component) =>
    outputPage(shapeComponentData(component), component.name, 'single', tabs));
}

function generateIndexPage(components, tabs) {
  outputPage(components.map((component) => shapeComponentData(component)), 'index', 'all', tabs);
}

function getTabs(types) {
  return types.map((type) => ({
    id: type.name,
    label: type.name,
    path: `index.html#${type.name}`,
    components: [
      {
        name: 'molecules/sg-nav',
        data: {
          items: type.components.map((component) => ({
            name: component.name,
            label: component.name,
            path: `${component.name}.html`,
            components: [],
          })),
        },
      },
    ],
  }));
}

function componentsFromTypes(types) {
  let components = [];

  types.forEach((type) => {
    components = components.concat(type.components);
  });

  return components;
}

export default (settings) => {
  config = Object.assign(config, settings);

  const types = helpers.getFolders(`${config.src}/components`);
  const typesWithComponents = types.map((type) => ({
    name: type,
    components: getComponents(`${config.src}/components/${type}`, type),
  }));

  const tabs = getTabs(typesWithComponents);
  generateIndexPage(componentsFromTypes(typesWithComponents), tabs);
  generateSinglePages(componentsFromTypes(typesWithComponents), tabs);
};
