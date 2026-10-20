(() => {
  const products = [
    { id: 1, name: "Beaded Phone Lanyard",       type: "lanyard",   price: 80,  img: "phonelanyards.PNG",        icon: "📿", variants: ["Pastel Garden", "Midnight", "Lavender", "Cherry Red"],
      desc: "Pastel floral and charm beads with a secure phone clip — pick your colors and vibe." },
    { id: 2, name: "Butterfly Beaded Lanyard",   type: "lanyard",   price: 85,  img: "phonelanyards.PNG",        icon: "🦋", variants: ["Pastel Garden", "Midnight", "Lavender", "Cherry Red"],
      desc: "Colorful beads with a dainty butterfly accent. A cute everyday carry for your phone." },
    { id: 3, name: "Laptop Sleeve Strap",        type: "strap",     price: 120, img: "laptop_sleevestraps.png",  icon: "💻", variants: ["Lilac Daisy", "Midnight Galaxy", "Pastel Rainbow", "Olive Daisy"],
      desc: "Embroidered strap with star and daisy details — fits most laptop sleeves and bags." },
    { id: 4, name: "Galaxy Laptop Strap",        type: "strap",     price: 130, img: "laptop_sleevestraps.png",  icon: "🌙", variants: ["Midnight Galaxy", "Lilac Daisy", "Pastel Rainbow", "Olive Daisy"],
      desc: "Black woven strap with planet and moon embroidery. Sleek and space-themed." },
    { id: 5, name: "Cable Organizer",            type: "organizer", price: 50,  img: "cable_organizers.png",     icon: "🎀", variants: ["Lilac Star", "Blush Heart", "Black Star", "Sky Blue", "Sage Clover", "Lavender Daisy"],
      desc: "Velcro wrap with a floral or heart patch to keep your charging cables tangle-free." },
    { id: 6, name: "Headphone Organizer",        type: "organizer", price: 55,  img: "headphone_organizers.png", icon: "🎧", variants: ["Blush Bear", "Lilac Daisy", "Midnight Star", "Sky Blue", "Sage Clover", "Blush Bow"],
      desc: "Wrap up your earphones neatly with a pastel velcro organizer — daisies, bears, or stars." },
    { id: 7, name: "Woven Friendship Bracelet",  type: "woven",     price: 70,  img: "woven_bracelets.PNG",      icon: "🧵", variants: ["Purple & White", "Pastel Pink", "Black & Silver", "Rainbow Pastel", "Blue & White", "Mint Floral"],
      desc: "Braided in pastel or bold shades with a charm dangle. Perfect for matching with friends." },
    { id: 8, name: "Custom Theme Set",           type: "bundle",    price: 250, img: "custom_set.PNG",           icon: "✨", variants: ["Pastel Mix", "Galaxy", "Garden", "Custom colors"],
      desc: "Mix-and-match set: phone lanyard + cable organizer + bracelet in one coordinated theme." },
  ];
  const storageKey = "string-theory-cart";

  function readCart() {
    try {
      const saved = JSON.parse(localStorage.getItem(storageKey) || "[]");
      if (!Array.isArray(saved)) return [];
      return saved.map((item) => {
        const product = products.find((entry) => entry.id === Number(item.id));
        const qty = Math.floor(Number(item.qty));
        const option = product?.variants.includes(item.option) ? item.option : product?.variants[0];
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
    if (count) count.textContent = `${shown.length} ${shown.length === 1 ? "item" : "handmade favorites"}`;
    const empty = document.querySelector("[data-products-empty]");
    if (empty) empty.hidden = shown.length > 0;
  }

  function renderProductCard(product) {
    return `
      <article class="card">
        <div class="product-art">
          <img src="${product.img}" alt="${product.name}">
        </div>
        <div class="card-content">
          <h3>${product.name}</h3>
          <p class="desc">${product.desc}</p>
          <div class="price">${formatPrice(product.price)}</div>
          <label class="variant-field">
            <span>Color / style</span>
            <select data-product-variant="${product.id}" aria-label="Color or style for ${product.name}">
              ${product.variants.map((variant) => `<option value="${variant}">${variant}</option>`).join("")}
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
        <div class="cart-item-icon"><img src="${product.img}" alt="${product.name}"></div>
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
        const email = `mailto:cecitdepartment@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(lines.join("\n"))}`;
        notify("Opening your email app with the details. Your cart will stay saved.");
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
