
-- Delete existing content blocks for business page sections
DELETE FROM section_content_blocks WHERE section_id IN (
  SELECT id FROM page_sections WHERE page = 'business'
);
-- Delete existing business page sections
DELETE FROM page_sections WHERE page = 'business';

-- Insert new sections
INSERT INTO page_sections (id, page, section_key, label, sort_order, is_visible, section_type, hero_height, bg_color, text_color, layout_template) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'business', 'hero', 'Hero Banner', 1, true, 'hero', '100vh', '#1C1C3A', '#FFFFFF', 'stacked'),
  ('b1000000-0000-0000-0000-000000000002', 'business', 'opp-nav', 'Opportunity Nav', 2, true, 'small', '100vh', '#FFF0E0', '', 'stacked'),
  ('b1000000-0000-0000-0000-000000000003', 'business', 'hosted-header', 'Hosted Machine Header', 3, true, 'section', '100vh', '', '', 'stacked'),
  ('b1000000-0000-0000-0000-000000000004', 'business', 'hosted-body', 'Hosted Machine Details', 4, true, 'section', '100vh', '#FFFFFF', '', 'stacked'),
  ('b1000000-0000-0000-0000-000000000005', 'business', 'partner-header', 'Partner Header', 5, true, 'section', '100vh', '#1C1C3A', '#FFFFFF', 'stacked'),
  ('b1000000-0000-0000-0000-000000000006', 'business', 'partner-body', 'Partner Details', 6, true, 'section', '100vh', '#FFF0E0', '', 'stacked'),
  ('b1000000-0000-0000-0000-000000000007', 'business', 'plushie-header', 'Custom Plushie Header', 7, true, 'section', '100vh', '', '', 'stacked'),
  ('b1000000-0000-0000-0000-000000000008', 'business', 'plushie-body', 'Custom Plushie Details', 8, true, 'section', '100vh', '#FFFFFF', '', 'stacked'),
  ('b1000000-0000-0000-0000-000000000009', 'business', 'how-it-works', 'How It Works', 9, true, 'section', '100vh', '#1C1C3A', '#FFFFFF', 'stacked'),
  ('b1000000-0000-0000-0000-000000000010', 'business', 'contact', 'Contact Section', 10, true, 'section', '100vh', '', '', 'stacked');

-- Hero content blocks
INSERT INTO section_content_blocks (section_id, block_type, row_order, content) VALUES
  ('b1000000-0000-0000-0000-000000000001', 'heading', 0, '{"text": "Grow With Klawsome!"}'),
  ('b1000000-0000-0000-0000-000000000001', 'text', 1, '{"text": "Three ways to bring the magic of Klawsome into your world — whether you''re a business owner, entrepreneur, or creator. Pick your path below."}'),
  ('b1000000-0000-0000-0000-000000000001', 'button', 2, '{"text": "Get in Touch →", "url": "#section-contact"}');

-- Opportunity Nav
INSERT INTO section_content_blocks (section_id, block_type, row_order, content) VALUES
  ('b1000000-0000-0000-0000-000000000002', 'heading', 0, '{"text": "Our Opportunities"}'),
  ('b1000000-0000-0000-0000-000000000002', 'richtext', 1, '{"html": "<p>🎰 <strong>Host a Machine in Your Business</strong></p><p>⭐ <strong>Become a Klawsome Partner</strong></p><p>🧸 <strong>Custom Plushie Orders</strong></p>"}');

-- Opp 1: Hosted Machine Header
INSERT INTO section_content_blocks (section_id, block_type, row_order, content) VALUES
  ('b1000000-0000-0000-0000-000000000003', 'heading', 0, '{"text": "Host a Klawsome Machine in Your Business"}'),
  ('b1000000-0000-0000-0000-000000000003', 'text', 1, '{"text": "📍 Available within 50 miles of Novi, MI (48375) only"}'),
  ('b1000000-0000-0000-0000-000000000003', 'text', 2, '{"text": "We place a machine in your space, handle everything, and you earn a share of every token played — no upfront cost, no hassle."}'),
  ('b1000000-0000-0000-0000-000000000003', 'button', 3, '{"text": "Apply for a Hosted Machine", "url": "#section-contact"}');

-- Opp 1: Hosted Machine Body
INSERT INTO section_content_blocks (section_id, block_type, row_order, content) VALUES
  ('b1000000-0000-0000-0000-000000000004', 'heading', 0, '{"text": "You earn 10% of every token played."}'),
  ('b1000000-0000-0000-0000-000000000004', 'text', 1, '{"text": "We handle the machine, the prizes, the repairs — everything. You simply provide the space and a 2.4GHz WiFi connection, and collect your 10% share each month."}'),
  ('b1000000-0000-0000-0000-000000000004', 'heading', 2, '{"text": "What each side handles"}'),
  ('b1000000-0000-0000-0000-000000000004', 'text', 3, '{"text": "A truly hands-off opportunity for your business."}'),
  ('b1000000-0000-0000-0000-000000000004', 'richtext', 4, '{"html": "<h4>Klawsome Takes Care Of</h4><p><em>We do the heavy lifting</em></p><ul><li>Machine delivery & installation</li><li>All prize stocking & restocking</li><li>All repairs & maintenance</li><li>Revenue tracking & monthly payouts</li><li>Ongoing machine operation</li></ul><h4>Your Business Provides</h4><p><em>That''s really it</em></p><ul><li>Floor space for the machine</li><li>One standard power outlet</li><li>A 2.4GHz WiFi connection</li></ul>"}'),
  ('b1000000-0000-0000-0000-000000000004', 'heading', 5, '{"text": "Perfect for high-traffic spots"}'),
  ('b1000000-0000-0000-0000-000000000004', 'richtext', 6, '{"html": "<p>🍜 Restaurants · 🧋 Bubble Tea Shops · 🎳 Entertainment Venues · 🛍️ Retail Stores · ⏳ Waiting Areas · 🏪 High Foot Traffic Spaces</p>"}'),
  ('b1000000-0000-0000-0000-000000000004', 'button', 7, '{"text": "Apply for a Hosted Machine →", "url": "#section-contact"}');

-- Opp 2: Partner Header
INSERT INTO section_content_blocks (section_id, block_type, row_order, content) VALUES
  ('b1000000-0000-0000-0000-000000000005', 'text', 0, '{"text": "Own a Fantasy Claw Arcade — Be the Go-To Entertainment Spot in Your City"}'),
  ('b1000000-0000-0000-0000-000000000005', 'heading', 1, '{"text": "Become a Klawsome Partner"}'),
  ('b1000000-0000-0000-0000-000000000005', 'text', 2, '{"text": "Open your own fully-equipped Klawsome claw arcade. We give you everything you need — the brand, the machines, the training, the marketing. You bring the vision."}'),
  ('b1000000-0000-0000-0000-000000000005', 'button', 3, '{"text": "Become a Partner →", "url": "#section-contact"}');

-- Opp 2: Partner Body
INSERT INTO section_content_blocks (section_id, block_type, row_order, content) VALUES
  ('b1000000-0000-0000-0000-000000000006', 'heading', 0, '{"text": "Why we''re not calling this a franchise"}'),
  ('b1000000-0000-0000-0000-000000000006', 'text', 1, '{"text": "We want you to have the freedom to build something bigger. Pair a Klawsome arcade with a bubble tea bar, a bakery, a themed café, a community event space — whatever concept you''re dreaming up. A traditional franchise would box you in. We''re here to fuel your vision, not constrain it. You get the full power of the Klawsome brand and proven system, with the flexibility to make it entirely yours."}'),
  ('b1000000-0000-0000-0000-000000000006', 'heading', 2, '{"text": "What Klawsome Supplies"}'),
  ('b1000000-0000-0000-0000-000000000006', 'cards', 3, '{"items": [{"icon": "🎰", "title": "Equipment", "description": "Commercial-grade claw machines, fully set up and ready to play from day one."}, {"icon": "🧸", "title": "Plushies & Prizes", "description": "Our curated kawaii-style plushie inventory, restocked as you grow."}, {"icon": "✨", "title": "The Brand", "description": "Full use of the Klawsome name, look, feel, and identity customers already love."}, {"icon": "📋", "title": "Training", "description": "Hands-on training for you and your staff on how to run everything smoothly."}, {"icon": "📣", "title": "Marketing Materials", "description": "Ready-to-use social media assets, templates, and launch marketing support."}, {"icon": "🤝", "title": "Ongoing Support", "description": "We''re in your corner as you scale — operational guidance and continued partnership."}]}'),
  ('b1000000-0000-0000-0000-000000000006', 'heading', 4, '{"text": "Pair it with your other concepts"}'),
  ('b1000000-0000-0000-0000-000000000006', 'text', 5, '{"text": "Launching a bubble tea shop? A bakery? A themed café? A Klawsome arcade plugs right in. Because we''re not locking you into a traditional franchise model, you have full flexibility to build a multi-concept space that draws in more customers and creates a one-of-a-kind destination in your community. The arcade drives foot traffic — you design what they do next."}'),
  ('b1000000-0000-0000-0000-000000000006', 'button', 6, '{"text": "Let''s Talk Partnership →", "url": "#section-contact"}');

-- Opp 3: Plushie Header
INSERT INTO section_content_blocks (section_id, block_type, row_order, content) VALUES
  ('b1000000-0000-0000-0000-000000000007', 'heading', 0, '{"text": "Custom Plushie Orders"}'),
  ('b1000000-0000-0000-0000-000000000007', 'text', 1, '{"text": "Have a character, mascot, or design in mind? Share it with us and we''ll create a quote. Simple to life-size, we do it all — for businesses and individuals alike."}'),
  ('b1000000-0000-0000-0000-000000000007', 'button', 2, '{"text": "Request a Quote →", "url": "#section-contact"}');

-- Opp 3: Plushie Body
INSERT INTO section_content_blocks (section_id, block_type, row_order, content) VALUES
  ('b1000000-0000-0000-0000-000000000008', 'text', 0, '{"text": "📦 Minimum order: 100 units. Perfect for businesses, events, brands, arcades, or anyone looking to create a custom keepsake at scale. Great for promotions, giveaways, retail, or arcade prizes."}'),
  ('b1000000-0000-0000-0000-000000000008', 'heading', 1, '{"text": "Pricing by complexity"}'),
  ('b1000000-0000-0000-0000-000000000008', 'text', 2, '{"text": "All prices are per unit, based on minimum 100-unit orders."}'),
  ('b1000000-0000-0000-0000-000000000008', 'data_cards', 3, '{"source": "inline", "display": "pricing-grid", "columns": 3, "items": [{"title": "Standard Plushie", "subtitle": "Simple Design", "price": "$4–6", "description": "Clean shapes, minimal detail. Great for branded giveaways and simple mascots.", "footer": "per unit"}, {"title": "Detailed Plushie", "subtitle": "Complex Design", "price": "$6–8", "description": "Highly detailed characters with accessories, facial features, and layered textures.", "footer": "per unit"}, {"title": "Oversized Plushie", "subtitle": "XL / Life-Size", "price": "$15–40", "description": "Statement-making XL and life-size plushies. Perfect for displays, events, and premium prizes.", "footer": "per unit"}]}'),
  ('b1000000-0000-0000-0000-000000000008', 'heading', 4, '{"text": "How it works"}'),
  ('b1000000-0000-0000-0000-000000000008', 'cards', 5, '{"items": [{"icon": "📝", "title": "Share your design", "description": "Send us a sketch, image, or description of your plushie concept."}, {"icon": "💬", "title": "We send a quote", "description": "We review complexity, size, and quantity then get back to you with pricing."}, {"icon": "✅", "title": "Approve & produce", "description": "Once approved, we handle production and delivery of your custom order."}]}'),
  ('b1000000-0000-0000-0000-000000000008', 'button', 6, '{"text": "Start Your Custom Order →", "url": "#section-contact"}');

-- How It Works
INSERT INTO section_content_blocks (section_id, block_type, row_order, content) VALUES
  ('b1000000-0000-0000-0000-000000000009', 'heading', 0, '{"text": "Getting Started is Easy"}'),
  ('b1000000-0000-0000-0000-000000000009', 'cards', 1, '{"items": [{"icon": "1", "title": "Reach Out", "description": "Fill out the form below and tell us about yourself, your business, and which opportunity interests you."}, {"icon": "2", "title": "We Connect", "description": "Our team follows up within 1–2 business days to learn more and answer your questions."}, {"icon": "3", "title": "Review & Plan", "description": "We review your location or concept together and map out the right path forward."}, {"icon": "4", "title": "Launch!", "description": "Machines installed, plushies stocked, partners trained — you''re ready to go."}]}');

-- Contact Section
INSERT INTO section_content_blocks (section_id, block_type, row_order, content) VALUES
  ('b1000000-0000-0000-0000-000000000010', 'heading', 0, '{"text": "Ready to Get Started?"}'),
  ('b1000000-0000-0000-0000-000000000010', 'text', 1, '{"text": "Tell us which opportunity excites you and we''ll take it from there."}'),
  ('b1000000-0000-0000-0000-000000000010', 'button', 2, '{"text": "Email Us", "url": "mailto:hello@klawsomenovi.com"}'),
  ('b1000000-0000-0000-0000-000000000010', 'text', 3, '{"text": "We''ll reply within 1–2 business days · hello@klawsomenovi.com"}');
