const { join } = require('path');

const packageJson = require(`${__dirname}/package.json`);
const buildVersion = packageJson.version;

module.exports = {
  projectVersion: buildVersion,
  projectDir: __dirname,
  componentsDir: join(__dirname, 'projects'),
  scriptsDir: join(__dirname, 'scripts'),
  outputDir: join(__dirname, 'dist'),
  publishDir: join(__dirname, 'publish'),
  libDir: join(__dirname, 'lib')
};
