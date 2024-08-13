// utils.js
const fs = require('fs');
const path = require('path');

// Ensure that the directory for the file path exists
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (!fs.existsSync(dirname)) {
        fs.mkdirSync(dirname, { recursive: true });
    }
};

module.exports = {
    ensureDirectoryExistence
};
