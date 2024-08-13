document.addEventListener('DOMContentLoaded', () => {
    // Select all images within the #offercontent section
    const images = document.querySelectorAll('#offerContent img');
    
    // Loop through each image and add the 'media-img' class
    images.forEach(img => {
        img.classList.add('media-img');
    });

    var links = document.querySelectorAll('#offerContent a');
    links.forEach(function(link) {
        link.setAttribute('target', '_blank');
    });

    var table = document.querySelector('table');
    if (table) {
        table.classList.add('table', 'table-bordered', 'table-condensed');
    }
});