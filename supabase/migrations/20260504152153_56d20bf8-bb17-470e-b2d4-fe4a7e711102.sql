
-- Rental package updates
UPDATE rental_packages
SET features = '["1 Claw Machine", "1 Hour of Play", "Filled with your product (5–10 inch, 0–5 lbs)", "Free delivery within 20 miles", "Easy win difficulty", "Free-play mode", "Full delivery and setup"]'::jsonb
WHERE name = 'Party Package';

UPDATE rental_packages
SET name = 'Add-On: Extra Hour',
    price = '$145 / machine',
    description = 'Extend any package by an hour, per machine.',
    features = '["$145 per additional hour, per machine", "Add as many hours as you need"]'::jsonb
WHERE name = 'Add-On: Extra Hour';

INSERT INTO rental_packages (name, price, description, features, cta_text, cta_url, is_highlight, sort_order)
VALUES (
  'Add-On: Extra Claw Machine',
  '$245',
  'One additional claw machine for your event. Coming soon — not yet available.',
  '["One extra claw machine", "Filled with product (5–10 inch, 0–5 lbs)", "Coming soon — not yet available"]'::jsonb,
  '',
  '',
  false,
  5
);

-- Rental FAQ additions
INSERT INTO faq_items (question, answer, page, sort_order) VALUES
('Is the claw machine safe for children?','Absolutely. Our machines are commercial-grade, fully UL-listed, and designed for unattended public use. They are stable, low-voltage on the play side, and have rounded edges. We recommend adult supervision for younger children, as with any arcade equipment.','rental',100),
('Are you insured?','Yes. Klawsome carries general liability insurance for our equipment and operators. A signed liability release waiver is required from the event host before the rental begins — we''ll send it with your booking confirmation.','rental',101),
('What happens if the machine breaks during my event?','Our team tests every machine before delivery. In the unlikely event of a malfunction, our on-call technician can troubleshoot remotely or come on-site if we''re local. If we can''t restore play, you''ll receive a prorated refund for the affected time.','rental',102),
('Can the machine be set to "always win"?','Yes — we offer a free-play / easy-win mode so every guest leaves with a prize. Just let us know the difficulty level you''d like when booking.','rental',103),
('What surfaces can the machine sit on?','Any flat, level indoor surface — hardwood, tile, low-pile carpet, or concrete. We do not place machines on grass, gravel, or uneven outdoor patios.','rental',104),
('Can the machine be used outdoors?','Indoor use only. Our machines are not weather-sealed and should never be exposed to rain, direct sun, or temperatures below 50°F.','rental',105),
('Is a deposit required?','Yes, a 25% non-refundable deposit holds your date. The balance is due 7 days before the event.','rental',106),
('Do you offer corporate or recurring rentals?','Yes — we work with offices, schools, breweries, and pop-ups on one-time and ongoing rentals. Contact events@klawsomenovi.com for a custom quote.','rental',107);
