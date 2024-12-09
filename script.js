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
            
            
            
            
            
            cell1.innerHTML = `<img src="${product.imagem || 'https://via.placeholder.com/50'}" 
                   alt="Product Image" 
                   style="width: 50px; height: 50px; object-fit: cover; transition: transform 0.3s; cursor: pointer;" 
                   onmouseover="this.style.transform='scale(3)'" 
                   onmouseout="this.style.transform='scale(1)'">`;

            
            
            
            
            
            
            
            //cell1.innerHTML = `<img src="${product.imagem || 'https://via.placeholder.com/50'}" alt="Product Image" style="width: 50px; height: 50px; object-fit: cover;">`;  // Image
            cell2.innerHTML = `${product.codproduto}`;  // Product Code
            cell3.innerHTML = product.descricao;  // Description
            cell4.innerHTML = `${product.cxfechada || 'N/A'}`;  // Quantity Closed
            cell5.innerHTML = `R$ ${parseFloat(product.precofechada).toFixed(2)}`;  // Price Closed
            cell6.innerHTML = `${product.cxfracionada || 'N/A'}`;  // Quantity Fractioned
            cell7.innerHTML = `R$ ${parseFloat(product.precofrac).toFixed(2)}`;  // Price Fractioned

            // Add the "View Details" button in the 8th column
            cell8.innerHTML = `<button class="openModalBtn">Add</button>`;

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
const quantityInput = document.getElementById('quantity');
const addButton = document.getElementById('addButton');
const errorMessage = document.createElement("span");
const successMessage = document.createElement("span");

// Error and success messages
errorMessage.style.color = "red";
errorMessage.style.display = "none";
errorMessage.innerText = "Please enter a valid quantity (greater than 0).";
document.querySelector(".modal-buttons").appendChild(errorMessage);

successMessage.style.color = "green";
successMessage.style.display = "none";
successMessage.innerText = "Product added successfully!";
document.querySelector(".modal-buttons").appendChild(successMessage);

// Function to open modal
function openModal(productName, productDesc, productPrice, productImage) {
    const productInfo = modal.querySelector('.modal-stage-one .product-info');
    const priceInfo = modal.querySelector('.modal-stage-one .price-info');
    const productImageElement = modal.querySelector('.modal-stage-one img');
    
    productInfo.querySelector('h3').textContent = productName;
    productInfo.querySelector('p').textContent = productDesc;
    priceInfo.querySelector('p').innerHTML = `<strong>Price: ${productPrice}</strong>`;
    
    // Adjust image size in modal
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

// Validate quantity and show appropriate message when "Add Quantity" is clicked
addButton.addEventListener('click', function() {
    // Clear previous messages
    errorMessage.style.display = "none";
    successMessage.style.display = "none";

    let quantity = quantityInput.value;

    // Check if quantity is a valid positive number
    if (quantity <= 0 || isNaN(quantity) || quantity === "") {
        // Show error message
        errorMessage.style.display = "inline";
    } else {
        // Show success message
        successMessage.style.display = "inline";
        // Add product to order or perform necessary action here
    }
});

// Fetch and populate products when the page loads
window.onload = fetchProductData;


/*
function searchProducts() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.querySelectorAll('#productTable tbody tr');

    tableRows.forEach(row => {
        const productName = row.cells[2].textContent.toLowerCase();  // Assuming column 2 is the product description
        
        if (productName.includes(searchQuery)) {
            row.style.display = ''; // Show row if product matches the search query
        } else {
            row.style.display = 'none'; // Hide row if product doesn't match
        }
        
    });
}*/


function searchProducts() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    const tableRows = document.querySelectorAll('#productTable tbody tr');

    tableRows.forEach(row => {
        const productCode = row.cells[1].textContent.toLowerCase(); // Assuming column 1 is the product code
        const productDescription = row.cells[2].textContent.toLowerCase(); // Assuming column 2 is the product description

        // Check if either the product code or description includes the search query
        if (productCode.includes(searchQuery) || productDescription.includes(searchQuery)) {
            row.style.display = ''; // Show row if either matches
        } else {
            row.style.display = 'none'; // Hide row if neither matches
        }
    });
}


    