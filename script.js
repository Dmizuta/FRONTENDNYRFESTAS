// Function to open the modal with dynamic content
function adicionarItem(productName, productDescription, productPrice) {
    // Get the modal elements by ID
    const page = document.getElementById("page");
    const nameElement = document.getElementById("productName");
    const descriptionElement = document.getElementById("productDescription");
    const priceElement = document.getElementById("productPrice");

    // Populate the modal with the selected item data
    nameElement.textContent = productName;
    descriptionElement.textContent = productDescription;
    priceElement.textContent = `Preço: R$ ${productPrice}`;

    // Make the modal visible
    page.style.display = "flex";
}

// Function to handle item added action
function itemAdicionado() {
    alert("Adicionado com sucesso!");
    closeModal();  // Close the modal after adding the item
}

// Function to close the modal
function closeModal() {
    const page = document.getElementById("page");
    page.style.display = "none";  // Hide the modal
}
