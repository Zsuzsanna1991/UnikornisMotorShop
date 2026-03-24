document.addEventListener("DOMContentLoaded", () => {

    // --- HEADER betöltése ---
    fetch("header.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("header").innerHTML = data;
            attachCartListeners();
            updateCartCount();
        });

    // --- FOOTER betöltése ---
    fetch("footer.html")
        .then(res => res.text())
        .then(data => {
            document.getElementById("footer").innerHTML = data;
        });

    // --- Saját oldal add-to-cart gombjai ---
    attachCartListeners();

    // --- Kosár render cart.html-re ---
    if (document.getElementById("cart-items")) {
        renderCart();
    }
});

function attachCartListeners() {
    document.querySelectorAll('.add-to-cart').forEach(button => {
        if (!button.dataset.listener) {
            button.addEventListener('click', e => {
                e.preventDefault();
                const name = button.dataset.name;
                const price = parseInt(button.dataset.price);

                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                let existing = cart.find(item => item.name === name);
                if (existing) {
                    existing.quantity += 1;
                } else {
                    cart.push({ name, price, quantity: 1 });
                }

                localStorage.setItem('cart', JSON.stringify(cart));
                updateCartCount();
                alert(`${name} a kosárba`);
            });
            button.dataset.listener = "true";
        }
    });
}

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountEl = document.getElementById('cart-count');
    if (cartCountEl) cartCountEl.textContent = totalItems;
}

// --- cart.html kosár renderelése ---
function renderCart() {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const tbody = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    tbody.innerHTML = "";

    if (cart.length === 0) {
        tbody.innerHTML = `<tr><td colspan="5" class="text-center">A kosár üres</td></tr>`;
        totalEl.textContent = "";
        return;
    }

    let total = 0;
    cart.forEach((item, index) => {
        let itemTotal = item.price * item.quantity;
        total += itemTotal;
        tbody.innerHTML += `
            <tr>
                <td>${item.name}</td>
                <td>${item.price} Ft</td>
                <td>
                    <button class="btn btn-sm btn-secondary" onclick="changeQty(${index}, -1)">-</button>
                    ${item.quantity}
                    <button class="btn btn-sm btn-secondary" onclick="changeQty(${index}, 1)">+</button>
                </td>
                <td>${itemTotal} Ft</td>
                <td>
                    <button class="btn btn-sm btn-danger" onclick="removeItem(${index})">❌</button>
                </td>
            </tr>`;
    });

    totalEl.textContent = "Total: " + total + " Ft";
}

function changeQty(index, amount) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart[index].quantity += amount;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}

function removeItem(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.splice(index, 1);
    localStorage.setItem('cart', JSON.stringify(cart));
    renderCart();
    updateCartCount();
}