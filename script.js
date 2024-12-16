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
        const tableBody = document.querySelector('#productTable tbody');
        tableBody.innerHTML = '<tr><td colspan="7">Unable to load products at the moment. Please try again later.</td></tr>';
    }
}

// Function to populate the product table dynamically
function populateProductTable(products) {
    const tableBody = document.querySelector('#productTable tbody');

    // Clear any existing rows
    tableBody.innerHTML = '';

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

            // Populate cells with product data
            cell1.innerHTML = `
                <img src="${product.imagem || 'https://via.placeholder.com/50'}" 
                     alt="Product Image" 
                     style="width: 50px; height: 50px; object-fit: cover; transition: transform 0.3s; cursor: pointer;" 
                     onmouseover="this.style.transform='scale(3)'" 
                     onmouseout="this.style.transform='scale(1)'">
            `;

            cell2.textContent = product.codproduto || 'N/A'; // Product Code
            cell3.textContent = product.descricao || 'N/A'; // Description
            cell4.textContent = product.cxfechada || 'N/A'; // Quantity Closed
            cell5.textContent = `R$ ${parseFloat(product.precofechada).toFixed(2)}`; // Price Closed
            cell6.textContent = product.cxfracionada || 'N/A'; // Quantity Fractioned
            cell7.textContent = `R$ ${parseFloat(product.precofrac).toFixed(2)}`; // Price Fractioned
            cell8.innerHTML = `<button class="openModalBtn">Add</button>`;

            // Add event listener for "Add" button
            const openModalBtn = row.querySelector('.openModalBtn');
            openModalBtn.addEventListener('click', function () {
                const productImage = row.querySelector('img').src;
                const productCode = row.cells[1].textContent;
                const productDesc = row.cells[2].textContent;
                const productPrice1 = row.cells[4].textContent;
                const productPrice2 = row.cells[6].textContent;

                openModal(productCode, productDesc, productPrice1, productPrice2, productImage);
            });
        });
    } else {
        // No products available message
        tableBody.innerHTML = '<tr><td colspan="7">No products available.</td></tr>';
    }
}

// Function to open the modal with product details
function openModal(productCode, productDesc, productPrice1, productPrice2, productImage) {
    const modal = document.getElementById('myModal');
    const productInfo = modal.querySelector('.product-info');
    const priceInfo1 = modal.querySelector('.price1-info');
    const priceInfo2 = modal.querySelector('.price2-info');
    const productImageElement = modal.querySelector('img');

    // Populate modal with product details
    productInfo.querySelector('h3').textContent = productCode;
    productInfo.querySelector('p').textContent = productDesc;
    priceInfo1.querySelector('p').textContent = `Price 1: ${productPrice1}`;
    priceInfo2.querySelector('p').textContent = `Price 2: ${productPrice2}`;
    productImageElement.src = productImage;

    modal.style.display = 'block'; // Show modal
}

// Event listener to close modal
document.getElementById('closeModalBtn').addEventListener('click', function () {
    document.getElementById('myModal').style.display = 'none';
});


// Event listener to close modal
document.getElementById('cancelButton').addEventListener('click', function () {
    document.getElementById('myModal').style.display = 'none';
});


// Close modal when clicking outside of it
window.addEventListener('click', function (event) {
    const modal = document.getElementById('myModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Handle the "Add Quantity" button click
document.getElementById('addButton').addEventListener('click', async () => {
    const username = localStorage.getItem('username');
    if (!username) {
        alert('User not logged in');
        return;
    }

    const quantity = parseInt(document.getElementById('quantity').value);
    if (!quantity || quantity <= 0) {
        alert('Invalid quantity. Please enter a valid number.');
        return;
    }

    try {
        const productData = {
            username,
            productCode: document.querySelector('.product-info h3').textContent,
            productDesc: document.querySelector('.product-info p').textContent,
            quantity,
        };

        const response = await fetch('https://backendnyrfestas.vercel.app/add-to-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(productData),
        });

        const result = await response.json();
        alert(result.message || 'Product added successfully!');
        const modal = document.getElementById('myModal');
        modal.style.display = 'none'; 
        
    } catch (error) {
        console.error('Error adding product to order:', error);
        alert('Failed to add product to order.');
    }
});

// Fetch products when the page loads
window.onload = fetchProductData;


