const ejs = require('ejs');
const fs = require('fs');
const { ensureDirectoryExistence } = require('../utils/commonFunctions'); // Import the function
const {ogData} = require('../utils/commonData');

const aboutPage = async () => {
    try {
        // Render the EJS template
        const homeStr = await ejs.renderFile('views/contact.ejs', ogData);

        // Ensure the directory exists before writing the file
        ensureDirectoryExistence('dist/contactus.html');
        
        // Write the rendered HTML to the file
        fs.writeFileSync('dist/contactus.html', homeStr);
        console.log('contactus.html has been created');
    } catch (err) {
        console.error('Error rendering homepage EJS:', err);
    }
};

module.exports = aboutPage;
