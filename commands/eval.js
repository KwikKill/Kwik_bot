const fs = require("fs");
const path = require('path');
const { Util, PermissionsBitField } = require('discord.js');
const util = require('util');
const tags = require('common-tags');
const { escapeRegex, splitMessage } = require('../util/util');

const nl = '!!NL!!';
const nlPattern = new RegExp(nl, 'g');
var _sensitivePattern = undefined;
var lastResult = null;

module.exports = {
    name: 'eval',
    group: 'moderation',
    description: "Permet d'éxecuter du code js.",
    permission: PermissionsBitField.Flags.ManageMessages,
    owner: true,
    hidden: false,
    deploy: false,
    place: "dm",
    async run(message, client, interaction = undefined) {
        const doReply = val => {
            if (val instanceof Error) {
                message.reply(`Callback error: \`${val}\``);
            } else {
                const result = makeResultMessages(val, process.hrtime(hrStart));
                if (Array.isArray(result)) {
                    for (const item of result) message.reply(item);
                } else {
                    message.reply(result);
                }
            }
        };
        /* eslint-enable no-unused-vars */

        // Remove any surrounding code blocks before evaluation
        if (message.content.substring(6).startsWith('```') && message.content.substring(6).endsWith('```')) {
            message.content.substring(6) = message.content.substring(6).replace(/(^.*?\s)|(\n.*$)/g, '');
        }

        // Run the code and measure its execution time
        let hrDiff;
        try {
            const hrStart = process.hrtime();
            lastResult = eval(message.content.substring(6));
            hrDiff = process.hrtime(hrStart);
        } catch (err) {
            return message.reply(`Error while evaluating: \`${err}\``);
        }

        // Prepare for callback time and respond
        hrStart = process.hrtime();
        const result = makeResultMessages(lastResult, hrDiff, message.content.substring(6));
        if (Array.isArray(result)) {
            return result.map(item => message.reply(item));
        } else {
            return message.reply(result);
        }
    }
}


function makeResultMessages(result, hrDiff, input = null) {
    const inspected = util.inspect(result, { depth: 0 })
        .replace(nlPattern, '\n')
        .replace(sensitivePattern, '--snip--');
    const split = inspected.split('\n');
    const last = inspected.length - 1;
    const prependPart = inspected[0] !== '{' && inspected[0] !== '[' && inspected[0] !== "'" ? split[0] : inspected[0];
    const appendPart = inspected[last] !== '}' && inspected[last] !== ']' && inspected[last] !== "'" ?
        split[split.length - 1] :
        inspected[last];
    const prepend = `\`\`\`javascript\n${prependPart}\n`;
    const append = `\n${appendPart}\n\`\`\``;
    if (input) {
        return splitMessage(tags.stripIndents`
			*Executed in ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
			\`\`\`javascript
			${inspected}
			\`\`\`
		`, { maxLength: 1900, prepend, append });
    } else {
        return splitMessage(tags.stripIndents`
			*Callback executed after ${hrDiff[0] > 0 ? `${hrDiff[0]}s ` : ''}${hrDiff[1] / 1000000}ms.*
			\`\`\`javascript
			${inspected}
			\`\`\`
		`, { maxLength: 1900, prepend, append });
    }
}

function sensitivePattern(client) {
    if (_sensitivePattern == undefined) {
        let pattern = '';
        if (client.token) pattern += escapeRegex(client.token);
        _sensitivePattern = new RegExp(pattern, 'gi')
    }
    return _sensitivePattern;
}