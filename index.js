const fs = require('fs');
const _ = require('lodash');
const wordListPath = require('word-list');
const wordArray = fs.readFileSync(wordListPath, 'utf8').split('\n');
const wordMap = _.groupBy(wordArray, (word) => word[0]);

const Koa = require('koa');
const app = new Koa();

function randomAcronym(letters) {
  return letters.map(letter => (_.sample(wordMap[letter]))).join(' ');
}

app.use(async (ctx) => {
  if (ctx.path !== '/') {
    const num = Math.min(500, Math.max(ctx.query.samples || 10, 1));
    const letters = ctx.path.slice(1, ctx.path.length).split('').map(l => l.toLowerCase());
    const acronyms = _.range(0, num).map(() => randomAcronym(letters));
    const acronymHtml = acronyms.map(words => words.split(' ').map(word => `<strong>${(word[0] || '').toUpperCase()}</strong>${word.slice(1, word.length)}`).join(' '));
    const acronymListItems = acronymHtml.map(a => `<li>${a}</li>`).join('\n');
    ctx.body =  `
      <ul>
        ${acronymListItems}
      </ul>
    `;
  } else {
    ctx.body = 'Put an acronym in the path eg: /owen. Add a ?samples=n where n >= 1 and <= 1000 if you want';
  }
});

app.listen(3000);
