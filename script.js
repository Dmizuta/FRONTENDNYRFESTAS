// API URL for fetching product data
const API_URL = 'https://backendnyrfestas.vercel.app/products'; // Adjust to your live backend URL

// Function to fetch product data from the API
async function fetchProductData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();

        // Log the fetched data to check the structure
        console.log(data);

        // Map the data into the table
        populateProductTable(data);
    } catch (error) {
        console.error('Error fetching product data:', error);

        // Handle errors and show a user-friendly message in the table
        const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '<tr><td colspan="7">Unable to load products at the moment. Please try again later.</td></tr>';
    }
}

// Function to populate the product table dynamically
function populateProductTable(products) {
    const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];

    // Clear any existing rows
    tableBody.innerHTML = '';

    // Check if data exists and loop through the products
    if (products && products.length > 0) {
        products.forEach(product => {
            const row = tableBody.insertRow();

            // Insert cells for each product detail
            const cell1 = row.insertCell(0); // Image
            const cell2 = row.insertCell(1); // Product Code
            const cell3 = row.insertCell(2); // Description
            const cell4 = row.insertCell(3); // Quantity Closed
            const cell5 = row.insertCell(4); // Price Closed
            const cell6 = row.insertCell(5); // Quantity Fractioned
            const cell7 = row.insertCell(6); // Price Fractioned
            const cell8 = row.insertCell(7); // View Details Button

            // Insert data from backend
            cell1.innerHTML = `<img src="${product.imagem || 'https://via.placeholder.com/50'}" alt="Product Image" style="width: 50px; height: 50px; object-fit: cover;">`;  // Image
            cell2.innerHTML = `Code: ${product.codproduto}`;  // Product Code
            cell3.innerHTML = product.descricao;  // Description
            cell4.innerHTML = `${product.cxfechada || 'N/A'}`;  // Quantity Closed
            cell5.innerHTML = `R$ ${parseFloat(product.precofechada).toFixed(2)}`;  // Price Closed
            cell6.innerHTML = `${product.cxfracionada || 'N/A'}`;  // Quantity Fractioned
            cell7.innerHTML = `R$ ${parseFloat(product.precofracionada).toFixed(2)}`;  // Price Fractioned

            // Add the "View Details" button in the 8th column
            cell8.innerHTML = `<button class="openModalBtn">View Details</button>`;

            // Add event listener for the "View Details" button
            const openModalBtn = row.querySelector('.openModalBtn');
            openModalBtn.addEventListener('click', function() {
                const productName = row.cells[2].textContent; // Product description
                const productDesc = row.cells[2].textContent; // Detailed description
                const productPrice = row.cells[4].textContent; // Price 1
                const productImage = row.querySelector('img').src; // Product image

                openModal(productName, productDesc, productPrice, productImage);
            });
        });
    } else {
        // If no products found, show a message
        tableBody.innerHTML = '<tr><td colspan="7">No products available.</td></tr>';
    }
}

// Function to update and show modal with product details
const modal = document.getElementById('myModal');
const closeModalBtn = document.getElementById('closeModalBtn');

// Function to open modal
function openModal(productName, productDesc, productPrice, productImage) {
    const productInfo = modal.querySelector('.modal-stage-one .product-info');
    const priceInfo = modal.querySelector('.modal-stage-one .price-info');
    const productImageElement = modal.querySelector('.modal-stage-one img');
    
    productInfo.querySelector('h3').textContent = productName;
    productInfo.querySelector('p').textContent = productDesc;
    priceInfo.querySelector('p').innerHTML = `<strong>Price: ${productPrice}</strong>`;
    
    /* Adjust image size in modal
    productImageElement.src = productImage;
    productImageElement.style.width = '100%';  // Make image fit inside modal
    productImageElement.style.height = 'auto'; // Maintain aspect ratio

    modal.style.display = 'block'; // Show modal */
}

// Close modal functionality
closeModalBtn.addEventListener('click', function() {
    modal.style.display = 'none'; // Close the modal
});

// Close modal if clicked outside modal content
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        modal.style.display = 'none'; // Close modal
    }
});

// Fetch and populate products when the page loads
window.onload = fetchProductData;
