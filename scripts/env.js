require('dotenv').load({ path: 'config/env' });

var fs = require('fs');
var conf = 'define({\"FIREBASE\": \"' + process.env.CHECKIT_FIREBASE_URL + '\"})';

fs.writeFileSync('app/js/config.js', conf);
