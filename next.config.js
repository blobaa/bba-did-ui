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


module.exports = withSass(withCss({
    exportTrailingSlash: true,
    exportPathMap: function() {
        let pages = {};
        GET_ABLE_PAGES.forEach(page => {
            pages[page] = { page: page };
        })
        return pages;
    },
    assetPrefix: linkPrefix,
    env: {
        linkPrefix: linkPrefix,

        /* .env */
        BACKEND_DOMAIN: process.env.BACKEND_DOMAIN
    },
    generateBuildId: async () => 'current'
}));
