let p = require('pluralize');
var Twit = require('twit');
var T = new Twit(require('./config.js'));
var wordfilter = require('wordfilter');
var relations = require('./data.json');

Array.prototype.pick = function() {
  return this[Math.floor(Math.random()*this.length)];
};

function generate() {
  return new Promise((resolve, reject) => {
    let relation = relations.pick();
    let start = relation.surfaceStart;
    start = start.replace(/^an? /g,'');
    start = start.replace(/^the /ig,'');
    start = p.plural(start);
    let end = relation.surfaceEnd;
    resolve(`*slaps roof of ${end}* this bad boy can fit so many ${start} in it`);
  }).catch((e) => console.log(e));
}

function tweet() {
  generate().then(myTweet => {
    if (!wordfilter.blacklisted(myTweet)) {
      console.log(myTweet);

      T.post('statuses/update', { status: myTweet }, (err, reply) => {
        if (err) {
          console.log('error:', err);
        }
        else {
          console.log('reply:', reply);
        }
      });
    }
  }).catch((e) => console.log(e));
}

// Tweet once on initialization
tweet();
