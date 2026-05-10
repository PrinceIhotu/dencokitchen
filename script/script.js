/* ============================================================
   DENCO KITCHEN – script.js
   Hamburger Nav | Cart | Menu Filter | Stats Counter | Animations
   ============================================================ */

(function () {
  "use strict";

  /* ──────────────────────────────────────────
     MENU DATA
  ────────────────────────────────────────── */
  const menuItems = [
       { id: 1,  name: "Jollof Rice",    price: 2500, img: "styles/jollofsplash.jpg", emoji: "🍚", badge: "Best Seller" },
    { id: 2,  name: "Fried Rice",     price: 2800,  img: "styles/Fried\ rice.jpg", emoji: "🍳", badge: "" },
    { id: 3,  name: "Asun Spag",   price: 3000,  img: "styles/Asun\ pasta.jpg", emoji: "🥢", badge: "Popular" },
    { id: 4,  name: "Yam & Egg",      price: 2000,  img: "styles/yams.jpg", emoji: "🍳", badge: "" },
    { id: 5,  name: "Sauced Turkey",  price: 4500,  img: "styles/Peppered\ turkey\ -\ KikiFoodies.jpg", emoji: "🍗", badge: "Premium" },
    { id: 6,  name: "Suya Rice",      price: 3200,  img: "styles/Nigeria\ 🇳🇬\ asun\ basmati\ rice\ and\ pineapple\ juice.jpg", emoji: "🍢", badge: "Spicy 🔥" },
    { id: 7,  name: "Egusi Soup",     price: 2600,  img: "styles/egusi", emoji: "🥘", badge: "" },
    { id: 8,  name: "Meat Pie",       price: 800, img: "styles/Nigerian\ Meat\ Pies.jpg",  emoji: "🥧", badge: "Snack" },
  ];

  /* ──────────────────────────────────────────
     STATE
  ────────────────────────────────────────── */
  let cart = [];
  let activeCategory = "all";

  /* ──────────────────────────────────────────
     DOM REFS
  ────────────────────────────────────────── */
  const navbar       = document.getElementById("navbar");
  const hamburger    = document.getElementById("hamburger");
  const mobileNav    = document.getElementById("mobileNav");
  const mobileClose  = document.getElementById("mobileNavClose");
  const mobileLinks  = document.querySelectorAll(".mobile-link, .mobile-order-btn");
  const fabCart      = document.getElementById("fabCart");
  const fabCartCount = document.getElementById("fabCartCount");
  const cartSidebar  = document.getElementById("cartSidebar");
  const cartOverlay  = document.getElementById("cartOverlay");
  const cartClose    = document.getElementById("cartClose");
  const cartItemsEl  = document.getElementById("cartItems");
  const cartEmpty    = document.getElementById("cartEmpty");
  const cartFooter   = document.getElementById("cartFooter");
  const cartTotal    = document.getElementById("cartTotal");
  const menuGrid     = document.getElementById("menuGrid");
  const tabBtns      = document.querySelectorAll(".tab-btn");
  const adminLink    = document.getElementById("adminLink");
  const adminModal   = document.getElementById("adminModal");
  const adminClose   = document.getElementById("adminModalClose");
  const whatsappBtn  = document.getElementById("whatsappOrder");
  const toast        = document.getElementById("toast");

  /* ──────────────────────────────────────────
     NAVBAR – scroll effect
  ────────────────────────────────────────── */
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 60);
    // Highlight active nav link
    highlightNavLink();
  });

  function highlightNavLink() {
    const sections = document.querySelectorAll("section[id], header[id]");
    let current = "";
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
    });
    document.querySelectorAll(".nav-link").forEach((a) => {
      a.classList.toggle("active", a.getAttribute("href") === `#${current}`);
    });
  }

  /* ──────────────────────────────────────────
     MOBILE NAV – hamburger toggle
  ────────────────────────────────────────── */
  let backdrop;

  function openMobileNav() {
    mobileNav.classList.add("open");
    hamburger.classList.add("open");
    hamburger.setAttribute("aria-expanded", "true");
    // Backdrop
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.className = "mobile-nav-backdrop";
      document.body.appendChild(backdrop);
      backdrop.addEventListener("click", closeMobileNav);
    }
    requestAnimationFrame(() => backdrop.classList.add("active"));
    document.body.style.overflow = "hidden";
  }

  function closeMobileNav() {
    mobileNav.classList.remove("open");
    hamburger.classList.remove("open");
    hamburger.setAttribute("aria-expanded", "false");
    if (backdrop) backdrop.classList.remove("active");
    document.body.style.overflow = "";
  }

  hamburger.addEventListener("click", () => {
    if (mobileNav.classList.contains("open")) closeMobileNav();
    else openMobileNav();
  });

  mobileClose.addEventListener("click", closeMobileNav);

  mobileLinks.forEach((link) => {
    link.addEventListener("click", closeMobileNav);
  });

  /* ──────────────────────────────────────────
     MENU RENDER
  ────────────────────────────────────────── */
  function renderMenu() {
    menuGrid.innerHTML = "";

    menuItems.forEach((item, i) => {
      const card = document.createElement("div");
      card.className = "menu-card reveal";
      card.style.animationDelay = `${i * 0.07}s`;
      card.innerHTML = `
        <div class="menu-card-img">
        <img src="${item.img}" alt="${item.name}" class="card-photo" />
          ${item.badge ? `<span class="menu-card-badge">${item.badge}</span>` : ""}
        </div>
        <div class="menu-card-body">
          <div class="menu-card-info">
            <h3 class="menu-card-title">${item.name}</h3>
            <div class="menu-card-price">₦${item.price.toLocaleString()}</div>
          </div>
          <button class="add-to-cart" data-id="${item.id}" aria-label="Add ${item.name} to cart">
            <i class="fas fa-plus"></i>
          </button>
        </div>
      `;
      menuGrid.appendChild(card);
    });

    initReveal();

    menuGrid.querySelectorAll(".add-to-cart").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        const id = parseInt(e.currentTarget.dataset.id);
        addToCart(id);
        const icon = e.currentTarget.querySelector("i");
        icon.className = "fas fa-check";
        e.currentTarget.style.background = "var(--green)";
        setTimeout(() => {
          icon.className = "fas fa-plus";
          e.currentTarget.style.background = "";
        }, 900);
      });
    });
  }

  /* ──────────────────────────────────────────
     CART – open / close
  ────────────────────────────────────────── */
  function openCart() {
    cartSidebar.classList.add("open");
    cartOverlay.classList.add("active");
    document.body.style.overflow = "hidden";
  }

  function closeCart() {
    cartSidebar.classList.remove("open");
    cartOverlay.classList.remove("active");
    document.body.style.overflow = "";
  }

  fabCart && fabCart.addEventListener("click", openCart);
  cartClose.addEventListener("click", closeCart);
  cartOverlay.addEventListener("click", closeCart);

  /* ──────────────────────────────────────────
     CART – add / update / remove
  ────────────────────────────────────────── */
  function addToCart(id) {
    const item = menuItems.find((m) => m.id === id);
    if (!item) return;
    const existing = cart.find((c) => c.id === id);
    if (existing) {
      existing.qty += 1;
    } else {
      cart.push({ ...item, qty: 1 });
    }
    updateCartUI();
    openCart();
    showToast(`${item.emoji} ${item.name} added!`, "success");
    // FAB pulse
    if (fabCart) {
      fabCart.classList.remove("pulse");
      void fabCart.offsetWidth; // reflow to restart animation
      fabCart.classList.add("pulse");
      setTimeout(() => fabCart.classList.remove("pulse"), 700);
    }
  }

  function updateQty(id, delta) {
    const idx = cart.findIndex((c) => c.id === id);
    if (idx === -1) return;
    cart[idx].qty += delta;
    if (cart[idx].qty <= 0) cart.splice(idx, 1);
    updateCartUI();
  }

  function updateCartUI() {
    const total = cart.reduce((s, c) => s + c.price * c.qty, 0);
    const count = cart.reduce((s, c) => s + c.qty, 0);

    // FAB badge
    if (fabCartCount) {
      fabCartCount.textContent = count;
      fabCartCount.classList.toggle("visible", count > 0);
    }

    // Items list
    cartItemsEl.innerHTML = "";

    if (cart.length === 0) {
      cartItemsEl.appendChild(cartEmpty);
      cartEmpty.style.display = "flex";
      cartFooter.style.display = "none";
      return;
    }

    cartEmpty.style.display = "none";
    cartFooter.style.display = "block";
    cartTotal.textContent = `₦${total.toLocaleString()}`;

    cart.forEach((item) => {
      const el = document.createElement("div");
      el.className = "cart-item";
      el.innerHTML = `
        <div class="cart-item-emoji">${item.emoji}</div>
        <div class="cart-item-info">
          <div class="cart-item-name">${item.name}</div>
          <div class="cart-item-price">₦${(item.price * item.qty).toLocaleString()}</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" data-id="${item.id}" data-delta="-1">−</button>
          <span class="qty-display">${item.qty}</span>
          <button class="qty-btn" data-id="${item.id}" data-delta="1">+</button>
        </div>
      `;
      cartItemsEl.appendChild(el);
    });

    cartItemsEl.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        updateQty(parseInt(btn.dataset.id), parseInt(btn.dataset.delta));
      });
    });

    // Build WhatsApp order message
    const lines = cart.map((c) => `• ${c.name} x${c.qty} = ₦${(c.price * c.qty).toLocaleString()}`).join("%0A");
    const msg = `Hello Denco Kitchen! 🍽️%0A%0AI'd like to place an order:%0A%0A${lines}%0A%0A*Total: ₦${total.toLocaleString()}*%0A%0APlease confirm availability and delivery. Thank you!`;
    if (whatsappBtn) whatsappBtn.href = `https://wa.me/2348000000000?text=${msg}`;
  }

  /* ──────────────────────────────────────────
     STATS COUNTER ANIMATION
  ────────────────────────────────────────── */
  function animateCounter(el, target, duration = 1800) {
    const start = performance.now();
    const startVal = 0;

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const ease = 1 - Math.pow(1 - progress, 3);
      const val = Math.round(startVal + (target - startVal) * ease);
      el.textContent = val >= 1000 ? val.toLocaleString() : val;
      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  let statsAnimated = false;

  function checkStats() {
    if (statsAnimated) return;
    const statsSection = document.querySelector(".stats-section");
    if (!statsSection) return;
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      statsAnimated = true;
      document.querySelectorAll(".stat-number[data-target]").forEach((el) => {
        animateCounter(el, parseInt(el.dataset.target));
      });
    }
  }

  window.addEventListener("scroll", checkStats, { passive: true });
  checkStats();

  /* ──────────────────────────────────────────
     SCROLL REVEAL (IntersectionObserver)
  ────────────────────────────────────────── */
  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );

    document.querySelectorAll(".reveal").forEach((el) => {
      if (!el.classList.contains("visible")) observer.observe(el);
    });
  }

  // Add reveal class to sections
  function attachRevealToSections() {
    const targets = document.querySelectorAll(
      ".brand-story-grid, .stat-card, .service-card, .testi-card, .cta-content, .section-header, .footer-col, .footer-brand"
    );
    targets.forEach((el) => el.classList.add("reveal"));
    initReveal();
  }

  /* ──────────────────────────────────────────
     ADMIN MODAL
  ────────────────────────────────────────── */
  if (adminLink) {
    adminLink.addEventListener("click", (e) => {
      e.preventDefault();
      adminModal.style.display = "flex";
    });
  }

  if (adminClose) {
    adminClose.addEventListener("click", () => {
      adminModal.style.display = "none";
    });
  }

  adminModal && adminModal.addEventListener("click", (e) => {
    if (e.target === adminModal) adminModal.style.display = "none";
  });

  /* ──────────────────────────────────────────
     SMOOTH SCROLL for all anchor links
  ────────────────────────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const target = document.querySelector(a.getAttribute("href"));
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    });
  });

  /* ──────────────────────────────────────────
     TOAST NOTIFICATION
  ────────────────────────────────────────── */
  let toastTimer;

  function showToast(msg, type = "") {
    clearTimeout(toastTimer);
    toast.textContent = msg;
    toast.className = `toast ${type} show`;
    toastTimer = setTimeout(() => {
      toast.classList.remove("show");
    }, 2800);
  }

  /* ──────────────────────────────────────────
     KEYBOARD accessibility
  ────────────────────────────────────────── */
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeMobileNav();
      closeCart();
      if (adminModal) adminModal.style.display = "none";
    }
  });

  /* ──────────────────────────────────────────
     INIT
  ────────────────────────────────────────── */
  renderMenu();
  attachRevealToSections();
  updateCartUI();

})();
