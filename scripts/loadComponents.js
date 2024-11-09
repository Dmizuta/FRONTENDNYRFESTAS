async function loadComponent(elementId, filePath) {
    try {
        const response = await fetch(filePath);
        const content = await response.text();
        document.getElementById(elementId).innerHTML = content;
    } catch (error) {
        console.error(`Erro ao carregar o componente de ${filePath}:`, error);
    }
}

document.addEventListener("DOMContentLoaded", () => {
    loadComponent("navbar", "components/navbar.html");

    // Carrega a tabela de produtos na página de Lista de Produtos
    if (document.getElementById("productTable")) {
        loadComponent("productTable", "components/product-table.html");
    }
});
