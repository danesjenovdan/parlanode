const fs = require('fs');
const Handlebars = require('handlebars');
const inquirer = require('inquirer');
const kebabCase = require('lodash/kebabCase');
const camelCase = require('lodash/camelCase');
const upperFirst = require('lodash/upperFirst');
const chalk = require('chalk');

const URL_REGEX = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/;
const CARD_FILES = ['card.json', 'card.vue', 'data.json', 'state.json'];
const CARD_TYPES = {
  p: 'poslanec',
  ps: 'poslanska_skupina',
  s: 'seja',
  c: 'empty',
};

inquirer.prompt([
  {
    type: 'input',
    name: 'name',
    message: 'Enter the card name:',
    validate: value => (value.length > 0 ? true : 'Card name is mandatory.'),
    default: 'Example Card Name',
  },
  {
    type: 'list',
    name: 'group',
    message: 'Choose a card group:',
    choices: [
      { value: 'p', name: 'Poslanec (p)' },
      { value: 'ps', name: 'Poslanska skupina (ps)' },
      { value: 's', name: 'Seja (s)' },
      new inquirer.Separator(),
      { value: 'c', name: 'Custom (c)' },
    ],
    default: 0,
  },
  {
    type: 'input',
    name: 'method',
    message: 'Enter the card method:',
    validate: value => (value.length > 0 ? true : 'Card method is mandatory.'),
    default: answers => kebabCase(answers.name),
  },
  {
    type: 'input',
    name: 'type',
    message: 'Enter the card type:',
    suffix: ' (used to determine OG image)',
    validate: value => (value.length > 0 ? true : 'Card type is mandatory.'),
    default: answers => CARD_TYPES[answers.group],
  },
  {
    type: 'input',
    name: 'dataUrl',
    message: 'Enter the data URL:',
    validate(value) {
      if (value.length === 0) {
        return 'Data URL is mandatory.';
      }
      if (!value.match(URL_REGEX)) {
        return 'Data URL must be a valid URL address.';
      }
      return true;
    },
    default: '{analize}/',
  },
  {
    type: 'confirm',
    name: 'big',
    message: 'Should the card be displayed in two columns?',
    suffix: ' (adds "big-card" class name)',
    default: false,
  },
  {
    type: 'confirm',
    name: 'high',
    message: 'Should the card have an unlimited height?',
    suffix: ' (adds "high-card" class name)',
    default: false,
  },
]).then((answers) => {
  const newCardFolder = `cards/${answers.group}/${answers.method}/`;
  const finalData = {
    _id: `${answers.group}-${answers.method}`,
    lastUpdate: new Date(),
    componentName: upperFirst(camelCase(answers.name)),
    ...answers,
  };
  const cliCommand = `yarn run cards-dev ${answers.group}/${answers.method}`;

  fs.mkdirSync(newCardFolder);

  CARD_FILES.forEach((file) => {
    const source = fs.readFileSync(`cards/_empty/${file}`, 'utf-8');
    const template = Handlebars.compile(source);
    const result = template(finalData);

    fs.writeFileSync(newCardFolder + file, result);
  });

  // eslint-disable-next-line no-console
  console.log(`\nCard "${answers.name}" generated successfully!\nTo start development, simply run:`);
  // eslint-disable-next-line no-console
  console.log(`\n${chalk.italic.yellow(cliCommand)}\n`);
});
