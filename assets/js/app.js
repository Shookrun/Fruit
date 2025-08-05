document.addEventListener("DOMContentLoaded", function () {
  let products = document.getElementById("products");
  const cartIcon = document.querySelector(".fa-shopping-cart");
  const notificationIcon = document.querySelector(".fa-shopping-cart");
  let mockData = [
    { id: 1, title: "Portağal", price: 16.00, img: "https://pngimg.com/d/orange_PNG777.png", category: "Fruit" },
    { id: 2, title: "Portağal", price: 16.00, img: "https://pngimg.com/d/orange_PNG777.png", category: "Fruit" },
    { id: 3, title: "Portağal", price: 16.00, img: "https://pngimg.com/d/orange_PNG777.png", category: "Fruit" },
    { id: 4, title: "Portağal", price: 16.00, img: "https://pngimg.com/d/orange_PNG777.png", category: "Fruit" },
    { id: 5, title: "Portağal", price: 16.00, img: "https://pngimg.com/d/orange_PNG777.png", category: "Fruit" },
    { id: 12, title: "Pomidor", price: 16.00, img: "../images/tomato.png", category: "Vegetable" },
    { id: 13, title: "Pomidor", price: 16.00, img: "../images/tomato.png", category: "Vegetable" },
    { id: 14, title: "Pomidor", price: 16.00, img: "../images/tomato.png", category: "Vegetable" },
  ];

  function displayProducts(filteredData) {
    products.innerHTML = "";
    filteredData.map(({ id, title, price, img }) => {
      products.innerHTML += `
        <div class="product-item">
          <img src="${img}" alt="${title}" />
          <h3>${title}</h3>
          <div class="product-prices">
            <span class="discounted-price">${price}₼/kq</span>
          </div>
          <div class="weight-selector">
            <label>Kiloqram: </label>
            <input type="number" class="weight-input" min="0.1" step="0.1" value="1">
          </div>
          <button class="add-to-cart">Səbətə Əlavə et</button>
        </div>
      `;
    });
    
    attachCartEventListeners();
  }

  function attachCartEventListeners() {
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    addToCartButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const product = this.closest(".product-item");
        const productName = product.querySelector("h3").textContent;
        const basePrice = parseFloat(product.querySelector(".discounted-price").textContent.replace('₼', ''));
        const weight = parseFloat(product.querySelector(".weight-input").value);
        const productImage = product.querySelector("img").src;
        
        if (weight <= 0 || isNaN(weight)) {
          alert("Yazdığınız kiloqram dəyərli uyğun deyil !");
          return;
        }

        if (cart[productName]) {
          cart[productName].weight += weight;
          cart[productName].totalPrice = (cart[productName].weight * basePrice).toFixed(2);
        } else {
          cart[productName] = {
            basePrice: basePrice,
            weight: weight,
            totalPrice: (basePrice * weight).toFixed(2),
            image: productImage,
          };
        }
        updateCartDisplay();
      });
    });
  }

  displayProducts(mockData);

  const categoryItems = document.querySelectorAll(".category");
  categoryItems.forEach(item => {
    item.addEventListener("click", function () {
      const category = this.getAttribute("data-category");
      const filteredProducts = mockData.filter(product => product.category === category);
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
      <div class="cart-total">Cəm: 0.00₼</div>
      <a href="../pages/payment.html" class="checkout salam">Ödəniş Et</a>
    </div>
  `;
  document.body.appendChild(modal);

  const closeModal = modal.querySelector(".close-modal");
  const cartItemsList = modal.querySelector(".cart-items");
  const cartTotal = modal.querySelector(".cart-total");
  let cart = JSON.parse(localStorage.getItem("cart")) || {};

  let notificationBadge;
  if (notificationIcon) {
    notificationBadge = document.createElement("span");
    notificationBadge.classList.add("notification-badge");
    notificationBadge.textContent = "0";
    notificationBadge.style.display = "none";
    notificationIcon.appendChild(notificationBadge);
  }

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

  function updateCartDisplay() {
    cartItemsList.innerHTML = "";
   
    let uniqueItemCount = Object.keys(cart).length;
    let grandTotal = 0;

    Object.keys(cart).forEach((productName) => {
      const item = cart[productName];
      grandTotal += parseFloat(item.totalPrice);
      
      const cartItem = document.createElement("li");
      cartItem.classList.add("cart-item");
      cartItem.innerHTML = `
        <img src="${item.image}" alt="${productName}" width="50" height="50">
        <div class="item-details">
          <span class="item-name">${productName}</span>
          <span class="item-price">${item.basePrice}₼/kg</span>
          <span class="item-weight">${item.weight.toFixed(1)} kg</span>
          <span class="item-total">Cəm: ${item.totalPrice}₼</span>
        </div>
        <div class="quantity-controls">
          <button class="decrease">-</button>
          <span class="quantity">${item.weight.toFixed(1)} kg</span>
          <button class="increase">+</button>
        </div>
        <button class="remove-item">X</button>
      `;
      cartItemsList.appendChild(cartItem);
      
      cartItem.querySelector(".increase").addEventListener("click", function () {
        cart[productName].weight += 0.5; 
        cart[productName].totalPrice = (cart[productName].weight * cart[productName].basePrice).toFixed(2);
        updateCartDisplay();
      });
      
      cartItem.querySelector(".decrease").addEventListener("click", function () {
        cart[productName].weight -= 0.5; 
        if (cart[productName].weight <= 0) {
          delete cart[productName];
        } else {
          cart[productName].totalPrice = (cart[productName].weight * cart[productName].basePrice).toFixed(2);
        }
        updateCartDisplay();
      });
      
      cartItem.querySelector(".remove-item").addEventListener("click", function () {
        delete cart[productName];
        updateCartDisplay();
      });
    });

    cartTotal.textContent = `Cəm: ${grandTotal.toFixed(2)}₼`;

    if (notificationIcon) {
      if (uniqueItemCount > 0) {
        notificationBadge.textContent = uniqueItemCount;
        notificationBadge.style.display = "inline";
      } else {
        notificationBadge.style.display = "none";
      }
    }

    localStorage.setItem("cart", JSON.stringify(cart));
  }

  updateCartDisplay();
});