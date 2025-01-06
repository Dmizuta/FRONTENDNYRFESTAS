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

// Function to format numbers as currency (Brazilian Real - R$)
function formatCurrency(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
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
      const cell8 = row.insertCell(7); // ADD BUTTON
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
      cell5.textContent = `${formatCurrency(product.precofechada)}`; // Price Closed
     //cell5.textContent = `R$ ${parseFloat(product.precofechada).toFixed(2)}`; // Price Closed
      cell6.textContent = product.cxfracionada || "N/A"; // Quantity Fractioned
      cell7.textContent = `${formatCurrency(product.precofrac)}`; // Price Fractioned
      //cell7.textContent = `R$ ${parseFloat(product.precofrac).toFixed(2)}`; // Price Fractioned
      cell8.innerHTML = `<button class="openModalBtn">Add</button>`;



      
      // Add event listener for "Add" button
      const openModalBtn = row.querySelector(".openModalBtn");
      openModalBtn.addEventListener("click", function () {
        const productImage = row.querySelector("img").src;
        const productCode = row.cells[1].textContent;
        const productDesc = row.cells[2].textContent;
        const cxFechada = row.cells[3].textContent;
        const priceFechada = row.cells[4].textContent;
        const cxFracionada = row.cells[5].textContent;
        const priceFracionada = row.cells[6].textContent;

       openModal(
          productImage,
          productCode,
          productDesc,
          cxFechada,
          priceFechada,
          cxFracionada,
          priceFracionada
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
  productImage,
  productCode,
  productDesc,
  cxFechada,
  priceFechada,
  cxFracionada,
  priceFracionada
)
 {
  const modal = document.getElementById("myModal");
  const productInfo = modal.querySelector(".product-info");
  const priceInfoFechada = modal.querySelector(".price1-info");
  const priceInfoFracionada = modal.querySelector(".price2-info");
  const cxFechadaInfo = modal.querySelector(".cxfechada-info");
  const cxFracionadaInfo = modal.querySelector(".cxfracionada-info");
  const productImageElement = modal.querySelector("img");
  
  // Populate modal with product details
  productInfo.querySelector("h3").textContent = productCode;
  productInfo.querySelector("p").textContent = productDesc;
  priceInfoFechada.querySelector("p").textContent = `Preço Caixa Fechada: ${priceFechada}`;
  priceInfoFracionada.querySelector("p").textContent = `Preço Caixa Fracionada: ${priceFracionada}`;
  cxFechadaInfo.querySelector("p").textContent = `Caixa Fechada: ${cxFechada}`; // Corrected
  cxFracionadaInfo.querySelector("p").textContent = `Caixa Fracionada: ${cxFracionada}`; // Corrected
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

/*// Close modal when clicking outside of it
window.addEventListener("click", function (event) {
  const modal = document.getElementById("myModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});*/







//ADD PRODUCT TO ORDER
document.getElementById("addButton").addEventListener("click", async () => {
  const customerId = localStorage.getItem("customerId");
  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("role");

  console.log("Button clicked. User role:", userRole);

  if (!username) {
    alert("No customer selected");
    console.log("No username found in localStorage.");
    return;
  }








  console.log("HERE!!!", userRole);

// FOR NON ADMIN USERS
if (userRole !== "ADMIN") {
  try {
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
      console.log('Cadastro is complete, proceeding with adding product to order');
      console.log('Admin adding product for username:', username);
      const customerResponse = await fetch(
        `https://backendnyrfestas.vercel.app/get-user-info?customerId=${customerId}`
      );

      if (customerResponse.ok) {
        const customerData = await customerResponse.json();
        console.log("Customer info fetched:", customerData);
        const { username, razaosocial, representante, cnpj } = customerData;

        const productCode = document.querySelector('#codprod').textContent;

        // Fetch product details from the API using the product code
        const productBuyResponse = await fetch(
          `https://backendnyrfestas.vercel.app/product-buy/${productCode}`,
          { headers: { "Content-Type": "application/json" } }
        );

        // Parse the JSON response
        const productBuyData = await productBuyResponse.json();
        console.log("Product Data:", productBuyData);

        // Extract product description and prices
        const productDesc = productBuyData.descricao;
        const precofechada = productBuyData.precofechada;
        const precofrac = productBuyData.precofrac;
        const cxfechada = productBuyData.cxfechada;

        console.log("Product Description:", productDesc, "Preco Fechada:", precofechada, "Preco Frac:", precofrac, "Cx Fechada:", cxfechada);

        // Validate product details
        if (!productCode || !productDesc || !precofechada || !precofrac|| !cxfechada) {
          alert("Product details are missing or incorrect.");
          console.log("Product details missing:", productCode, productDesc, precofechada, precofrac, cxfechada);
          return;
        }

        const quantity = parseInt(document.getElementById('quantity').value);

        // Choose the correct price based on the quantity
        const chosenPrice = (quantity >= cxfechada) ? precofechada : precofrac;

        const productData = {
          username: username,
          representante: representante,
          cnpj: cnpj,
          customerId: customerId,
          razaosocial: razaosocial,
          codproduto: productCode,
          descricao: productDesc,
          quantidade: quantity,
          preco: chosenPrice
        };

        console.log("Admin product data being sent:", productData);

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
          alert(addResult.message || "Product added to existing draft order");
          console.log("Product successfully added to order");
          const modal = document.getElementById("myModal");
          modal.style.display = "none";
          document.getElementById("quantity").value = ""; // Clear quantity field
        } else {
          console.error("Failed to add product to order:", addResult.error);
          alert(addResult.error || "Failed to add product to order.");
        }
      } else {
        console.error("Failed to fetch customer info:", customerResponse);
        alert("SELECIONE UM CADASTRO PARA ADICIONAR O PRODUTO.");
      }
    } else {
      alert('Cadastro not filled, cannot add product.');
    }
  } catch (error) {
    console.error("Error:", error);
    alert("Something went wrong, please try again later");
  }
}

  
  else {
    // FOR ADMIN USERS (no cadastro check)

    try {
      console.log('Admin adding product for username:', username);
      const customerResponse = await fetch(
        `https://backendnyrfestas.vercel.app/get-user-info?customerId=${customerId}`
      );

      if (customerResponse.ok) {
        const customerData = await customerResponse.json();
        console.log("Customer info fetched:", customerData);
        const { username, razaosocial, representante, cnpj } = customerData;

        const productCode = document.querySelector('#codprod').textContent;

        
          // Fetch product details from the API using the product code

  const productBuyResponse = await fetch(
      `https://backendnyrfestas.vercel.app/product-buy/${productCode}`, 
      { headers: { "Content-Type": "application/json" } }
  );



  // Parse the JSON response
  const productBuyData = await productBuyResponse.json();
  console.log("Product Data:", productBuyData);









// Extract product description and prices
const productDesc = productBuyData.descricao;
const precofechada = productBuyData.precofechada;
const precofrac = productBuyData.precofrac;
const cxfechada = productBuyData.cxfechada;

console.log("Product Description:", productDesc, "Preco Fechada:", precofechada, "Preco Frac:", precofrac, "Cx Fechada:", cxfechada);

// Validate product details
if (!productCode || !productDesc || !precofechada || !precofrac|| !cxfechada) {
  alert("Product details are missing or incorrect.");
  console.log("Product details missing:", productCode, productDesc, precofechada, precofrac, cxfechada);
  return;
}

const quantity = parseInt(document.getElementById('quantity').value);

// Choose the correct price based on the quantity
const chosenPrice = (quantity >= cxfechada) ? precofechada : precofrac;

       
const productData = {
  username: username,
  representante: representante,
  cnpj: cnpj,
  customerId: customerId,
  razaosocial: razaosocial,
  codproduto: productCode,
  descricao: productDesc,
  quantidade: quantity,
  preco: chosenPrice
};
     

        console.log("Admin product data being sent:", productData);
        

        const addResponse = await fetch(
          "https://backendnyrfestas.vercel.app/add-to-order-admin",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          }
        );

        const addResult = await addResponse.json();

        if (addResponse.ok) {
          alert(addResult.message || "Product added to existing draft order");
          console.log("Product successfully added to order");
          const modal = document.getElementById("myModal");
          modal.style.display = "none";
          document.getElementById("quantity").value = ""; // Clear quantity field
        } else {
          console.error("Failed to add product to order:", addResult.error);
          alert(addResult.error || "Failed to add product to order.");
        }
      } else {
        console.error("Failed to fetch customer info:", customerResponse);
        alert("SELECIONE UM CLIENTE PARA ADICIONAR O PRODUTO.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong, please try again later");
    }
  }
});




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
