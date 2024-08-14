const fs = require('fs');
const path = require('path');
const axios = require('axios');
const { ensureDirectoryExistence } = require('../utils/commonFunctions');
const { baseUrl, jsonDataUrl } = require('../utils/commonData');

// Define your static URLs
const staticUrls = [
    'index.html',
    'aboutus.html',
    'contactus.html',
    'submissions.html',
    'donations.html'
];

const sitemap = async () => {
    let urlsXml = '';
    let dynamicUrlsXml = '';

    // Static URLs XML
    const staticUrlsXml = staticUrls.map(url => `
        <url>
            <loc>${baseUrl}/${url}</loc>
            <lastmod>${new Date().toISOString()}</lastmod>
        </url>`)
    .join('\n');

    console.log('Static URLs XML:', staticUrlsXml);

    try {
        // Fetch data from the JSON URL
        const response = await axios.get(jsonDataUrl);
        const data = response.data;

        // Dynamic URLs XML
        dynamicUrlsXml = data.map(item => `
            <url>
                <loc>${baseUrl}/offer/${item.slug}-wayanad-donation.html</loc>
                <lastmod>${new Date().toISOString()}</lastmod>
            </url>`)
        .join('\n');

        console.log('Dynamic URLs XML:', dynamicUrlsXml);
    } catch (err) {
        console.error('Error fetching data for sitemap:', err);
    }

    // Combine static and dynamic URLs XML
    urlsXml = staticUrlsXml + '\n' + dynamicUrlsXml;

    // Construct the sitemap XML
    const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${urlsXml}
    </urlset>`;

    // Ensure the directory exists before writing the file
    ensureDirectoryExistence('dist/sitemap.xml');

    // Write sitemap.xml to the dist folder
    fs.writeFileSync('dist/sitemap.xml', xml);

    console.log('Sitemap generated successfully.');
};

module.exports = sitemap;
