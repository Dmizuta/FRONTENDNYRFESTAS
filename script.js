// Open Modal with dynamic content based on the product selected
function openModal(productName, productDescription, productPrice) {
    const modal = document.getElementById('modal');
    const productNameElem = document.getElementById('modal-product-name');
    const productDescriptionElem = document.getElementById('modal-product-description');
    const productPriceElem = document.getElementById('modal-product-price');
    
    // Set modal content dynamically
    productNameElem.textContent = productName;
    productDescriptionElem.textContent = productDescription;
    productPriceElem.textContent = `Preço: R$ ${productPrice}`;

    // Show the modal
    modal.style.display = 'flex';
}

// Close the modal
function closeModal() {
    const modal = document.getElementById('modal');
    modal.style.display = 'none';
}

// Handle adding the item to the cart (for now just a success alert)
function itemAdicionado() {
    alert("Item adicionado ao pedido com sucesso!");
    closeModal();  // Close the modal after adding the item
}

// Add event listeners to "Adicionar" buttons
document.querySelectorAll('.add-button').forEach(button => {
    button.addEventListener('click', function() {
        const product = this.closest('.product');
        const productName = product.getAttribute('data-name');
        const productDescription = product.getAttribute('data-description');
        const productPrice = product.getAttribute('data-price');
        
        openModal(productName, productDescription, productPrice);
    });
});
