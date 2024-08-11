//Function for fetching data from promise.josn
async function fetchData() {
    //Repo Credentials
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
    //Making log in case of failed fetch
    if (!response.ok) {
        console.log(apiUrl);
        console.log("Response error occured");
        throw new Error('Network response was not ok');
        
    }

    const jsonData = await response.json();
    return jsonData;
}
//onclick handler for details button on donations.html
function showDetails(url) {
    window.location.href = url;
}

//Function for generating table to donations.html
function createTableBody(data) {
    const fileUrl='https://github.com/keralarehab/keralarehab/blob/initial_template/incidents/wayanad-landslide-2024/';
    const tableBody = document.getElementById('table-body');
    tableBody.innerHTML = '';

    // Sort data by date_of_promise in descending order
    data.sort((a, b) => new Date(b.date_of_promise) - new Date(a.date_of_promise));

    //converting each document from data to rows
    data.forEach((item, index) => {
        const tr = document.createElement('tr');
        
        //SlNo is generated on recent to oldest order
        const tdSlNo = document.createElement('td');
        tdSlNo.textContent = index + 1;
        tr.appendChild(tdSlNo);

        //NA will be given in case of missing values
        const tdPromise = document.createElement('td');
        tdPromise.textContent = item.promise || 'NA';
        tr.appendChild(tdPromise);

        const tdPromiser = document.createElement('td');
        tdPromiser.textContent = item.promisor || 'NA';
        tr.appendChild(tdPromiser);

        const tdDateOfPromise = document.createElement('td');
        tdDateOfPromise.textContent = item.date_of_promise || 'NA';
        tr.appendChild(tdDateOfPromise);

        //Details Button
        const tdDetails = document.createElement('td');
        if (item.offers && item.offers.length > 0) {
            const link = document.createElement('button');
            link.onclick =() => {
                 showDetails(`donationdetail.html#${item.slug}`);
            };
            link.textContent = 'Details';
            link.className = 'btn btn-outline-primary';
            tdDetails.appendChild(link);
        } else {
            tdDetails.textContent = 'NA';
        }
        tr.appendChild(tdDetails);

        //Progress Button
        const tdProgress = document.createElement('td');
        if (item.offers && item.offers.length > 0) {
            const link = document.createElement('button');
            link.onclick =() => {
                 showDetails(`progressdetail.html#${item.slug}`);
            };
            link.textContent = 'Progress';
            link.className = 'btn btn-outline-primary';
            tdProgress.appendChild(link);
        } else {
            tdProgress.textContent = 'NA';
        }
        tr.appendChild(tdProgress);

        tableBody.appendChild(tr);
    });
}

//Modal used to display media - commeting for the time being
// function showImage(url) {
//     const modalImage = document.getElementById('modalImage');
//     modalImage.src = url;
//     $('#imageModal').modal('show');
// }

async function loadTable() {
    try {
        const data = await fetchData();
        if (data && data.length > 0) {
            createTableBody(data);
            $('#data-table').DataTable(); // Added data table for pagination
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

loadTable();