/**
 * 跳转到定义示例，本示例支持`package.json`中`dependencies`、`devDependencies`跳转到对应依赖包。
 */
const path = require('path');
const fs = require('fs');
/**
 * 查找文件定义的provider，匹配到了就return一个location，否则不做处理
 * 最终效果是，当按住Ctrl键时，如果return了一个location，字符串就会变成一个可以点击的链接，否则无任何效果
 * @param {*} document 
 * @param {*} position 
 * @param {*} token 
 */
module.exports = function provideDefinition(document, position, token) {
    const line = document.lineAt(position)
    const word = getWord(line._text, position._character)

    let fileName = document.fileName;
    if (word.file) {
        const includeRe = 'include\\s+(\'|")(\\S+' + word.file + '.thrift)(\'|")'
        const includeLine = document.getText().match(includeRe)
        if (includeLine.length > 3) {
            fileName = path.join(path.dirname(fileName), includeLine[2])
        }
    }

    const ln = getPosition(fileName, word.word)
    if (ln > -1) {
        return new vscode.Location(vscode.Uri.file(fileName), new vscode.Position(ln, 0));
    }
}

function getPosition(filePath, word) {
    const allFileContents = fs.readFileSync(filePath, 'utf-8');
    const lines = allFileContents.split(/\n/)
    const re = '(struct|enum)\\s+' + word + '\\s*{'
    let line = -1
    for (let i = 0; i < lines.length; i++) {
        if (lines[i].search(re) > -1) {
            line = i
            break
        }
    }
    return line
}


function getWord(line, position) {
    var start = 0
    var end = line.length - 1

    for (let i = position; i < line.length; i++) {
        if (!/^[a-zA-Z0-9\.]$/.test(line[i])) {
            end = i
            break
        }

    }
    for (let i = position; i >= 0; i--) {
        if (!/^[a-zA-Z0-9\.]$/.test(line[i])) {
            start = i + 1
            break
        }
    }
    const fullWorld = line.substring(start, end)
    if (/\./.test(fullWorld)) {
        const idx = fullWorld.indexOf(".")
        return { file: fullWorld.substring(0, idx), word: fullWorld.substring(idx + 1, fullWorld.length) }
    } else {
        return { word: fullWorld }
    }

}