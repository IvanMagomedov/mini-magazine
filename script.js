document.addEventListener('DOMContentLoaded', function() {
    // Элементы DOM
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartCount = document.getElementById('cart-count');
    const cartModal = document.getElementById('cart-modal');
    const closeModal = document.querySelector('.close');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalPrice = document.getElementById('cart-total-price');
    const cartIcon = document.querySelector('.cart');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Данные корзины
    let cart = [];
    let count = 0;

    // Инициализация корзины из localStorage
    function initCart() {
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            cart = JSON.parse(savedCart);
            count = cart.reduce((total, item) => total + item.quantity, 0);
            updateCart();
        }
    }

    // Сохранение корзины в localStorage
    function saveCart() {
        localStorage.setItem('cart', JSON.stringify(cart));
    }

    // Открытие корзины
    function openCart() {
        cartModal.style.display = 'block';
        renderCartItems();
    }

    // Закрытие корзины
    function closeCart() {
        cartModal.style.display = 'none';
    }

    // Обновление корзины
    function updateCart() {
        cartCount.textContent = count;
        renderCartItems();
        saveCart();
    }

    // Отрисовка товаров в корзине
    function renderCartItems() {
        if (!cartItemsContainer) return;

        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
            cartTotalPrice.textContent = '$0.00';
            return;
        }

        cartItemsContainer.innerHTML = '';
        let total = 0;

        cart.forEach(item => {
            total += item.price * item.quantity;

            const cartItemElement = document.createElement('div');
            cartItemElement.className = 'cart-item';
            cartItemElement.innerHTML = `
                <img class="cart-item-image" src="${item.image}" alt="${item.name}">
                <div class="cart-item-details">
                    <span class="cart-item-title">${item.name}</span>
                    <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    <span class="cart-item-quantity">Количество: ${item.quantity}</span>
                </div>
                <button class="cart-item-remove" data-id="${item.id}" title="Удалить">
                    ×
                </button>
            `;

            cartItemsContainer.appendChild(cartItemElement);
        });

        cartTotalPrice.textContent = `$${total.toFixed(2)}`;

        // Добавляем обработчики для кнопок удаления
        document.querySelectorAll('.cart-item-remove').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.dataset.id;
                removeFromCart(itemId);
            });
        });
    }

    // Добавление товара в корзину
    function addToCart(productId, productName, productPrice, productImage) {
        // Проверяем, есть ли товар уже в корзине
        const existingItem = cart.find(item => item.id === productId);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: productId,
                name: productName,
                price: productPrice,
                image: productImage,
                quantity: 1
            });
        }

        count++;
        updateCart();
    }

    // Удаление товара из корзины
    function removeFromCart(itemId) {
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex !== -1) {
            count -= cart[itemIndex].quantity;
            cart.splice(itemIndex, 1);
            updateCart();
        }
    }

    // Оформление заказа
    function checkout() {
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }

        alert(`Заказ оформлен! Сумма: $${calculateTotal().toFixed(2)}\nСпасибо за покупку!`);
        cart = [];
        count = 0;
        updateCart();
        closeCart();
    }

    // Подсчет общей суммы
    function calculateTotal() {
        return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    }

    // Обработчики событий
    cartIcon.addEventListener('click', openCart);
    closeModal.addEventListener('click', closeCart);
    checkoutBtn.addEventListener('click', checkout);

    window.addEventListener('click', function(event) {
        if (event.target === cartModal) {
            closeCart();
        }
    });

    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            const productElement = this.parentElement;
            const productId = productElement.dataset.id;
            const productName = productElement.querySelector('h3').textContent;
            const productPrice = parseFloat(productElement.querySelector('.price').textContent.replace('$', ''));
            const productImage = productElement.querySelector('img').src;

            addToCart(productId, productName, productPrice, productImage);
        });
    });

    // Инициализация корзины при загрузке
    initCart();
});