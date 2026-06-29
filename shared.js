const STORAGE_KEY = "lifestyle_tunisia_content_v2";
const SUPABASE_TABLE = "site_content";
const SUPABASE_ROW_ID = "main";
const SUPABASE_FALLBACK = {
  url: "https://xsoimvyaolpskcioejwa.supabase.co",
  anonKey:
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhzb2ltdnlhb2xwc2tjaW9landhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI3MjAxNjAsImV4cCI6MjA5ODI5NjE2MH0.u-k9L6L0AVeIY2HaGxguYdkLpVMSfC3xSWeLxMwTOBs",
};

function getSupabaseConfig() {
  const config = window.SUPABASE_CONFIG || SUPABASE_FALLBACK;
  return {
    url: String(config.url || SUPABASE_FALLBACK.url).replace(/\/+$/, ""),
    anonKey: String(config.anonKey || SUPABASE_FALLBACK.anonKey),
  };
}

function isSupabaseConfigured() {
  const { url, anonKey } = getSupabaseConfig();
  return Boolean(url && anonKey);
}

function supabaseHeaders() {
  const { anonKey } = getSupabaseConfig();
  return {
    apikey: anonKey,
    Authorization: `Bearer ${anonKey}`,
    "Content-Type": "application/json",
  };
}

async function fetchSupabaseContent() {
  const { url } = getSupabaseConfig();
  const endpoint = `${url}/rest/v1/${SUPABASE_TABLE}?id=eq.${encodeURIComponent(SUPABASE_ROW_ID)}&select=content&limit=1`;
  const response = await fetch(endpoint, {
    method: "GET",
    headers: supabaseHeaders(),
  });
  if (!response.ok) throw new Error(`Supabase read failed (${response.status})`);
  const data = await response.json();
  return data?.[0]?.content || null;
}

async function upsertSupabaseContent(content) {
  const { url } = getSupabaseConfig();
  const endpoint = `${url}/rest/v1/${SUPABASE_TABLE}?on_conflict=id`;
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      ...supabaseHeaders(),
      Prefer: "resolution=merge-duplicates,return=minimal",
    },
    body: JSON.stringify([
      {
        id: SUPABASE_ROW_ID,
        content,
        updated_at: new Date().toISOString(),
      },
    ]),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase write failed (${response.status})${detail ? `: ${detail}` : ""}`);
  }
}

function parseInstagramId(url) {
  const match = String(url || "").match(/instagram\.com\/(?:reel|p|tv)\/([A-Za-z0-9_-]+)/);
  return match ? match[1] : null;
}

function isInstagramUrl(url) {
  return /instagram\.com\/(reel|p|tv)\//.test(String(url || ""));
}

function getInstagramEmbedUrl(url) {
  const id = parseInstagramId(url);
  return id ? `https://www.instagram.com/reel/${id}/embed` : "";
}

function normalizeAssetPath(value) {
  if (!value) return "";
  return String(value).replace(/^(\.\.\/)+assets\//, "assets/");
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function generateDefaultProducts(sectionKey, count, startId) {
  const types = [
    "Slim Fit Shirt",
    "Premium Polo",
    "Cotton T-Shirt",
    "Tailored Blazer",
    "Urban Jacket",
    "Denim Shirt",
    "Chino Pants",
    "Cargo Pants",
    "Smart Trousers",
    "Classic Hoodie",
    "Crewneck Sweatshirt",
    "Bomber Jacket",
  ];
  const colors = ["Black", "White", "Navy", "Olive", "Beige", "Grey", "Brown", "Blue"];
  const products = [];
  for (let i = 0; i < count; i += 1) {
    const type = types[i % types.length];
    const color = colors[i % colors.length];
    const price = 89 + (i % 10) * 7;
    products.push({
      id: startId + i,
      name: `${color} ${type}`,
      price: `${price} TND`,
      category: "Men",
      section: sectionKey,
      rating: 5,
      image: `https://picsum.photos/seed/lsb-${sectionKey}-${i + 1}/800/1000`,
    });
  }
  return products;
}

function defaultContent() {
  if (window.SITE_DEFAULT_CONTENT) {
    return JSON.parse(JSON.stringify(window.SITE_DEFAULT_CONTENT));
  }

  const latest = generateDefaultProducts("latest", 12, 1);
  const formal = generateDefaultProducts("formal", 12, 100);
  const casual = generateDefaultProducts("casual", 12, 200);
  const street = generateDefaultProducts("street", 12, 300);

  return {
    site: {
      brandName: "lifestyle_tunisia",
      brandSubtitle: "Life style brand",
      tagline: "Premium men's clothing in Tunisia.",
      announcement: "New men's arrivals every week — exclusive collection.",
      logoUrl: "assets/brand-logo-reference.png",
    },
    navigation: [
      { label: "Home", href: "#home" },
      { label: "Men's Latest", href: "#men-latest" },
      { label: "Men's Formal", href: "#men-formal" },
      { label: "Men's Casual", href: "#men-casual" },
      { label: "Men's Street", href: "#men-street" },
      { label: "Explore", href: "#explore" },
    ],
    heroBanner: {
      title: "We Are lifestyle_tunisia",
      subtitle: "Premium men's clothing crafted for modern Tunisian style.",
      ctaText: "Shop Men's Collection",
      ctaLink: "#men-latest",
      mediaType: "image",
      mediaUrl: "assets/template-reference.png",
      videoPoster: "",
      autoplay: true,
      loop: true,
      muted: true,
      playsinline: true,
      focusX: 50,
      focusY: 40,
      overlayOpacity: 0.45,
    },
    categoryTiles: [
      {
        title: "Men's Formal",
        subtitle: "Best clothes for business men",
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/lsb-formal/900/1100",
        focusX: 50,
        focusY: 30,
        link: "#men-formal",
      },
      {
        title: "Men's Casual",
        subtitle: "Everyday comfort with style",
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/lsb-casual/900/1100",
        focusX: 50,
        focusY: 35,
        link: "#men-casual",
      },
      {
        title: "Men's Street",
        subtitle: "Urban looks for modern men",
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/lsb-street/900/1100",
        focusX: 50,
        focusY: 40,
        link: "#men-street",
      },
      {
        title: "Accessories",
        subtitle: "Belts, watches & more",
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/lsb-accessories/900/1100",
        focusX: 50,
        focusY: 50,
        link: "#explore",
      },
    ],
    productSections: [
      {
        key: "latest",
        title: "Men's Latest",
        subtitle: "Details to details is what makes lifestyle_tunisia different.",
      },
      {
        key: "formal",
        title: "Men's Formal",
        subtitle: "Executive shirts, blazers and tailored essentials.",
      },
      {
        key: "casual",
        title: "Men's Casual",
        subtitle: "Relaxed fits designed for comfort and confidence.",
      },
      {
        key: "street",
        title: "Men's Street",
        subtitle: "Bold urban pieces for the modern man.",
      },
    ],
    explore: {
      title: "Explore Our Products",
      paragraph1:
        "lifestyle_tunisia is a men-only brand focused on premium fabrics, clean silhouettes, and timeless wardrobe essentials.",
      quote: "Style is a way to say who you are without having to speak.",
      paragraph2: "From formal wear to street style, every piece is curated for the modern Tunisian man.",
      ctaText: "Discover More",
      tiles: [
        {
          type: "text",
          title: "Leather Bags",
          subtitle: "Latest Collection",
        },
        {
          type: "media",
          mediaType: "image",
          mediaUrl: "https://picsum.photos/seed/lsb-explore-1/800/800",
          focusX: 50,
          focusY: 50,
        },
        {
          type: "media",
          mediaType: "image",
          mediaUrl: "https://picsum.photos/seed/lsb-explore-2/800/800",
          focusX: 50,
          focusY: 40,
        },
        {
          type: "text",
          title: "Different Types",
          subtitle: "Over 48 Products",
        },
      ],
    },
    social: {
      title: "Social Media",
      subtitle: "Follow our latest men's looks and behind-the-scenes content.",
      items: [
        { mediaType: "image", mediaUrl: "https://picsum.photos/seed/lsb-social-1/500/500", focusX: 50, focusY: 50 },
        { mediaType: "image", mediaUrl: "https://picsum.photos/seed/lsb-social-2/500/500", focusX: 50, focusY: 50 },
        { mediaType: "image", mediaUrl: "https://picsum.photos/seed/lsb-social-3/500/500", focusX: 50, focusY: 50 },
        { mediaType: "image", mediaUrl: "https://picsum.photos/seed/lsb-social-4/500/500", focusX: 50, focusY: 50 },
        { mediaType: "image", mediaUrl: "https://picsum.photos/seed/lsb-social-5/500/500", focusX: 50, focusY: 50 },
        { mediaType: "image", mediaUrl: "https://picsum.photos/seed/lsb-social-6/500/500", focusX: 50, focusY: 50 },
      ],
    },
    featuredVideo: {
      title: "Featured Reel",
      subtitle: "Watch our latest men's collection in action.",
      mediaType: "instagram",
      mediaUrl:
        "https://www.instagram.com/reel/DTLdfkrDbk0/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
      height: 520,
      focusX: 50,
      focusY: 50,
    },
    newsletter: {
      title: "By Subscribing To Our Newsletter You Can Get 30% Off",
      subtitle: "Details to details is what makes lifestyle_tunisia different.",
      storeLocation: "Tunis, Tunisia",
      phone: "+216 00 000 000",
      officeLocation: "Avenue Habib Bourguiba",
      workHours: "09:00 AM – 8:00 PM Daily",
      email: "contact@lifestyle_tunisia.com",
      socialLinks: "Instagram, Facebook, TikTok",
    },
    footer: {
      address: "Avenue Habib Bourguiba, Tunis, Tunisia",
      email: "contact@lifestyle_tunisia.com",
      phone: "+216 00 000 000",
      copyright: "Copyright © 2026 lifestyle_tunisia. All Rights Reserved.",
      col2Title: "Shopping & Categories",
      col2Links: "Men's Latest, Men's Formal, Men's Casual, Men's Street",
      col3Title: "Useful Links",
      col3Links: "Homepage, About Us, Help, Contact Us",
      col4Title: "Help & Information",
      col4Links: "Help, FAQ's, Shipping, Tracking ID",
    },
    products: [...latest, ...formal, ...casual, ...street],
  };
}

function normalizeLegacyContent(saved) {
  if (!saved || typeof saved !== "object") return saved;

  const normalized = { ...saved };

  if (saved.site?.footerBrand && !saved.site?.brandSubtitle) {
    normalized.site = {
      ...saved.site,
      brandSubtitle: saved.site.footerBrand,
    };
  }

  if (saved.hero && !saved.heroBanner) {
    const hero = saved.hero;
    normalized.heroBanner = {
      title: hero.title || "",
      subtitle: [hero.kicker, hero.subtitle].filter(Boolean).join(". "),
      ctaText: hero.ctaText || "Shop Men's Collection",
      ctaLink: hero.ctaLink || "#men-latest",
      mediaType: hero.mediaType || "image",
      mediaUrl: hero.mediaUrl || "",
      videoPoster: hero.videoPoster || "",
      autoplay: hero.autoplay !== false,
      loop: hero.loop !== false,
      muted: hero.muted !== false,
      playsinline: hero.playsinline !== false,
      focusX: hero.focusX ?? 50,
      focusY: hero.focusY ?? 45,
      overlayOpacity: hero.overlayOpacity ?? 0.42,
    };
  }

  if (saved.sections) {
    const sections = saved.sections;
    if (!saved.productSections?.length) {
      normalized.productSections = [
        { key: "latest", title: sections.productsTitle || "Latest Men's Products", subtitle: sections.productsSubtitle || "" },
        { key: "formal", title: "Men's Formal", subtitle: sections.collectionsSubtitle || "" },
        { key: "casual", title: "Men's Casual", subtitle: sections.collectionsSubtitle || "" },
        { key: "street", title: "Men's Street", subtitle: sections.collectionsSubtitle || "" },
      ];
    }
    normalized.explore = {
      ...(normalized.explore || {}),
      title: sections.aboutTitle || normalized.explore?.title,
      paragraph1: sections.aboutText || normalized.explore?.paragraph1,
    };
  }

  if (saved.products?.length && !saved.products[0]?.section) {
    const sectionKeys = ["latest", "formal", "casual", "street"];
    normalized.products = saved.products.map((product, index) => ({
      ...product,
      section: sectionKeys[Math.min(Math.floor(index / 15), sectionKeys.length - 1)],
      rating: product.rating ?? 5,
    }));
  }

  return normalized;
}

function mergeContent(base, saved) {
  if (isLegacyUserContent(saved)) {
    return mapUserContentToSite(saved);
  }

  const incoming = normalizeLegacyContent(saved);
  const merged = {
    ...base,
    ...incoming,
    site: { ...base.site, ...(incoming?.site || {}) },
    heroBanner: { ...base.heroBanner, ...(incoming?.heroBanner || {}) },
    explore: {
      ...base.explore,
      ...(incoming?.explore || {}),
      tiles: incoming?.explore?.tiles?.length ? incoming.explore.tiles : base.explore.tiles,
    },
    social: {
      ...base.social,
      ...(incoming?.social || {}),
      items: incoming?.social?.items?.length ? incoming.social.items : base.social.items,
    },
    featuredVideo: { ...base.featuredVideo, ...(incoming?.featuredVideo || {}) },
    newsletter: { ...base.newsletter, ...(incoming?.newsletter || {}) },
    footer: { ...base.footer, ...(incoming?.footer || {}) },
    navigation: incoming?.navigation?.length ? incoming.navigation : base.navigation,
    categoryTiles: incoming?.categoryTiles?.length ? incoming.categoryTiles : base.categoryTiles,
    productSections: incoming?.productSections?.length ? incoming.productSections : base.productSections,
    products: incoming?.products?.length ? incoming.products : base.products,
  };
  return merged;
}

async function loadContent() {
  const base = defaultContent();
  if (isSupabaseConfigured()) {
    try {
      const remote = await fetchSupabaseContent();
      if (remote) {
        const merged = mergeContent(base, remote);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
        return merged;
      }
    } catch (error) {
      console.error("Failed to load content from Supabase:", error);
    }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return base;
    return mergeContent(base, JSON.parse(raw));
  } catch (error) {
    console.error("Failed to load content:", error);
    return base;
  }
}

async function saveContent(content) {
  let remoteSaved = false;
  let localSaved = false;
  let error = null;

  if (isSupabaseConfigured()) {
    try {
      await upsertSupabaseContent(content);
      remoteSaved = true;
    } catch (err) {
      error = err?.message || String(err);
      console.error("Failed to save content to Supabase:", err);
    }
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
    localSaved = true;
  } catch (err) {
    if (!error) error = err?.message || String(err);
    console.error("Failed to save content to local storage:", err);
  }

  const ok = isSupabaseConfigured() ? remoteSaved : localSaved;
  return { ok, remoteSaved, localSaved, error };
}

function resolveMediaType(item) {
  const url = item?.mediaUrl || "";
  if (item?.mediaType === "instagram" || isInstagramUrl(url)) return "instagram";
  if (item?.mediaType === "video") return "video";
  return "image";
}

function mediaPosition(item) {
  const x = Math.max(0, Math.min(100, Number(item?.focusX) || 50));
  const y = Math.max(0, Math.min(100, Number(item?.focusY) || 50));
  return `${x}% ${y}%`;
}

function buildMediaHtml(item, className = "media-fill") {
  const type = resolveMediaType(item);
  const url = normalizeAssetPath(item.mediaUrl || "");
  const pos = mediaPosition(item);

  if (type === "instagram") {
    const embed = getInstagramEmbedUrl(item.mediaUrl);
    if (!embed) return `<div class="${className} media-fallback">Invalid Instagram URL</div>`;
    return `<iframe class="${className} instagram-embed" src="${escapeHtml(embed)}" loading="lazy" allowfullscreen></iframe>`;
  }

  if (type === "video") {
    const poster = normalizeAssetPath(item.videoPoster || "");
    const autoplay = item.autoplay !== false;
    const loop = item.loop !== false;
    const muted = item.muted !== false;
    const playsinline = item.playsinline !== false;
    return `<video class="${className}" style="object-position:${pos}" src="${escapeHtml(url)}" poster="${escapeHtml(poster)}" ${autoplay ? "autoplay" : ""} ${muted ? "muted" : ""} ${loop ? "loop" : ""} ${playsinline ? "playsinline" : ""} controls></video>`;
  }

  return `<img class="${className}" style="object-position:${pos}" src="${escapeHtml(url)}" alt="" loading="lazy" />`;
}
