const async = require('async');

arr = [3000, 1000, 6000];

async function main() {
    async.each(arr, function (item, callback) {
            setTimeout(() => {
                console.log(item),
                    callback();
            }, item);
        },
        function (error) {
            console.log("ALL DONE!")
        }
    );
}

main();