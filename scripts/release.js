const execSync = require('child_process').execSync;

// transpiling scripts code to js. If this action changes working tree, you will have to commit changes manually
execSync('npm run build', { stdio: [0, 1, 2] });
execSync('prettier ./src --write', { stdio: [0, 1, 2] });
require('../src/scripts/release');
execSync('npm publish', { stdio: [0, 1, 2] });
