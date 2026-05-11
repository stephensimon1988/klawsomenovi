-- Remove redundant "Are tables and chairs provided?" FAQ on birthdays page
-- (duplicate of the "seating and space" question per master feedback doc)
DELETE FROM public.faq_items WHERE id = 'ac785872-49a3-474d-9bcb-b168c0b772b3';
