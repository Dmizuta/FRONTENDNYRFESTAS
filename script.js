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








document.getElementById('addButton').addEventListener('click', async () => {
    const username = localStorage.getItem("username");  // Get the username from localStorage

    try {
        // First, check if the user has a completed cadastro
        const cadastroResponse = await fetch('https://backendnyrfestas.vercel.app/check-cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username })
        });

        const cadastroResult = await cadastroResponse.json();

        if (cadastroResponse.ok && cadastroResult.cadastroFilled) {
            // Cadastro is complete, proceed with adding the product to the order

            // Fetch user info (e.g., razaosocial)
            const userResponse = await fetch(`https://backendnyrfestas.vercel.app/get-user-info?username=${username}`);
            
            if (userResponse.ok) {
                const userData = await userResponse.json();
                const { razaosocial } = userData;



                const productData = {

                    username: username,
                    razaosocial: razaosocial,
                    codproduto : document.getElementById('productCode').value,
                    descricao : document.getElementById('productDescription').value,
                    quantidade : parseInt(document.getElementById('quantity').value),
                    preco : parseFloat(document.getElementById('price').value),
                };

                const addResponse = await fetch('https://backendnyrfestas.vercel.app/add-to-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });

                const addResult = await addResponse.json();

                if (addResponse.ok) {
                    alert(addResult.message); // "Product added to existing draft order" or "New draft order created"
                } else {
                    console.error(addResult.error);
                    alert('Failed to add product to order');
                }
            } else {
                console.error('Failed to fetch user info');
                alert('Failed to fetch user info');
            }
        } else {
            // If cadastro is incomplete or not found, show alert
            alert(cadastroResult.error || 'Unknown error with cadastro');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});











/*


document.getElementById('addButton').addEventListener('click', async () => {
    const username = localStorage.getItem("username");  // Get the username from localStorage

    try {
        // Fetch user info from the backend (razaosocial and username)
        const response = await fetch(`https://backendnyrfestas.vercel.app/get-user-info?username=${username}`);
        
        // Check if the response is okay
        if (response.ok) {
            const userData = await response.json();
            
            // Log the fetched user data to the console
            console.log("Fetched user data:", userData);
            
            // Extract razaosocial and username from the response
            const { razaosocial } = userData;

            const productData = {
                username: username,
                razaosocial: razaosocial,  // Use the fetched razaosocial
                codproduto: 'P001',
                descricao: 'Product Example',
                quantidade: 2,
                preco: 100
            };

            // Now send the product data to the backend
            const addResponse = await fetch('https://backendnyrfestas.vercel.app/add-to-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(productData)
            });

            const addResult = await addResponse.json();

            if (addResponse.ok) {
                alert(`Product added to order! Order ID: ${addResult.orderId}`);
            } else {
                console.error(addResult.error);
                alert('Failed to add product to order');
            }
        } else {
            console.error('Failed to fetch user info');
            alert('Failed to fetch user info');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred');
    }
});

*/














window.onload = function() {
    const username = localStorage.getItem('username');
   
        document.getElementById('username-display').textContent = `Hello, ${username}`;
    
    
};








// Fetch and populate products when the page loads
window.onload = fetchProductData;





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



async function handleLogin(username, password) {
    const response = await fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (data.success) {
        // If login is successful, store login data in localStorage
        localStorage.setItem('username', data.user.username); // Storing the username
        // Optionally, you can store additional data like user ID or a session token here

        alert("Login successful!");
        window.location.href = '/home'; // Redirect the user to the homepage or dashboard
    } else {
        alert(data.message); // Show error message if login failed
    }
}


    









