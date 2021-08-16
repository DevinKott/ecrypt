const optionDefinitions = [
    { name: 'mode', alias: 'm', type: String },
    { name: 'input', alias: 'i', type: String },
    { name: 'output', alias: 'o', type: String },
    { name: 'debug', alias: 'd', type: Boolean },
    { name: 'help', alias: 'h', type: String },
    { name: 'delete', type: Boolean },
    { name: 'recursive', alias: 'r', type: Boolean }
];

const sections = [
    {
        header: 'ecrypt',
        content: 'Encrypt files or directories.'
    },
    {
        header: 'Required Options',
        optionList: [
            {
                name: 'mode',
                alias: 'm',
                type: String,
                typeLabel: '{underline String}',
                description: "Either 'encrypt' or 'decrypt'. Specifies the type of operation you are running the program with."
            },
            {
                name: 'input',
                alias: 'i',
                type: String,
                typeLabel: '{underline String}',
                description: "The input path of the file you want to encrypt or decrypt."
            },
            {
                name: 'output',
                alias: 'o',
                type: String,
                typeLabel: '{underline String}',
                description: "The output path of the file you want to encrypt or decrypt."
            }
        ]
    },
    {
        header: 'Other Options',
        optionList: [
            {
                name: 'delete',
                type: Boolean,
                typeLabel: '{underline Boolean}',
                description: 'Set to true if you want to delete the input file after processing. Defaults to false.'
            },
            {
                name: 'recursive',
                type: Boolean,
                alias: 'r',
                typeLabel: '{underline Boolean}',
                description: 'If the input file is a directory, specify whether you want to recursive down into subdirectories.'
            }
        ]
    },
    {
        header: "Misc",
        optionList: [
            {
                name: 'help',
                alias: 'h',
                typeLabel: '',
                description: 'Displays help information about this program.'
            },
            {
                name: 'debug',
                alias: 'd',
                type: Boolean,
                typeLabel: '{underline Boolean}',
                description: "Specify true if you want to see debug information printed to the screen. Otherwise, specify false. Defaults to false."
            }
        ]
    },
    {
        content: `Project\t{underline https://github.com/DevinKott/ecrypt}\nWebsite\t{underline https://www.devinkott.com/}`
    }
];

module.exports = {
    optionDefinitions,
    sections
};