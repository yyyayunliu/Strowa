-- Strowa V2 backend verification / patch
-- Safe to run after the earlier strowa_supabase_fixed.sql.

create schema if not exists extensions;
create extension if not exists pgcrypto with schema extensions;

grant usage on schema public to anon, authenticated;

grant execute on function public.strowa_list_active_checkins() to anon, authenticated;
grant execute on function public.strowa_create_checkin(text,text,text,text,text,double precision,double precision,text,integer) to anon, authenticated;
grant execute on function public.strowa_end_checkin(uuid,text) to anon, authenticated;
grant execute on function public.strowa_send_hello(uuid,text,text) to anon, authenticated;
grant execute on function public.strowa_list_hellos(uuid,text) to anon, authenticated;

-- Ask Supabase/PostgREST to refresh its function schema cache immediately.
notify pgrst, 'reload schema';

-- This should run successfully and return zero or more rows:
select * from public.strowa_list_active_checkins();
