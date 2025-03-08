// API URL for fetching product data

// Função para buscar produtos da estação selecionada
async function fetchProductData(epoca) {
    console.log(`Fetching products for season: ${epoca}`); // Log para verificar a estação
    try {
        const response = await fetch(`${URL_API}/products?epoca=${epoca}`); // Adiciona o parâmetro de estação à URL
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
            '<tr><td colspan="7">Não foi possível carregar os produtos, tente novamente mais tarde.</td></tr>';
    }
}




// Select all season icons
const seasonIcons = document.querySelectorAll(".icon-button");

// Function to fetch data and highlight selected icon
function handleSeasonSelection(season, clickedElement) {
    fetchProductData(season);

    // Remove highlight from all icons
    seasonIcons.forEach(icon => icon.classList.remove("selected"));

    // Add highlight to the clicked icon
    clickedElement.classList.add("selected");
}

// Add click event listeners to each icon
document.getElementById("carnaval").addEventListener("click", function() {
    handleSeasonSelection('carnaval', this);
});

document.getElementById("junino").addEventListener("click", function() {
    handleSeasonSelection('junino', this);
});

document.getElementById("hlwn").addEventListener("click", function() {
    handleSeasonSelection('halloween', this);
});

// Auto-select default season on page load with delay
window.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
      document.getElementById("junino").click();
  }, 300); // Delay in milliseconds (500ms = 0.5s)
});



///////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to format numbers as currency (Brazilian Real - R$)
function formatCurrency(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

function populateProductTable(products) {
  const tableBody = document.querySelector("#productTable tbody");

  // Clear any existing rows
  tableBody.innerHTML = "";

  if (products && products.length > 0) {
      products.forEach((product, index) => {
          const row = tableBody.insertRow();

          // Insert cells for each product detail
          const cell1 = row.insertCell(0); // Ascending Index
          const cell2 = row.insertCell(1); // Image
          const cell3 = row.insertCell(2); // Product Code
          const cell4 = row.insertCell(3); // Description
          const cell5 = row.insertCell(4); // Quantity Closed
          const cell6 = row.insertCell(5); // Price Closed
          const cell7 = row.insertCell(6); // Quantity Fractioned
          const cell8 = row.insertCell(7); // Price Fractioned
          const cell9 = row.insertCell(8); // Add Button

          // Populate cells with product data
          cell1.textContent = index + 1; // Ascending index, starting from 1
          cell2.innerHTML = `
              <img src="${product.imagem || "https://via.placeholder.com/50"}" 
                   alt="Product Image"  
                   style="width: 50px; height: 50px; object-fit: cover; transition: transform 0.3s; cursor: pointer;" 
                   onmouseover="this.style.transform='scale(3)'" 
                   onmouseout="this.style.transform='scale(1)'">
          `;
          cell3.textContent = product.codproduto || "N/A"; 
          cell4.textContent = product.descricao || "N/A"; 
          cell5.textContent = product.cxfechada || "N/A"; 
          cell6.textContent = `${formatCurrency(product.precofechada)}`; 
          cell7.textContent = product.cxfracionada || "N/A"; 
          cell8.textContent = `${formatCurrency(product.precofrac)}`; 

          // Accessing `estoque` value to check stock availability
          console.log('ESTOQUE:', product.estoque);

          // Handle the add button based on stock availability
          if (product.estoque === 0) {
              cell9.innerHTML = `
                  <button class="openModalBtn" style="background-color: red; color: white;">ESGOTADO</button>
              `;
          } else {
              cell9.innerHTML = `
                  <button class="openModalBtn" 
                      onmousedown="this.style.transform='scale(0.95)';" 
                      onmouseup="this.style.transform='scale(1)';" 
                      onmouseleave="this.style.transform='scale(1)';">
                      <img src="/imagens/shoppingcart.png" alt="Adicionar">
                  </button>
              `;
          }

          // Add event listener for "Add" button
          const openModalBtn = row.querySelector(".openModalBtn");
          if (openModalBtn) {
              if (product.estoque === 0) {
                  // If the product is out of stock, disable the button by changing its functionality
                  openModalBtn.disabled = true; // Optionally style to show it's disabled
                  openModalBtn.style.cursor = 'not-allowed'; // Change cursor to not-allowed
                  // Optional: Set a click handler that shows a message instead
                  openModalBtn.addEventListener("click", function () {
                      alert("Este produto está esgotado!");
                  });
              } else {
                  // If the product is available, enable the modal opening functionality
                  openModalBtn.addEventListener("click", function () {
                      const productImage = row.querySelector("img").src;
                      const productCode = row.cells[2].textContent;
                      const productDesc = row.cells[3].textContent;
                      const cxFechada = row.cells[4].textContent;
                      const priceFechada = row.cells[5].textContent;
                      const cxFracionada = row.cells[6].textContent;
                      const priceFracionada = row.cells[7].textContent;

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
              }
          }
      });
  } else {
      // No products available message, ensuring colspan matches the number of columns
      tableBody.innerHTML = '<tr><td colspan="9">SELECIONE UMA ESTAÇÃO.</td></tr>';
  }
}




////////////////////////////////////////////////////////////////////////////////////////////////////



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
  priceInfoFechada.querySelector("p").innerHTML = `<span class="label1">Preço Caixa Fechada:</span> <span class="value1">${priceFechada}</span>`;
  priceInfoFracionada.querySelector("p").innerHTML = `<span class="label1">Preço Caixa Fracionada:</span> <span class="value1">${priceFracionada}</span>`;
  cxFechadaInfo.querySelector("p").innerHTML = `<span class="label2">Caixa Fechada:</span> <span class="value2">${cxFechada}</span>`;
  cxFracionadaInfo.querySelector("p").innerHTML = `<span class="label2">Caixa Fracionada:</span> <span class="value2">${cxFracionada}</span>`;
  productImageElement.src = productImage;
  

  modal.style.display = "block"; // Show modal
  

  const quantityInput = (document.getElementById('quantity'));
        
  setTimeout(() => {
    quantityInput.focus();  // Focus on the quantity input field
  }, 100); // Optional: delay slightly to ensure modal is fully displayed before focusing
};






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

////////////////////////////////////////////////////////////////////////////////////////////////////



const addProductToOrder = async () => {
  const customerId = localStorage.getItem("customerId");
  const username = localStorage.getItem("username");
  const userRole = localStorage.getItem("role");

  console.log("Action triggered. User role:", userRole);

  if (!username) {
      alert("NENHUM CADASTRO SELECIONADO.");
      console.log("No username found in localStorage.");
      return;
  }

  // Exibe o modal
  const modal = document.getElementById("myModal");
  modal.style.display = "block"; // Certifique-se de que o modal está visível





  // FOR NON ADMIN USERS
  if (userRole !== "ADMIN") {
    try {
      console.log('Checking cadastro for username:', username);
      const cadastroResponse = await fetch(`${URL_API}/check-cadastro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: username })
      });

      if (!cadastroResponse.ok) {
        alert('POR FAVOR, CADASTRE UM CLIENTE.');
        console.error('Error checking cadastro:', cadastroResponse);
        return;
      }

      const cadastroResult = await cadastroResponse.json();
      console.log('Cadastro check result:', cadastroResult);

      if (cadastroResult.cadastroFilled) {
        console.log('Cadastro is complete, proceeding with adding product to order');
        console.log('Admin adding product for username:', username);
        const customerResponse = await fetch(
          `${URL_API}/get-user-info?customerId=${customerId}`
        );

        if (customerResponse.ok) {
          const customerData = await customerResponse.json();
          console.log("Customer info fetched:", customerData);
          const { username, razaosocial, representante, cnpj } = customerData;

          const productCode = document.querySelector('#codprod').textContent;

          // Fetch product details from the API using the product code
          const productBuyResponse = await fetch(
            `${URL_API}/product-buy/${productCode}`,
            { headers: { "Content-Type": "application/json" } }
          );

          // Parse the JSON response
          const productBuyData = await productBuyResponse.json();

          const product = Array.isArray(productBuyData) ? productBuyData[0] : productBuyData;


          

          // Extract product description and prices

          const productDesc = product.descricao;
          const precofechada = product.precofechada;
          const precofrac = product.precofrac;
          const cxfracionada = product.cxfracionada;
          const cxfechada = product.cxfechada;
          const ipi = product.ipi;

/*
          const productDesc = productBuyData.descricao;
          const precofechada = productBuyData.precofechada;
          const precofrac = productBuyData.precofrac;
          const cxfracionada = productBuyData.cxfracionada;
          const cxfechada = productBuyData.cxfechada;
          const ipi = productBuyData.ipi;*/

          console.log("Product Description:", productDesc, "Preco Fechada:", precofechada, "Preco Frac:", precofrac, "Cx Fechada:", cxfechada, "IPI:", ipi);

          // Validate product details
          if (!productCode || !productDesc || !precofechada || !precofrac || !cxfechada || !cxfracionada) {
            alert("DETALHES DO PEDIDO FALTANDO.");
            console.log("Product details missing:", productCode, productDesc, precofechada, precofrac, cxfechada, ipi);
            return;
          }

          const quantity = parseInt(document.getElementById('quantity').value);

          if (quantity < cxfracionada) {
            alert("QUANTIDADE MÍNIMA NECESSÁRIA!"); // Alert the user
            return; // Exit the function without adding the product
        }

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
            preco: chosenPrice,
            ipi: ipi
          };

          console.log("Admin product data being sent:", productData);

          const addResponse = await fetch(
            `${URL_API}/add-to-order`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(productData),
            }
          );

          const addResult = await addResponse.json();

          if (addResponse.ok) {
            setTimeout(() => {
              let searchInput = document.getElementById('searchInput');
            
              searchInput.focus();      // Refocus on the input
            }, 10);

            alert(addResult.message || "PRODUTO ADICIONADO AO PEDIDO.");
            console.log("Product successfully added to order");
            modal.style.display = "none"; // Oculta o modal
            document.getElementById("quantity").value = ""; // Clear quantity field

          } else {
            console.error("FALHA AO ADICIONAR O PRODUTO:", addResult.error);
            alert(addResult.error || "FALHA AO ADICIONAR O PRODUTO.");
          }
        } else {
          console.error("Failed to fetch customer info:", customerResponse);
          alert("SELECIONE UM CLIENTE PARA ADICIONAR O PRODUTO.");
        }
      } else {
        alert('CADASTRO NÃO PREENCHIDO, NÃO É POSSÍVEL ADICIONAR UM PRODUTO.');
      }
    } catch (error) {
      console.error("Error:", error);
      alert("OCORREU UM ERRO, TENTE NOVAMENTE.");
    }




  } else {
    // FOR ADMIN USERS (no cadastro check)
    try {
      console.log('Admin adding product for username:', username);
      const customerResponse = await fetch(
        `${URL_API}/get-user-info?customerId=${customerId}`
      );

      if (customerResponse.ok) {
       

        const customerData = await customerResponse.json();
        console.log("Customer info fetched:", customerData);
        const { username, razaosocial, representante, cnpj } = customerData;

        const productCode = document.querySelector('#codprod').textContent;

        // Fetch product details from the API using the product code
        const productBuyResponse = await fetch(
          `${URL_API}/product-buy/${productCode}`, 
          { headers: { "Content-Type": "application/json" } }
        );

        // Parse the JSON response
        const productBuyData = await productBuyResponse.json();



        const product = Array.isArray(productBuyData) ? productBuyData[0] : productBuyData;


          

        // Extract product description and prices

        const productDesc = product.descricao;
        const precofechada = product.precofechada;
        const precofrac = product.precofrac;
        //const cxfracionada = product.cxfracionada;
        const cxfechada = product.cxfechada;
        const ipi = product.ipi;



        console.log("Product Data:", productBuyData);
/*
        // Extract product description and prices
        const productDesc = productBuyData.descricao;
        const precofechada = productBuyData.precofechada;
        const precofrac = productBuyData.precofrac;
        const cxfechada = productBuyData.cxfechada;
        const ipi = productBuyData.ipi;

        */
         
        
        

        console.log("Product Description:", productDesc, "Preco Fechada:", precofechada, "Preco Frac:", precofrac, "Cx Fechada:", cxfechada, "Ipi:", ipi);

        // Validate product details
        if (!productCode || !productDesc || !precofechada || !precofrac || !cxfechada) {
          alert("DETALHES DO PRODUTO FALTANDO.");
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
          preco: chosenPrice,
          ipi: ipi,
          
        };

        console.log("Admin product data being sent:", productData);
        console.log('IPI:',ipi);

        const addResponse = await fetch(
          `${URL_API}/add-to-order-admin`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(productData),
          }
        );

        const addResult = await addResponse.json();

        if (addResponse.ok) {

          setTimeout(() => {
            let searchInput = document.getElementById('searchInput');
          
            searchInput.focus();      // Refocus on the input
          }, 10);

          alert(addResult.message || "PRODUTO ADICIONADO AO PEDIDO");
          console.log("Product successfully added to order");
          modal.style.display = "none"; // Oculta o modal
          document.getElementById("quantity").value = ""; // Clear quantity field
        } else {
          console.error("FALHA AO ADICIONAR O PRODUTO:", addResult.error);
          alert(addResult.error || "FALHA AO ADICIONAR O PRODUTO.");
        }
      } else {
        console.error("Failed to fetch customer info:", customerResponse);
        alert("SELECIONE UM CLIENTE PARA ADICIONAR O PRODUTO.");
      }
    } catch (error) {
      console.error("Error:", error);
      alert("OCORREU UM ERRO, TENTE NOVAMENTE.");
    }
  }
};

// Adiciona o evento de clique no botão
document.getElementById("addButton").addEventListener("click", addProductToOrder);


setTimeout(() => {
  let searchInput = document.getElementById('searchInput');

  searchInput.focus();      // Refocus on the input
}, 10);


// Adiciona o evento de pressionar a tecla "Enter"
document.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
        addProductToOrder();
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












////////////////////////////////////////////////////////////////////////////////////////////////////


function searchProducts() {
  const searchQuery = document
    .getElementById("searchInput")
    .value.toLowerCase();
  const tableRows = document.querySelectorAll("#productTable tbody tr");

  tableRows.forEach((row) => {
    const productCode = row.cells[2].textContent.toLowerCase(); // Assuming column 1 is the product code
    const productDescription = row.cells[3].textContent.toLowerCase(); // Assuming column 2 is the product description

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


////////////////////////////////////////////////////////////////////////////////////////////////////



