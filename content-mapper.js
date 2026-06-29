const PRODUCT_SECTION_KEYS = ["latest", "formal", "casual", "street"];
const PRODUCTS_PER_SECTION = 15;

function isLegacyUserContent(data) {
  return Boolean(data?.hero || data?.sections);
}

function sanitizeProductImage(url, productId) {
  const value = String(url || "").trim();
  if (
    !value ||
    /instagram\.com\//i.test(value) ||
    (!value.startsWith("assets/") && !/^https?:\/\//i.test(value))
  ) {
    return `https://picsum.photos/seed/lifestyle-men-${productId}/800/1000`;
  }
  return value;
}

function assignProductSections(products) {
  return products.map((product, index) => ({
    ...product,
    image: sanitizeProductImage(product.image, product.id ?? index + 1),
    section: PRODUCT_SECTION_KEYS[Math.min(Math.floor(index / PRODUCTS_PER_SECTION), PRODUCT_SECTION_KEYS.length - 1)],
    rating: product.rating ?? 5,
  }));
}

function mapUserContentToSite(sourceData) {
  const { site, hero, sections, products } = sourceData;

  return {
    site: {
      brandName: site.brandName,
      brandSubtitle: site.footerBrand || site.brandSubtitle || "Life style brand",
      tagline: site.tagline,
      announcement: site.announcement,
      logoUrl: site.logoUrl,
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
      title: hero.title,
      subtitle: `${hero.kicker}. ${hero.subtitle}`,
      ctaText: hero.ctaText,
      ctaLink: "#men-latest",
      mediaType: hero.mediaType,
      mediaUrl: hero.mediaUrl,
      videoPoster: hero.videoPoster || "",
      autoplay: true,
      loop: true,
      muted: true,
      playsinline: true,
      focusX: hero.focusX ?? 50,
      focusY: hero.focusY ?? 45,
      overlayOpacity: hero.overlayOpacity ?? 0.42,
    },
    categoryTiles: [
      {
        title: "Men's Formal",
        subtitle: sections.collectionsSubtitle,
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/lsb-formal/900/1100",
        focusX: 50,
        focusY: 30,
        link: "#men-formal",
      },
      {
        title: "Men's Casual",
        subtitle: sections.collectionsSubtitle,
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/lsb-casual/900/1100",
        focusX: 50,
        focusY: 35,
        link: "#men-casual",
      },
      {
        title: "Men's Street",
        subtitle: sections.collectionsSubtitle,
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/lsb-street/900/1100",
        focusX: 50,
        focusY: 40,
        link: "#men-street",
      },
      {
        title: sections.collectionsTitle,
        subtitle: sections.collectionsSubtitle,
        mediaType: "image",
        mediaUrl: "https://picsum.photos/seed/lsb-accessories/900/1100",
        focusX: 50,
        focusY: 50,
        link: "#explore",
      },
    ],
    productSections: [
      { key: "latest", title: sections.productsTitle, subtitle: sections.productsSubtitle },
      { key: "formal", title: "Men's Formal", subtitle: sections.collectionsSubtitle },
      { key: "casual", title: "Men's Casual", subtitle: sections.collectionsSubtitle },
      { key: "street", title: "Men's Street", subtitle: sections.collectionsSubtitle },
    ],
    explore: {
      title: sections.aboutTitle,
      paragraph1: sections.aboutText,
      quote: "Style is a way to say who you are without having to speak.",
      paragraph2: sections.collectionsSubtitle,
      ctaText: "Discover More",
      tiles: [
        { type: "text", title: sections.collectionsTitle, subtitle: sections.collectionsSubtitle },
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
        { type: "text", title: sections.productsTitle, subtitle: `${products.length} Products` },
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
      subtitle: sections.productsSubtitle,
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
    products: assignProductSections(products),
  };
}

function importContent(parsed) {
  if (isLegacyUserContent(parsed)) {
    return mapUserContentToSite(parsed);
  }
  return mergeContent(defaultContent(), parsed);
}
