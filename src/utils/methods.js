'use strict';

const { log, color } = require("console-log-colors");
const { writeFile, escapeRegExp } = require("./functions");

const generateMethod = async (method, deep = ['documentation']) => {
    let markdown = '';
    let collection = "";

    if(deep.length == 1) {
        collection = "README.md";
    } else {
        collection = deep.join('/') + '.md'; 
    }

    markdown += `# [Back to collection](/${collection})\n`;

    markdown += await readItem(method, deep)

    log.yellow(`Creating ${color.yellowBG(method.name)} method documentation ...`);
    writeFile(markdown, `./${deep.join('/')}/${method.name.replace(/\s/g, '_')}`, 'md');
}

const readItem = async (item, deep) => {
    let markdown = '';

    markdown += `\n`
    markdown += `## 🔗 End-point: ${item.name}\n`
    markdown += item?.request?.description !== undefined ? `${item?.request?.description || ''}\n` :``
    markdown += `### Method: ${item?.request?.method}\n`
    markdown += `\`\`\`\n`
    markdown += `${item?.request?.url?.raw}\n`
    markdown += `\`\`\`\n`
    markdown += await readItemHeaders(item?.request)
    markdown += await readItemBody(item?.request?.body)
    markdown += await readItemQuery(item?.request?.url)
    markdown += await readItemVariables(item?.request?.url?.variable)
    markdown += await readItemAuthorization(item?.request?.auth)
    markdown += await readItemResponses(item?.response)
    markdown += `\n`

    return markdown;
}

const readItemHeaders = async (request) => {
    let markdown = '';
    if(request) {
        markdown += `### 🧾 Headers\n`
        markdown += `\n`
        markdown += `|Key|Value|Description|\n`
        markdown += `|---|---|---|\n`
        request.header.map(header =>{
            markdown += `|${escapeRegExp(header.key)}|${escapeRegExp(header.value)}|${escapeRegExp(header.description) || ''}\n`
        })
        markdown += `\n`
        markdown += `\n`
    }

    return markdown;
}

const readItemBody = async (body) => {
    let markdown = '';
    if(body) {
        markdown += `### 📝 Body \`${body.mode}\` \n`

        if(body.mode === 'formdata') {
            markdown += `\n`
            markdown += `|Key|Value|Type|Description|\n`
            markdown += `|---|---|---|---|\n`
            body.formdata.map(item =>{
                markdown += `|${escapeRegExp(item.key)}|${item.type === 'file' ? escapeRegExp(item.src) : item.value !== undefined ? escapeRegExp(item.value.replace(/\\n/g,'')) : '' }|${escapeRegExp(item.type)}|${escapeRegExp(item.description) || ''}\n`
            })
            markdown += `\n`
            markdown += `\n`
        }

        if(body.mode === 'raw') {
            markdown += `\n`
            markdown += `\`\`\`json\n`
            markdown += `${body.raw}\n`
            markdown += `\`\`\`\n`
            markdown += `\n`
        }
    }

    return markdown;
}

const readItemQuery = async (url) => {
    let markdown = '';

    if(url?.query){
        markdown += `### ⚙️ Query Params\n`
        markdown += `\n`
        markdown += `|Key|Value|Description|\n`
        markdown += `|---|---|---|\n`
        url.query.map(query =>{
            markdown += `|${escapeRegExp(query.key)}|${escapeRegExp(query.value)}|${escapeRegExp(query.description) || ''}|\n`
        })
        markdown += `\n`
        markdown += `\n`
    }

    return markdown
}

const readItemVariables = async (variables) => {
    let markdown = '';

    if(variables?.length){
        markdown += `### ⚙️ Variables\n`
        markdown += `\n`
        markdown += `|Key|Value|Description|\n`
        markdown += `|---|---|---|\n`
        variables.map(variable =>{
            markdown += `|${escapeRegExp(variable.key)}|${escapeRegExp(variable.value)}|${escapeRegExp(variable.description) || ''}|\n`
        })
        markdown += `\n`
        markdown += `\n`
    }

    return markdown;
}

const readItemAuthorization = async (authorization) => {
    let markdown = '';

    if(authorization){
        markdown += `### 🔐 Authorization \`${authorization.type}\`\n`
        markdown += `\n`
        markdown += `|Key|Value|Type|Description|\n`
        markdown += `|---|---|---|---|\n`
        markdown += `|${escapeRegExp(authorization.key)}|${escapeRegExp(authorization.value)}|${escapeRegExp(authorization.type)}|${escapeRegExp(authorization.description) || ''}|\n`
        markdown += `\n`
        markdown += `\n`
    }

    return markdown
}

const readItemResponses = async (responses) => {
    let markdown = `\n`
    markdown += '## 📝 Responses\n';
    markdown += `\n`

    if(responses?.length > 0){
        for(let i = 0; i < responses.length; i++){
            const response = responses[i];

            markdown += `### 📬 Response \`${response.code}\`\n`
            markdown += `\n`
            markdown += `\`\`\`json\n`
            markdown += `${response.body}\n`
            markdown += `\`\`\`\n`
            markdown += `\n`
        }
    }

    return markdown
}

const generateMethodMarkdown = async (method, deep = ['documentation']) => {
    let markdown = '';

    let filename = method.name.replace(/\s/g, '_');

    markdown += `🔗 [${method.name}](/${deep.join('/')}/${filename}.md)\n`
    markdown += `\n`

    return markdown;
}

module.exports = {
    generateMethod,
    generateMethodMarkdown
}