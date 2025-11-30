-- ---------------------------------------------------------
-- MOCK DATA GENERATOR FOR OUTFIT SUGGESTIONS
-- ---------------------------------------------------------
-- This script will automatically link every product in your database
-- to 3 other random products to simulate "Complete The Look".
-- ---------------------------------------------------------

-- 1. Clear existing suggestions (Optional - uncomment if you want to reset)
-- delete from product_suggestions;

-- 2. Insert 3 random suggestions for EACH product
insert into product_suggestions (source_product_id, suggested_product_id)
select 
  p1.id as source_id, 
  p2.id as suggested_id
from products p1
cross join lateral (
  -- For each product (p1), find 3 other random products (p2)
  select id 
  from products p2
  where p2.id != p1.id -- Don't suggest the product itself
  order by random()    -- Randomize
  limit 3              -- Pick 3
) p2
on conflict (source_product_id, suggested_product_id) do nothing;

-- 3. Verify the data
select count(*) as total_suggestions from product_suggestions;
