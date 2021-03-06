const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const NodeRSA = require('node-rsa');
const commandLineArgs = require('command-line-args');
const commandLineUsage = require('command-line-usage');
const { optionDefinitions, sections } = require('./helpDocs');

const path = require('path');
const fs = require('fs');

const { readFile, writeFile, getExtension, isDir } = require('./filesystem');
const { encryptFile, decryptFile } = require('./crypto');

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

const VALID_MODES = [ 'encrypt', 'decrypt', 'enc', 'dec', 'e', 'd' ];
const validMode = mode => VALID_MODES.includes(mode);

const logger = createLogger({
    level: 'debug',
    format: combine(
        label({ label: 'ecrypt' }),
        timestamp(),
        myFormat
    ),
    transports: [
        new transports.Console()
    ]
});

const PROGRAM_NAME = "ecrypt";
const PROGRAM_AUTHOR = "Devin Kott";

const PUBLIC_KEY_LOCATION = "./keys/id_rsa.pub";
const PRIVATE_KEY_LOCATION = "./keys/id_rsa";

let DEBUG = false;

const main = async () => {
    printStartingInformation();

    logger.debug(`Reading public key from ${PUBLIC_KEY_LOCATION}.`);
    const opensshPublicKey = await readFile(PUBLIC_KEY_LOCATION).catch(
        msg => {
            logger.error(msg);
            process.exit();
        }
    );
    const opensshPub = new NodeRSA(opensshPublicKey.toString());
    logger.debug(`Done reading public key (key size: ${opensshPub.getKeySize()}).`);

    logger.debug(`Reading private key from ${PRIVATE_KEY_LOCATION}.`);
    const opensshPrivateKey = await readFile(PRIVATE_KEY_LOCATION).catch(
        msg => {
            logger.error(msg);
            process.exit();
        }
    );
    const opensshPriv = new NodeRSA(opensshPrivateKey.toString());
    logger.debug(`Done reading private key (key size: ${opensshPriv.getKeySize()}).`);

    const options = commandLineArgs(optionDefinitions);
    const validOptions = options.help ||
    (
        options.mode &&
        options.input &&
        options.output &&
        [ options.input ].every(fs.existsSync)
    );
    const usage = commandLineUsage(sections);

    if (!validOptions || options.help) {
        console.log(usage);
        process.exit();
    }

    const mode = options.mode;
    const inputFile = options.input;
    const outputFile = options.output;

    if (!validMode(mode)) {
        logger.error(`Invalid mode. Try one of the following: ${VALID_MODES}`);
        process.exit();
    }

    const isDirectory = await isDir(inputFile).catch(
        errMsg => {
            logger.error(errMsg);
            process.exit();
        }
    );

    switch (mode) {
        case `e`:
        case `enc`:
        case `encrypt`:
            await encryptFile(inputFile, outputFile, opensshPub).catch(
                msg => {
                    logger.error(msg);
                    process.exit();
                }
            );
            break;
        case `d`:
        case `dec`:
        case `decrypt`:
            await decryptFile(inputFile, outputFile, opensshPriv).catch(
                msg => {
                    logger.error(msg);
                    process.exit();
                }
            );
            break;
        default:
            logger.error(`Unknown mode: '${mode}'.`);
            return;
    };

};

const printStartingInformation = () => {
    logger.info(PROGRAM_NAME);
    logger.info(PROGRAM_AUTHOR);
    console.log();
    console.log();
};

main();