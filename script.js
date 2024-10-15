// Sample product data (replace with your actual data retrieval method)
const productsData = {
    'P001': { description: 'Descrição do Produto 1', price: 10.00 },
    'P002': { description: 'Descrição do Produto 2', price: 15.00 },
    'P003': { description: 'Descrição do Produto 3', price: 20.00 }
};

const orderForm = document.getElementById('order-form');
const productCodeInput = document.getElementById('product-code');
const productDescription = document.getElementById('product-description');
const quantityInput = document.getElementById('quantity');
const addButton = document.getElementById('add-product');
const productsContainer = document.getElementById('product-items');
const totalPriceDisplay = document.getElementById('total-price');

let totalPrice = 0;

// Show product description based on code input
productCodeInput.addEventListener('input', (e) => {
    const code = e.target.value;
    if (productsData[code]) {
        productDescription.textContent = productsData[code].description;
    } else {
        productDescription.textContent = '';
    }
});

// Add product to the list and update total price
addButton.addEventListener('click', () => {
    const code = productCodeInput.value;
    const quantity = parseInt(quantityInput.value, 10);
    
    if (productsData[code] && quantity > 0) {
        const productInfo = productsData[code];
        const productTotal = productInfo.price * quantity;

        // Add to the list
        const li = document.createElement('li');
        li.textContent = `${code} - ${productInfo.description} (x${quantity}) - R$ ${productTotal.toFixed(2).replace('.', ',')}`;
        productsContainer.appendChild(li);

        // Update total price
        totalPrice += productTotal;
        totalPriceDisplay.textContent = `R$ ${totalPrice.toFixed(2).replace('.', ',')}`;

        // Clear inputs
        productCodeInput.value = '';
        productDescription.textContent = '';
        quantityInput.value = '';
    }
});
