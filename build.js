const fs = require('fs');
const ejs = require('ejs');
const axios = require('axios');
const marked = require('marked');
const path = require('path');
const cheerio = require('cheerio');

const og_title = 'Kerala Rehab | Transforming Promises into Support for Wayanad Landslide Victims';
const og_description = 'Kerala Rehab is committed to turning pledges into action by ensuring that promises made to disaster victims are fulfilled. Join us in making a difference.';
const og_url = 'https://www.keralarehab.in';
const og_image = 'https://keralarehab.in/asset/images/og-image-kerala-rehab.png';

// URL of the JSON data
const jsonUrl = 'https://raw.githubusercontent.com/keralarehab/keralarehab.github.io/initial_template/incidents/wayanad-landslide-2024/data/promise.json';

// Function to fetch markdown files and convert to HTML
const fetchMarkdownToHTML = async (url) => {
    try {
        const response = await axios.get(url);
        return marked.parse(response.data);
    } catch (error) {
        console.error('Error fetching markdown:', error);
        return '';
    }
};

// Function to create directories if they do not exist
const ensureDirectoryExistence = (filePath) => {
    const dirname = path.dirname(filePath);
    if (fs.existsSync(dirname)) {
        return true;
    }
    ensureDirectoryExistence(dirname);
    fs.mkdirSync(dirname);
};

// Function to copy assets from public to dist folder
const copyDirectory = (src, dest) => {
    fs.mkdirSync(dest, {
        recursive: true
    });
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

// Clear contents of dist folder
const clearDistFolder = () => {
    if (fs.existsSync('dist')) {
        fs.rmdirSync('dist', {
            recursive: true
        });
        console.log('Cleared dist folder');
    }
};

// Main build function
const build = async () => {
    clearDistFolder();

    // Fetch the JSON data
    try {
        const response = await axios.get(jsonUrl);
        const data = response.data;

        // Render the homepage template
        ejs.renderFile('views/index.ejs', {
            og_title: og_title,
            og_description: og_description,
            og_image: og_image,
            og_url: og_url,
            og_keywords: ''
        }, (err, homeStr) => {
            if (err) {
                console.error('Error rendering homepage EJS:', err);
                return;
            }
            ensureDirectoryExistence('dist/index.html');
            fs.writeFileSync('dist/index.html', homeStr);
            console.log('index.html has been created');
        });

        // Render the about us template
        ejs.renderFile('views/about.ejs', {}, (err, aboutStr) => {
            if (err) {
                console.error('Error rendering about EJS:', err);
                return;
            }
            ensureDirectoryExistence('dist/aboutus.html');
            fs.writeFileSync('dist/aboutus.html', aboutStr);
            console.log('aboutus.html has been created');
        });

        // Render the contact us template
        ejs.renderFile('views/contact.ejs', {}, (err, contactStr) => {
            if (err) {
                console.error('Error rendering contact EJS:', err);
                return;
            }
            ensureDirectoryExistence('dist/contactus.html');
            fs.writeFileSync('dist/contactus.html', contactStr);
            console.log('contactus.html has been created');
        });

        // Process each donation asynchronously
        const processedData = await Promise.all(data.map(async (x) => {
            x.details = await fetchDetails(x.slug);
            return x;
        }));

        console.log(data);

        // Render the offers template with the data
        ejs.renderFile('views/offers.ejs', {
            data: processedData
        }, (err, offersStr) => {
            if (err) {
                console.error('Error rendering offers EJS:', err);
                return;
            }
            ensureDirectoryExistence('dist/donations.html');
            fs.writeFileSync('dist/donations.html', offersStr);
            console.log('donations.html has been created');
        });

        // Generate offer pages for each markdown file
        for (let i = 0; i < processedData.length; i++) {
            const donation = processedData[i];
            const prevOffer = (i > 0) ? processedData[i - 1].slug : null;
            const nextOffer = (i < processedData.length - 1) ? processedData[i + 1].slug : null;

            const prevOfferUrl = prevOffer ? `offer/${prevOffer}-wayanad-donation.html` : null;
            const nextOfferUrl = nextOffer ? `offer/${nextOffer}-wayanad-donation.html` : null;

            for (let j = 0; j < donation.offers.length; j++) {
                const offer = donation.offers[j];
                const offerUrl = `https://raw.githubusercontent.com/keralarehab/keralarehab.github.io/initial_template/incidents/wayanad-landslide-2024/${offer.offer}`;
                const progressUrl = `https://raw.githubusercontent.com/keralarehab/keralarehab.github.io/initial_template/incidents/wayanad-landslide-2024/${offer.progress}`;

                try {
                    // Fetch and render offer details page
                    const offerContent = await fetchMarkdownToHTML(offerUrl);
                    const progressContent = await fetchMarkdownToHTML(progressUrl);

                    const offerFilePath = `dist/offer/${path.basename(offer.offer, '.md')}-wayanad-donation.html`;
                    ensureDirectoryExistence(offerFilePath);

                    ejs.renderFile('views/offer.ejs', {
                        promisor: donation.promisor,
                        promise: donation.promise,
                        date_of_promise: donation.date_of_promise,
                        offerContent: offerContent,
                        progressContent: progressContent,
                        prevOfferUrl: prevOfferUrl,
                        nextOfferUrl: nextOfferUrl
                    }, (err, offerStr) => {
                        if (err) {
                            console.error('Error rendering offer EJS:', err);
                            return;
                        }
                        fs.writeFileSync(offerFilePath, offerStr);
                        console.log(`${offerFilePath} has been created`);
                    });
                } catch (error) {
                    console.error('Error fetching markdown content:', error);
                }
            }
        }

        // Copy assets from public to dist folder
        copyDirectory('public/asset', 'dist/asset');
        console.log('Assets have been copied to dist/asset');

    } catch (error) {
        console.error('Error fetching JSON data:', error);
    }
};

async function fetchDetails(slug) {
    const offerUrl = `https://raw.githubusercontent.com/keralarehab/keralarehab.github.io/initial_template/incidents/wayanad-landslide-2024/offers/${slug}.md`;
    try {
        const response = await axios.get(offerUrl);
        const markdown = response.data;
        const htmlString = marked.parse(markdown);

        const $ = cheerio.load(htmlString);

        let detailsText = '';
        let foundDetails = false;

        $('p').each((index, element) => {
            if ($(element).prev().text().includes('Details')) {
                foundDetails = true;
            } else if (foundDetails) {
                detailsText += $(element).text() + '\n';
            }
        });

        return detailsText.trim();
    } catch (error) {
        console.error('Error fetching details:', error);
        return '';
    }
}

//build();