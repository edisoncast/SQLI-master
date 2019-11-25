const crypto = require('crypto');

const password = "@lic3";

const salt = "S3cureSalt";
const hash = crypto.pbkdf2Sync(password, salt, 100, 127, 'sha512').toString('hex');

console.log(hash);