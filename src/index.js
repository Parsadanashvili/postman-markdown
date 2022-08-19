'use strict';

const args = require(`minimist`)(process.argv.slice(2))
const { log, color } = require('console-log-colors');
const { createStructure } = require('./utils');
const { writeFile, readFile, fileExists } = require('./utils/functions');

const init = async () => {
    const path = args['_'];

    if(!path.length > 0) return log.red('Please provide a path to a Postman JSON Collection');

    if(!await fileExists(path[0])) return log.red(`File ${path} does not exist`);

    log.blue('Reading file...');

    const json = JSON.parse(await readFile(path[0]));

    log.blue(`Generating markdown file ...`);

    const markdown = await createStructure(json);

    writeFile(markdown, 'README', 'md');

    return log.green(`Documentation was created correctly ${color.bgGreen('readme.md')}`);
}

module.exports = { init }