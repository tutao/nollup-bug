import bluebird from "bluebird"

bluebird.Promise.resolve(true).then(() => console.log("works!"))