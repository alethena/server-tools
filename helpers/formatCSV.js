const Json2csvParser = require('json2csv').Parser;
const fields = ['txhash', 'contractAddress', 'buy', 'sell', 'price', 'fee', 'lastPrice', 'user', 'amount', 'blocknumber', 'timestamp'];

const json2csvParser = new Json2csvParser({
    fields
});

function convertToCSV(notCSV) {
    // let out = {}
    const csv = json2csvParser.parse(notCSV);

    return csv;
}

module.exports.convertToCSV = convertToCSV;