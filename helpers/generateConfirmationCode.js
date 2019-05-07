const uuidv4 = require('uuid/v4');
const md5 = require('md5');

function codeGenerator(eMail) {
    let code = md5(uuidv4() + eMail);
    return code;
}

module.exports.codeGenerator = codeGenerator;
