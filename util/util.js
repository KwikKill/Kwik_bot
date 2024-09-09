// This returns Object.prototype in order to return a valid object
// without creating a new one each time this is called just to discard it the moment after.
const isConstructorProxyHandler = { construct() { return Object.prototype; } };

function escapeRegex(str) {
    return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&');
}

function disambiguation(items, label, property = 'name') {
    const itemList = items.map(item => `"${(property ? item[property] : item).replace(/ /g, '\xa0')}"`).join(',   ');
    return `Multiple ${label} found, please be more specific: ${itemList}`;
}

function verifyString(
    data,
    error = Error,
    errorMessage = `Expected a string, got ${data} instead.`,
    allowEmpty = true,
) {
    if (typeof data !== 'string') {
        throw new error(errorMessage);
    }
    if (!allowEmpty && data.length === 0) {
        throw new error(errorMessage);
    }
    return data;
}

function splitMessage(text, { maxLength = 2_000, char = '\n', prepend = '', append = '' } = {}) {

    text = verifyString(text);
    if (text.length <= maxLength) {
        return [text];
    }
    let splitText = [text];
    if (Array.isArray(char)) {
        while (char.length > 0 && splitText.some(elem => elem.length > maxLength)) {
            const currentChar = char.shift();
            if (currentChar instanceof RegExp) {
                splitText = splitText.flatMap(chunk => chunk.match(currentChar));
            } else {
                splitText = splitText.flatMap(chunk => chunk.split(currentChar));
            }
        }
    } else {
        splitText = text.split(char);
    }
    if (splitText.some(elem => elem.length > maxLength)) {
        throw new RangeError('SPLIT_MAX_LEN');
    }
    const messages = [];
    let msg = '';
    for (const chunk of splitText) {
        if (msg && (msg + char + chunk + append).length > maxLength) {
            messages.push(msg + append);
            msg = prepend;
        }
        msg += (msg && msg !== prepend ? char : '') + chunk;
    }
    return messages.concat(msg).filter(m => m);
}

function isConstructor(func, _class) {
    try {
        // eslint-disable-next-line no-new
        new new Proxy(func, isConstructorProxyHandler)();
        if (!_class) { return true; }
        return func.prototype instanceof _class;
    } catch (err) {
        return false;
    }
}

function paginate(items, page = 1, pageLength = 10) {
    const maxPage = Math.ceil(items.length / pageLength);
    if (page < 1) { page = 1; }
    if (page > maxPage) { page = maxPage; }
    const startIndex = (page - 1) * pageLength;
    return {
        items: items.length > pageLength ? items.slice(startIndex, startIndex + pageLength) : items,
        page,
        maxPage,
        pageLength
    };
}

module.exports = {
    escapeRegex,
    disambiguation,
    paginate,
    isConstructor,
    splitMessage,
    verifyString
};
