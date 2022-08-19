'use strict';

const fs = require(`fs`);

/**
 * Turn unescaped text to escaped text
 * @param {string} text: Unescaped text
 * @return {string} Escaped text
 */
const escapeRegExp = (text) => {
    if(text) {
        return text.replace(/[-[\]{}()*+?.,\\^$|#]/g, '\\$&');
    }
    return '';
}

/**
 * Create file and write content to file
 * @param {string} content: File content
 * @param {string} fileName: File name
 * @param {string} fileExtension: File extension
 * @return {string} Escaped text
 */
const writeFile = async (content, fileName, fileExtension = 'md') => {
    return fs.writeFileSync(`${fileName}.${fileExtension}`, content);
}

const fileExists = async (fileName) => {
    return fs.existsSync(fileName);
}

const readFile = async (fileName) => {
    return fs.readFileSync(fileName);
}


module.exports = {
    escapeRegExp,
    writeFile,
    fileExists,
    readFile
}