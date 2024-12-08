// API URL for fetching product data
const API_URL = 'https://backendnyrfestas.vercel.app/products'; // Adjust to your live backend URL

// Function to format the price (check if it's a number first)
function formatPrice(price) {
    return isNaN(price) ? 'R$ 0.00' : `R$ ${parseFloat(price).toFixed(2)}`;
}

// Function to fetch product data from the API
async function fetchProductData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
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

    products.forEach(product => {
        // Create a new row for each product
        const row = tableBody.insertRow();

        // Insert cells for each product detail
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);

        // Insert data from backend (use real data, no random values)
        cell1.innerHTML = `<img src="${product.imageUrl || 'https://via.placeholder.com/50'}" alt="Product Image">`;  // Use product image from API or placeholder
        cell2.innerHTML = `Code-${product.id}`;  // Product ID
        cell3.innerHTML = product.nome;  // Product name
        cell4.innerHTML = product.cxfechada || 0;  // Default to 0 if not available
        cell5.innerHTML = formatPrice(product.precofechada);  // Use formatPrice function
        cell6.innerHTML = product.cxfracionada || 0;  // Default to 0 if not available
        cell7.innerHTML = formatPrice(product.precofracionada);  // Use formatPrice function
    });
}

// Function to update and show modal with product details
const modal = document.getElementById('myModal');
const closeModalBtn = document.getElementById('closeModalBtn');
function openModal(productName, productDesc, productPrice, productImage) {
    const productInfo = modal.querySelector('.modal-stage-one .product-info');
    const priceInfo = modal.querySelector('.modal-stage-one .price-info');
    const productImageElement = modal.querySelector('.modal-stage-one img');
    
    productInfo.querySelector('h3').textContent = productName;
    productInfo.querySelector('p').textContent = productDesc;
    priceInfo.querySelector('p').innerHTML = `<strong>Price: ${productPrice}</strong>`;
    productImageElement.src = productImage;

    modal.style.display = 'block'; // Show modal
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
