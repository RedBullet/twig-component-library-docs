# WP Boilerplate

[ ![Codeship Status for redbullet/wp-boilerplate](https://codeship.com/projects/42373ae0-2cd9-0134-8d3a-6e1c50b8ca86/status?branch=master)](https://codeship.com/projects/163515)

## Introduction
This is Redbullet's Wordpress Boilerplate build.
It uses [Timber](http://upstatement.com/timber/) for Twig templates, [Composer](https://getcomposer.org/) for PHP
Dependencies, [NPM](https://www.npmjs.com/) for client side dependencies, [Browserify](http://browserify.org/) for
gluing the JS together and [Sass](http://sass-lang.com/) for styling.

## Running it on your machine

### Pre-requisites

- PHP 5.5
- Apache
- MySQL
- Composer
- NPM

### Install Dependencies

- Make sure you are running > npm v3 or you will get babel crashing out.
- run `composer install`
- run `npm install`
- install [wp-cli](http://wp-cli.org/)

### Configure Installation

- Create a vhost for for your site with the docroot as the web directory of this project
- The domain must be foo.lvh.me
- Don't forget to restart your server!

```
<VirtualHost *:80>
    DocumentRoot "/path/to/the/repo/web
    ServerName wp-boilerplate.lvh.me
</VirtualHost>
```

- Create a database and make a note of the credentials
- Change directory into the web directory
- Run `wp core config --dbname={dbname} --dbuser={dbuser} --dbpass={dbpass} --extra-php <<< $'define( \'WP_DEBUG\', true );\ndefine( \'WP_DEBUG_LOG\', true );'` to set up the wp-config file
- Change back to root directory
- If you have a seed database import the seed database as your database `mysql -u {dbuser} -p {dbname} < seed/{file.sql}`
- If you don't have a seed then visit your vhost url to finish installing the wordpress database setup
- Activate the Timber plugin if needed (If no seed database)
- Activate the theme if needed (If no seed database)
- If there is an uploads directory in your seed directory copy it to web/wp-content/uploads

### Run the site

- Update the config in `/gulpfile.babel.js/config.js` with your theme name in `const dest` and your vhost url in `config.borwserSync`
- Update the JS/CSS paths in /theme/layouts/base.twig to match your theme name. (We had to leave these hardcoded as otherwise it breaks gulp-rev-all)
- run `npm run serve` to fire up the site with Browser Sync

### Set up linting in your Text Editor

Using [Atom](https://atom.io/) you can set up the scss-lint, eslint, and linter-php automatically by installing the following plugins:

- https://atom.io/packages/linter
- https://atom.io/packages/linter-scss-lint
- https://atom.io/packages/linter-eslint
- https://atom.io/packages/linter-php

via `apm`: `apm install linter linter-scss-lint linter-eslint linter-php`

Using [SublimeText] you can set up the scss-lint and eslint following these instructions

- http://www.sublimelinter.com/en/latest/
- http://jonathancreamer.com/setup-eslint-with-es6-in-sublime-text/
- https://github.com/attenzione/SublimeLinter-scss-lint
- https://github.com/SublimeLinter/SublimeLinter-phplint

### Committing

`npm run lint` is run in a pre-commit hook, and if it fails, your code will not be committed.

Commit messages are validated using [validate-commit-msg](https://github.com/kentcdodds/validate-commit-msg).

Valid types are:

- feat: A new feature
- fix: A bug fix
- docs: Documentation only changes
- style: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
- refactor: A code change that neither fixes a bug nor adds a feature
- perf: A code change that improves performance
- test: Adding missing tests
- chore: Changes to the build process or auxiliary tools and libraries such as documentation generation

Commit messages should use the imperative, present tense: “change” not “changed” nor “changes”.

Example commit messages:

`feat: Add linting for javascript files in the /component folder`
`chore: Update eslint`

## Updating data

- import an updated seed database as your database `mysql -u {dbuser} -p {dbname} < seed/{file.sql}`
- if there is an uploads directory in your seed directory copy it to web/wp-content/uploads

## Extending

### Generators

- Run `npm run create:component` to create a new twig component
- Run `npm run create:post-type` to create a custom post type
- Run `npm run create:taxonomy` to create a new taxonomy
- Run `npm run create:view` to create a new view

### Wordpress Plugins

- Plugins should be installed and updated via Composer using [wpackagist](http://wpackagist.org/)
- e.g. to install timber-library this is done via `composer require wpackagist-plugin/timber-library` ran from the root
directory

#### Package not available on wpackagist or a homebrew one?

- Then create a plugin directory in web/wp-content/plugins
- add this directory to be un-ignored via .gitignore

### Adding NPM packages

These should be installed with the --save-dev flag

## Seeding

The seeds directory is to store the files that are required to get the site running on your machine. At the time of
writing we only have a database, but in time this will likely include uploads files to.

### Build a new seed

- Create a database dump from live - select the option to drop tables if they exist
- The snapshot database is staging if you can't find it
- Download the database dump to the /seed directory, name it after the date
- If there are uploaded files, save them to a uploads directory in /seed
- run this against the db dump to change hostname: `sed -i "" -e 's/http:\/\/wp-boilerplate.staging.wpengine.com/http:\/\/wp-boilerplate.lvh.me/g' {sql_file}`
- commit it

## Deployments

- Deployments run automatically by codeship when deployments are made.
- Pushing to master deploys to staging
- Pushing to production deploys to production
- To get codeship to fire the production build you need to update your .git/config file to have:
   [branch "production"]
       mergeoptions = --no-ff

### Setting up Codeship

#### Environment variables

Set `GITHUB_ACCESS_TOKEN` to be your [Github cli access token](https://help.github.com/articles/creating-an-access-token-for-command-line-use/)

#### Setup commands

```
phpenv global 5.5
npm rebuild node-sass
npm install --no-spin
# This is hard-coded because it's unlikely that we'll update the ruby version often (if ever)
rvm use 2.3.1 --install
bundle install
composer self-update 1.0.3
composer config -g github-oauth.github.com $GITHUB_ACCESS_TOKEN
composer install --no-interaction --no-dev
```

#### Test commands

```
npm run build
npm run lint
# If you want to test visual regression add the line below
# npm run test
```

#### Deployments

- Set up a deploy path for `master`
- Select the custom script option
- In the custom script action, add the following:
```
chmod +x deploy.sh
./deploy.sh staging wpengine_project_name
```
- Where `wpengine_project_name` is the name of the wpengine install

- Set up a deploy path for `production`
- Select the custom script option
- In the custom script action, add the following:
```
chmod +x deploy.sh
./deploy.sh production wpengine_project_name
```
- Where `wpengine_project_name` is the name of the wpengine install
- Get your deploy key from the repo and add it to the wpengine git push ssh keys (If hosted on wpengine)

## Visual Regression Testing

You will need PhantomJS and CasperJS globally to run the BackstopJs Visual regression tests.
`npm install -g phantomjs casperjs`

We use [BackStopJS](https://www.npmjs.com/package/backstopjs/) for visual regression testing.

- To generate a new set of reference images: `gulp reference`
- To run the tests: `npm run test`

They will auto run on the production branch on push
