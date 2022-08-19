'use strict';

const { log } = require("console-log-colors");
const { generateProject } = require("./project");
const fs = require(`fs`);

/**
 * Create structure of markdown documentation
 * @param {object} json: Postman JSON Collection 
 */
const createStructure = async (json) => {
    await createDocumentationFolder();

    return new Promise(async (resolve, reject) => {
        let markdown = '';

        markdown += await generateProject(json);
        markdown += `\n`;
        
        resolve(markdown);
    }).then(async (markdown) => {
        return markdown;
    }).catch(async (error) => {
        log.red(error);
    });
}

/**
 * Create documentation folder
 */
const createDocumentationFolder = async () => {
    if (!fs.existsSync(`./documentation`)) {
        log.blue(`Creating documentation folder ...`);
        fs.mkdirSync(`./documentation`);
    }
}

module.exports = {
    createStructure
}