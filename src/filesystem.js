const fs = require('fs');
const path = require('path');
const { valid } = require('./utils');

const readFile = (filename = "") => {
    if (!valid(filename)) return Promise.reject(`Parameter is null or undefined.`);
    if (typeof filename !== 'string') return Promise.reject(`Parameter not a string.`);

    return new Promise(
        (resolve, reject) => {
            const fullPath = path.join(process.cwd(), filename);

            fs.stat(
                fullPath,
                (err, stats) => {
                    if (valid(err)) {
                        return reject(err.message);
                    }

                    if (!stats.isFile()) {
                        return reject(`${filename} is not a file.`);
                    }

                    fs.readFile(
                        fullPath,
                        (err, data) => {
                            if (valid(err)) {
                                return reject(err.message);
                            }

                            return resolve(data);
                        }
                    );
                }
            );
        }
    );
};

const writeFile = (filename = "", data) => {
    if (!valid(filename)) return Promise.reject(`Parameter 'filename' is null or undefined.`);
    if (typeof filename !== 'string') return Promise.reject(`Parameter 'filename' not a string.`);
    if (!valid(data)) return Promise.reject(`Parameter 'data' is null or undefined.`);

    return new Promise(
        (resolve, reject) => {
            const fullPath = path.join(process.cwd(), filename);
            fs.writeFile(
                fullPath,
                data,
                err => {
                    if (valid(err)) {
                        return reject(err.message);
                    }

                    return resolve();
                }
            );
        }
    );
};

const getExtension = (filename = "") => {
    if (!valid(filename)) return Promise.reject(`Invalid parameter.`);
    if (typeof(filename) !== 'string') return Promise.reject(`Parameter not string.`);
    if (filename.length === 0) return Promise.reject(`Filename must be non-empty.`);

    return Promise.resolve(path.extname(filename));
}

const readDir = (directory = "") => {

};

module.exports = {
    readFile,
    writeFile,
    getExtension
};