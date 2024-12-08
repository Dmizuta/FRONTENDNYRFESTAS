// API URL for fetching product data
const API_URL = 'https://backendnyrfestas.vercel.app/products'; // Adjust to your live backend URL

// Function to fetch product data from the API
async function fetchProductData() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        // Log the data for debugging purposes
        console.log(data);

        // Map the data into the table
        populateProductTable(data);
    } catch (error) {
        console.error('Error fetching product data:', error);

        // Handle errors and show a user-friendly message in the table
        const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];
        tableBody.innerHTML = '<tr><td colspan="8">Unable to load products at the moment. Please try again later.</td></tr>';
    }
}









// Function to populate the product table dynamically
function populateProductTable(products) {
    const tableBody = document.getElementById('productTable').getElementsByTagName('tbody')[0];

    // Clear any existing rows
    tableBody.innerHTML = '';

    // Loop through the products and add rows
    products.forEach(product => {
        const row = tableBody.insertRow();

        // Create the cells for each column (7 columns)
        const cell1 = row.insertCell(0);  // Image
        const cell2 = row.insertCell(1);  // CodProduto (Product Code)
        const cell3 = row.insertCell(2);  // Descricao (Description)
        const cell4 = row.insertCell(3);  // CxFechada (Closed box quantity)
        const cell5 = row.insertCell(4);  // PrecoFechada (Closed box price)
        const cell6 = row.insertCell(5);  // CxFracionada (Fractional box quantity)
        const cell7 = row.insertCell(6);  // PrecoFracionada (Fractional box price)

        // Fill the cells with the data from the product
        cell1.innerHTML = `<img src="${product.imageUrl || 'https://via.placeholder.com/50'}" alt="Product Image">`;
        cell2.innerHTML = `Code-${product.id}`;  // Assuming 'id' is the product code
        cell3.innerHTML = product.descricao || 'No description available';  // Assuming 'descricao' is the description
        cell4.innerHTML = product.cxfechada || 0;  // If no value, display 0 for closed box quantity
        cell5.innerHTML = `R$ ${product.precofechada ? product.precofechada.toFixed(2) : '0.00'}`;  // Display price for closed box
        cell6.innerHTML = product.cxfracionada || 0;  // If no value, display 0 for fractional box quantity
        cell7.innerHTML = `R$ ${product.precofracionada ? product.precofracionada.toFixed(2) : '0.00'}`;  // Display price for fractional box
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
