document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.getElementById("cart-icon");
  const cartDropdown = document.getElementById("cart-dropdown");
  let cartItemCount = parseInt(localStorage.getItem("cartItemCount")) || 0;
  let cartTotal = parseFloat(localStorage.getItem("cartTotal")) || 0;
  let cartItems = JSON.parse(localStorage.getItem("cartItems")) || {};

  function addToCart(item) {
    const itemId = item.id;
    if (cartItems[itemId]) {
      cartItems[itemId].quantity++;
    } else {
      cartItems[itemId] = { ...item, quantity: 1 };
    }
    updateCartView();
    saveCartToLocalStorage();
  }

  function updateCartView() {
    const cartItemsList = document.getElementById("cart-items");
    cartItemsList.innerHTML = "";
    cartTotal = 0;
    cartItemCount = 0;
    for (const itemId in cartItems) {
      if (cartItems.hasOwnProperty(itemId)) {
        const item = cartItems[itemId];
        const listItem = document.createElement("li");
        listItem.textContent = `${item.name} x ${item.quantity}`;

        const removeButton = document.createElement("button");
        removeButton.textContent = "Eliminar";
        removeButton.className = "btn-remove";
        listItem.appendChild(removeButton);

        cartItemsList.appendChild(listItem);

        cartTotal += item.price * item.quantity;
        cartItemCount += item.quantity;

        removeButton.addEventListener("click", function () {
          removeFromCart(itemId);
        });
      }
    }

    if (cartItemCount > 3) {
      const discount = cartTotal * 0.3;
      cartTotal -= discount;
    }

    document.getElementById("cart-item-count").textContent = cartItemCount;
    document.getElementById("cart-total").textContent =
      "Total: $" + cartTotal.toFixed(2);

    cartDropdown.classList.add("show");
  }

  function removeFromCart(itemId) {
    if (cartItems[itemId]) {
      cartItems[itemId].quantity--;
      if (cartItems[itemId].quantity === 0) {
        delete cartItems[itemId];
      }
    }
    updateCartView();
    saveCartToLocalStorage();
  }

  function saveCartToLocalStorage() {
    localStorage.setItem("cartItems", JSON.stringify(cartItems));
    localStorage.setItem("cartItemCount", cartItemCount);
    localStorage.setItem("cartTotal", cartTotal);
  }

  // Función para abrir y cerrar el carrito
  function toggleCart() {
    cartDropdown.classList.toggle("show");
  }

  // Mostrar/ocultar el carrito cuando se hace clic en el ícono del carrito
  cartIcon.addEventListener("click", toggleCart);

  // Obtener el botón de comprar
  const btnComprar = document.getElementById("btn-comprar");

  // Agregar evento de clic al botón de comprar
  btnComprar.addEventListener("click", function () {
    // Mostrar la animación de SweetAlert2
    Swal.fire({
      title: "¡Buena elección!",
      text: "¡Gracias por tu compra!",
      icon: "success",
      confirmButtonText: "Aceptar",
    }).then(() => {
      // Limpiar el carrito y el localStorage después de cerrar la alerta
      cartItems = {};
      cartItemCount = 0;
      cartTotal = 0;
      updateCartView();
      saveCartToLocalStorage();
    });
  });

  // Obtener el contenedor del menú
  const menuContainer = document.getElementById("menu-container");

  // Cargar el menú desde el JSON y generar los elementos
  fetch("../js/menu.json")
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .then((menu) => {
      generateMenu(menu); // Llamar a generateMenu con los datos del menú
    })
    .catch((error) => {
      console.error("Error al cargar el menú:", error);
    });

  // Función para generar el menú a partir del JSON
  function generateMenu(menu) {
    menu.menu.forEach((category) => {
      category.subcategories.forEach((subcategory) => {
        subcategory.items.forEach((item) => {
          const itemDiv = document.createElement("div");
          itemDiv.classList.add("menu-item");
          itemDiv.classList.add("fade-in");

          const itemName = document.createElement("h4");
          itemName.textContent = item.name;

          const itemPrice = document.createElement("p");
          itemPrice.textContent = `Precio: $${item.price}`;

          const itemImage = document.createElement("img"); // Crear elemento de imagen
          itemImage.src = item.image; // Establecer la ruta de la imagen desde el JSON
          itemImage.alt = item.name; // Establecer el texto alternativo de la imagen

          const addToCartBtn = document.createElement("button");
          addToCartBtn.textContent = "Agregar al carrito";
          addToCartBtn.classList.add("add-to-cart-btn");

          addToCartBtn.addEventListener("click", () => {
            addToCart(item);
          });

          itemDiv.appendChild(itemName);
          itemDiv.appendChild(itemPrice);
          itemDiv.appendChild(itemImage); // Agregar la imagen al div del elemento
          itemDiv.appendChild(addToCartBtn);

          menuContainer.appendChild(itemDiv);
        });
      });
    });
  }

  // Actualizar la vista del carrito cuando se carga la página
  updateCartView();
});
