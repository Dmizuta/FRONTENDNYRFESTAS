// URL da API para buscar os dados do produto
const API_URL = "https://backendnyrfestas.vercel.app/products"; // Ajuste para o URL do backend em produção

// Função para buscar os dados do produto na API
async function fetchProductData() {
  try {
    const response = await fetch(API_URL);
    const data = await response.json();

    // Log dos dados para verificar a estrutura
    console.log(data);

    // Mapeia os dados na tabela
    populateProductTable(data);
  } catch (error) {
    console.error("Erro ao buscar dados do produto:", error);

    // Tratar erros e mostrar uma mensagem amigável na tabela
    const tableBody = document.querySelector("#productTable tbody");
    tableBody.innerHTML =
      '<tr><td colspan="7">Não foi possível carregar os produtos no momento. Por favor, tente novamente mais tarde.</td></tr>';
  }
}

// Função para formatar números como moeda (Real Brasileiro - R$)
function formatCurrency(value) {
  return `R$ ${value.toFixed(2).replace('.', ',')}`;
}

// Função para popular dinamicamente a tabela de produtos
function populateProductTable(products) {
  const tableBody = document.querySelector("#productTable tbody");

  // Limpar quaisquer linhas existentes
  tableBody.innerHTML = "";

  if (products && products.length > 0) {
    products.forEach((product) => {
      const row = tableBody.insertRow();

      // Inserir células para cada detalhe do produto
      const cell1 = row.insertCell(0); // Imagem
      const cell2 = row.insertCell(1); // Código do Produto
      const cell3 = row.insertCell(2); // Descrição
      const cell4 = row.insertCell(3); // Quantidade Fechada
      const cell5 = row.insertCell(4); // Preço Fechado
      const cell6 = row.insertCell(5); // Quantidade Fracionada
      const cell7 = row.insertCell(6); // Preço Fracionado
      const cell8 = row.insertCell(7); // Botão ADD

      // Popular células com dados do produto
      cell1.innerHTML = `
        <img src="${
          product.imagem || "https://via.placeholder.com/50"
        }" 
             alt="Imagem do Produto" 
             style="width: 50px; height: 50px; object-fit: cover; transition: transform 0.3s; cursor: pointer;" 
             onmouseover="this.style.transform='scale(3)'" 
             onmouseout="this.style.transform='scale(1)'">
      `;

      cell2.textContent = product.codproduto || "N/A"; // Código do Produto
      cell3.textContent = product.descricao || "N/A"; // Descrição
      cell4.textContent = product.cxfechada || "N/A"; // Quantidade Fechada
      cell5.textContent = `${formatCurrency(product.precofechada)}`; // Preço Fechado
      cell6.textContent = product.cxfracionada || "N/A"; // Quantidade Fracionada
      cell7.textContent = `${formatCurrency(product.precofrac)}`; // Preço Fracionado
      cell8.innerHTML = `<button class="openModalBtn"><img src="/shoppingcart.png" alt="Adicionar"></button>`;

      // Adicionar evento para o botão "Adicionar"
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
    // Mensagem para quando não houver produtos disponíveis
    tableBody.innerHTML =
      '<tr><td colspan="7">Nenhum produto disponível.</td></tr>';
  }
}

// Função para abrir o modal com os detalhes do produto
function openModal(
  productImage,
  productCode,
  productDesc,
  cxFechada,
  priceFechada,
  cxFracionada,
  priceFracionada
) {
  const modal = document.getElementById("myModal");
  const productInfo = modal.querySelector(".product-info");
  const priceInfoFechada = modal.querySelector(".price1-info");
  const priceInfoFracionada = modal.querySelector(".price2-info");
  const cxFechadaInfo = modal.querySelector(".cxfechada-info");
  const cxFracionadaInfo = modal.querySelector(".cxfracionada-info");
  const productImageElement = modal.querySelector("img");

  // Preencher o modal com os detalhes do produto
  productInfo.querySelector("h3").textContent = productCode;
  productInfo.querySelector("p").textContent = productDesc;
  priceInfoFechada.querySelector("p").innerHTML = `<span class="label1">Preço Caixa Fechada:</span> <span class="value1">${priceFechada}</span>`;
  priceInfoFracionada.querySelector("p").innerHTML = `<span class="label1">Preço Caixa Fracionada:</span> <span class="value1">${priceFracionada}</span>`;
  cxFechadaInfo.querySelector("p").innerHTML = `<span class="label2">Caixa Fechada:</span> <span class="value2">${cxFechada}</span>`;
  cxFracionadaInfo.querySelector("p").innerHTML = `<span class="label2">Caixa Fracionada:</span> <span class="value2">${cxFracionada}</span>`;
  productImageElement.src = productImage;

  modal.style.display = "block"; // Mostrar o modal
}

// Listener de evento para fechar o modal
document.getElementById("closeModalBtn").addEventListener("click", function () {
  document.getElementById("myModal").style.display = "none";
});

document.getElementById("cancelButton").addEventListener("click", function () {
  document.getElementById("myModal").style.display = "none";
});

// Fechar o modal ao clicar fora dele
window.addEventListener("click", function (event) {
  const modal = document.getElementById("myModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
