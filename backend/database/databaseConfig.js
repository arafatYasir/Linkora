const mongoose = require("mongoose");

const databaseConfig = () => {
    mongoose.connect(process.env.MONGODB_URL)
        .then(() => {
            console.log("----------Database Connected----------");
        })
        .catch(e => {
            console.log("Error on connecting to mongodb: ", e.message);
        })
};

module.exports = databaseConfig;