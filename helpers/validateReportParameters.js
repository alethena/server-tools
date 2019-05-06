const validator = require("email-validator");

function validateParameters(body) {
    return new Promise((resolve, reject) => {
        if (body.position !== "BoardOfDirectors" && body.position !== "ExecutiveBoard") {
            reject("Invalid position");
        } else if (!validator.validate(body.emailAddress)) {
            reject("Invalid email address");
        } else if (isNaN(Number(body.tradedVolume))) {
            reject("Invalid volume");
        } else if (isNaN(Number(body.totalPrice))) {
            reject("Invalid price");
        } else if (body.reason) {
            reject("Invalid reason");
            // NEED CHECK AGAINST INJECTION HERE!!!
            // ALSO CHECK TX HASH!!!
        } else {
            resolve([body.position, body.emailAddress, Number(body.tradedVolume), Number(body.totalPrice), body.trxHash, body.Reason]);
        }
    });
}

module.exports.validateParameters = validateParameters;