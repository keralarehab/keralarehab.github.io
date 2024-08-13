const ejs = require('ejs');
const fs = require('fs');
const axios = require('axios');
const marked = require('marked');
const cheerio = require('cheerio');
const path = require('path');

const { ensureDirectoryExistence } = require('../utils/commonFunctions');
const { ogData, jsonDataUrl } = require('../utils/commonData');

const offerDetailPage = async () => {

    try {
        // Fetch data from the JSON URL
        const response = await axios.get(jsonDataUrl);
        const tempdata = response.data;
     

        const processedData = tempdata;         

        // Add OG data to the JSON data
        // const data = { ...ogData, ...jsonData };
        
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

                console.log('');
                console.log('');
                console.log('');
                console.log('----------==========--------');
                console.log(offerUrl);
                console.log(progressUrl);

                try {

                    let tempOg = ogData;

                    // Fetch and render offer details page
                    const offerContent = await fetchMarkdownToHTML(offerUrl);

                    // Load the HTML content into cheerio
                    const $ = cheerio.load(offerContent);

                    // Extract the text from the <p> tag under the <h2 id="details"> heading
                    const detailsText = $('h2#details').next('p').text();
                    tempOg.og_description = detailsText;

                    const firstImageSrc = $('img').first().attr('src') || null;
                    if(firstImageSrc){
                        tempOg.og_image = firstImageSrc;
                    }
                    

                    tempOg.og_title = donation.promisor + ' | ' + donation.promise;

                    const progressContent = await fetchMarkdownToHTML(progressUrl);

                    const offerFilePath = `dist/offer/${path.basename(offer.offer, '.md')}-wayanad-donation.html`;
                    ensureDirectoryExistence(offerFilePath);

                    let jsonData = {
                        promisor: donation.promisor,
                        promise: donation.promise,
                        date_of_promise: donation.date_of_promise,
                        offerContent: offerContent,
                        progressContent: progressContent,
                        prevOfferUrl: prevOfferUrl,
                        nextOfferUrl: nextOfferUrl
                    };

                    
                    let tdata = { ...tempOg, ...jsonData };

                    ejs.renderFile('views/offerDetail.ejs', tdata, (err, offerStr) => {
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
    } catch (err) {
        console.error('Error rendering offers page:', err);
    }

};


const fetchMarkdownToHTML = async (url) => {
    try {
        const response = await axios.get(url);
        return marked.parse(response.data);
    } catch (error) {
        console.error('Error fetching markdown:', error);
        return '';
    }
};

module.exports = offerDetailPage;

