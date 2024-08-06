async function fetchMarkdown(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const markdown = await response.text();
        const formattedHTML = marked.parse(markdown);
        const contentElement = document.getElementById('content');
        contentElement.innerHTML = formattedHTML;
        const h1Elements = contentElement.querySelectorAll('h1');
        h1Elements.forEach(h1 => {
            const h3 = document.createElement('h3');
            h3.innerHTML = h1.innerHTML;
            h1.replaceWith(h3);
        });
        const h2Elements = contentElement.querySelectorAll('h2');
        h2Elements.forEach(h2 => {
            const h4 = document.createElement('h4');
            h4.innerHTML = h2.innerHTML;
            h2.replaceWith(h4);
        });
        const tables = contentElement.querySelectorAll('table');
        tables.forEach(table => {
            table.setAttribute('border', '1');
        });
        const anchors = contentElement.querySelectorAll('a');
        anchors.forEach(anchor => {
            if (anchor.textContent.trim() === 'View Progress') {
                const existingValue = anchor.getAttribute('href').slice(1);
                anchor.setAttribute('href', `donationdetail.html?value=${existingValue}`);
            }
        })
    } catch (error) {
        console.error('Error fetching markdown:', error);
        document.getElementById('content').innerText = 'Error loading content.';
    }
}

function formatMarkdown(markdown) {
  
    const lines = markdown.split('\n');
    let title = '';
    let promise = '';
    let dateOfPromise = '';
    let details = '';
    let progressLink = '';
    let references = '';

    lines.forEach((line, index) => {
        if (index === 0) {
            title = line;
        } else if (line.startsWith('Promise')) {
            promise = line;
        } else if (line.startsWith('Date of Promise')) {
            dateOfPromise = line.replace('Date of Promise', '').trim();
        } else if (line.startsWith('Details')) {
            details = line.replace('Details', '').trim();
        } else if (line.startsWith('Progress')) {
            const linkIndex = lines.indexOf(line) + 1;
            progressLink = lines[linkIndex].trim();
        } else if (line.startsWith('References')) {
            references = line.replace('References', '').trim();
        }
    });

    return `
        <h1>${title}</h1>
        <p><strong>${promise}</strong></p>
        <p><strong>Date of Promise:</strong> ${dateOfPromise}</p>
        <p><strong>Details:</strong> ${details}</p>
        <p><strong>Progress:</strong> <a href="${progressLink}" target="_blank">View Progress</a></p>
        <p><strong>References:</strong> <a href="${references}" target="_blank">${references}</a></p>
    `;
}

function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}
const path = getQueryParam('value');
const rawLink = 'https://raw.githubusercontent.com/keralarehab/keralarehab/initial_template/incidents/wayanad-landslide-2024/'+path;
fetchMarkdown(rawLink);
