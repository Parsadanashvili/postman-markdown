'use strict';

const { log } = require("console-log-colors");
const fs = require(`fs`);
const { writeFile } = require("./functions");
const { generateMethod, generateMethodMarkdown } = require("./methods");

const generateCollection = async (collection, deep = ['documentation']) => {
    let collectionName = collection.name.replace(/\s/g, '_');
    await createCollectionFolder(`/${deep.join('/')}/${collectionName}`);

    let markdown = '';

    markdown += `# 🗂️ ${collection.name}\n`;
    markdown += `\n`;

    let collections = await collection.item.filter(item => item.item !== undefined);

    for(let i = 0; i < collections.length; i++) {
        markdown += await renderCollectionMarkdown(collections[i], [...deep, collectionName]);
        await generateCollection(collections[i], [...deep, collectionName]);
    }

    let methods = await collection.item.filter(item => item.item === undefined);

    if(methods.length > 0) {
        markdown += `\n`;    

        for(let i = 0; i < methods.length; i++) {
            markdown += await generateMethodMarkdown(methods[i], [...deep, collectionName]);
            await generateMethod(methods[i], [...deep, collectionName]);
        }
    }

    // await collection.item.forEach(async (item) => {
    //     if(item.item) {
    //         markdown += await renderCollectionMarkdown(item, [...deep, collectionName]);
    //         await generateCollection(item, [...deep, collectionName]);
    //     } else {
    //         markdown += await generateMethod(item, [...deep, collectionName]);
    //     }
    // });

    writeFile(markdown, `./${deep.join('/')}/${collection.name.replace(/\s/g, '_')}`, 'md');
}

const renderCollectionMarkdown = async (collection, deep = ['documentation']) => {
    let markdown = '';

    let filename = collection.name.replace(/\s/g, '_');

    markdown += `📁 [${collection.name}](/${deep.join('/')}/${filename}.md)\n`
    markdown += `\n`

    return markdown;
}

/**
 * Create collection folder
 */
const createCollectionFolder = async (name) => {
    if (!fs.existsSync(`./${name}`)) {
        log.magenta(`Creating ${name} folder ...`);
        fs.mkdirSync(`./${name}`);
    }
}

module.exports = {
    generateCollection,
    renderCollectionMarkdown
}