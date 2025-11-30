-- Create the product_suggestions table
create table if not exists product_suggestions (
  id uuid default uuid_generate_v4() primary key,
  source_product_id uuid references products(id) on delete cascade not null,
  suggested_product_id uuid references products(id) on delete cascade not null,
  display_order integer default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  -- Prevent duplicate suggestions for the same product
  unique(source_product_id, suggested_product_id)
);

-- Create an index for faster lookups when loading a product page
create index if not exists idx_product_suggestions_source on product_suggestions(source_product_id);

-- Enable Row Level Security (RLS)
alter table product_suggestions enable row level security;

-- Allow public read access (anyone can see suggestions)
create policy "Public suggestions are viewable by everyone."
  on product_suggestions for select
  using ( true );

-- Allow authenticated users (admins) to insert/update/delete
-- Note: Adjust this policy based on your actual auth setup if needed
create policy "Admins can manage suggestions."
  on product_suggestions for all
  using ( auth.role() = 'authenticated' );
