const path = require('path');
const { readFile, writeFile } = require('./filesystem')

const encryptFile = (inFile, outFile, publicKey) => {
    return new Promise(
        (resolve, reject) => {
            return readFile(inFile).then(
                fileContents => {
                    // const fileExtension = path.extname(inFile);
                    outputContents = publicKey.encrypt(fileContents);
                    writeFile(outFile, outputContents).then(
                        () => resolve()
                    ).catch(
                        msg => reject(msg)
                    )
                }
            ).catch(
                msg => reject(msg)
            )
        }
    );
};

const decryptFile = (inFile, outFile, privateKey) => {
    return new Promise(
        (resolve, reject) => {
            return readFile(inFile).then(
                fileContents => {
                    // const fileExtension = path.extname(inFile);
                    outputContents = privateKey.decrypt(fileContents);
                    writeFile(outFile, outputContents).then(
                        () => resolve()
                    ).catch(
                        msg => reject(msg)
                    )
                }
            ).catch(
                msg => reject(msg)
            )
        }
    );
};

module.exports = {
    encryptFile,
    decryptFile
}