const withSass = require('@zeit/next-sass');
const withCss = require('@zeit/next-css');

const dotenv = require('dotenv');
dotenv.config();


/************************************************************************
 *  Config
 ************************************************************************/

const SUB_DOMAIN = "";
const GET_ABLE_PAGES = [
    '/',
];


/************************************************************************
 *  MAIN
 ************************************************************************/

const isProd = (process.env.NODE_ENV || 'production') === 'production';
const linkPrefix = isProd ? SUB_DOMAIN : '';


const MAINNET_URL = process.env.MAINNET_URL || "https://ardor.jelurida.com";
const TESTNET_URL = process.env.TESTNET_URL || "https://ardor.jelurida.com";


const minTestnetBalance = parseInt(process.env.MIN_TESTNET_BALANCE);
const minMainnetBalance = parseInt(process.env.MIN_MAINNET_BALANCE);

let MIN_TESTNET_BALANCE = 10;
let MIN_MAINNET_BALANCE = 2;

if (!isNaN(minTestnetBalance) && minTestnetBalance > 0) {
    MIN_TESTNET_BALANCE = minTestnetBalance;
}

if (!isNaN(minMainnetBalance) && minMainnetBalance > 0) {
    MIN_MAINNET_BALANCE = minMainnetBalance;
}


const IS_DEV = isProd ? false : process.env.RUN_ENV === "prod" ? false : true;


module.exports = withSass(withCss({
    exportTrailingSlash: true,
    exportPathMap() {
        const pages = {};
        GET_ABLE_PAGES.forEach((page) => {
            pages[page] = { page };
        });
        return pages;
    },
    assetPrefix: linkPrefix,
    env: {
        linkPrefix,

        /* .env */
        IS_DEV,
        MAINNET_URL,
        TESTNET_URL,
        MIN_TESTNET_BALANCE,
        MIN_MAINNET_BALANCE
    },
    generateBuildId: async () => 'current'
}));
