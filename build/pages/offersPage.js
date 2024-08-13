const ejs = require('ejs');
const fs = require('fs');
const axios = require('axios');
const marked = require('marked');
const cheerio = require('cheerio');

const { ensureDirectoryExistence } = require('../utils/commonFunctions');
const { ogData, jsonDataUrl,offerUrl } = require('../utils/commonData'); // Import the OG data and JSON URL

const offersPage = async () => {
    try {
        // Fetch data from the JSON URL
        const response = await axios.get(jsonDataUrl);
        const tempdata = response.data;
     

        const processedData = tempdata;
        
        const jsonData = {data:processedData};

        

        // Add OG data to the JSON data
        const data = { ...ogData, ...jsonData };
        console.log(data);

        // Render the EJS template with the combined data
        const homeStr = await ejs.renderFile('views/offers.ejs', data);

        // Ensure the directory exists before writing the file
        ensureDirectoryExistence('dist/donations.html');

        // Write the rendered HTML to the file
        fs.writeFileSync('dist/donations.html', homeStr);
        console.log('donations.html has been created');
    } catch (err) {
        console.error('Error rendering offers page:', err);
    }
};





module.exports = offersPage;
