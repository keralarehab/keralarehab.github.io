// utils/commonData.js
const baseUrl = 'https://www.keralarehab.in';

const ogData = {
    og_title: 'Kerala Rehab | Transforming Promises into Support for Wayanad Landslide Victims',
    og_description: 'Kerala Rehab is committed to turning pledges into action by ensuring that promises made to disaster victims are fulfilled. Join us in making a difference.',
    og_url: baseUrl,
    og_image: 'https://keralarehab.in/assets/images/og-image-kerala-rehab.png',
    og_keywords: '',
};

// URL to fetch JSON data
const jsonDataUrl = 'https://raw.githubusercontent.com/keralarehab/keralarehab.github.io/initial_template/incidents/wayanad-landslide-2024/data/promise.json'; 
const offerUrl = 'https://raw.githubusercontent.com/keralarehab/keralarehab.github.io/initial_template/incidents/wayanad-landslide-2024/offers';

module.exports = { ogData, jsonDataUrl, offerUrl,baseUrl };
