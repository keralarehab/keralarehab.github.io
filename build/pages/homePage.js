const ejs = require('ejs');
const fs = require('fs');
const { ensureDirectoryExistence } = require('../utils/commonFunctions'); // Import the function
const { ogData } = require('../utils/commonData'); 


const homePage = async () => {
    try {
        // Render the EJS template
        const homeStr = await ejs.renderFile('views/index.ejs', ogData);

        // Ensure the directory exists before writing the file
        ensureDirectoryExistence('dist/index.html');
        
        // Write the rendered HTML to the file
        fs.writeFileSync('dist/index.html', homeStr);
        console.log('index.html has been created');
    } catch (err) {
        console.error('Error rendering homepage EJS:', err);
    }
};

module.exports = homePage;
