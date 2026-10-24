from pyscript import window, document
import json

PRODUCTS = [
    {
        "id": 1,
        "name": "Beaded Phone Charm",
        "type": "lanyard",
        "price": 80,
        "variants": [
            {"name": "Turquoise Beads", "image": "product/2.png"},
        ],
        "desc": "Colorful beaded wrist strap to add a little personality to your phone.",
    },
    {
        "id": 2,
        "name": "Floral Desk Mirror",
        "type": "mirror",
        "price": 120,
        "variants": [
            {"name": "Pink Petal", "image": "product/3.png"},
            {"name": "Orange Blossom", "image": "product/4.png"},
            {"name": "Rose Bouquet", "image": "product/5.png"},
            {"name": "Teal Bouquet", "image": "product/6.png"},
            {"name": "Pink Garden", "image": "product/7.png"},
            {"name": "Teal Daisy", "image": "product/8.png"},
            {"name": "Pink Floral", "image": "product/9.png"},
            {"name": "Golden Flower", "image": "product/10.png"},
            {"name": "Blue Bouquet", "image": "product/11.png"},
            {"name": "Yellow Daisy", "image": "product/12.png"},
            {"name": "Turquoise Garden", "image": "product/13.png"},
        ],
        "desc": "A handmade mirror decorated with a colorful floral design. Choose your favorite style.",
    },
    {
        "id": 3,
        "name": "Decorative Hair Clips",
        "type": "clips",
        "price": 50,
        "variants": [
            {"name": "Yellow Chick Clips", "image": "product/1.png"},
            {"name": "Blue Heart Clips", "image": "product/16.png"},
            {"name": "Red Bunny Clips", "image": "product/17.png"},
            {"name": "Cherry Clips", "image": "product/18.png"},
            {"name": "Teal Bunny Clips", "image": "product/19.png"},
            {"name": "Turquoise Bow Clips", "image": "product/20.png"},
            {"name": "Blue Gray Heart Clips", "image": "product/21.png"},
            {"name": "Yellow Blue Heart Clips", "image": "product/22.png"},
            {"name": "Mixed Bow Clips", "image": "product/24.png"},
            {"name": "Multicolor Heart Clips", "image": "product/25.png"},
            {"name": "Pink Blossom Clips", "image": "product/27.png"},
            {"name": "Red Yellow Bow Clips", "image": "product/28.png"},
            {"name": "Cherry Vine Clips", "image": "product/29.png"},
            {"name": "Orange Flower Clips", "image": "product/30.png"},
            {"name": "Blue Yellow Heart Clips", "image": "product/32.png"},
            {"name": "Primary Color Heart Clips", "image": "product/33.png"},
        ],
        "desc": "Soft, playful handmade clips in a range of colorful designs.",
    },
    {
        "id": 4,
        "name": "Cable Organizer",
        "type": "organizer",
        "price": 50,
        "variants": [
            {"name": "Pastel Cable Wrap", "image": "product/26.png"},
        ],
        "desc": "A handy wrap to keep cables together and easy to find.",
    },
    {
        "id": 5,
        "name": "Striped Flower Vase",
        "type": "decor",
        "price": 120,
        "variants": [
            {"name": "Red and White Flowers", "image": "product/14.png"},
        ],
        "desc": "A cheerful handmade flower arrangement in a striped vase.",
    },
    {
        "id": 6,
        "name": "Pink Flower Accessory",
        "type": "decor",
        "price": 70,
        "variants": [
            {"name": "Pink Flower", "image": "product/15.png"},
        ],
        "desc": "A small, flower-shaped handmade accessory.",
    },
    {
        "id": 7,
        "name": "Pom-Pom Charm",
        "type": "decor",
        "price": 55,
        "variants": [
            {"name": "Green Pom-Pom", "image": "product/23.png"},
        ],
        "desc": "A fluffy green charm with a handmade look.",
    },
    {
        "id": 8,
        "name": "Floral Ring Charm",
        "type": "decor",
        "price": 70,
        "variants": [
            {"name": "Red and White Flowers", "image": "product/31.png"},
        ],
        "desc": "A round floral handmade charm with a hanging loop.",
    },
]

STORAGE_KEY = "string-theory-cart"
notify_timer = None


def find_product(pid):
    for p in PRODUCTS:
        if p["id"] == pid:
            return p
    return None


def read_cart():
    try:
        raw = window.localStorage.getItem(STORAGE_KEY)
        if not raw:
            return []
        saved = json.loads(raw)
        if not isinstance(saved, list):
            return []
        result = []
        for item in saved:
            if not isinstance(item, dict):
                continue
            try:
                pid = int(item.get("id", 0))
                qty = int(item.get("qty", 0))
            except (ValueError, TypeError):
                continue
            product = find_product(pid)
            if not product or qty <= 0:
                continue
            opt = item.get("option")
            variant_names = [v["name"] for v in product["variants"]]
            option = opt if opt in variant_names else product["variants"][0]["name"]
            result.append({"id": product["id"], "option": option, "qty": qty})
        return result
    except Exception:
        return []


def save_cart(cart):
    window.localStorage.setItem(STORAGE_KEY, json.dumps(cart))
    update_badge(cart)


def format_price(amount):
    return f"₱{amount:,}"


def get_variant(product, option):
    for v in product["variants"]:
        if v["name"] == option:
            return v
    return product["variants"][0]


def update_badge(cart=None):
    if cart is None:
        cart = read_cart()
    count = sum(item["qty"] for item in cart)
    badges = document.querySelectorAll("[data-cart-count]")
    for badge in badges:
        badge.textContent = str(count)
        link = badge.closest(".cart, .cart-link")
        if link:
            item_word = "item" if count == 1 else "items"
            link.setAttribute("aria-label", f"Shopping cart, {count} {item_word}")


def notify(message):
    global notify_timer
    target = document.querySelector("[data-notice]")
    if not target:
        return
    target.textContent = message
    target.hidden = False
    target.style.display = "block"
    if notify_timer is not None:
        window.clearTimeout(notify_timer)

    def hide_notice():
        target.hidden = True
        target.style.display = "none"

    notify_timer = window.setTimeout(hide_notice, 2800)


def render_product_card(product):
    options_html = "".join(
        f'<option value="{v["name"]}">{v["name"]}</option>' for v in product["variants"]
    )
    return f"""
      <article class="card">
        <div class="product-art">
          <img src="{product['variants'][0]['image']}" alt="{product['name']} - {product['variants'][0]['name']}">
        </div>
        <div class="card-content">
          <h3>{product['name']}</h3>
          <p class="desc">{product['desc']}</p>
          <div class="price">{format_price(product['price'])}</div>
          <label class="variant-field">
            <span>Color / style</span>
            <select data-product-variant="{product['id']}" aria-label="Color or style for {product['name']}">
              {options_html}
            </select>
          </label>
          <button class="add" type="button" data-add-to-cart="{product['id']}">Add to Cart</button>
        </div>
      </article>"""


def render_featured():
    grid = document.querySelector("[data-featured-grid]")
    if not grid:
        return
    featured = PRODUCTS[:3]
    grid.innerHTML = "".join(render_product_card(p) for p in featured)


def render_products():
    grid = document.querySelector("[data-product-grid]")
    if not grid:
        return
    active_filter_el = document.querySelector(".filter.active")
    active_filter = "all"
    if active_filter_el:
        val = active_filter_el.getAttribute("data-filter")
        if val:
            active_filter = val
    shown = [p for p in PRODUCTS if active_filter == "all" or p["type"] == active_filter]
    grid.innerHTML = "".join(render_product_card(p) for p in shown)
    count = document.querySelector("[data-result-count]")
    if count:
        item_word = "item" if len(shown) == 1 else "items"
        count.textContent = f"{len(shown)} {item_word}"
    empty = document.querySelector("[data-products-empty]")
    if empty:
        empty.hidden = len(shown) > 0


def render_cart():
    cart_list = document.querySelector("[data-cart-list]")
    if not cart_list:
        return
    cart = read_cart()
    empty = len(cart) == 0
    items_in_cart = []
    for item in cart:
        product = find_product(item["id"])
        if product:
            items_in_cart.append({
                "product": product,
                "option": item["option"],
                "qty": item["qty"],
            })

    rows = []
    for entry in items_in_cart:
        p = entry["product"]
        opt = entry["option"]
        qty = entry["qty"]
        variant = get_variant(p, opt)
        line_total = format_price(p["price"] * qty)
        rows.append(f"""
      <article class="cart-row">
        <div class="cart-item-icon"><img src="{variant['image']}" alt="{p['name']} - {opt}"></div>
        <div class="cart-item-info"><h2>{p['name']}</h2><p>{opt}</p><p>{p['desc']}</p><button class="text-button" type="button" data-cart-action="remove" data-product-id="{p['id']}" data-product-option="{opt}">Remove</button></div>
        <div class="quantity-control" aria-label="Quantity for {p['name']}">
          <button type="button" aria-label="Decrease {p['name']} quantity" data-cart-action="decrease" data-product-id="{p['id']}" data-product-option="{opt}">−</button>
          <span>{qty}</span>
          <button type="button" aria-label="Increase {p['name']} quantity" data-cart-action="increase" data-product-id="{p['id']}" data-product-option="{opt}">+</button>
        </div>
        <strong class="line-total">{line_total}</strong>
      </article>""")

    cart_list.innerHTML = "".join(rows)
    subtotal = sum(entry["product"]["price"] * entry["qty"] for entry in items_in_cart)

    for el in document.querySelectorAll("[data-cart-empty]"):
        el.hidden = not empty
    for el in document.querySelectorAll("[data-cart-summary]"):
        el.hidden = empty
    for el in document.querySelectorAll("[data-cart-subtotal]"):
        el.textContent = format_price(subtotal)
    for el in document.querySelectorAll("[data-checkout-link]"):
        el.hidden = empty


def render_checkout():
    checkout_items = document.querySelector("[data-checkout-items]")
    if not checkout_items:
        return
    cart = read_cart()
    empty = len(cart) == 0
    total = 0
    lines = []
    for item in cart:
        product = find_product(item["id"])
        if product:
            line_cost = product["price"] * item["qty"]
            total += line_cost
            lines.append(
                f"<li><span>{item['qty']} x {product['name']} <small>({item['option']})</small></span><strong>{format_price(line_cost)}</strong></li>"
            )
    checkout_items.innerHTML = "".join(lines)
    for el in document.querySelectorAll("[data-checkout-empty]"):
        el.hidden = not empty
    for el in document.querySelectorAll("[data-checkout-form]"):
        el.hidden = empty
    for el in document.querySelectorAll("[data-checkout-total]"):
        el.textContent = format_price(total)


def add_to_cart(pid, option):
    cart = read_cart()
    found = None
    for item in cart:
        if item["id"] == pid and item["option"] == option:
            found = item
            break
    if found:
        found["qty"] += 1
    else:
        cart.append({"id": pid, "option": option, "qty": 1})
    save_cart(cart)
    product = find_product(pid)
    name = product["name"] if product else "Item"
    notify(f"{name} ({option}) added to your cart.")


def update_quantity(pid, option, action):
    cart = read_cart()
    item = None
    for entry in cart:
        if entry["id"] == pid and entry["option"] == option:
            item = entry
            break
    if not item:
        return
    if action == "remove":
        cart = [e for e in cart if not (e["id"] == pid and e["option"] == option)]
    elif action == "increase":
        item["qty"] += 1
    elif action == "decrease":
        item["qty"] -= 1
        if item["qty"] <= 0:
            cart = [e for e in cart if not (e["id"] == pid and e["option"] == option)]
    save_cart(cart)
    render_cart()


def on_filter_click(event):
    btn = event.currentTarget
    for item in document.querySelectorAll(".filter"):
        item.classList.remove("active")
    btn.classList.add("active")
    render_products()


def setup_filters():
    for btn in document.querySelectorAll(".filter"):
        btn.addEventListener("click", on_filter_click)


def on_form_submit(event):
    event.preventDefault()
    form = event.currentTarget
    is_order = form.getAttribute("data-mailto-form") == "order"
    cart = read_cart()
    if is_order and len(cart) == 0:
        notify("Your cart is empty. Add an item before requesting an order.")
        return

    lines = []
    if is_order:
        lines.append("Order request:")
        total = 0
        for item in cart:
            product = find_product(item["id"])
            if product:
                cost = product["price"] * item["qty"]
                total += cost
                lines.append(f"{item['qty']} x {product['name']} ({item['option']}) - {format_price(cost)}")
        lines.append(f"Estimated total: {format_price(total)}")
        lines.append("")
        lines.append("Customer details:")

    customer_email = ""
    for el in form.elements:
        name = el.getAttribute("name")
        val = el.value if el.value is not None else ""
        if name and name != "submit" and el.type != "submit":
            if name == "Email":
                customer_email = val
            lines.append(f"{name}: {val}")

    subject = "String Theory of Charms order request" if is_order else "String Theory of Charms inquiry"
    copy = f"&cc={window.encodeURIComponent(customer_email)}" if (is_order and customer_email) else ""
    body_text = "\n".join(lines)
    email = f"mailto:stringtheoryofcharms@gmail.com?subject={window.encodeURIComponent(subject)}{copy}&body={window.encodeURIComponent(body_text)}"

    if is_order:
        notify("Opening your email app with the order details and your address copied.")
    else:
        notify("Opening your email app with the message details.")

    window.location.href = email


def setup_email_forms():
    for form in document.querySelectorAll("[data-mailto-form]"):
        form.addEventListener("submit", on_form_submit)


def on_document_click(event):
    target = getattr(event, "target", None)
    if not target or not hasattr(target, "closest"):
        return
    add_button = target.closest("[data-add-to-cart]")
    if add_button:
        card = add_button.closest(".card")
        variant_select = card.querySelector("[data-product-variant]") if card else None
        option = variant_select.value if variant_select else ""
        attr_val = add_button.getAttribute("data-add-to-cart")
        if attr_val:
            add_to_cart(int(attr_val), option)
        return

    cart_button = event.target.closest("[data-cart-action]")
    if cart_button:
        attr_pid = cart_button.getAttribute("data-product-id")
        opt = cart_button.getAttribute("data-product-option") or ""
        action = cart_button.getAttribute("data-cart-action") or ""
        if attr_pid:
            update_quantity(int(attr_pid), opt, action)
        return


def on_document_change(event):
    target = getattr(event, "target", None)
    if not target or not hasattr(target, "closest"):
        return
    variant_select = target.closest("[data-product-variant]")
    if not variant_select:
        return
    attr_pid = variant_select.getAttribute("data-product-variant")
    if not attr_pid:
        return
    pid = int(attr_pid)
    product = find_product(pid)
    if not product:
        return
    variant = get_variant(product, variant_select.value)
    card = variant_select.closest(".card")
    if card:
        image = card.querySelector(".product-art img")
        if image:
            image.src = variant["image"]
            image.alt = f"{product['name']} - {variant['name']}"


def init():
    try:
        year = str(window.Date.new().getFullYear())
    except Exception:
        year = "2026"
    for el in document.querySelectorAll("[data-year]"):
        el.textContent = year

    update_badge()
    render_featured()
    render_products()
    render_cart()
    render_checkout()
    setup_filters()
    setup_email_forms()
    document.addEventListener("click", on_document_click)
    document.addEventListener("change", on_document_change)


if document.readyState == "loading":
    document.addEventListener("DOMContentLoaded", lambda e: init())
else:
    init()
