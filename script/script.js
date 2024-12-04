document.addEventListener("DOMContentLoaded", function() {
    let cart = [];
    if (localStorage.getItem('cart')) {
      cart = JSON.parse(localStorage.getItem('cart'));
    }
    updateCartCount();

    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(function(button) {
      button.addEventListener('click', function() {
        const productElement = this.closest('.product');
        const productName = productElement.querySelector('.caption h6 a').innerText;
        const productPrice = productElement.querySelector('.price').innerText.replace('₽', '');
        const productImage = productElement.querySelector('img').getAttribute('src');

        const existingProductIndex = cart.findIndex(item => item.name === productName);
        if (existingProductIndex !== -1) {
          cart[existingProductIndex].quantity += 1;
        } else {
          const product = {
            name: productName,
            price: parseFloat(productPrice),
            image: productImage,
            quantity: 1
          };
          cart.push(product);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();

        alert('Товар "' + productName + '" добавлен в корзину!');
      });
    });

    const cartModal = document.getElementById('cartModal');
    cartModal.addEventListener('show.bs.modal', function() {
      displayCartItems();
    });

    function updateCartCount() {
      const cartCountElement = document.getElementById('cart-count');
      cartCountElement.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    }

    function displayCartItems() {
      const cartItemsContainer = document.getElementById('cart-items');
      cartItemsContainer.innerHTML = '';
      let totalPrice = 0;
      if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Ваша корзина пуста.</p>';
      } else {
        cart.forEach((item, index) => {
          const itemTotal = item.price * item.quantity;
          totalPrice += itemTotal;

          const cartItem = document.createElement('div');
          cartItem.classList.add('d-flex', 'align-items-center', 'justify-content-between', 'border-bottom', 'py-2');
          cartItem.innerHTML = `
            <div class="d-flex align-items-center">
              <img src="${item.image}" alt="${item.name}" width="50" class="me-2">
              <div>
                <h6 class="mb-0">${item.name}</h6>
                <small>${item.price.toFixed(2)} руб. x ${item.quantity}</small>
              </div>
            </div>
            <div>
              <strong>${itemTotal.toFixed(2)} руб.</strong>
              <button class="btn btn-sm btn-danger ms-2 remove-item" data-index="${index}">&times;</button>
            </div>
          `;
          cartItemsContainer.appendChild(cartItem);
        });
      }
      document.getElementById('total-price').innerText = totalPrice.toFixed(2) + 'руб.';

      const removeButtons = document.querySelectorAll('.remove-item');
        removeButtons.forEach(button => {
          button.addEventListener('click', function() {
            const index = this.getAttribute('data-index');
            removeItemFromCart(index);
          });
        });
      }

      function removeItemFromCart(index) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        updateCartCount();
        displayCartItems();
      }

      document.getElementById('checkout-btn').addEventListener('click', function() {
        if (cart.length === 0) {
          alert('Ваша корзина пуста!');
          return;
        }
        cart = [];
        localStorage.removeItem('cart');
        updateCartCount();
        displayCartItems();
        alert('Спасибо за ваш заказ!');
        const modal = bootstrap.Modal.getInstance(cartModal);
        modal.hide();
      });
    });