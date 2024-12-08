// Simulate a public API with product data
const API_URL = 'https://backendnyrfestas.vercel.app/products'; // Mock API endpoint for testing

// Function to fetch product data from the API
async function fetchProductData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Map the data into the table
        populateProductTable(data);
    } catch (error) {
        console.error('Error fetching product data:', error);
    }
}

// Function to populate the product table dynamically
function populateProductTable(products) {
    const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];

    products.forEach(product => {
        // Create a new row
        const row = tableBody.insertRow();

        // Insert cells for each product detail
        const cell1 = row.insertCell(0);
        const cell2 = row.insertCell(1);
        const cell3 = row.insertCell(2);
        const cell4 = row.insertCell(3);
        const cell5 = row.insertCell(4);
        const cell6 = row.insertCell(5);
        const cell7 = row.insertCell(6);
        const cell8 = row.insertCell(7); // This will be the button cell

        // For simulation purposes, using random data for each product
        cell1.innerHTML = `<img src="https://via.placeholder.com/50" alt="Product Image">`;  // Placeholder image
        cell2.innerHTML = `Code-${product.id}`;  // Simulate Product Code
        cell3.innerHTML = `${product.nome}`;  // Simulate Product Description
        cell4.innerHTML = `${product.quantidade}`;  // Simulate Quantity 1
        cell5.innerHTML = `${product.preco}`;  // Simulate Price 1
        cell6.innerHTML = Math.floor(Math.random() * 100);  // Simulate Quantity 2
        cell7.innerHTML = `R$ ${(Math.random() * 100).toFixed(2)}`;  // Simulate Price 2
        cell8.innerHTML = `<button class="openModalBtn">View Details</button>`; // Add button at the end of each row

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
}

// Function to update and show modal
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

// Fetch and populate products on page load
window.onload = fetchProductData;