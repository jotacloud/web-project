const mongoose = require('mongoose');
require('dotenv').config();

async function main(){
    await mongoose.connect(process.env.DATABASE_URL);
    console.log(process.env.DATABASE_URL)
    console.log('Conectou ao Mongoose!');
}
main().catch(err => console.log(err));

module.exports = mongoose;