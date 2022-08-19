'use strict';

const { generateCollection, renderCollectionMarkdown } = require("./collections");
const { generateMethod, generateMethodMarkdown } = require("./methods");

const generateProject = async (json) => {
    let markdown = ``

    markdown += `# 📦 Project: ${json.info.name}\n`
    markdown += json.info.description !== undefined ? `${json.info.description || ''}\n` :``
    
    markdown += `\n`
    markdown += `## 🗂️ Collections\n`
    markdown += `\n`

    let collections = await json.item.filter(item => item.item !== undefined);

    for(let i = 0; i < collections.length; i++) {
        markdown += await renderCollectionMarkdown(collections[i]);
        await generateCollection(collections[i]);
    }

    let methods = await json.item.filter(item => item.item === undefined);

    if(methods.length > 0) {
        markdown += `\n`
        markdown += `## 🗂️ Methods\n`
        markdown += `\n`

        for(let i = 0; i < methods.length; i++) {
            markdown += await generateMethodMarkdown(methods[i]);
            await generateMethod(methods[i]);
        }
    }

    markdown += '\n_________________________________________________\n';
    markdown += 'Created By: [Parsadanashvili](https://github.com/parsadanashvili/)\n';

    return markdown
}

module.exports = {
    generateProject
}