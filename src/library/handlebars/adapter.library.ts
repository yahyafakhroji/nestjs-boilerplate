import { config } from '@lib/helpers/config.helper';
// import * as fs from 'fs';
import * as handlebars from 'handlebars';
import * as layouts from 'handlebars-layouts';
// import { join } from 'path';

// register helpers
handlebars.registerHelper(layouts(handlebars));
handlebars.registerHelper('base_uri', () => {
  return config.get('API_URI');
});
handlebars.registerHelper('inc', (value) => {
  return parseInt(value) + 1;
});

// register partials
/* const partialsDir = join(__dirname, '../../..', 'templates', 'partials');
fs.readdirSync(partialsDir).forEach((filename) => {
  const matches = /^([^.]+).hbs$/.exec(filename);
  if (!matches) {
    return;
  }

  const name = matches[1];
  const template = fs.readFileSync(partialsDir + '/' + filename, 'utf8');
  handlebars.registerPartial(name, template);
}); */

export { handlebars };
