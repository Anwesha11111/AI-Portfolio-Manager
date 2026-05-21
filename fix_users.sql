-- Fix the handle_new_user trigger to include virtual_balance
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.users (id, email, username, country, document_number, virtual_balance)
  values (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'username', 
    new.raw_user_meta_data->>'country', 
    new.raw_user_meta_data->>'documentNumber',
    1000000.00
  );
  return new;
end;
$$;

-- Fix existing users who don't have virtual_balance set
update public.users 
set virtual_balance = coalesce(virtual_balance, 1000000.00)
where virtual_balance is null;
