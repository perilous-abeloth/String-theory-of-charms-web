(() => {
  const products = [
    { id: 1, name: "Beaded Phone Charm", type: "lanyard", price: 80, variants: [
      { name: "Turquoise Beads", image: "product/2.png" },
    ], desc: "Colorful beaded wrist strap to add a little personality to your phone." },
    { id: 2, name: "Floral Desk Mirror", type: "mirror", price: 120, variants: [
      { name: "Pink Petal", image: "product/3.png" },
      { name: "Orange Blossom", image: "product/4.png" },
      { name: "Rose Bouquet", image: "product/5.png" },
      { name: "Teal Bouquet", image: "product/6.png" },
      { name: "Pink Garden", image: "product/7.png" },
      { name: "Teal Daisy", image: "product/8.png" },
      { name: "Pink Floral", image: "product/9.png" },
      { name: "Golden Flower", image: "product/10.png" },
      { name: "Blue Bouquet", image: "product/11.png" },
      { name: "Yellow Daisy", image: "product/12.png" },
      { name: "Turquoise Garden", image: "product/13.png" },
    ], desc: "A handmade mirror decorated with a colorful floral design. Choose your favorite style." },
    { id: 3, name: "Decorative Hair Clips", type: "clips", price: 50, variants: [
      { name: "Yellow Chick Clips", image: "product/1.png" },
      { name: "Blue Heart Clips", image: "product/16.png" },
      { name: "Red Bunny Clips", image: "product/17.png" },
      { name: "Cherry Clips", image: "product/18.png" },
      { name: "Teal Bunny Clips", image: "product/19.png" },
      { name: "Turquoise Bow Clips", image: "product/20.png" },
      { name: "Blue Gray Heart Clips", image: "product/21.png" },
      { name: "Yellow Blue Heart Clips", image: "product/22.png" },
      { name: "Mixed Bow Clips", image: "product/24.png" },
      { name: "Multicolor Heart Clips", image: "product/25.png" },
      { name: "Pink Blossom Clips", image: "product/27.png" },
      { name: "Red Yellow Bow Clips", image: "product/28.png" },
      { name: "Cherry Vine Clips", image: "product/29.png" },
      { name: "Orange Flower Clips", image: "product/30.png" },
      { name: "Blue Yellow Heart Clips", image: "product/32.png" },
      { name: "Primary Color Heart Clips", image: "product/33.png" },
    ], desc: "Soft, playful handmade clips in a range of colorful designs." },
    { id: 4, name: "Cable Organizer", type: "organizer", price: 50, variants: [
      { name: "Pastel Cable Wrap", image: "product/26.png" },
    ], desc: "A handy wrap to keep cables together and easy to find." },
    { id: 5, name: "Striped Flower Vase", type: "decor", price: 120, variants: [
      { name: "Red and White Flowers", image: "product/14.png" },
    ], desc: "A cheerful handmade flower arrangement in a striped vase." },
    { id: 6, name: "Pink Flower Accessory", type: "decor", price: 70, variants: [
      { name: "Pink Flower", image: "product/15.png" },
    ], desc: "A small, flower-shaped handmade accessory." },
    { id: 7, name: "Pom-Pom Charm", type: "decor", price: 55, variants: [
      { name: "Green Pom-Pom", image: "product/23.png" },
    ], desc: "A fluffy green charm with a handmade look." },
    { id: 8, name: "Floral Ring Charm", type: "decor", price: 70, variants: [
      { name: "Red and White Flowers", image: "product/31.png" },
    ], desc: "A round floral handmade charm with a hanging loop." },
  ];
  const storageKey = "string-theory-cart";

  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.map((item) => {
        const product = products.find((entry) => entry.id === Number(item.id));
        const qty = Math.floor(Number(item.qty));
        const option = product?.variants.some((variant) => variant.name === item.option) ? item.option : product?.variants[0].name;
        return product && qty > 0 ? { id: product.id, option, qty } : null;
      }).filter(Boolean);
    } catch {
      return [];
    }
  }

  function saveCart(cart) {
    localStorage.setItem(storageKey, JSON.stringify(cart));
    updateBadge(cart);
  }

  function formatPrice(amount) {
    return `₱${amount.toLocaleString("en-PH")}`;
  }

  function getVariant(product, option) {
    return product.variants.find((variant) => variant.name === option) || product.variants[0];
  }

  function updateBadge(cart = readCart()) {
    const count = cart.reduce((total, item) => total + item.qty, 0);
    document.querySelectorAll("[data-cart-count]").forEach((badge) => {
      badge.textContent = count;
      const link = badge.closest(".cart, .cart-link");
      if (link) link.setAttribute("aria-label", `Shopping cart, ${count} ${count === 1 ? "item" : "items"}`);
    });
  }

  function notify(message) {
    const target = document.querySelector("[data-notice]");
    if (!target) return;
    target.textContent = message;
    target.hidden = false;
    target.style.display = "block";
    window.clearTimeout(notify.timer);
    notify.timer = window.setTimeout(() => {
      target.hidden = true;
      target.style.display = "none";
    }, 2800);
  }

  function renderProducts() {
    const grid = document.querySelector("[data-product-grid]");
    if (!grid) return;
    const activeFilter = document.querySelector(".filter.active")?.dataset.filter || "all";
    const shown = products.filter((product) => activeFilter === "all" || product.type === activeFilter);
    grid.innerHTML = shown.map((product) => renderProductCard(product)).join("");
    const count = document.querySelector("[data-result-count]");
    if (count) count.textContent = `${shown.length} ${shown.length === 1 ? "item" : "items"}`;
    const empty = document.querySelector("[data-products-empty]");
    if (empty) empty.hidden = shown.length > 0;
  }

  function renderProductCard(product) {
    return `
      <article class="card">
        <div class="product-art">
          <img src="${product.variants[0].image}" alt="${product.name} - ${product.variants[0].name}">
        </div>
        <div class="card-content">
          <h3>${product.name}</h3>
          <p class="desc">${product.desc}</p>
          <div class="price">${formatPrice(product.price)}</div>
          <label class="variant-field">
            <span>Color / style</span>
            <select data-product-variant="${product.id}" aria-label="Color or style for ${product.name}">
              ${product.variants.map((variant) => `<option value="${variant.name}">${variant.name}</option>`).join("")}
            </select>
          </label>
          <button class="add" type="button" data-add-to-cart="${product.id}">Add to Cart</button>
        </div>
      </article>`;
  }

  function renderFeatured() {
    const grid = document.querySelector("[data-featured-grid]");
    if (!grid) return;
    const featured = products.slice(0, 3);
    grid.innerHTML = featured.map((product) => renderProductCard(product)).join("");
  }

  function renderCart() {
    const list = document.querySelector("[data-cart-list]");
    if (!list) return;
    const cart = readCart();
    const empty = cart.length === 0;
    const productsInCart = cart.map((item) => ({ ...products.find((product) => product.id === item.id), option: item.option, qty: item.qty }));
    list.innerHTML = productsInCart.map((product) => `
      <article class="cart-row">
        <div class="cart-item-icon"><img src="${getVariant(product, product.option).image}" alt="${product.name} - ${product.option}"></div>
        <div class="cart-item-info"><h2>${product.name}</h2><p>${product.option}</p><p>${product.desc}</p><button class="text-button" type="button" data-cart-action="remove" data-product-id="${product.id}" data-product-option="${product.option}">Remove</button></div>
        <div class="quantity-control" aria-label="Quantity for ${product.name}">
          <button type="button" aria-label="Decrease ${product.name} quantity" data-cart-action="decrease" data-product-id="${product.id}" data-product-option="${product.option}">−</button>
          <span>${product.qty}</span>
          <button type="button" aria-label="Increase ${product.name} quantity" data-cart-action="increase" data-product-id="${product.id}" data-product-option="${product.option}">+</button>
        </div>
        <strong class="line-total">${formatPrice(product.price * product.qty)}</strong>
      </article>`).join("");
    const subtotal = productsInCart.reduce((total, product) => total + product.price * product.qty, 0);
    document.querySelectorAll("[data-cart-empty]").forEach((element) => { element.hidden = !empty; });
    document.querySelectorAll("[data-cart-summary]").forEach((element) => { element.hidden = empty; });
    document.querySelectorAll("[data-cart-subtotal]").forEach((element) => { element.textContent = formatPrice(subtotal); });
    document.querySelectorAll("[data-checkout-link]").forEach((element) => { element.hidden = empty; });
  }

  function renderCheckout() {
    const list = document.querySelector("[data-checkout-items]");
    if (!list) return;
    const cart = readCart();
    const empty = cart.length === 0;
    const total = cart.reduce((sum, item) => sum + products.find((product) => product.id === item.id).price * item.qty, 0);
    list.innerHTML = cart.map((item) => {
      const product = products.find((entry) => entry.id === item.id);
      return `<li><span>${item.qty} x ${product.name}<small>(${item.option})</small></span><strong>${formatPrice(product.price * item.qty)}</strong></li>`;
    }).join("");
    document.querySelectorAll("[data-checkout-empty]").forEach((element) => { element.hidden = !empty; });
    document.querySelectorAll("[data-checkout-form]").forEach((element) => { element.hidden = empty; });
    document.querySelectorAll("[data-checkout-total]").forEach((element) => { element.textContent = formatPrice(total); });
  }

  function addToCart(id, option) {
    const cart = readCart();
    const found = cart.find((item) => item.id === id && item.option === option);
    if (found) found.qty += 1;
    else cart.push({ id, option, qty: 1 });
    saveCart(cart);
    const product = products.find((item) => item.id === id);
    notify(`${product.name} (${option}) added to your cart.`);
  }

  function updateQuantity(id, option, action) {
    let cart = readCart();
    const item = cart.find((entry) => entry.id === id && entry.option === option);
    if (!item) return;
    if (action === "remove") cart = cart.filter((entry) => entry.id !== id || entry.option !== option);
    if (action === "increase") item.qty += 1;
    if (action === "decrease") {
      item.qty -= 1;
      if (item.qty <= 0) cart = cart.filter((entry) => entry.id !== id || entry.option !== option);
    }
    saveCart(cart);
    renderCart();
  }

  function setupFilters() {
    document.querySelectorAll(".filter").forEach((button) => {
      button.addEventListener("click", () => {
        document.querySelectorAll(".filter").forEach((item) => item.classList.remove("active"));
        button.classList.add("active");
        renderProducts();
      });
    });
  }

  function setupEmailForms() {
    document.querySelectorAll("[data-mailto-form]").forEach((form) => {
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const fields = new FormData(form);
        const isOrder = form.dataset.mailtoForm === "order";
        const cart = readCart();
        if (isOrder && cart.length === 0) {
          notify("Your cart is empty. Add an item before requesting an order.");
          return;
        }
        const lines = [];
        if (isOrder) {
          lines.push("Order request:");
          cart.forEach((item) => {
            const product = products.find((entry) => entry.id === item.id);
            lines.push(`${item.qty} x ${product.name} (${item.option}) - ${formatPrice(product.price * item.qty)}`);
          });
          const total = cart.reduce((sum, item) => sum + products.find((entry) => entry.id === item.id).price * item.qty, 0);
          lines.push(`Estimated total: ${formatPrice(total)}`, "", "Customer details:");
        }
        for (const [name, value] of fields.entries()) {
          if (name !== "submit") lines.push(`${name}: ${value}`);
        }
        const subject = isOrder ? "String Theory of Charms order request" : "String Theory of Charms inquiry";
        const customerEmail = fields.get("Email");
        const copy = isOrder && customerEmail ? `&cc=${encodeURIComponent(customerEmail)}` : "";
        const email = `mailto:stringtheoryofcharms@gmail.com?subject=${encodeURIComponent(subject)}${copy}&body=${encodeURIComponent(lines.join("\n"))}`;
        notify(isOrder ? "Opening your email app with the order details and your address copied." : "Opening your email app with the message details.");
        window.location.href = email;
      });
    });
  }

  document.addEventListener("click", (event) => {
    const addButton = event.target.closest("[data-add-to-cart]");
    if (addButton) {
      const card = addButton.closest(".card");
      const option = card.querySelector("[data-product-variant]").value;
      addToCart(Number(addButton.dataset.addToCart), option);
    }
    const cartButton = event.target.closest("[data-cart-action]");
    if (cartButton) updateQuantity(Number(cartButton.dataset.productId), cartButton.dataset.productOption, cartButton.dataset.cartAction);
  });

  document.addEventListener("change", (event) => {
    const variantSelect = event.target.closest("[data-product-variant]");
    if (!variantSelect) return;
    const product = products.find((entry) => entry.id === Number(variantSelect.dataset.productVariant));
    const variant = getVariant(product, variantSelect.value);
    const image = variantSelect.closest(".card").querySelector(".product-art img");
    image.src = variant.image;
    image.alt = `${product.name} - ${variant.name}`;
  });

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-year]").forEach((element) => { element.textContent = new Date().getFullYear(); });
    updateBadge();
    renderFeatured();
    renderProducts();
    renderCart();
    renderCheckout();
    setupFilters();
    setupEmailForms();
  });
})();
