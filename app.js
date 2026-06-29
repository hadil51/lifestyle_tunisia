function stars(rating) {
  const count = Math.max(0, Math.min(5, Number(rating) || 5));
  return "★".repeat(count) + "☆".repeat(5 - count);
}

function renderNavigation(navItems) {
  const nav = document.getElementById("mainNav");
  nav.innerHTML = navItems
    .map((item) => `<a href="${escapeHtml(item.href)}">${escapeHtml(item.label)}</a>`)
    .join("");
}

function renderHeroBanner(banner) {
  const el = document.getElementById("heroBanner");
  const overlay = Math.max(0, Math.min(0.85, Number(banner.overlayOpacity) || 0.45));
  const eager = { loading: "eager", fetchpriority: "high" };
  el.innerHTML = `
    <div class="tile-media">${buildMediaHtml(banner, "media-fill", eager)}</div>
    <div class="tile-overlay" style="background:rgba(0,0,0,${overlay})"></div>
    <div class="tile-content">
      <h1>${escapeHtml(banner.title)}</h1>
      <p>${escapeHtml(banner.subtitle)}</p>
      <a class="btn-outline" href="${escapeHtml(banner.ctaLink || "#men-latest")}">${escapeHtml(banner.ctaText)}</a>
    </div>
  `;
}

function renderCategoryTiles(tiles) {
  const wrap = document.getElementById("categoryTiles");
  wrap.innerHTML = tiles
    .map(
      (tile, index) => `
    <a class="category-tile reveal" href="${escapeHtml(tile.link || "#")}">
      <div class="tile-media">${buildMediaHtml(tile, "media-fill", index === 0 ? { loading: "eager", fetchpriority: "high" } : { loading: "eager" })}</div>
      <div class="tile-overlay"></div>
      <div class="tile-content">
        <h3>${escapeHtml(tile.title)}</h3>
        <p>${escapeHtml(tile.subtitle)}</p>
      </div>
    </a>
  `
    )
    .join("");
}

function renderProductCard(product, index = 0) {
  const mediaOptions = index < 4 ? { loading: "eager" } : { loading: "lazy" };
  return `
    <article class="product-card">
      <div class="product-image-wrap">
        ${buildProductMediaHtml(product, mediaOptions)}
        <div class="product-actions">
          <span title="View">👁</span>
          <span title="Favorite">★</span>
          <span title="Cart">🛒</span>
        </div>
      </div>
      <div class="product-info">
        <div class="product-top">
          <h3>${escapeHtml(product.name)}</h3>
          <span class="rating">${stars(product.rating)}</span>
        </div>
        <p class="price">${escapeHtml(product.price)}</p>
      </div>
    </article>
  `;
}

function renderProductSections(sections, products) {
  const wrap = document.getElementById("productSections");
  wrap.innerHTML = sections
    .map((section) => {
      const sectionProducts = products.filter((p) => p.section === section.key);
      const cards = sectionProducts.map((product, index) => renderProductCard(product, index)).join("");
      return `
      <section id="men-${escapeHtml(section.key)}" class="section product-section reveal">
        <div class="container">
          <div class="section-head">
            <h2>${escapeHtml(section.title)}</h2>
            <p class="italic">${escapeHtml(section.subtitle)}</p>
          </div>
          <div class="carousel-wrap">
            <button class="carousel-btn prev" data-target="carousel-${escapeHtml(section.key)}" aria-label="Previous">‹</button>
            <div id="carousel-${escapeHtml(section.key)}" class="carousel">${cards}</div>
            <button class="carousel-btn next" data-target="carousel-${escapeHtml(section.key)}" aria-label="Next">›</button>
          </div>
        </div>
      </section>
    `;
    })
    .join("");
}

function renderFeaturedVideo(video) {
  const el = document.getElementById("featuredVideo");
  const height = Math.max(280, Math.min(800, Number(video.height) || 520));
  el.innerHTML = `
    <div class="section-head">
      <h2>${escapeHtml(video.title)}</h2>
      <p class="italic">${escapeHtml(video.subtitle)}</p>
    </div>
    <div class="featured-video-wrap" style="height:${height}px">
      <div class="tile-media">${buildMediaHtml(video, "featured-media")}</div>
    </div>
  `;
}

function renderExplore(explore) {
  const el = document.getElementById("explore");
  const tiles = explore.tiles
    .map((tile) => {
      if (tile.type === "text") {
        return `
        <article class="explore-tile text-tile reveal">
          <h3>${escapeHtml(tile.title)}</h3>
          <p class="italic">${escapeHtml(tile.subtitle)}</p>
        </article>
      `;
      }
      return `
      <article class="explore-tile media-tile reveal">
        <div class="tile-media">${buildMediaHtml(tile)}</div>
      </article>
    `;
    })
    .join("");

  el.innerHTML = `
    <div class="explore-grid">
      <div class="explore-copy reveal">
        <h2>${escapeHtml(explore.title)}</h2>
        <p>${escapeHtml(explore.paragraph1)}</p>
        <blockquote>${escapeHtml(explore.quote)}</blockquote>
        <p>${escapeHtml(explore.paragraph2)}</p>
        <a class="btn-outline dark" href="#men-latest">${escapeHtml(explore.ctaText)}</a>
      </div>
      <div class="explore-tiles">${tiles}</div>
    </div>
  `;
}

function renderSocial(social) {
  const el = document.getElementById("social");
  const items = social.items
    .map(
      (item) => `
    <article class="social-item reveal">
      <div class="tile-media">${buildMediaHtml(item)}</div>
    </article>
  `
    )
    .join("");

  el.innerHTML = `
    <div class="container">
      <div class="section-head center">
        <h2>${escapeHtml(social.title)}</h2>
        <p class="italic">${escapeHtml(social.subtitle)}</p>
      </div>
      <div class="social-grid">${items}</div>
    </div>
  `;
}

function renderNewsletter(data) {
  const el = document.getElementById("newsletter");
  el.innerHTML = `
    <div class="newsletter-grid">
      <div>
        <h2>${escapeHtml(data.title)}</h2>
        <p class="italic">${escapeHtml(data.subtitle)}</p>
        <form class="newsletter-form" onsubmit="event.preventDefault()">
          <input type="text" placeholder="Your Name" />
          <input type="email" placeholder="Your Email Address" />
          <button type="submit" aria-label="Subscribe">➤</button>
        </form>
      </div>
      <div class="newsletter-info">
        <p><strong>Store Location:</strong> ${escapeHtml(data.storeLocation)}</p>
        <p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>
        <p><strong>Office Location:</strong> ${escapeHtml(data.officeLocation)}</p>
        <p><strong>Work Hours:</strong> ${escapeHtml(data.workHours)}</p>
        <p><strong>Email:</strong> ${escapeHtml(data.email)}</p>
        <p><strong>Social Media:</strong> ${escapeHtml(data.socialLinks)}</p>
      </div>
    </div>
  `;
}

function renderFooter(footer, site) {
  const el = document.getElementById("siteFooter");
  const col2 = footer.col2Links.split(",").map((l) => l.trim()).filter(Boolean);
  const col3 = footer.col3Links.split(",").map((l) => l.trim()).filter(Boolean);
  const col4 = footer.col4Links.split(",").map((l) => l.trim()).filter(Boolean);

  el.innerHTML = `
    <div class="container footer-top">
      <div>
        <div class="footer-brand">
          <img src="${escapeHtml(normalizeAssetPath(site.logoUrl))}" alt="logo" />
          <div>
            <strong>${escapeHtml(site.brandName)}</strong>
            <small>${escapeHtml(site.brandSubtitle)}</small>
          </div>
        </div>
        <p>${escapeHtml(footer.address)}</p>
        <p>${escapeHtml(footer.email)}</p>
        <p>${escapeHtml(footer.phone)}</p>
      </div>
      <div>
        <h4>${escapeHtml(footer.col2Title)}</h4>
        ${col2.map((l) => `<a href="#">${escapeHtml(l)}</a>`).join("")}
      </div>
      <div>
        <h4>${escapeHtml(footer.col3Title)}</h4>
        ${col3.map((l) => `<a href="#">${escapeHtml(l)}</a>`).join("")}
      </div>
      <div>
        <h4>${escapeHtml(footer.col4Title)}</h4>
        ${col4.map((l) => `<a href="#">${escapeHtml(l)}</a>`).join("")}
      </div>
    </div>
    <div class="container footer-bottom">
      <p>${escapeHtml(footer.copyright)}</p>
      <div class="social-icons">f · t · in · b</div>
    </div>
  `;
}

let carouselsReady = false;

function setupCarousels() {
  if (carouselsReady) return;
  carouselsReady = true;
  document.body.addEventListener("click", (event) => {
    const btn = event.target.closest(".carousel-btn");
    if (!btn) return;
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    const amount = target.clientWidth * 0.85;
    target.scrollBy({ left: btn.classList.contains("prev") ? -amount : amount, behavior: "smooth" });
  });
}

function setupRevealAnimations() {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05, rootMargin: "0px 0px -20px 0px" }
  );
  document.querySelectorAll(".reveal").forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight * 1.05) {
      el.classList.add("visible");
    }
    io.observe(el);
  });
}

function renderPage(content) {
  document.getElementById("brandName").textContent = content.site.brandName;
  document.getElementById("brandSubtitle").textContent = content.site.brandSubtitle;
  const logo = document.getElementById("brandLogo");
  logo.loading = "eager";
  logo.decoding = "async";
  logo.fetchPriority = "high";
  logo.src = normalizeAssetPath(content.site.logoUrl);
  document.getElementById("announcementBar").textContent = content.site.announcement;

  renderNavigation(content.navigation);
  renderHeroBanner(content.heroBanner);
  renderCategoryTiles(content.categoryTiles);
  renderProductSections(content.productSections, content.products);
  renderFeaturedVideo(content.featuredVideo);
  renderExplore(content.explore);
  renderSocial(content.social);
  renderNewsletter(content.newsletter);
  renderFooter(content.footer, content.site);

  setupCarousels();
  setupRevealAnimations();
}

async function init() {
  renderPage(loadCachedContent());
  const fresh = await loadRemoteContent();
  if (fresh) renderPage(fresh);
}

init();
