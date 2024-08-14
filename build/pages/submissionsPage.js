const ejs = require('ejs');
const fs = require('fs');
const { ensureDirectoryExistence } = require('../utils/commonFunctions'); // Import the function
const {ogData} = require('../utils/commonData');

const submissionsPage = async () => {
    try {
        // Render the EJS template
        const homeStr = await ejs.renderFile('views/submissions.ejs', ogData);

        // Ensure the directory exists before writing the file
        ensureDirectoryExistence('dist/submissions.html');
        
        // Write the rendered HTML to the file
        fs.writeFileSync('dist/submissions.html', homeStr);
        console.log('submissions.html has been created');
    } catch (err) {
        console.error('Error rendering homepage EJS:', err);
    }
};

module.exports = submissionsPage;
