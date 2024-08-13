const fs = require('fs-extra');
const path = require('path');


const buildHomePage = require('./pages/homePage');
const buildAboutPage = require('./pages/aboutPage');
const buildContactPage = require('./pages/contactPage');
const buildOffersPage = require('./pages/offersPage');
const buildOfferDetailPages = require('./pages/offerDetailPage');

// Main build function to call all other build scripts
const build = async () => {
    await buildHomePage();
    await buildAboutPage();
    await buildContactPage();
    await buildOffersPage();
    await buildOfferDetailPages();
};


// Function to copy assets from public to dist folder
const copyDirectory = (src, dest) => {
    fs.mkdirSync(dest, { recursive: true });
    fs.readdirSync(src).forEach((file) => {
        const srcPath = path.join(src, file);
        const destPath = path.join(dest, file);
        if (fs.lstatSync(srcPath).isDirectory()) {
            copyDirectory(srcPath, destPath);
        } else {
            fs.copyFileSync(srcPath, destPath);
        }
    });
};


copyDirectory('public/asset', 'dist/asset');
build();
