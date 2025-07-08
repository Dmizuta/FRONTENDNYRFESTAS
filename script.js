

// Function to fetch product data for the selected season
async function fetchProductData(epoca) {
  console.log(`Fetching products for season: ${epoca}`);

  try {
      const response = await fetch(`${URL_API}/products?epoca=${epoca}`);
      if (!response.ok) throw new Error("Failed to fetch");

      const data = await response.json();
      console.log("Fetched data:", data);

      const tableBody = document.querySelector("#productTable tbody");

      if (Array.isArray(data) && data.length > 0) {
          populateProductTable(data);
      } else {
          console.warn("No products found for this season.");
          tableBody.innerHTML =
              '<tr><td colspan="7">Nenhum produto encontrado para esta estação.</td></tr>';
      }
  } catch (error) {
      console.error("Error fetching product data:", error);
      document.querySelector("#productTable tbody").innerHTML =
          '<tr><td colspan="7">Erro ao carregar os produtos. Tente novamente mais tarde.</td></tr>';
  }
}



///////////////////////////////////////////////////////////////////////////////////////////////////////
// Select all season icons
const seasonIcons = document.querySelectorAll(".icon-button");

// Function to fetch data and highlight selected icon


function handleSeasonSelection(season, clickedElement) {
  fetchProductData(season);
  updateBackground(season); // <- Adiciona essa linha aqui 👇

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

document.getElementById("icon-hlwn").addEventListener("click", function() {
  handleSeasonSelection('halloween', this);
});

document.getElementById("icon-copa").addEventListener("click", function() {
  handleSeasonSelection('copa', this);
});

/*
document.getElementById("hlwn").addEventListener("click", function() {
  alert("Em breve Halloween disponível! 🎃👻");
});*/


// Auto-select default season on page load with delay
window.addEventListener("load", () => {
  setTimeout(() => {
      const hlwnButton = document.getElementById("icon-hlwn");
      if (hlwnButton) {
          hlwnButton.click();
      } else {
          console.error("hlwn button not found!");
      }
  }, 200);
});

///////////////////////////////////////////////////////////////////////////////////////////////////////

const backgroundImages = {
  carnaval: "/imagens/festa-1.jpg",
  junino: "/imagens/junino-1.jpg",
  halloween: "/imagens/hlwn-1.jpg",
  copa: "/imagens/copa-1.jpg"
};

function updateBackground(season) {
  const imageUrl = backgroundImages[season];
  if (imageUrl) {
    document.body.style.backgroundImage = `url('${imageUrl}')`;
    document.body.style.backgroundPosition = "center 100px";
  } else {
    console.warn(`No background image found for season: ${season}`);
  }
}




///////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to format numbers as currency (Brazilian Real - R$)
function formatCurrency(value) {
return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

///////////////////////////////////////////////////////////////////////////////////////////////////////

// Function to populate the product table
function populateProductTable(products) {
  const tableBody = document.querySelector("#productTable tbody");
  
  const userRole = localStorage.getItem("role");

  // Clear any existing rows
  tableBody.innerHTML = "";

  if (products && products.length > 0) {
      products.forEach((product, index) => {
          const row = tableBody.insertRow();

          // Insert cells for each product detail
          const cell1 = row.insertCell(0); // Ascending Index
          cell1.classList.add("index-cell"); // Add class for styling
          const cell2 = row.insertCell(1); // Image
          const cell3 = row.insertCell(2); // Product Code
          const cell4 = row.insertCell(3); // Description
          const cell5 = row.insertCell(4); // Quantity Closed
          cell5.classList.add("quantityClosed-cell"); // Add class for styling
          const cell6 = row.insertCell(5); // Price Closed
          const cell7 = row.insertCell(6); // Quantity Fractioned
          cell7.classList.add("quantityFractioned-cell"); // Add class for styling
          const cell8 = row.insertCell(7); // Price Fractioned
          const cell9 = row.insertCell(8); // Add Button

          // Populate cells with product data
          cell1.textContent = index + 1;
          cell2.innerHTML = `
              <img src="${product.imagem || "https://via.placeholder.com/50"}" 
                   alt="Product Image"
                   loading="lazy"  
                   style="width: 50px; height: 50px; object-fit: cover; transition: transform 0.3s; cursor: zoom-in;" 
                   onmouseover="this.style.transform='scale(3)'" 
                   onmouseout="this.style.transform='scale(1)'">
          `;
          cell3.textContent = product.codproduto || "N/A";
          cell4.textContent = product.descricao || "N/A";
          cell5.textContent = product.cxfechada || "N/A";
          cell6.textContent = `${formatCurrency(product.precofechada)}`;
          cell7.textContent = product.cxfracionada || "N/A";
          cell8.textContent = `${formatCurrency(product.precofrac)}`;

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
              if (product.estoque === 0 && userRole !== "ADMIN") {
                  openModalBtn.disabled = true;
                  openModalBtn.style.cursor = 'not-allowed';
                  openModalBtn.addEventListener("click", function () {
                      alert("Este produto está esgotado!");
                  });
              } else {
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
                          priceFracionada,
                          product.estoque // Pass estoque value
                      );
                  });
              }
          }
      });
  } else {
      tableBody.innerHTML = '<tr><td colspan="9">SELECIONE UMA ESTAÇÃO.</td></tr>';
  }
}






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// Function to open the modal with product details
function openModal(
  productImage,
  productCode,
  productDesc,
  cxFechada,
  priceFechada,
  cxFracionada,
  priceFracionada,
  estoque
) {
  const modal = document.getElementById("myModal");
  const productInfo = modal.querySelector(".product-info");
  const priceInfoFechada = modal.querySelector(".price1-info");
  const priceInfoFracionada = modal.querySelector(".price2-info");
  const cxFechadaInfo = modal.querySelector(".cxfechada-info");
  const cxFracionadaInfo = modal.querySelector(".cxfracionada-info");
  const productImageElement = modal.querySelector("img");
  const stockControl = modal.querySelector(".stock-control");
  const stockCheckbox = modal.querySelector("#stockCheckbox");






  // Populate modal with product details
  productInfo.querySelector("h3").textContent = productCode;
  productInfo.querySelector("p").textContent = productDesc;
  priceInfoFechada.querySelector("p").innerHTML = `<span class="label1">Preço Caixa Fechada:</span> <span class="value1">${priceFechada}</span>`;
  priceInfoFracionada.querySelector("p").innerHTML = `<span class="label1">Preço Caixa Fracionada:</span> <span class="value1">${priceFracionada}</span>`;
  cxFechadaInfo.querySelector("p").innerHTML = `<span class="label2">Caixa Fechada:</span> <span class="value2">${cxFechada}</span>`;
  cxFracionadaInfo.querySelector("p").innerHTML = `<span class="label2">Caixa Fracionada:</span> <span class="value2">${cxFracionada}</span>`;
  productImageElement.src = productImage;

  // Set checkbox state based on estoque
  stockCheckbox.checked = estoque === 1;
  stockCheckbox.setAttribute("data-product-code", productCode); // Add data attribute to track product

  // Show checkbox only for Admin
  const role = localStorage.getItem("role");
  stockControl.style.display = role === "ADMIN" ? "block" : "none";

  //modal.style.display = "block";



  // After showing the modal
modal.style.display = "block";

// Focus the quantity input
setTimeout(() => {
  const quantityInput = modal.querySelector("#quantity");
  if (quantityInput) quantityInput.focus();
}, 50);




  // Attach event listener to checkbox inside modal
  stockCheckbox.addEventListener("change", handleStockChange);
}

// Function to handle checkbox change
function handleStockChange(event) {
  const checkbox = event.target;
  const productCode = checkbox.getAttribute("data-product-code");
  const isChecked = checkbox.checked ? 1 : 0;

  updateStock(productCode, isChecked);
}

// Function to update stock in backend
async function updateStock(productCode, estoque) {
  try {
      const response = await fetch(`${URL_API}/update-stock`, {
          method: "POST",
          headers: {
              "Content-Type": "application/json",
          },
          body: JSON.stringify({ productCode, estoque }),
      });

      if (!response.ok) {
          throw new Error("Failed to update stock");
      }

      alert("Estoque atualizado com sucesso!");
      location.reload(); // Reload the page after confirmation
  } catch (error) {
      console.error("Erro ao atualizar estoque:", error);
      alert("Erro ao atualizar estoque!");
  }
}


/*
// Function to open the modal with product details
function openModal(
  productImage,
  productCode,
  productDesc,
  cxFechada,
  priceFechada,
  cxFracionada,
  priceFracionada,
  estoque
) {
  const modal = document.getElementById("myModal");
  const productInfo = modal.querySelector(".product-info");
  const priceInfoFechada = modal.querySelector(".price1-info");
  const priceInfoFracionada = modal.querySelector(".price2-info");
  const cxFechadaInfo = modal.querySelector(".cxfechada-info");
  const cxFracionadaInfo = modal.querySelector(".cxfracionada-info");
  const productImageElement = modal.querySelector("img");
  const stockControl = modal.querySelector(".stock-control");
  const stockCheckbox = modal.querySelector("#stockCheckbox");

  // Populate modal with product details
  productInfo.querySelector("h3").textContent = productCode;
  productInfo.querySelector("p").textContent = productDesc;
  priceInfoFechada.querySelector("p").innerHTML = `<span class="label1">Preço Caixa Fechada:</span> <span class="value1">${priceFechada}</span>`;
  priceInfoFracionada.querySelector("p").innerHTML = `<span class="label1">Preço Caixa Fracionada:</span> <span class="value1">${priceFracionada}</span>`;
  cxFechadaInfo.querySelector("p").innerHTML = `<span class="label2">Caixa Fechada:</span> <span class="value2">${cxFechada}</span>`;
  cxFracionadaInfo.querySelector("p").innerHTML = `<span class="label2">Caixa Fracionada:</span> <span class="value2">${cxFracionada}</span>`;
  productImageElement.src = productImage;

  // Set checkbox state based on estoque
  stockCheckbox.checked = estoque === 1;

  // Show checkbox only for Admin
  const role = localStorage.getItem("role");
  if (role === "ADMIN") {
      stockControl.style.display = "block";
  } else {
      stockControl.style.display = "none";
  }

  modal.style.display = "block";

  const quantityInput = document.getElementById("quantity");
  setTimeout(() => {
      quantityInput.focus();
  }, 100);
}



document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("productModal");

  modal.addEventListener("change", function (event) {
      if (event.target.classList.contains("stockCheckbox")) {
          const productCode = event.target.dataset.productCode;
          const isChecked = event.target.checked ? 1 : 0;

          updateStock(productCode, isChecked);
      }
  });
});

*/


// Existing close modal listeners (unchanged)
document.getElementById("closeModalBtn").addEventListener("click", function () {
  document.getElementById("myModal").style.display = "none";
});

document.getElementById("cancelButton").addEventListener("click", function () {
  document.getElementById("myModal").style.display = "none";
});

window.addEventListener("click", function (event) {
  const modal = document.getElementById("myModal");
  if (event.target === modal) {
      modal.style.display = "none";
  }
});

// Add logic for the "Adicionar" button
document.getElementById("addButton").addEventListener("click", function () {
  const quantity = document.getElementById("quantity").value;
  const productCode = document.querySelector("#codprod").textContent;
  const role = localStorage.getItem("role");
  const stockCheckbox = document.getElementById("stockCheckbox");

  // Your existing add-to-order logic here (if any)
  console.log(`Adding ${quantity} of ${productCode} to order`);

  // If Admin, check if stock changed and update
  if (role === "Admin") {
      const newStockValue = stockCheckbox.checked ? 1 : 0;
      updateStock(productCode, newStockValue);
  } else {
      document.getElementById("myModal").style.display = "none";
  }
});
/*
// Function to update stock via API
function updateStock(productCode, estoque) {
  fetch(`${URL_API}/update-stock`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productCode, estoque }),
  })
      .then(response => response.json())
      .then(data => {
          if (data.success) {
              alert(`Estoque atualizado: Produto agora está ${estoque ? "em estoque" : "esgotado"}`);
              window.location.reload(); // Reload page after alert
          } else {
              alert("Erro ao atualizar o estoque");
          }
      })
      .catch(error => {
          console.error("Erro:", error);
          alert("Erro ao atualizar o estoque");
      });
}
*/
/*
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
*/



////////////////////////////////////////////////////////////////////////////////////////////////////////////

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

console.log("SO FAR SO GOOD");

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



        console.log("Product Description:", productDesc, "Preco Fechada:", precofechada, "Preco Frac:", precofrac, "Cx Fechada:", cxfechada, "IPI:", ipi);

        // Validate product details
        if (!productCode || !productDesc || !precofechada || !precofrac || !cxfechada || !cxfracionada) {
          alert("DETALHES DO PEDIDO FALTANDO.");
          console.log("Product details missing:", productCode, productDesc, precofechada, precofrac, cxfechada, ipi);
          return;
        }

        const quantity = parseInt(document.getElementById('quantity').value);


     // Validate quantity is not 0 or NaN
     if (isNaN(quantity) || quantity <= 0) {
      alert("QUANTIDADE INVÁLIDA, INSIRA UM VALOR VÁLIDO.");
      console.log("Invalid quantity:", quantity);
      return;
  }




        if (quantity < cxfracionada) {
          alert("NECESSÁRIO QUANTIDADE MÍNIMA!"); // Alert the user
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


          document.getElementById("searchInput").value = ""; // Clear search input
          document.getElementById("searchInput").focus(); // Refocus on the search input


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
      const cxfracionada = product.cxfracionada;
      const cxfechada = product.cxfechada;
      const ipi = product.ipi;



      console.log("Product Data:", productBuyData);

       
      
      

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

      
        document.getElementById("searchInput").value = ""; // Clear search input
        document.getElementById("searchInput").focus(); // Refocus on the search input

      
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
  const modal = document.getElementById("myModal");
  if (event.key === "Enter" && modal && modal.style.display === "block") {
      event.preventDefault(); // Prevent default Enter behavior
      addProductToOrder();
  }
});

/*
// Adiciona o evento de pressionar a tecla "Enter"
document.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
      addProductToOrder();
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





const bell = document.getElementById("notificationBell");
const dropdown = document.getElementById("notificationDropdown");
const count = document.getElementById("notificationCount");
const list = document.getElementById("notificationList");

// Dummy notifications
const notifications = [
  "Catálogo Halloween 08/07/25",
  
];

// ⚙️ Renderiza as notificações e decide se mostra o contador
function renderNotifications() {
  list.innerHTML = "";

  notifications.forEach((note) => {
    const li = document.createElement("li");
    li.textContent = note;
    list.appendChild(li);
  });

  const hasSeen = localStorage.getItem("notificationsSeen");

  if (notifications.length > 0 && !hasSeen) {
    count.textContent = notifications.length;
    count.style.display = "inline";
  } else {
    count.style.display = "none";
  }
}

// 🛎️ Clicar no sino
bell.addEventListener("click", (e) => {
  e.stopPropagation();
  const isVisible = dropdown.style.display === "block";

  if (isVisible) {
    dropdown.style.display = "none";
  } else {
    dropdown.style.display = "block";

    // 👇 Marca como "visto" e esconde o contador permanentemente
    localStorage.setItem("notificationsSeen", "true");
    count.style.display = "none";
  }
});

// 🔐 Fecha o dropdown se clicar fora
document.addEventListener("click", (e) => {
  if (!e.target.closest(".note")) {
    dropdown.style.display = "none";
  }
});

// 🔁 Inicia tudo
renderNotifications();

