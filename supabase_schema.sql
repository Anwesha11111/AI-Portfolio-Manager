-- 0. Clean up existing schema
drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user cascade;

drop table if exists public.transactions cascade;
drop table if exists public.holdings cascade;
drop table if exists public.users cascade;

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Users Table
create table public.users (
  id uuid primary key references auth.users(id),
  email text not null,
  virtual_balance numeric not null default 1000000.00,
  current_simulated_date bigint not null default 1104537600000, -- Default: Jan 1, 2005 in milliseconds
  monthly_income numeric default 0,
  monthly_expenses numeric default 0,
  total_savings numeric default 0,
  time_horizon text default 'long', -- 'short', 'medium', 'long'
  drawdown_tolerance text default 'medium', -- 'low', 'medium', 'high'
  primary_objective text default 'growth', -- 'income', 'growth', 'preservation'
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Holdings Table (Current Portfolio)
create table public.holdings (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  symbol text not null,
  quantity integer not null,
  average_buy_price numeric not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id, symbol) -- A user can only have one active holding record per symbol
);

-- 3. Transactions Table (Immutable Ledger)
create table public.transactions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete cascade not null,
  symbol text not null,
  type text not null check (type in ('BUY', 'SELL')),
  quantity integer not null,
  price_per_unit numeric not null,
  simulated_date bigint not null, -- The time-machine timestamp
  real_created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Row Level Security (RLS)
alter table public.users enable row level security;
alter table public.holdings enable row level security;
alter table public.transactions enable row level security;

-- Policies
create policy "Users can view their own profile." on users for select using (auth.uid() = id);
create policy "Users can update their own profile." on users for update using (auth.uid() = id);

create policy "Users can view their own holdings." on holdings for select using (auth.uid() = user_id);
create policy "Users can insert their own holdings." on holdings for insert with check (auth.uid() = user_id);
create policy "Users can update their own holdings." on holdings for update using (auth.uid() = user_id);
create policy "Users can delete their own holdings." on holdings for delete using (auth.uid() = user_id);

create policy "Users can view their own transactions." on transactions for select using (auth.uid() = user_id);
create policy "Users can insert their own transactions." on transactions for insert with check (auth.uid() = user_id);

-- 4. Triggers
-- Automatically insert a row into public.users when a new user signs up
create function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email)
  values (new.id, new.email);
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
