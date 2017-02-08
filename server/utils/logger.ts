import log4js = require('log4js');
import fs = require('fs');


// create the log directory if not yet existing
let path: string = 'logs';
if (!fs.existsSync(path)) {
  fs.mkdirSync(path);
}

log4js.configure('log4js.json', { reloadSecs: 300 });

export let logger = log4js.getLogger('default');
export function getLogger(name: string) {
  return log4js.getLogger(name);
}


