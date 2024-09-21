/**
 * @see https://prettier.io/docs/en/configuration.html
 * @type {{singleQuote: boolean, trailingComma: string, tabWidth: number, semi: boolean, overrides: [{options: {semi: boolean, tabWidth: number}, files: string[]}]}}
 */
const config = {
    trailingComma: 'es5',
    tabWidth: 4,
    semi: true,
    singleQuote: true,
    overrides: [
        {
            files: ['*.json', '*.css'],
            options: {
                semi: true,
                tabWidth: 2,
            },
        },
    ],
};

export default config;
