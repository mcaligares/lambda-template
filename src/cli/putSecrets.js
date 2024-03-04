// tsx src/cli/putSecret.js <stage> <dbUrl>
const secrets = require('../lib/secrets');
require('dotenv').config();

const args = process.argv.slice(2);

if (args.length !== 2) {
  console.log('Usage: tsx src/cli/putSecret.js <stage> <dbUrl>')
  process.exit(1);
}

if (require.main === module) {
  console.log('Update database URL');
  const [stage, dbUrl] = args;

  secrets.putDatabaseUrl(stage, dbUrl).then(val => {
    console.log(val);
    console.log('Secret set');
    process.exit(0);
  }).catch(err => {
    console.error('Secret not set', err);
    process.exit(1);
  });
}