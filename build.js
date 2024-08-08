const fs = require('fs');
const ejs = require('ejs');
const axios = require('axios');
const marked = require('marked');
const path = require('path');
const cheerio = require('cheerio');

// URL of the JSON data
const jsonUrl = 'https://raw.githubusercontent.com/keralarehab/keralarehab.github.io/initial_template/incidents/wayanad-landslide-2024/data/promise.json';

// Function to fetch markdown files and convert to HTML
const fetchMarkdownToHTML = async (url) => {
    const response = await axios.get(url);
    return marked.parse(response.data);
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

// Clear contents of dist folder
const clearDistFolder = () => {
    if (fs.existsSync('dist')) {
        fs.rmdirSync('dist', { recursive: true });
        console.log('Cleared dist folder');
    }
};

// Main build function
const build = async () => {
    // Clear dist folder
    clearDistFolder();

    // Fetch the JSON data
    try {
        const response = await axios.get(jsonUrl);
        const data = response.data;

        // Render the homepage template
        ejs.renderFile('views/index.ejs', {}, (err, homeStr) => {
            if (err) {
                console.error('Error rendering homepage EJS:', err);
                return;
            }

            // Write the rendered HTML to the output file
            ensureDirectoryExistence('dist/index.html');
            fs.writeFileSync('dist/index.html', homeStr);
            console.log('index.html has been created');
        });


        // Process each donation asynchronously
        const processedData = await Promise.all(data.map(async (x) => {
            x.details = await fetchDetails(x.slug); // Await the markdown function
            return x;
        }));
        
        console.log(data);

        // Render the offers template with the data
        ejs.renderFile('views/offers.ejs', { data: data }, (err, offersStr) => {
            if (err) {
                console.error('Error rendering offers EJS:', err);
                return;
            }

            // Write the rendered HTML to the output file
            ensureDirectoryExistence('dist/offers.html');
            fs.writeFileSync('dist/offers.html', offersStr);
            console.log('offers.html has been created');
        });

        
        const donation_length = data.length;
        console.log(donation_length + 'donations');
        // Generate offer pages for each markdown file
        for (let i = 0; i < donation_length; i++) {
            const donation = data[i];
            
            const prevOffer = (i > 0) ? data[i - 1].slug : null;
            const nextOffer = (i < donation_length - 1) ? data[i + 1].slug : null;

            

            const prevOfferUrl = prevOffer ? `offer/${prevOffer}-wayanad-donation.html` : null;
            const nextOfferUrl = nextOffer ? `offer/${nextOffer}-wayanad-donation.html` : null;

            console.log('-------');
            console.log(prevOfferUrl);
            console.log(nextOfferUrl);
            console.log('-------');

           


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

 async function fetchDetails(slug){
       
        const offerUrl = `https://raw.githubusercontent.com/keralarehab/keralarehab.github.io/initial_template/incidents/wayanad-landslide-2024/offers/${slug}.md`;
        const response =  await axios.get(offerUrl);
        const htmlString = marked.parse(response.data);

        // Load the HTML string into cheerio
        const $ = cheerio.load(htmlString);

        // Find the <h2> element with id "details"
        const detailsHeader = $('#details');
        // Extract the text from the next sibling <p> element
        if (detailsHeader.length) {
            const detailsText = detailsHeader.next('p').text();
            return detailsText;
        } else {
            console.log('Details header not found.');
        }   
        return ''; 
}


build();
