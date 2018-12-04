const fs = require('fs');
const Handlebars = require('handlebars');
const inquirer = require('inquirer');
const kebabCase = require('lodash/kebabCase');
const camelCase = require('lodash/camelCase');
const upperFirst = require('lodash/upperFirst');
const chalk = require('chalk');

const CARD_FILES = ['card.json', 'card.vue', 'data.json', 'state.json'];

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
    name: 'dataUrl',
    message: 'Enter the data URL:',
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
    _id: `${answers.group}_${answers.method}`,
    lastUpdate: new Date().toJSON(),
    componentName: upperFirst(camelCase(answers.name)),
    ...answers,
  };
  const cliCommand = `npm run cards ${answers.group}/${answers.method}`;

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
