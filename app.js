// Sélection des éléments
const cartIcon = document.querySelector(".cart-icon");
const cartPanel = document.getElementById("cartPanel");
const closeCart = document.getElementById("closeCart");
const cartItemsContainer = document.getElementById("cartItems");
const cartTotal = document.getElementById("cartTotal");
const cartCount = document.querySelector(".cart-icon span");
const darkModeBtn = document.querySelector(".fa-moon");
const filterBtns = document.querySelectorAll('.filter-btn');
const allProducts = document.querySelectorAll('.product-card');

filterBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    // 1. Gérer l'état visuel des boutons
    document.querySelector('.filter-btn.active').classList.remove('active');
    btn.classList.add('active');

    // 2. Filtrer les produits
    const category = btn.getAttribute('data-category');

    allProducts.forEach(product => {
      const productCat = product.getAttribute('data-category');
      
      if (category === 'all' || category === productCat) {
        product.style.display = 'block';
        product.style.opacity = "1";
        product.style.animation = 'fadeIn 0.4s ease forwards';
      } else {
        product.style.display = 'none';
      }
    });
  });
});
// Produits depuis le HTML
const productCards = document.querySelectorAll(".product-card");

let cart = JSON.parse(localStorage.getItem("cart")) || [];

/* ===============================
   OUVRIR / FERMER PANIER
================================ */
cartIcon.addEventListener("click", () => {
  cartPanel.classList.add("active");
});

closeCart.addEventListener("click", () => {
  cartPanel.classList.remove("active");
});

/* ===============================
   AJOUT AU PANIER
================================ */
productCards.forEach((card, index) => {
  const button = card.querySelector("button");

  button.addEventListener("click", () => {
    const name = card.querySelector("h3").innerText;
    const price = parseFloat(card.querySelector(".price").innerText);
    const image = card.querySelector("img").src;

    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({
        name,
        price,
        image,
        quantity: 1
      });
    }

    updateCart();
  });
});

/* ===============================
   METTRE À JOUR PANIER
================================ */
function updateCart() {
  cartItemsContainer.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartItemsContainer.innerHTML += `
      <div class="cart-item">
        <img src="${item.image}">
        <div class="info">
          <p>${item.name}</p>
          <small>${item.quantity} x ${item.price} F</small>
        </div>
        <button onclick="removeItem(${index})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
    `;
  });

  cartTotal.innerText = total.toFixed(2);
  cartCount.innerText = cart.reduce((acc, item) => acc + item.quantity, 0);

  localStorage.setItem("cart", JSON.stringify(cart));
}

/* ===============================
   SUPPRIMER PRODUIT
================================ */
function removeItem(index) {
  cart.splice(index, 1);
  updateCart();
}


/* ===============================
   DARK MODE AMÉLIORÉ
================================ */
darkModeBtn.addEventListener("click", () => {
  document.body.classList.toggle("dark");

  // Sauvegarde préférence utilisateur
  localStorage.setItem("darkMode", document.body.classList.contains("dark"));
});

// Charger préférence au démarrage
if (localStorage.getItem("darkMode") === "true") {
  document.body.classList.add("dark");
}

/* ===============================
   INITIALISATION
================================ */
updateCart();

/* ===============================
   SPA NAVIGATION (History API)
================================ */

// Toutes les sections principales
const sections = {
  "/": document.getElementById("home"),
  "/produits": document.getElementById("products"),
  "/about": document.getElementById("about"),
  "/panier": cartPanel
};

// Fonction pour afficher la bonne vue
function navigate(path) {

  // Si route inconnue → home
  if (!sections[path]) {
    path = "/";
  }

  // Masquer toutes les sections
  Object.values(sections).forEach(section => {
    if (section) {
      section.style.display = "none";
    }
  });

  // Cas spécial panier (slide panel)
  if (path === "/panier") {
    cartPanel.classList.add("active");
  } else {
    cartPanel.classList.remove("active");
  }

  // Afficher section normale
  if (sections[path] && path !== "/panier") {
    sections[path].style.display = "block";
  }

  // Scroll top
  window.scrollTo(0, 0);
}

// Intercepter les clics menu
document.addEventListener("click", e => {

  if (e.target.matches("[data-link]")) {
    e.preventDefault();
    const path = e.target.getAttribute("href");

    history.pushState({}, "", path);
    navigate(path);
  }

});

productCards.forEach(card => {

card.addEventListener("click", (e)=>{

if(e.target.tagName === "BUTTON") return;

const name = card.querySelector("h3").innerText;
const price = card.querySelector(".price").innerText;
const image = card.querySelector("img").src;

alert(
"Produit : "+name+
"\nPrix : "+price+
"\nProduit premium disponible sur GabaoShop."
);

});

});


