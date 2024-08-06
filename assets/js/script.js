async function fetchData() {
    const repoOwner = 'keralarehab';
    const repoName = 'keralarehab';
    const filePath = 'incidents/wayanad-landslide-2024/data/promise.json';
    const branch = 'initial_template';
    const apiUrl = `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${filePath}?ref=${branch}`;


    const response = await fetch(apiUrl, {
        headers: {
            'Accept': 'application/vnd.github.v3.raw'
        }
    });

    if (!response.ok) {
        console.log(apiUrl);
        console.log("Response error occured");
        throw new Error('Network response was not ok');
        
    }

    const jsonData = await response.json();
    return jsonData;
}
function showDetails(donation) {
    // Navigate to details.html with the id as a URL parameter
    window.location.href = `donationdetail.html?value=${donation}`;
}
// function createTableHeader(headerData) {
//     const tableHeader = document.getElementById('table-header');
//     tableHeader.innerHTML = '';
//     headerData.forEach(header => {
//         const th = document.createElement('th');
//         th.textContent = header;
//         tableHeader.appendChild(th);
//     });
// }

function createTableBody(data) {
    const fileUrl='https://github.com/keralarehab/keralarehab/blob/initial_template/incidents/wayanad-landslide-2024/';
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';
    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        
        const tdSlNo = document.createElement('td');
        tdSlNo.textContent = index + 1;
        tr.appendChild(tdSlNo);

        const tdPromise = document.createElement('td');
        tdPromise.textContent = item.promise || 'NA';
        tr.appendChild(tdPromise);

        const tdPromiser = document.createElement('td');
        tdPromiser.textContent = item.promisor || 'NA';
        tr.appendChild(tdPromiser);

        const tdDateOfPromise = document.createElement('td');
        tdDateOfPromise.textContent = item.date_of_promise || 'NA';
        tr.appendChild(tdDateOfPromise);

        const tdMedia = document.createElement('td');
        if (item.media) {
            const button = document.createElement('button');
            button.textContent = 'View';
            button.className = 'btn btn-primary';
            button.onclick = () => showImage(item.media);
            tdMedia.appendChild(button);
        } else {
            tdMedia.textContent = 'NA';
        }
        tr.appendChild(tdMedia);

        const tdDetails = document.createElement('td');
        if (item.offers && item.offers.length > 0) {
            const link = document.createElement('button');
            link.onclick =() => {
                showDetails(item.offers[0].offer);
            };
            link.textContent = 'Details';
            tdDetails.appendChild(link);
        } else {
            tdDetails.textContent = 'NA';
        }
        tr.appendChild(tdDetails);

        const tdProgress = document.createElement('td');
        if (item.offers && item.offers.length > 0) {
            const link = document.createElement('a');
            link.href = fileUrl+item.offers[0].progress;
            link.textContent = 'Progress';
            link.target = '_blank';
            tdProgress.appendChild(link);
        } else {
            tdProgress.textContent = 'NA';
        }
        tr.appendChild(tdProgress);

        tableBody.appendChild(tr);
    });
}

function showImage(url) {
    const modalImage = document.getElementById('modalImage');
    modalImage.src = url;
    $('#imageModal').modal('show');
}


function showImage(url) {
    const modalImage = document.getElementById('modalImage');
    modalImage.src = url;
    $('#imageModal').modal('show');
}

async function loadTable() {
    try {
        const data = await fetchData();
        if (data && data.length > 0) {
            createTableBody(data);
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

loadTable();