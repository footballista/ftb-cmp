const execSync = require('child_process').execSync;

if (process.env.APIHOST) {
  // updating environment files when building somewhere in the cloud
  const { readFileSync, writeFileSync } = require('fs');
  let env = readFileSync(__dirname + '/../src/environments/environment.sample.ts').toString();
  env = env.replace('%APIHOST%', process.env.APIHOST);
  env = env.replace('%GRAPHQLHOST%', process.env.GRAPHQLHOST);
  env = env.replace('%LOCALHOST%', process.env.LOCALHOST);
  env = env.replace('%IMGHOST%', process.env.IMGHOST);
  writeFileSync(__dirname + '/../src/environments/environment.ts', env);
}

execSync('stencil build', { stdio: [0, 1, 2] });
