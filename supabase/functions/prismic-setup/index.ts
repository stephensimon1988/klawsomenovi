import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// ──────────────────────────────────────────────
//  Prismic Custom Types API + Migration API
// ──────────────────────────────────────────────

const CUSTOM_TYPES_API = "https://customtypes.prismic.io";
const MIGRATION_API = "https://migration.prismic.io";

// ── CUSTOM TYPE DEFINITIONS ──

function textField(label: string) {
  return { type: "StructuredText", config: { label, single: "paragraph", allowTargetBlank: true } };
}
function richTextField(label: string) {
  return { type: "StructuredText", config: { label, multi: "paragraph,heading3,heading4,strong,em,list-item,o-list-item,hyperlink", allowTargetBlank: true } };
}
function imageField(label: string) {
  return { type: "Image", config: { label, constraint: {} } };
}
function booleanField(label: string) {
  return { type: "Boolean", config: { label, default_value: false } };
}
function numberField(label: string) {
  return { type: "Number", config: { label } };
}
function dateField(label: string) {
  return { type: "Date", config: { label } };
}
function selectField(label: string, options: string[]) {
  return { type: "Select", config: { label, options, default_value: options[0] } };
}
function linkField(label: string) {
  return { type: "Link", config: { label, allowTargetBlank: true } };
}
function keyTextField(label: string) {
  return { type: "Text", config: { label } };
}

const customTypes = [
  // ── 1. HOMEPAGE (single) ──
  {
    id: "homepage",
    label: "Homepage",
    repeatable: false,
    json: {
      Hero: {
        hero_headline: richTextField("Hero Headline"),
        hero_description: richTextField("Hero Description"),
        hero_background_image: imageField("Hero Background Image"),
        hero_logo: imageField("Hero Logo"),
        hours_card: {
          type: "Group",
          config: {
            label: "Hours Card",
            fields: {
              label: keyTextField("Label"),
              value: keyTextField("Value"),
            },
          },
        },
      },
      Story: {
        story_title: textField("Story Title"),
        story_body: richTextField("Story Body"),
      },
      About: {
        about_steps: {
          type: "Group",
          config: {
            label: "About Steps",
            fields: {
              image: imageField("Step Image"),
              title: keyTextField("Title"),
              description: keyTextField("Description"),
            },
          },
        },
      },
    },
  },

  // ── 2. TOKEN TIER (repeatable) ──
  {
    id: "token_tier",
    label: "Token Tier",
    repeatable: true,
    json: {
      Main: {
        price: keyTextField("Price"),
        tokens: keyTextField("Tokens"),
        bonus: keyTextField("Bonus"),
        is_highlight: booleanField("Highlight"),
        sort_order: numberField("Sort Order"),
      },
    },
  },

  // ── 3. NEWS ARTICLE (repeatable) ──
  {
    id: "news_article",
    label: "News Article",
    repeatable: true,
    json: {
      Main: {
        title: textField("Title"),
        source: keyTextField("Source"),
        date: dateField("Date"),
        url: keyTextField("URL"),
        thumbnail: imageField("Thumbnail"),
      },
    },
  },

  // ── 4. BIRTHDAY PAGE (single) ──
  {
    id: "birthday_page",
    label: "Birthday Page",
    repeatable: false,
    json: {
      Hero: {
        hero_image: imageField("Hero Background Image"),
        hero_badge: imageField("Hero Badge Image"),
        hero_headline: richTextField("Hero Headline"),
      },
      Celebration: {
        celebration_title: textField("Celebration Title"),
        celebration_body: richTextField("Celebration Body"),
        celebration_gif: imageField("Celebration GIF"),
      },
      Hosting: {
        hosting_rules: richTextField("Hosting Rules"),
        contact_email: keyTextField("Contact Email"),
      },
      PartyOptions: {
        party_options: {
          type: "Group",
          config: {
            label: "Party Options",
            fields: {
              title: keyTextField("Title"),
              image: imageField("Image"),
              features: richTextField("Features"),
            },
          },
        },
        photography_note: keyTextField("Photography Note"),
      },
      Invites: {
        invite_templates: {
          type: "Group",
          config: {
            label: "Invite Templates",
            fields: {
              image: imageField("Preview Image"),
              download_url: keyTextField("Download URL"),
            },
          },
        },
      },
    },
  },

  // ── 5. FAQ ITEM (repeatable) ──
  {
    id: "faq_item",
    label: "FAQ Item",
    repeatable: true,
    json: {
      Main: {
        question: textField("Question"),
        answer: richTextField("Answer"),
        page: selectField("Page", ["birthdays", "general"]),
        sort_order: numberField("Sort Order"),
      },
    },
  },

  // ── 6. JOB LISTING (repeatable) ──
  {
    id: "job_listing",
    label: "Job Listing",
    repeatable: true,
    json: {
      Main: {
        title: keyTextField("Title"),
        category: selectField("Category", ["in_store", "hybrid_paid", "hybrid_unpaid"]),
        description: richTextField("Description"),
        image: imageField("Image"),
        job_description_url: keyTextField("Job Description URL"),
        apply_url: keyTextField("Apply URL"),
        is_active: booleanField("Active"),
      },
    },
  },

  // ── 7. BUSINESS PAGE (single) ──
  {
    id: "business_page",
    label: "Business Page",
    repeatable: false,
    json: {
      Hero: {
        hero_headline: richTextField("Hero Headline"),
        hero_description: richTextField("Hero Description"),
      },
      HostedMachine: {
        hosted_headline: textField("Hosted Machine Headline"),
        hosted_description: richTextField("Hosted Machine Description"),
        revenue_share: keyTextField("Revenue Share"),
        klawsome_handles: {
          type: "Group",
          config: { label: "Klawsome Handles", fields: { item: keyTextField("Item") } },
        },
        business_provides: {
          type: "Group",
          config: { label: "Business Provides", fields: { item: keyTextField("Item") } },
        },
        venues: {
          type: "Group",
          config: { label: "Venues", fields: { label: keyTextField("Label") } },
        },
      },
      Partner: {
        partner_headline: textField("Partner Headline"),
        partner_description: richTextField("Partner Description"),
        partner_includes: {
          type: "Group",
          config: {
            label: "Partner Includes",
            fields: {
              icon: keyTextField("Icon Emoji"),
              title: keyTextField("Title"),
              desc: keyTextField("Description"),
            },
          },
        },
      },
      Plushie: {
        plushie_headline: textField("Plushie Headline"),
        plushie_description: richTextField("Plushie Description"),
        pricing_tiers: {
          type: "Group",
          config: {
            label: "Pricing Tiers",
            fields: {
              label: keyTextField("Label"),
              title: keyTextField("Title"),
              price: keyTextField("Price"),
              per: keyTextField("Per"),
              desc: keyTextField("Description"),
              variant: selectField("Variant", ["light", "accent", "dark"]),
            },
          },
        },
        plushie_steps: {
          type: "Group",
          config: {
            label: "Plushie Steps",
            fields: {
              icon: keyTextField("Icon Emoji"),
              title: keyTextField("Title"),
              desc: keyTextField("Description"),
            },
          },
        },
      },
      HowItWorks: {
        how_steps: {
          type: "Group",
          config: {
            label: "How It Works Steps",
            fields: {
              step_number: numberField("Step Number"),
              title: keyTextField("Title"),
              description: keyTextField("Description"),
            },
          },
        },
      },
    },
  },

  // ── 8. SITE SETTINGS (single) ──
  {
    id: "site_settings",
    label: "Site Settings",
    repeatable: false,
    json: {
      Contact: {
        address: keyTextField("Address"),
        phone: keyTextField("Phone"),
        general_email: keyTextField("General Email"),
        events_email: keyTextField("Events Email"),
      },
      Social: {
        instagram_url: keyTextField("Instagram URL"),
        facebook_url: keyTextField("Facebook URL"),
        tiktok_url: keyTextField("TikTok URL"),
        google_maps_url: keyTextField("Google Maps URL"),
      },
      Branding: {
        tagline: keyTextField("Tagline"),
        regular_hours: richTextField("Regular Hours"),
        special_hours: {
          type: "Group",
          config: {
            label: "Special Hours",
            fields: {
              label: keyTextField("Label"),
              value: keyTextField("Value"),
            },
          },
        },
        as_seen_on_image: imageField("As Seen On Image"),
        storefront_image: imageField("Storefront Image"),
      },
      GiftCards: {
        gift_card_url: keyTextField("Gift Card Purchase URL"),
        gift_card_images: {
          type: "Group",
          config: {
            label: "Gift Card Images",
            fields: {
              image: imageField("Gift Card Image"),
            },
          },
        },
      },
    },
  },
];

// ── CONTENT DOCUMENTS ──

function rt(text: string) {
  return [{ type: "paragraph", text, spans: [] }];
}

function prismicImage(url: string, alt = "") {
  return { url, alt, dimensions: { width: 800, height: 600 } };
}

const contentDocuments: Array<{
  type: string;
  uid?: string;
  title: string;
  data: Record<string, any>;
}> = [
  // ── SITE SETTINGS ──
  {
    type: "site_settings",
    title: "Site Settings",
    data: {
      address: "42768 Grand River Ave, Suite C-140, Novi, MI 48375",
      phone: "(248) 938-4093",
      general_email: "team@klawsomenovi.com",
      events_email: "events@klawsomenovi.com",
      instagram_url: "https://www.instagram.com/klawsomenovi/",
      facebook_url: "https://www.facebook.com/klawsomenovi",
      tiktok_url: "https://www.tiktok.com/@klawsomenovi",
      google_maps_url: "https://www.google.com/maps/place/42768+Grand+River+Ave+Suite+C-140,+Novi,+MI+48375",
      tagline: "Michigan's first stand-alone claw machine arcade",
      regular_hours: rt("Tue–Sun 11 a.m. to 9 p.m. · Closed Mondays"),
      special_hours: [
        { label: "Spring break hours", value: "Monday March 30, 11 a.m. to 9 p.m." },
        { label: "Easter", value: "Closed Easter Sunday April 5" },
      ],
      as_seen_on_image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/5634d99f-8f37-4229-a409-dfbb9b66697c/As+Seen+On.png", "As seen on Michigan Mama News, Hour Detroit, Little Guide, Hometown Life"),
      storefront_image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/eac946a6-e513-4e64-acdc-dd5024eb5a61/IMG_1638.jpg", "Klawsome arcade storefront"),
      gift_card_url: "https://app.squareup.com/gift/ML1R35ZH9VKRW/order",
      gift_card_images: [
        { image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/36daa7e6-4290-4a8c-94b4-3c19ecc4ae32/gift+card.png", "Klawsome gift card 1") },
        { image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/23f1e86a-d1bd-442d-b7e1-4d9fe1f118f2/gift+card+2.png", "Klawsome gift card 2") },
      ],
    },
  },

  // ── HOMEPAGE ──
  {
    type: "homepage",
    title: "Homepage",
    data: {
      hero_headline: rt("Michigan's first stand-alone claw arcade"),
      hero_description: rt("Step into Klawsome and experience bright, colorful machines filled with kawaii plushies and prizes. Open Tuesday through Sunday, 11 a.m. to 9 p.m. at Sakura Novi in Michigan."),
      hero_background_image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/9dbb036d-bd01-425e-b085-2833702bc6c9/Klawsome_FriendsFamily-056.jpg", "Klawsome arcade"),
      hero_logo: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f907dbc8-8a5c-43a3-8224-1729d43956bb/CircularLogo_Klawsome_RGB.png", "Klawsome Logo"),
      hours_card: [
        { label: "Spring break hours:", value: "Monday March 30, 11 a.m. to 9 p.m." },
        { label: "Closed Easter Sunday April 5", value: "" },
        { label: "Regular hours:", value: "Tue–Sun 11 a.m. to 9 p.m. · Closed Mondays" },
      ],
      story_title: rt("The Klawsome Story"),
      story_body: rt("Klawsome! is Michigan's first stand-alone claw machine arcade, offering a unique and exciting experience where customers can test their skills to win kawaii-style plushies from vibrantly colored claw machines. We are a family-owned local business based in Novi, Michigan, inspired by the popular arcades in Asian countries."),
      about_steps: [
        {
          image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/efbb8c64-c51b-4f06-a1b1-fb0a04a5e367/klaw-play.gif", "Play"),
          title: "Play",
          description: "Choose from over 40 claw machines filled with adorable plushies and prizes.",
        },
        {
          image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/466192b1-eb36-4dcf-82c7-8a6564bf0ce1/klaw-win.png", "Win"),
          title: "Win",
          description: "Test your skills and grab kawaii treasures from every machine.",
        },
        {
          image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/27ff8701-0ef1-472e-808b-8e8e4eb93e2f/klaw-collect.gif", "Collect"),
          title: "Collect",
          description: "Build your collection of adorable plushies and share the joy!",
        },
      ],
    },
  },

  // ── TOKEN TIERS ──
  ...[
    { price: "$1", tokens: "5 Tokens", bonus: "", is_highlight: false, sort_order: 1 },
    { price: "$5", tokens: "25 Tokens", bonus: "", is_highlight: false, sort_order: 2 },
    { price: "$10", tokens: "55 Tokens", bonus: "5 bonus", is_highlight: false, sort_order: 3 },
    { price: "$20", tokens: "120 Tokens", bonus: "20 bonus", is_highlight: true, sort_order: 4 },
  ].map((tier, i) => ({
    type: "token_tier",
    uid: `tier-${i + 1}`,
    title: `Token Tier ${tier.tokens}`,
    data: tier,
  })),

  // ── NEWS ARTICLES ──
  ...[
    {
      title: "Check Out Klawsome In Novi – Michigan's Only Stand-Alone Claw Machine Arcade",
      source: "Little Guide Detroit",
      date: "2025-08-28",
      url: "https://littleguidedetroit.com/check-out-klawsome-in-novi-michigans-only-stand-alone-claw-machine-arcade/",
      thumbnail: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/da23b372-138d-4c18-977f-8db39f1cd16a/klawsome+littleguidedetroit.jpg"),
    },
    {
      title: "Klawsome! Sakura Novi Kicks Off with Michigan's First 'Clawcade'",
      source: "Hour Detroit",
      date: "2025-08-28",
      url: "https://www.hourdetroit.com/development-topics/klawsome-sakura-novi-kicks-off-with-michigans-first-clawcade/",
      thumbnail: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/cf98d1f2-1b98-49e2-953a-6784766e898d/klawsome+hourdetroit.png"),
    },
    {
      title: "Sakura Novi Launches with the Grand Opening of Klawsome!",
      source: "Michigan Mama News",
      date: "2025-08-28",
      url: "https://michiganmamanews.com/2025/08/28/sakura-novi-launches-with-the-grand-opening-of-klawsome-on-friday-august-29/",
      thumbnail: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f02582ee-95a6-4fb9-bf08-3ac93e6b9861/PXL_20250822_201918587.jpg"),
    },
    {
      title: "Klawsome!, featuring 40-plus claw arcade games, opening in Sakura Novi",
      source: "Hometown Life",
      date: "2025-08-28",
      url: "https://www.hometownlife.com/story/news/2025/08/25/klawsome-novi-opening-arcade-games/85760940007/",
      thumbnail: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/fdbcfe32-94e1-4e84-bb54-e48754347867/klawsome+hometown+life.webp"),
    },
    {
      title: "Couldn't stop winning from these claw machines!",
      source: "@clawcraziness",
      date: "2025-09-02",
      url: "https://www.tiktok.com/@clawcraziness/video/7545589134090358030",
      thumbnail: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/d8e28fdf-05d0-48a8-a4d0-dd11696cfb08/klawsome+clawcraziness.png"),
    },
    {
      title: "Grand Opening of KLAWSOME Clawcade in Novi, MI.",
      source: "@Zcaders",
      date: "2025-08-29",
      url: "https://www.youtube.com/watch?v=pd0E6-y9Yjk",
      thumbnail: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/7181dc67-e806-447f-a74f-1f5a6102a2a3/klawsome+zcaders.png"),
    },
  ].map((article, i) => ({
    type: "news_article",
    uid: `news-${i + 1}`,
    title: article.title,
    data: {
      title: rt(article.title),
      source: article.source,
      date: article.date,
      url: article.url,
      thumbnail: article.thumbnail,
    },
  })),

  // ── FAQ ITEMS ──
  ...[
    { q: "How much time do families get to set up and clean up?", a: "Clients have 30 minutes before and after the event to set up and clean up." },
    { q: "Can I bring my own food?", a: "Yes! Klawsome does not provide food/beverages, so feel free to bring any food, cake, beverages, etc. We have a variety of recommended vendors listed on our website for food, photography, balloons, and more. However, please note that for a semi-private party with Paris Baguette, outside food is not permitted." },
    { q: "How many tokens should I purchase?", a: "We recommend 325 tokens ($250 package) per group of five kids. This breaks down to 50 tokens per child, with 75 tokens in reserve for kids that need help. Some kids win a ton, but some need more guidance. Our staff will also be on the lookout for kids that need help." },
    { q: "How many hours can my party be?", a: "Public play is about a half an hour while private events are about one hour of play (+ 30 min for setup and 30 min for cleanup)." },
    { q: "What if a guest has food allergies?", a: "As Klawsome's policy is that guests are responsible for bringing their own food/beverages, clients must take note and accountability of any allergies/dietary restrictions that guests have." },
    { q: "What is the cancellation/refund policy?", a: "Klawsome does not provide a refund for a cancellation made 5 days or less before the event. If a client does not receive a refund, they may redeem all of their purchased tokens in store at a later date. Clients that make a cancellation more than 5 days in advance receive a full refund." },
    { q: "How many adults and children are allowed?", a: "A maximum of 12 adults are allowed along with a maximum of 12 children. Klawsome keeps a limit on guests to ensure a fun and comfortable experience for everyone." },
    { q: "Do I need to stay with my child?", a: "Any guest aged 10 or under is required to have one parent stay with them throughout the party. For any child older than 10, parents can simply drop them off. The parent of the birthday guest must stay for the entire party." },
    { q: "What is the difference between a private and a public/semi-private event?", a: "Private parties are reservation-only with exclusive, uninterrupted access to all machines. Public/semi-private parties do not require a reservation (but highly recommended). Both events are tons of fun!" },
    { q: "Do I need to reserve a birthday party in advance?", a: "Yes. Please notify Klawsome at least two weeks in advance. Saturdays are typically our busiest day, so we recommend booking a morning private event or keeping groups 7 guests or fewer during public hours. Only two reserved parties can be booked per day." },
    { q: "What seating and space is provided for parties?", a: "Klawsome provides two rectangular tables, one round table, and stools for children. Folding chairs for adults are available upon request. A one-hour private space rental is available for $100." },
    { q: "Does Klawsome offer anything special for birthdays without booking a party?", a: "Yes. Guests can visit anytime during regular hours and receive a personalized birthday gift bag and balloon for the celebrant. No purchase is necessary — just subscribe to Klawsome's newsletter to redeem." },
  ].map((faq, i) => ({
    type: "faq_item",
    uid: `faq-${i + 1}`,
    title: faq.q,
    data: {
      question: rt(faq.q),
      answer: rt(faq.a),
      page: "birthdays",
      sort_order: i + 1,
    },
  })),

  // ── BIRTHDAY PAGE ──
  {
    type: "birthday_page",
    title: "Birthday Page",
    data: {
      hero_image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/55fefb9f-eb8b-4185-a0bf-aec7b9e28a73/Klawsome_FriendsFamily-054-Edit.jpg", "Birthday party at Klawsome"),
      hero_badge: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/0aa66e68-edcd-41bb-a162-6c4d5453b16e/klawsomebirthday.png", "Klawsome Birthday"),
      hero_headline: rt("Celebrate your birthday with Klawsome!"),
      celebration_title: rt("Klawsome Wants To Celebrate You!"),
      celebration_body: rt("Come in anytime during our regular hours and we'll provide a personalized birthday gift bag and balloon for the celebrant. No purchase is necessary — simply subscribe to our newsletter to redeem."),
      celebration_gif: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/80256d92-709b-4da7-afc3-707621daf4de/Bday+Gif.gif", "Birthday gift promotion"),
      hosting_rules: rt("Please notify Klawsome two weeks in advance for parties. The earlier, the better to ensure best customer service. Saturdays are generally the busiest day. For the best experience, we recommend either booking a private event in the morning OR only booking parties with small groups (7 or less) during public hours. Klawsome can only book two parties per day, based on staffing."),
      contact_email: "events@klawsomenovi.com",
      party_options: [
        {
          title: "Private",
          image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/b423ffd5-9411-4093-96d5-b7dc4a6149b3/IMG-20251123-WA0064.jpg", "Private birthday party"),
          features: rt("In-house party at Klawsome. Takes place during closed hours. Set-up for decorations is available. 1 hour @ $250 — includes 325 tokens, exclusive space, tables and seating, ability to bring own food."),
        },
        {
          title: "Reserved Semi-Private",
          image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/d50dbe5e-0b2a-4366-8f45-104da8f0b11a/PXL_20251124_002020087.MP.jpg", "Semi-private birthday party"),
          features: rt("Table for one hour at Paris Baguette (Klawsome's next-door neighbor). Food cost TBD by Paris Baguette. Unlimited play time during public business hours. Simple decor available. No wall hangings or advance set-up. 1 hour @ $250 — includes 325 tokens."),
        },
      ],
      photography_note: "Photography Rental also available — 1 hour @ $49",
      invite_templates: [
        {
          image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/b7a7ccb0-4b9d-491c-a6a2-b6db899bd15f/Birthday+Invite+Template+%282%29.png", "Birthday invite template 1"),
          download_url: "https://www.klawsomenovi.com/s/Klawsome-Birthday-Invite.pdf",
        },
        {
          image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f3c702b6-da3f-4a85-aec7-e279e2d41820/%7BNAME%7D%E2%80%99S+%7BAGE%7D+BIRTHDAY.PNG", "Birthday invite template 2"),
          download_url: "https://www.klawsomenovi.com/s/Klawsome-Birthday-Invite-2.pdf",
        },
      ],
    },
  },

  // ── JOB LISTINGS ──
  ...[
    {
      title: "Assistant Store Manager",
      category: "in_store",
      description: "The Assistant Manager (AM) is responsible for the successful day-to-day performance of the store under the guidance of the General Manager (GM), with accountability for performing/training store associates on operation duties, delivering exceptional customer service, achieving store financial targets, and performing all GM responsibilities in the absence of the GM.",
      image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/f02582ee-95a6-4fb9-bf08-3ac93e6b9861/PXL_20250822_201918587.jpg", "Assistant Store Manager"),
      job_description_url: "https://www.klawsomenovi.com/s/Assistant-Store-Manager-Klawsome-5te9.pdf",
      apply_url: "https://forms.gle/m2XQHFELi3cmVGCw6",
    },
    {
      title: "Store Associate",
      category: "in_store",
      description: 'The store associate AKA "Fun Facilitator" at Klawsome! creates a lively, welcoming environment for customers. This role focuses on delivering excellent customer service, ensuring smooth game operations, plushie restocking, keeping the facility clean and organized. Enthusiasm and a passion for customer interaction are essential.',
      image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/057fb62e-a01f-49c9-a963-255ce0091234/KlawsomeCrewSelfieWall.jpg", "Store Associate"),
      job_description_url: "https://www.klawsomenovi.com/s/Fun-Facilitator-Store-Associate-Klawsome.pdf",
      apply_url: "https://forms.gle/m2XQHFELi3cmVGCw6",
    },
    {
      title: "General Manager",
      category: "hybrid_paid",
      description: "",
      image: null,
      job_description_url: "https://docs.google.com/document/d/1irhqnFe2z0909RRO5Tzf5BF7dSBlWDXqhqFXCiFWiVg/edit?usp=sharing",
      apply_url: "https://forms.gle/m2XQHFELi3cmVGCw6",
    },
    {
      title: "Purchasing Specialist",
      category: "hybrid_paid",
      description: "",
      image: null,
      job_description_url: "https://docs.google.com/document/d/1P3KExCIMFUp6RDz6hsGqHzASvwDZQB-hasbVLZKaLO0/edit?usp=sharing",
      apply_url: "https://forms.gle/m2XQHFELi3cmVGCw6",
    },
    {
      title: "Events Assistant Manager",
      category: "hybrid_paid",
      description: "",
      image: null,
      job_description_url: "https://drive.google.com/file/d/1zs_LLaoP9-HKMVvFbSSADklTxXrWLiyy/view?usp=sharing",
      apply_url: "https://forms.gle/m2XQHFELi3cmVGCw6",
    },
    {
      title: "Internship",
      category: "hybrid_unpaid",
      description: "Involves mentoring within a specific field of our expertise (e.g. business, journalism, education). Projects fit your background/experience. In-person and remote working opportunities with part-time hours. Lasts two to three months. Ends with a letter of recommendation.",
      image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/d00baf82-bf76-4d17-a38e-b6ca3ab39d6f/PXL_20250610_212808314.MP.jpg", "Internship"),
      job_description_url: "https://drive.google.com/file/d/1Z4OJY0PJtaH8ejFIUIJPkQtNS1BwhD_o/view?usp=sharing",
      apply_url: "https://forms.gle/m2XQHFELi3cmVGCw6",
    },
    {
      title: "Corporate Development Fellow (Founder's Office)",
      category: "hybrid_unpaid",
      description: "Responsible for collecting and analyzing data such as financial and market research. This role helps with expanding our franchise beyond a single location by finding ideal areas for expansion and helping create a story that convinces business owners to partner with Klawsome!",
      image: prismicImage("https://images.squarespace-cdn.com/content/v1/679927505e618d391ae386e6/466192b1-eb36-4dcf-82c7-8a6564bf0ce1/klaw-win.png", "Corporate Development Fellow"),
      job_description_url: "https://www.klawsomenovi.com/s/Corporate-Development-Fellow-Founders-Office.pdf",
      apply_url: "https://forms.gle/m2XQHFELi3cmVGCw6",
    },
  ].map((job, i) => ({
    type: "job_listing",
    uid: `job-${i + 1}`,
    title: job.title,
    data: {
      title: job.title,
      category: job.category,
      description: job.description ? rt(job.description) : [],
      image: job.image,
      job_description_url: job.job_description_url,
      apply_url: job.apply_url,
      is_active: true,
    },
  })),

  // ── BUSINESS PAGE ──
  {
    type: "business_page",
    title: "Business Page",
    data: {
      hero_headline: rt("Grow With Klawsome!"),
      hero_description: rt("Three ways to bring the magic of Klawsome into your world — whether you're a business owner, entrepreneur, or creator 🤝"),
      hosted_headline: rt("Host a Klawsome Machine in Your Business"),
      hosted_description: rt("We place a machine in your space, handle everything, and you earn a share of every token played — no upfront cost, no hassle."),
      revenue_share: "10%",
      klawsome_handles: [
        { item: "Machine delivery & installation" },
        { item: "All prize stocking & restocking" },
        { item: "All repairs & maintenance" },
        { item: "Revenue tracking & monthly payouts" },
        { item: "Ongoing machine operation" },
      ],
      business_provides: [
        { item: "Floor space for the machine" },
        { item: "One standard power outlet" },
        { item: "A 2.4GHz WiFi connection" },
      ],
      venues: [
        { label: "🍜 Restaurants" },
        { label: "🧋 Bubble Tea Shops" },
        { label: "🎳 Entertainment Venues" },
        { label: "🛍️ Retail Stores" },
        { label: "⏳ Waiting Areas" },
        { label: "🏪 High Foot Traffic Spaces" },
      ],
      partner_headline: rt("Become a Klawsome Partner"),
      partner_description: rt("Open your own Klawsome-branded arcade or add a Klawsome zone to your existing business."),
      partner_includes: [
        { icon: "🎰", title: "Machines", desc: "Full fleet of Klawsome machines customized for your space." },
        { icon: "🧸", title: "Prizes", desc: "Licensed plushies, anime collectibles, and more -- supplied by us." },
        { icon: "📱", title: "Tech", desc: "Remote monitoring, cashless payments, and real-time analytics." },
        { icon: "🎓", title: "Training", desc: "Full onboarding so you're confident from day one." },
        { icon: "📣", title: "Marketing", desc: "Brand assets, social media support, and launch help." },
        { icon: "🔧", title: "Support", desc: "Ongoing maintenance support and prize restocking guidance." },
      ],
      plushie_headline: rt("Custom Plushies"),
      plushie_description: rt("We design and produce custom plushies for businesses, events, and creators."),
      pricing_tiers: [
        { label: "Simple Design", title: "Standard Plushie", price: "$4-6", per: "per unit", desc: "Clean shapes, minimal detail. Great for branded giveaways and simple mascots.", variant: "light" },
        { label: "Complex Design", title: "Detailed Plushie", price: "$6-8", per: "per unit", desc: "Highly detailed characters with accessories, facial features, and layered textures.", variant: "accent" },
        { label: "XL / Life-Size", title: "Oversized Plushie", price: "$15-40", per: "per unit", desc: "Statement-making XL and life-size plushies. Perfect for displays, events, and premium prizes.", variant: "dark" },
      ],
      plushie_steps: [
        { icon: "📝", title: "Share your design", desc: "Send us a sketch, image, or description of your plushie concept." },
        { icon: "💬", title: "We send a quote", desc: "We review complexity, size, and quantity then get back to you with pricing." },
        { icon: "✅", title: "Approve & produce", desc: "Once approved, we handle production and delivery of your custom order." },
      ],
      how_steps: [
        { step_number: 1, title: "Reach Out", description: "Fill out the form below and tell us about yourself, your business, and which opportunity interests you." },
        { step_number: 2, title: "We Connect", description: "Our team follows up within 1-2 business days to learn more and answer your questions." },
        { step_number: 3, title: "Review & Plan", description: "We review your location or concept together and map out the right path forward." },
        { step_number: 4, title: "Launch!", description: "Machines installed, plushies stocked, partners trained — you're ready to go." },
      ],
    },
  },
];

// ── MAIN HANDLER ──

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const accessToken = Deno.env.get("PRISMIC_ACCESS_TOKEN");
    const customTypesToken = Deno.env.get("PRISMIC_CUSTOM_TYPES_TOKEN") || accessToken;
    const repoName = Deno.env.get("PRISMIC_REPOSITORY_NAME");

    if (!accessToken || !repoName) {
      return new Response(
        JSON.stringify({ error: "Missing PRISMIC_ACCESS_TOKEN or PRISMIC_REPOSITORY_NAME" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const url = new URL(req.url);
    const action = url.searchParams.get("action") || "all";

    const typesHeaders = {
      Authorization: `Bearer ${customTypesToken}`,
      repository: repoName,
      "Content-Type": "application/json",
    };

    const migrationHeaders = {
      Authorization: `Bearer ${accessToken}`,
      repository: repoName,
      "Content-Type": "application/json",
    };

    const results: any = { types: [], documents: [] };

    // ── STEP 1: Create Custom Types ──
    if (action === "all" || action === "types") {
      for (const ct of customTypes) {
        const payload = {
          id: ct.id,
          label: ct.label,
          repeatable: ct.repeatable,
          json: ct.json,
          status: true,
        };

        // Try insert first, then update if it exists
        let res = await fetch(`${CUSTOM_TYPES_API}/customtypes/insert`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        if (res.status === 409) {
          // Already exists, update it
          res = await fetch(`${CUSTOM_TYPES_API}/customtypes/update`, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
          });
        }

        const status = res.ok ? "ok" : "error";
        const detail = res.ok ? null : await res.text();
        results.types.push({ id: ct.id, status, detail });
      }
    }

    // ── STEP 2: Push Content Documents ──
    if (action === "all" || action === "content") {
      for (const doc of contentDocuments) {
        const payload = {
          title: doc.title,
          type: doc.type,
          uid: doc.uid || undefined,
          lang: "en-us",
          data: doc.data,
        };

        const res = await fetch(`${MIGRATION_API}/documents`, {
          method: "POST",
          headers,
          body: JSON.stringify(payload),
        });

        const status = res.ok ? "ok" : "error";
        let detail = null;
        if (!res.ok) {
          detail = await res.text();
        }
        results.documents.push({ type: doc.type, title: doc.title, status, detail });
      }
    }

    return new Response(
      JSON.stringify({ message: "Prismic setup complete", results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
