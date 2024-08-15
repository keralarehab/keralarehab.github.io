document.getElementById('searchInput').addEventListener('input', function() {
        const query = this.value.toLowerCase();
        const offers = document.querySelectorAll('.offer-item');

        offers.forEach(offer => {
            const name = offer.getAttribute('data-name').toLowerCase();
            if (name.includes(query)) {
                offer.classList.remove('d-none');
                offer.classList.add('d-block');
            } else {
                offer.classList.remove('d-block');
                offer.classList.add('d-none');
            }
        });
});

// document.addEventListener('DOMContentLoaded', () => {
//     const ITEMS_PER_PAGE = 12;
//     const offersList = document.getElementById('offersList');
//     const paginationControls = document.getElementById('paginationControls');
//     const offerItems = document.querySelectorAll('.offer-item');
    
//     const totalPages = Math.ceil(offerItems.length / ITEMS_PER_PAGE);

//     const showPage = (page) => {
//         offerItems.forEach((item, index) => {
//             if (index >= (page - 1) * ITEMS_PER_PAGE && index < page * ITEMS_PER_PAGE) {
//                 item.classList.remove('d-none');
//                 item.classList.add('d-block');
//             } else {
//                 item.classList.remove('d-block');
//                 item.classList.add('d-none');
//             }
//         });
//     };

//     const createPaginationControls = () => {
//         for (let i = 1; i <= totalPages; i++) {
//             const li = document.createElement('li');
//             li.className = 'page-item';
//             const a = document.createElement('a');
//             a.className = 'page-link';
//             a.href = '#';
//             a.textContent = i;
//             a.addEventListener('click', (e) => {
//                 e.preventDefault();
//                 showPage(i);
//                 document.querySelectorAll('.page-item').forEach(item => item.classList.remove('active'));
//                 li.classList.add('active');
//             });
//             li.appendChild(a);
//             paginationControls.appendChild(li);
//         }
//     };

//     // Initialize pagination
//     showPage(1); // Show the first page initially
//     createPaginationControls();
// });
