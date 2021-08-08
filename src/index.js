const { createLogger, format, transports } = require('winston');
const { combine, timestamp, label, printf } = format;
const NodeRSA = require('node-rsa');

const path = require('path');

const { readFile, writeFile, getExtension } = require('./filesystem');
const { encryptFile, decryptFile } = require('./crypto');

const myFormat = printf(({ level, message, label, timestamp }) => {
    return `${timestamp} [${label}] ${level}: ${message}`;
});

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

    if (process.argv.length <= 2) {
        logger.error(`Not enough arguments. Must supply file to encrypt.`);
        return;
    }

    const arguments = process.argv.slice(2);

    // TODO: More error handling here
    const mode = arguments[0];
    const file = arguments[1];

    const ext = await getExtension(file).catch(
        msg => {
            logger.error(msg);
            process.exit();
        }
    );
    const name = path.basename(file, ext);

    switch (mode) {
        case `e`:
        case `enc`:
        case `encrypt`:
            await encryptFile(file, `output${ext}`, opensshPub).catch(
                msg => {
                    logger.error(msg);
                    process.exit();
                }
            );
            break;
        case `d`:
        case `dec`:
        case `decrypt`:
            await decryptFile(file, `output${ext}`, opensshPriv).catch(
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