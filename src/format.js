module.exports = function formatThrift(content) {
    var lines = content.split('\n')
    var newLines = []
    var idx = 0
    while (idx < lines.length) {
        if (lines[idx].match(/\s*struct\s+\w+\s*{/)) {
            var s_idx = idx
            while (!lines[idx].match('\s*}\s*')) {
                idx += 1
            }
            idx += 1
            var j = formatStruct(lines.slice(s_idx, idx))
            newLines = newLines.concat(j)
        } else if (lines[idx].match(/\s*enum\s+\w+\s*{/)) {
            var s_idx = idx
            while (!lines[idx].match('\s*}\s*')) {
                idx += 1
            }
            idx += 1
            newLines = newLines.concat(formatEnum(lines.slice(s_idx, idx)))
        } else if (lines[idx].match(/\s*service\s+\w+\s*{/)) {
            var s_idx = idx
            while (!lines[idx].match('\s*}\s*')) {
                idx += 1
            }
            idx += 1
            newLines = newLines.concat(formatService(lines.slice(s_idx, idx)))
        } else {
            newLines.push(lines[idx])
            idx += 1
        }
    }
    return newLines
}

function formatEnum(lines) {
    return lines
}

function formatStruct(lines) {
    var idx = 1
    for (var i in lines) {
        var m = lines[i].match(/^(\s+)\d*:?\s*(\S+.*)/)
        if (m) {
            lines[i] = `${m[1]}${idx}: ${m[2]}`
            idx += 1
        }
    }
    return lines
}

function formatService(lines) {
    for (var i in lines) {
        var m = lines[i].match(/^(\s+)([\w\.]+)\s+(\w+)\s*\(\s*\d*:?\s*([\w\.]+)\s+(\w+)\s*\)\s*(.*)/)
        if (m) {
            lines[i] = `${m[1]}${m[2]} ${m[3]}(1: ${m[4]} ${m[5]}) ${m[6]}`
        }
    }
    return lines
}