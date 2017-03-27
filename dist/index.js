import Domain from 'domain';
import Server from './lib/server';

let domain = Domain.create();

domain.on('error', function(err) {
  process.exit();
});

domain.run(function() {
   module.exports = require('./lib/server').server.start();
});
