function setStatus(text, isError = false) {
  const status = document.getElementById("status");
  status.textContent = text;
  status.style.color = isError ? "#a22e2e" : "#1f7a2e";
}

function setDeep(obj, path, value) {
  const keys = path.split(".");
  let current = obj;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const key = keys[i];
    if (!current[key] || typeof current[key] !== "object") current[key] = {};
    current = current[key];
  }
  current[keys[keys.length - 1]] = value;
}

function getDeep(obj, path) {
  return path.split(".").reduce((acc, key) => (acc ? acc[key] : undefined), obj);
}

function val(v) {
  return String(v ?? "").replace(/"/g, "&quot;");
}

function formatSaveResult(result) {
  if (result.ok && result.remoteSaved) {
    return { text: "Saved to Supabase. Refresh the website to see changes.", isError: false };
  }
  if (result.localSaved && !result.remoteSaved && isSupabaseConfigured()) {
    return {
      text: `Saved locally only. Supabase sync failed: ${result.error || "unknown error"}`,
      isError: true,
    };
  }
  if (result.localSaved) {
    return { text: "Saved locally.", isError: false };
  }
  return {
    text: result.error || "Save failed. Try smaller images or hosted media URLs.",
    isError: true,
  };
}

let state = defaultContent();
let productFilter = "";

function renderFormFields() {
  const form = document.getElementById("adminForm");
  form.querySelectorAll("input[name], textarea[name], select[name]").forEach((field) => {
    if (field.type === "checkbox") {
      field.checked = Boolean(getDeep(state, field.name));
      return;
    }
    field.value = getDeep(state, field.name) ?? "";
  });
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("Could not read file."));
    reader.readAsDataURL(file);
  });
}

function renderNav() {
  const wrap = document.getElementById("navList");
  wrap.innerHTML = state.navigation
    .map(
      (item, i) => `
    <div class="item-card">
      <h4>Link ${i + 1}</h4>
      <div class="row">
        <label>Label <input data-nav="${i}" data-field="label" value="${val(item.label)}" /></label>
        <label>Href <input data-nav="${i}" data-field="href" value="${val(item.href)}" /></label>
      </div>
      <button type="button" data-remove-nav="${i}" class="danger">Remove</button>
    </div>
  `
    )
    .join("");
}

function renderCategoryTiles() {
  const wrap = document.getElementById("categoryTilesList");
  wrap.innerHTML = state.categoryTiles
    .map(
      (tile, i) => `
    <div class="item-card">
      <h4>Tile ${i + 1}</h4>
      <div class="row">
        <label>Title <input data-tile="${i}" data-field="title" value="${val(tile.title)}" /></label>
        <label>Subtitle <input data-tile="${i}" data-field="subtitle" value="${val(tile.subtitle)}" /></label>
        <label>Link <input data-tile="${i}" data-field="link" value="${val(tile.link)}" /></label>
        <label>
          Media Type
          <select data-tile="${i}" data-field="mediaType">
            <option value="image" ${tile.mediaType === "image" ? "selected" : ""}>Image</option>
            <option value="video" ${tile.mediaType === "video" ? "selected" : ""}>Video</option>
            <option value="instagram" ${tile.mediaType === "instagram" ? "selected" : ""}>Instagram Reel</option>
          </select>
        </label>
        <label>Media URL <input data-tile="${i}" data-field="mediaUrl" value="${val(tile.mediaUrl)}" /></label>
        <label>Focus X <input type="number" data-tile="${i}" data-field="focusX" value="${tile.focusX ?? 50}" /></label>
        <label>Focus Y <input type="number" data-tile="${i}" data-field="focusY" value="${tile.focusY ?? 50}" /></label>
      </div>
    </div>
  `
    )
    .join("");
}

function renderProductSections() {
  const wrap = document.getElementById("productSectionsList");
  wrap.innerHTML = state.productSections
    .map(
      (section, i) => `
    <div class="item-card">
      <h4>${val(section.key)}</h4>
      <div class="row">
        <label>Title <input data-section="${i}" data-field="title" value="${val(section.title)}" /></label>
        <label>Subtitle <input data-section="${i}" data-field="subtitle" value="${val(section.subtitle)}" /></label>
      </div>
    </div>
  `
    )
    .join("");
}

function renderExploreTiles() {
  const wrap = document.getElementById("exploreTilesList");
  wrap.innerHTML = state.explore.tiles
    .map((tile, i) => {
      if (tile.type === "text") {
        return `
        <div class="item-card">
          <h4>Tile ${i + 1} (Text)</h4>
          <div class="row">
            <label>Title <input data-explore="${i}" data-field="title" value="${val(tile.title)}" /></label>
            <label>Subtitle <input data-explore="${i}" data-field="subtitle" value="${val(tile.subtitle)}" /></label>
          </div>
        </div>
      `;
      }
      return `
      <div class="item-card">
        <h4>Tile ${i + 1} (Media)</h4>
        <div class="row">
          <label>
            Media Type
            <select data-explore="${i}" data-field="mediaType">
              <option value="image" ${tile.mediaType === "image" ? "selected" : ""}>Image</option>
              <option value="video" ${tile.mediaType === "video" ? "selected" : ""}>Video</option>
              <option value="instagram" ${tile.mediaType === "instagram" ? "selected" : ""}>Instagram Reel</option>
            </select>
          </label>
          <label>Media URL <input data-explore="${i}" data-field="mediaUrl" value="${val(tile.mediaUrl)}" /></label>
          <label>Focus X <input type="number" data-explore="${i}" data-field="focusX" value="${tile.focusX ?? 50}" /></label>
          <label>Focus Y <input type="number" data-explore="${i}" data-field="focusY" value="${tile.focusY ?? 50}" /></label>
        </div>
      </div>
    `;
    })
    .join("");
}

function renderSocial() {
  const wrap = document.getElementById("socialList");
  wrap.innerHTML = state.social.items
    .map(
      (item, i) => `
    <div class="item-card">
      <h4>Social Item ${i + 1}</h4>
      <div class="row">
        <label>
          Media Type
          <select data-social="${i}" data-field="mediaType">
            <option value="image" ${item.mediaType === "image" ? "selected" : ""}>Image</option>
            <option value="video" ${item.mediaType === "video" ? "selected" : ""}>Video</option>
            <option value="instagram" ${item.mediaType === "instagram" ? "selected" : ""}>Instagram Reel</option>
          </select>
        </label>
        <label>Media URL <input data-social="${i}" data-field="mediaUrl" value="${val(item.mediaUrl)}" /></label>
        <label>Focus X <input type="number" data-social="${i}" data-field="focusX" value="${item.focusX ?? 50}" /></label>
        <label>Focus Y <input type="number" data-social="${i}" data-field="focusY" value="${item.focusY ?? 50}" /></label>
      </div>
      <button type="button" data-remove-social="${i}" class="danger">Remove</button>
    </div>
  `
    )
    .join("");
}

function renderProducts() {
  const wrap = document.getElementById("productsList");
  wrap.innerHTML = state.products
    .map((product, index) => {
      const hidden = productFilter && product.section !== productFilter ? "product-hidden" : "";
      return `
      <div class="item-card ${hidden}" data-product-section="${product.section}">
        <h4>#${index + 1} — ${val(product.name)}</h4>
        <div class="row">
          <label>Name <input data-product="${index}" data-field="name" value="${val(product.name)}" /></label>
          <label>Price <input data-product="${index}" data-field="price" value="${val(product.price)}" /></label>
          <label>
            Section
            <select data-product="${index}" data-field="section">
              <option value="latest" ${product.section === "latest" ? "selected" : ""}>Men's Latest</option>
              <option value="formal" ${product.section === "formal" ? "selected" : ""}>Men's Formal</option>
              <option value="casual" ${product.section === "casual" ? "selected" : ""}>Men's Casual</option>
              <option value="street" ${product.section === "street" ? "selected" : ""}>Men's Street</option>
            </select>
          </label>
          <label>Rating (1-5) <input type="number" min="1" max="5" data-product="${index}" data-field="rating" value="${product.rating ?? 5}" /></label>
          <label>Image URL <input data-product="${index}" data-field="image" value="${val(product.image)}" /></label>
        </div>
        <button type="button" data-remove-product="${index}" class="danger">Remove</button>
      </div>
    `;
    })
    .join("");
}

function renderAll() {
  renderFormFields();
  renderNav();
  renderCategoryTiles();
  renderProductSections();
  renderExploreTiles();
  renderSocial();
  renderProducts();
}

function bindEvents() {
  const form = document.getElementById("adminForm");

  form.addEventListener("input", (event) => {
    const t = event.target;

    if (t.matches("[data-nav]")) {
      const i = Number(t.dataset.nav);
      state.navigation[i][t.dataset.field] = t.value;
      return;
    }
    if (t.matches("[data-tile]")) {
      const i = Number(t.dataset.tile);
      const v = t.type === "number" ? Number(t.value) : t.value;
      state.categoryTiles[i][t.dataset.field] = v;
      return;
    }
    if (t.matches("[data-section]")) {
      const i = Number(t.dataset.section);
      state.productSections[i][t.dataset.field] = t.value;
      return;
    }
    if (t.matches("[data-explore]")) {
      const i = Number(t.dataset.explore);
      const v = t.type === "number" ? Number(t.value) : t.value;
      state.explore.tiles[i][t.dataset.field] = v;
      return;
    }
    if (t.matches("[data-social]")) {
      const i = Number(t.dataset.social);
      const v = t.type === "number" ? Number(t.value) : t.value;
      state.social.items[i][t.dataset.field] = v;
      return;
    }
    if (t.matches("[data-product]")) {
      const i = Number(t.dataset.product);
      const v = t.type === "number" ? Number(t.value) : t.value;
      state.products[i][t.dataset.field] = v;
      return;
    }
    if (t.name) {
      const v =
        t.type === "checkbox" ? t.checked : t.type === "number" ? Number(t.value) : t.value;
      setDeep(state, t.name, v);
    }
  });

  document.getElementById("heroBannerUpload").addEventListener("change", async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      const dataUrl = await readFileAsDataURL(file);
      state.heroBanner.mediaUrl = dataUrl;
      if (file.type.startsWith("video/")) {
        state.heroBanner.mediaType = "video";
      } else if (file.type.startsWith("image/")) {
        state.heroBanner.mediaType = "image";
      }
      renderFormFields();
      setStatus("Hero media loaded from desktop. Click Save All Changes.");
    } catch {
      setStatus("Failed to load selected file.", true);
    }
  });

  form.addEventListener("click", (event) => {
    const t = event.target;
    if (t.matches("[data-remove-nav]")) {
      state.navigation.splice(Number(t.dataset.removeNav), 1);
      renderNav();
    }
    if (t.matches("[data-remove-social]")) {
      state.social.items.splice(Number(t.dataset.removeSocial), 1);
      renderSocial();
    }
    if (t.matches("[data-remove-product]")) {
      state.products.splice(Number(t.dataset.removeProduct), 1);
      renderProducts();
    }
  });

  document.getElementById("addNav").addEventListener("click", () => {
    state.navigation.push({ label: "New Link", href: "#" });
    renderNav();
  });

  document.getElementById("addSocial").addEventListener("click", () => {
    state.social.items.push({
      mediaType: "image",
      mediaUrl: "https://picsum.photos/seed/new-social/500/500",
      focusX: 50,
      focusY: 50,
    });
    renderSocial();
  });

  document.getElementById("addProduct").addEventListener("click", () => {
    state.products.unshift({
      id: Date.now(),
      name: "New Men Product",
      price: "99 TND",
      category: "Men",
      section: productFilter || "latest",
      rating: 5,
      image: "assets/template-reference.png",
    });
    renderProducts();
    setStatus("Product added.");
  });

  document.getElementById("productFilter").addEventListener("change", (e) => {
    productFilter = e.target.value;
    renderProducts();
  });

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    setStatus("Saving...");
    const result = await saveContent(state);
    const message = formatSaveResult(result);
    setStatus(message.text, message.isError);
  });

  document.getElementById("resetDefault").addEventListener("click", async () => {
    state = defaultContent();
    renderAll();
    const result = await saveContent(state);
    const message = formatSaveResult(result);
    setStatus(message.isError ? `Reset done. ${message.text}` : "Reset to default and saved.", message.isError);
  });

  document.getElementById("clearStorage").addEventListener("click", async () => {
    localStorage.removeItem(STORAGE_KEY);
    state = defaultContent();
    renderAll();
    const result = await saveContent(state);
    const message = formatSaveResult(result);
    setStatus(message.isError ? message.text : "Saved data cleared and reset to defaults.", message.isError);
  });

  document.getElementById("exportJson").addEventListener("click", () => {
    const text = JSON.stringify(state, null, 2);
    document.getElementById("importJsonText").value = text;
    navigator.clipboard?.writeText(text).catch(() => {});
    setStatus("JSON exported below (and copied if allowed).");
  });

  document.getElementById("importJsonBtn").addEventListener("click", async () => {
    const text = document.getElementById("importJsonText").value.trim();
    if (!text) return setStatus("Paste JSON first.", true);
    try {
      state = mergeContent(defaultContent(), JSON.parse(text));
      renderAll();
      const result = await saveContent(state);
      const message = formatSaveResult(result);
      setStatus(message.isError ? message.text : "JSON imported and saved.", message.isError);
    } catch {
      setStatus("Invalid JSON.", true);
    }
  });
}

async function initAdmin() {
  setStatus("Loading content from Supabase...");
  bindEvents();
  try {
    state = await loadContent();
    renderAll();
    setStatus("Content loaded. Edit and click Save All Changes.");
  } catch (error) {
    renderAll();
    setStatus(`Could not load remote content: ${error?.message || "unknown error"}`, true);
  }
}

initAdmin();
