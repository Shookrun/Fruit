document.addEventListener("DOMContentLoaded", function () {
  let products = document.getElementById("products");
  const cartIcon = document.querySelector(".fa-shopping-cart");
  const notificationIcon = document.querySelector(".fa-bell");
  let mockData = [
    { id: 1, title: "Portağal", price: 16.00, img: "https://pngimg.com/d/orange_PNG777.png", category: "Fruit" },
    { id: 2, title: "Portağal", price: 16.00, img: "https://pngimg.com/d/orange_PNG777.png", category: "Fruit" },
    { id: 3, title: "Portağal", price: 16.00, img: "https://pngimg.com/d/orange_PNG777.png", category: "Fruit" },
    { id: 4, title: "Portağal", price: 16.00, img: "https://pngimg.com/d/orange_PNG777.png", category: "Fruit" },
    { id: 5, title: "Portağal", price: 16.00, img: "https://pngimg.com/d/orange_PNG777.png", category: "Fruit" },
    { id: 12, title: "Pomidor", price: 16.00, img: "https://e7.pngegg.com/pngimages/299/589/png-clipart-red-tomatoes-cherry-tomato-food-salad-tomato-natural-foods-fitness-thumbnail.png", category: "Vegetable" },
    { id: 13, title: "Pomidor", price: 16.00, img: "https://e7.pngegg.com/pngimages/299/589/png-clipart-red-tomatoes-cherry-tomato-food-salad-tomato-natural-foods-fitness-thumbnail.png", category: "Vegetable" },
    { id: 14, title: "Pomidor", price: 16.00, img: "https://e7.pngegg.com/pngimages/299/589/png-clipart-red-tomatoes-cherry-tomato-food-salad-tomato-natural-foods-fitness-thumbnail.png", category: "Vegetable" },
  ];

  function displayProducts(filteredData) {
    products.innerHTML = ""; // Önbelleği temizle
    filteredData.map(({ id, title, price, img }) => {
      products.innerHTML += `
        <div class="product-item">
          <img src="${img}" alt="${title}" />
          <h3>${title}</h3>
          <div class="product-prices">
            <span class="discounted-price">$${price}</span>
          </div>
          <button class="add-to-cart">Səbətə Əlavə et</button>
        </div>
      `;
    });
  }

  // Başlangıçta tüm ürünleri göster
  displayProducts(mockData);

  // Kategoriye tıklanabilirlik ekleyelim
  const categoryItems = document.querySelectorAll(".category");

  categoryItems.forEach(item => {
    item.addEventListener("click", function () {
      const category = this.getAttribute("data-category");

      // Seçilen kategoriye ait ürünleri filtrele
      const filteredProducts = mockData.filter(product => product.category === category);

      // Filtrelenmiş ürünleri göster
      displayProducts(filteredProducts);
    });
  });

  const modal = document.createElement("div");
  modal.classList.add("cart-modal");
  modal.innerHTML = `
    <div class="cart-content">
      <span class="close-modal">&times;</span>
      <h2>Səbətiniz</h2>
      <ul class="cart-items"></ul>
      <button class="checkout">Əldə et</button>
    </div>
  `;
  document.body.appendChild(modal);

  const closeModal = modal.querySelector(".close-modal");
  const cartItemsList = modal.querySelector(".cart-items");
  const addToCartButtons = document.querySelectorAll(".add-to-cart");

  let notificationBadge;
  if (notificationIcon) {
    notificationBadge = document.createElement("span");
    notificationBadge.classList.add("notification-badge");
    notificationBadge.textContent = "0";
    notificationBadge.style.display = "none";
    notificationIcon.appendChild(notificationBadge);
  }

  let cart = {};

  cartIcon.addEventListener("click", function () {
    modal.style.display = "block";
  });

  closeModal.addEventListener("click", function () {
    modal.style.display = "none";
  });

  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const product = this.closest(".product-item");
      const productName = product.querySelector("h3").textContent;
      const productPrice = product.querySelector(".discounted-price").textContent;
      const productImage = product.querySelector("img").src;

      if (cart[productName]) {
        cart[productName].quantity++;
      } else {
        cart[productName] = {
          price: productPrice,
          image: productImage,
          quantity: 1,
        };
      }
      updateCartDisplay();
    });
  });

  function updateCartDisplay() {
    cartItemsList.innerHTML = "";
    let totalCount = 0;

    Object.keys(cart).forEach((productName) => {
      const item = cart[productName];
      totalCount += item.quantity;

      const cartItem = document.createElement("li");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${productName}" width="50" height="50">
        <span>${productName} - ${item.price}</span>
        <div class="quantity-controls">
          <button class="decrease">-</button>
          <span class="quantity">${item.quantity}</span>
          <button class="increase">+</button>
        </div>
        <button class="remove-item">X</button>
      `;
      cartItemsList.appendChild(cartItem);
      cartItem.querySelector(".increase").addEventListener("click", function () {
        cart[productName].quantity++;
        updateCartDisplay();
      });
      cartItem.querySelector(".decrease").addEventListener("click", function () {
        cart[productName].quantity--;
        if (cart[productName].quantity <= 0) {
          delete cart[productName];
        }
        updateCartDisplay();
      });
      cartItem.querySelector(".remove-item").addEventListener("click", function () {
        delete cart[productName];
        updateCartDisplay();
      });
    });

    if (notificationIcon) {
      if (totalCount > 0) {
        notificationBadge.textContent = totalCount;
        notificationBadge.style.display = "inline";
      } else {
        notificationBadge.style.display = "none";
      }
    }
  }

  updateCartDisplay();
});
