// API URL for fetching product data
const API_URL = "https://backendnyrfestas.vercel.app/products"; // Adjust to your live backend URL

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
    console.error("Error fetching product data:", error);

    // Handle errors and show a user-friendly message in the table
    const tableBody = document.querySelector("#productTable tbody");
    tableBody.innerHTML =
      '<tr><td colspan="7">Unable to load products at the moment. Please try again later.</td></tr>';
  }
}

// Function to populate the product table dynamically
function populateProductTable(products) {
  const tableBody = document.querySelector("#productTable tbody");

  // Clear any existing rows
  tableBody.innerHTML = "";

  if (products && products.length > 0) {
    products.forEach((product) => {
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
                <img src="${
                  product.imagem || "https://via.placeholder.com/50"
                }" 
                     alt="Product Image" 
                     style="width: 50px; height: 50px; object-fit: cover; transition: transform 0.3s; cursor: pointer;" 
                     onmouseover="this.style.transform='scale(3)'" 
                     onmouseout="this.style.transform='scale(1)'">
            `;

      cell2.textContent = product.codproduto || "N/A"; // Product Code
      cell3.textContent = product.descricao || "N/A"; // Description
      cell4.textContent = product.cxfechada || "N/A"; // Quantity Closed
      cell5.textContent = `R$ ${parseFloat(product.precofechada).toFixed(2)}`; // Price Closed
      cell6.textContent = product.cxfracionada || "N/A"; // Quantity Fractioned
      cell7.textContent = `R$ ${parseFloat(product.precofrac).toFixed(2)}`; // Price Fractioned
      cell8.innerHTML = `<button class="openModalBtn">Add</button>`;

      // Add event listener for "Add" button
      const openModalBtn = row.querySelector(".openModalBtn");
      openModalBtn.addEventListener("click", function () {
        const productImage = row.querySelector("img").src;
        const productCode = row.cells[1].textContent;
        const productDesc = row.cells[2].textContent;
        const productPrice1 = row.cells[4].textContent;
        const productPrice2 = row.cells[6].textContent;

        openModal(
          productCode,
          productDesc,
          productPrice1,
          productPrice2,
          productImage
        );
      });
    });
  } else {
    // No products available message
    tableBody.innerHTML =
      '<tr><td colspan="7">No products available.</td></tr>';
  }
}

// Function to open the modal with product details
function openModal(
  productCode,
  productDesc,
  productPrice1,
  productPrice2,
  productImage
) {
  const modal = document.getElementById("myModal");
  const productInfo = modal.querySelector(".product-info");
  const priceInfo1 = modal.querySelector(".price1-info");
  const priceInfo2 = modal.querySelector(".price2-info");
  const productImageElement = modal.querySelector("img");

  // Populate modal with product details
  productInfo.querySelector("h3").textContent = productCode;
  productInfo.querySelector("p").textContent = productDesc;
  priceInfo1.querySelector("p").textContent = `Price 1: ${productPrice1}`;
  priceInfo2.querySelector("p").textContent = `Price 2: ${productPrice2}`;
  productImageElement.src = productImage;

  modal.style.display = "block"; // Show modal
}

// Event listener to close modal
document.getElementById("closeModalBtn").addEventListener("click", function () {
  document.getElementById("myModal").style.display = "none";
});

// Event listener to close modal
document.getElementById("cancelButton").addEventListener("click", function () {
  document.getElementById("myModal").style.display = "none";
});

// Close modal when clicking outside of it
window.addEventListener("click", function (event) {
  const modal = document.getElementById("myModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});




// ADD PRODUCT FUNCTION

document.getElementById("addButton").addEventListener("click", async () => {
    const customerId = localStorage.getItem("customerId");
    const username = localStorage.getItem("username");
  
    if (!username) {
      alert("No customer selected");
      return;
    }
  
    try {
      // First, check if the user has a completed cadastro
      console.log('Checking cadastro for username:', username);
      const cadastroResponse = await fetch('https://backendnyrfestas.vercel.app/check-cadastro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username })
      });
  
      if (!cadastroResponse.ok) {
        alert("Por favor preencha seu Cadastro.");
        console.error("Error checking cadastro:", cadastroResponse);
        return;
      }
  
      const cadastroResult = await cadastroResponse.json();
      console.log("Cadastro check result:", cadastroResult);
  
      if (cadastroResult.cadastroFilled) {
        // Cadastro is complete, proceed with adding the product to the order
        console.log("Cadastro is complete, proceeding with adding product to order");
  
        // Fetch customer info (e.g., razaosocial)
        console.log("Fetching customer info for customerId:", customerId);
        const customerResponse = await fetch(
          `https://backendnyrfestas.vercel.app/get-user-info?customerId=${customerId}`
        );
  
        if (customerResponse.ok) {
          const customerData = await customerResponse.json();
          console.log("Customer info fetched:", customerData);
          const { razaosocial } = customerData;
  
          // Fetch product details from modal
          const productName = document.querySelector("#codprod").textContent;
          const productDesc = document.querySelector("#descrip").textContent;
          const productPrice = document.querySelector("#preco1").textContent; // Assuming price is in this element
  
          const quantity = parseInt(document.getElementById("quantity").value);
  
          const productData = {
            username: username,
            customerId: customerId,  // Send customerId instead of username
            razaosocial: razaosocial,
            codproduto: productName, // Assuming the product code is productName (can be changed if needed)
            descricao: productDesc,
            quantidade: quantity,
            preco: productPrice,
          };
  
          // Log the product data to be sent
          console.log("Sending product data to add to order:", productData);
  
          const addResponse = await fetch(
            "https://backendnyrfestas.vercel.app/add-to-order",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(productData),
            }
          );
  
          const addResult = await addResponse.json(); // Parse the response body as JSON
  
          if (addResponse.ok) {
            alert(addResult.message || "Product added to existing draft order");
            console.log("Product successfully added to order");
            const modal = document.getElementById("myModal");
            modal.style.display = "none";
            // Optionally clear the form fields
            document.getElementById("quantity").value = ""; // Clear quantity field
          } else {
            // If the response is not ok, show the error message from the backend
            console.error("Failed to add product to order:", addResult.error);
            alert(addResult.error || "Failed to add product to order.");
          }
        } else {
          console.error("Failed to fetch customer info:", customerResponse);
          alert("Failed to fetch customer info");
        }
      } else {
        // If cadastro is incomplete or not found, show alert
        alert(cadastroResult.error || "Unknown error with cadastro");
        console.error("Cadastro incomplete or error:", cadastroResult.error);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong, please try again later");
    }
  });
  





/*
// ADD PRODUCT FUNCTION
document.getElementById("addButton").addEventListener("click", async () => {
  const customerId = localStorage.getItem("customerId");
  const username = localStorage.getItem("username");

  if (!customerId) {
    alert("No customer selected");
    return;
  }

  try {
    // Step 1: Check Cadastro
    console.log("Checking cadastro for username:", username);
    const cadastroResponse = await fetch('https://backendnyrfestas.vercel.app/check-cadastro', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    });

    if (!cadastroResponse.ok) {
      const errorResult = await cadastroResponse.json();
      alert(errorResult.message || "Favor preencher seu Cadastro.");
      console.error("Error checking cadastro:", errorResult.error);
      return;
    }

    const cadastroResult = await cadastroResponse.json();
    console.log("Cadastro check result:", cadastroResult);

    if (!cadastroResult.cadastroFilled) {
      alert("Cadastro incompleto. Favor completar antes de continuar.");
      return;
    }

    // Step 2: Fetch Customer Info
    console.log("Fetching customer info for customerId:", customerId);
    const customerResponse = await fetch(
      `https://backendnyrfestas.vercel.app/get-user-info?customerId=${customerId}`
    );

    if (!customerResponse.ok) {
      const errorResult = await customerResponse.json();
      alert(errorResult.message || "Failed to fetch customer info.");
      console.error("Error fetching customer info:", errorResult.error);
      return;
    }

    const customerData = await customerResponse.json();
    console.log("Customer info fetched:", customerData);
    const { razaosocial } = customerData;

    // Step 3: Prepare Product Data
    const productName = document.querySelector("#codprod").textContent;
    const productDesc = document.querySelector("#descrip").textContent;
    const productPrice = document.querySelector("#preco1").textContent;
    const quantity = parseInt(document.getElementById("quantity").value);

    const productData = {
      username,
      customerId,
      razaosocial,
      codproduto: productName,
      descricao: productDesc,
      quantidade: quantity,
      preco: productPrice,
    };

    console.log("Sending product data to add to order:", productData);

    // Step 4: Add Product to Order
    const addResponse = await fetch(
      "https://backendnyrfestas.vercel.app/add-to-order",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      }
    );

    const addResult = await addResponse.json();

    if (addResponse.ok) {
      alert(addResult.message); // Success message from backend
      console.log("Product successfully added to order");
      const modal = document.getElementById("myModal");
      modal.style.display = "none";
      document.getElementById("quantity").value = ""; // Clear quantity field
    } else {
      alert(addResult.message || "Failed to add product to order.");
      console.error("Failed to add product to order:", addResult.error);
    }
  } catch (error) {
    console.error("Unexpected error:", error);
    alert("Something went wrong, please try again later.");
  }
});



// ADD PRODUCT FUNCTION

document.getElementById('addButton').addEventListener('click', async () => {
    const username = localStorage.getItem("username");  // Get the username from localStorage
    

    if (!username) {
        alert('User not logged in');
        return;
    }

    try {
        // First, check if the user has a completed cadastro
        console.log('Checking cadastro for username:', username);
        const cadastroResponse = await fetch('https://backendnyrfestas.vercel.app/check-cadastro', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: username })
        });

        if (!cadastroResponse.ok) {
            alert('Favor preencher seu Cadastro.');
            console.error('Error checking cadastro:', cadastroResponse);
            return;
        }

        const cadastroResult = await cadastroResponse.json();
        console.log('Cadastro check result:', cadastroResult);

        if (cadastroResult.cadastroFilled) {
            // Cadastro is complete, proceed with adding the product to the order
            console.log('Cadastro is complete, proceeding with adding product to order');

            // Fetch user info (e.g., razaosocial)
            console.log('Fetching user info for username:', username);
            const userResponse = await fetch(`https://backendnyrfestas.vercel.app/get-user-info?username=${username}`);

            if (userResponse.ok) {
                const userData = await userResponse.json();
                console.log('User info fetched:', userData);
                const { razaosocial } = userData;

                // Fetch product details from modal
                const productName = document.querySelector('#codprod').textContent;
                const productDesc = document.querySelector('#descrip').textContent;
                const productPrice = document.querySelector('#preco1').textContent;//replace('Price: ', '').trim());
                
                const quantity = parseInt(document.getElementById('quantity').value);

                const productData = {
                    username: username,
                    razaosocial: razaosocial,
                    codproduto: productName,  // Assuming the product code is productName (can be changed if needed)
                    descricao: productDesc,
                    quantidade: quantity,
                    preco: productPrice
                };

                // Log the product data to be sent
                console.log('Sending product data to add to order:', productData);

                const addResponse = await fetch('https://backendnyrfestas.vercel.app/add-to-order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(productData)
                });

                const addResult = await addResponse.json();
                console.log('Add product result:', addResult);

                if (addResponse.ok) {
                    alert(addResult.message); // "Product added to existing draft order" or "New draft order created"
                    console.log('Product successfully added to order');
                    const modal = document.getElementById('myModal');
                    modal.style.display = 'none'; 
                    // Optionally clear the form fields
                    document.getElementById('quantity').value = '';  // Clear quantity field
                } else {
                    console.error('Failed to add product to order:', addResult.error);
                    alert('Failed to add product to order');
                }
            } else {
                console.error('Failed to fetch user info:', userResponse);
                alert('Failed to fetch user info');
            }
        } else {
            // If cadastro is incomplete or not found, show alert
            alert(cadastroResult.error || 'Unknown error with cadastro');
            console.error('Cadastro incomplete or error:', cadastroResult.error);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Something went wrong, please try again later');
    }
});



*/

// Fetch products when the page loads
window.onload = fetchProductData;

window.onload = function () {
  const userid = localStorage.getItem("username");

  document.getElementById("username-display").textContent = `Hello, ${userid}`;
};

// Fetch and populate products when the page loads
window.onload = fetchProductData;

function searchProducts() {
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const tableRows = document.querySelectorAll("#productTable tbody tr");

  tableRows.forEach((row) => {
    const productCode = row.cells[1].textContent.toLowerCase(); // Assuming column 1 is the product code
    const productDescription = row.cells[2].textContent.toLowerCase(); // Assuming column 2 is the product description

    // Check if either the product code or description includes the search query
    if (
      productCode.includes(searchQuery) ||
      productDescription.includes(searchQuery)
    ) {
      row.style.display = ""; // Show row if either matches
    } else {
      row.style.display = "none"; // Hide row if neither matches
    }
  });
}
/*
async function handleLogin(username, password) {
  const response = await fetch("/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ username, password }),
  });

  const data = await response.json();

  if (data.success) {
    // If login is successful, store login data in localStorage
    localStorage.setItem("username", data.user.username); // Storing the username
    // Optionally, you can store additional data like user ID or a session token here

    alert("Login successful!");
    window.location.href = "/home"; // Redirect the user to the homepage or dashboard
  } else {
    alert(data.message); // Show error message if login failed
  }
}*/
