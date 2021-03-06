import fs from 'fs';
import path from 'path';
import marked from 'marked';
import Twig from 'twig';
import * as helpers from './helpers';
import { slugify, humanize } from 'underscore.string';

Twig.cache(false);

let config = {
  name: 'Component Library',
  styleguideAssetSrc: `${path.dirname(__filename)}/assets/`,
  excludedTypes: ['utils'],
  styleguideNamespace: 'styleguide::',
  namespace: 'assets::',
  twig: {
    filters: [
      {
        name: 'resize',
        function: (value) => value,
      },
    ],
    functions: [
      {
        name: 'function',
        function: () => '',
      },
    ],
  },
  layout: 'styleguide::layouts/empty',
  stylesheets: [
    { href: 'assets/styles/main.css' },
  ],
  scripts: [
    { src: 'assets/scripts/main.js' },
  ],
  data: {},
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

function getVariants(src, name, twig) {
  const files = helpers.getFiles(src, 'json');

  return files.map((file) => ({
    name,
    heading: humanize(helpers.formatVariantFile(file)),
    data: Object.assign({}, config.data, helpers.getJson(`${src}/${file}`)),
    data_raw: helpers.getFile(`${src}/${file}`),
    php_data_raw: helpers.convertJsonToPhpString(`${src}/${file}`),
    twig_raw: twig,
    file_id: slugify(helpers.formatVariantFile(file)),
    slug: slugify(helpers.formatVariantFile(file)),
    isolated_link: `/${name}/${slugify(helpers.formatVariantFile(file))}.html`,
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
    variants: getVariants(
      `${src}/data`,
      `${type}/${name}`,
      helpers.getFile(`${src}/${name}.twig`)
    ),
    docs: getDocs(`${src}/Readme.md`),
  };
}

function getComponents(src, type) {
  const components = helpers.getFolders(src);
  return components.map((component) => getComponent(`${src}/${component}`, component, type));
}

function outputPage(data, filename, template, folder = '', tabs = []) {
  const templatePath =
    `${config.styleguideAssetSrc}/components/templates/${template}/${template}.twig`;
  return Twig.renderFile(templatePath, {
    settings: {
      views: `${config.src}`,
      'twig options': {
        namespaces: {
          styleguide: config.styleguideAssetSrc,
          assets: config.assetSrc,
        },
      },
    },
    site: {
      name: config.name,
      tabs,
    },
    scripts: config.scripts,
    stylesheets: config.stylesheets,
    data,
  }, (err, html) => {
    const dest = `${config.dest}/${folder}`;
    helpers.createDirIfNotExist(dest);
    fs.writeFileSync(`${dest}/${filename}.html`, html);
  });
}

function shapeComponentData(component) {
  const data = {
    page_header: {
      heading: component.name,
      sub_heading: component.type,
      isolated_link: `${component.name}.html#isolated`,
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
    ],
  };

  if (component.docs) {
    data.sections.push({
      heading: 'Documentation',
      components: [
        {
          name: 'molecules/sg-text',
          data: {
            text: component.docs,
          },
        },
      ],
    });
  }

  return data;
}

function getTabs(types, currentType = false, currentName = false) {
  return types.map((type) => ({
    id: type.name,
    label: type.name,
    path: `#${type.name}`,
    components: [
      {
        name: 'molecules/sg-nav',
        data: {
          items: type.components.map((component) => ({
            name: component.name,
            label: component.name,
            path: `/${type.name}/${component.name}/index.html#${type.name}`,
            components: [],
            active: (currentType === type.name && currentName === component.name),
          })),
        },
      },
    ],
  }));
}

function shapeVariantData(variant) {
  return {
    name: variant.name,
    data: Object.assign(variant.data, {
      layout: config.layout,
      namespace: config.namespace,
    }),
    slug: variant.slug,
  };
}

function generateVariantPages(components) {
  components.map((component) => component.variants.map(
    (variant) => outputPage(
      shapeVariantData(variant),
      variant.slug,
      'variant',
      variant.name
    )
  ));
}

function generateSinglePages(components, types) {
  components.map((component) => outputPage(
    shapeComponentData(component),
    'index',
    'single',
    `${component.type}/${component.name}`,
    getTabs(types, component.type, component.name)
  ));
}

function generateIndexPage(components, tabs) {
  outputPage(
    {
      text: getDocs(`${path.dirname(__filename)}/../docs/Readme.md`),
    },
    'index',
    'home',
    '',
    tabs
  );
}

function componentsFromTypes(types) {
  let components = [];

  types.forEach((type) => {
    components = components.concat(type.components);
  });

  return components;
}

function getTypes(src, excludedTypes = []) {
  const types = helpers.getFolders(src);

  return types.filter((type) => excludedTypes.find((excludedType) => excludedType !== type));
}

function setTwigFilters(filters) {
  filters.forEach((f) => {
    Twig.extendFilter(f.name, f.function);
  });
}

function setTwigFunctions(functions) {
  functions.forEach((f) => {
    Twig.extendFunction(f.name, f.function);
  });
}

export default (settings) => {
  config = Object.assign(config, settings);

  if (settings.dataSrc) {
    config.data = helpers.getJson(settings.dataSrc);
  }

  if (config.hasOwnProperty('twig') && config.twig.hasOwnProperty('filters')) {
    setTwigFilters(config.twig.filters);
  }

  if (config.hasOwnProperty('twig') && config.twig.hasOwnProperty('functions')) {
    setTwigFunctions(config.twig.functions);
  }

  const types = getTypes(`${config.src}/components`, config.excludedTypes);
  const typesWithComponents = types.map((type) => ({
    name: type,
    components: getComponents(`${config.src}/components/${type}`, type),
  }));

  generateIndexPage(componentsFromTypes(typesWithComponents), getTabs(typesWithComponents));
  generateSinglePages(componentsFromTypes(typesWithComponents), typesWithComponents);
  generateVariantPages(componentsFromTypes(typesWithComponents));
};
