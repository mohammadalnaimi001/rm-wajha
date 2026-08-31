-- =====================================================================
-- NEXORA — Employee Management System
-- Supabase schema: tables, indexes, functions, triggers, RLS policies.
--
-- HOW TO RUN
-- 1. Open your Supabase project -> SQL Editor -> New query.
-- 2. Paste this entire file and click "Run".
-- 3. It is safe to re-run: every statement is guarded with IF NOT EXISTS /
--    CREATE OR REPLACE / DROP POLICY IF EXISTS where applicable.
-- =====================================================================

create extension if not exists pgcrypto;

-- =====================================================================
-- 1. TABLES
-- =====================================================================

create table if not exists public.profiles (
  id            uuid primary key default gen_random_uuid(),
  auth_user_id  uuid not null unique references auth.users(id) on delete cascade,
  full_name     text not null,
  email         text not null,
  phone         text,
  role          text not null check (role in ('admin','employee')),
  active        boolean not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create table if not exists public.employee_targets (
  id           uuid primary key default gen_random_uuid(),
  employee_id  uuid not null references public.profiles(id) on delete cascade,
  month        date not null, -- always the 1st of the month
  target       numeric(12,2) not null default 0,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (employee_id, month)
);

create table if not exists public.services (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  category     text not null check (category in
                 ('Website','Booking','Digital Identity','Analytics','SEO','AI','Automation','Mobile','Other')),
  description  text,
  price        numeric(12,2) not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now()
);

create table if not exists public.quotations (
  id                uuid primary key default gen_random_uuid(),
  quotation_number  text unique,
  employee_id       uuid not null references public.profiles(id) on delete restrict,
  customer_name     text not null,
  company_name      text,
  phone             text,
  email             text,
  instagram         text,
  subtotal          numeric(12,2) not null default 0,
  discount          numeric(12,2) not null default 0,
  total             numeric(12,2) not null default 0,
  notes             text,
  status            text not null default 'DRAFT'
                      check (status in ('DRAFT','SENT','APPROVED','REJECTED','EXPIRED')),
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- Price/name are a SNAPSHOT taken at creation time. They must never be
-- re-derived from services.price later — that is the whole point of
-- storing them here instead of only a service_id.
create table if not exists public.quotation_items (
  id             uuid primary key default gen_random_uuid(),
  quotation_id   uuid not null references public.quotations(id) on delete cascade,
  service_id     uuid references public.services(id) on delete set null,
  service_name   text not null,
  price          numeric(12,2) not null,
  created_at     timestamptz not null default now()
);

create table if not exists public.contracts (
  id                uuid primary key default gen_random_uuid(),
  contract_number   text unique,
  employee_id       uuid not null references public.profiles(id) on delete restrict,
  quotation_id      uuid references public.quotations(id) on delete set null,
  customer_name     text not null,
  company_name      text,
  phone             text,
  email             text,
  total             numeric(12,2) not null default 0,
  status            text not null default 'PENDING'
                      check (status in ('PENDING','CONFIRMED','PAID','CANCELLED')),
  notes             text,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

create table if not exists public.contract_items (
  id             uuid primary key default gen_random_uuid(),
  contract_id    uuid not null references public.contracts(id) on delete cascade,
  service_id     uuid references public.services(id) on delete set null,
  service_name   text not null,
  price          numeric(12,2) not null,
  created_at     timestamptz not null default now()
);

-- =====================================================================
-- 2. INDEXES
-- =====================================================================

create index if not exists idx_profiles_auth_user_id on public.profiles(auth_user_id);
create index if not exists idx_profiles_role on public.profiles(role);

create index if not exists idx_employee_targets_employee_month on public.employee_targets(employee_id, month);

create index if not exists idx_quotations_employee_status on public.quotations(employee_id, status);
create index if not exists idx_quotations_created_at on public.quotations(created_at);
create index if not exists idx_quotation_items_quotation_id on public.quotation_items(quotation_id);
create index if not exists idx_quotation_items_service_id on public.quotation_items(service_id);

create index if not exists idx_contracts_employee_status on public.contracts(employee_id, status);
create index if not exists idx_contracts_created_at on public.contracts(created_at);
create index if not exists idx_contracts_quotation_id on public.contracts(quotation_id);
create index if not exists idx_contract_items_contract_id on public.contract_items(contract_id);
create index if not exists idx_contract_items_service_id on public.contract_items(service_id);

-- =====================================================================
-- 3. updated_at TRIGGER
-- =====================================================================

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists trg_employee_targets_updated_at on public.employee_targets;
create trigger trg_employee_targets_updated_at before update on public.employee_targets
  for each row execute function public.set_updated_at();

drop trigger if exists trg_services_updated_at on public.services;
create trigger trg_services_updated_at before update on public.services
  for each row execute function public.set_updated_at();

drop trigger if exists trg_quotations_updated_at on public.quotations;
create trigger trg_quotations_updated_at before update on public.quotations
  for each row execute function public.set_updated_at();

drop trigger if exists trg_contracts_updated_at on public.contracts;
create trigger trg_contracts_updated_at before update on public.contracts
  for each row execute function public.set_updated_at();

-- =====================================================================
-- 4. NUMBER GENERATION (quotation_number / contract_number)
-- =====================================================================

create or replace function public.generate_quotation_number()
returns trigger language plpgsql as $$
declare
  seq_val bigint;
  prefix text := 'Q-' || to_char(now(), 'YYYYMM') || '-';
begin
  if new.quotation_number is not null then
    return new;
  end if;
  select count(*) + 1 into seq_val
    from public.quotations
    where quotation_number like prefix || '%';
  new.quotation_number := prefix || lpad(seq_val::text, 4, '0');
  return new;
end;
$$;

drop trigger if exists trg_quotation_number on public.quotations;
create trigger trg_quotation_number before insert on public.quotations
  for each row execute function public.generate_quotation_number();

create or replace function public.generate_contract_number()
returns trigger language plpgsql as $$
declare
  seq_val bigint;
  prefix text := 'C-' || to_char(now(), 'YYYYMM') || '-';
begin
  if new.contract_number is not null then
    return new;
  end if;
  select count(*) + 1 into seq_val
    from public.contracts
    where contract_number like prefix || '%';
  new.contract_number := prefix || lpad(seq_val::text, 4, '0');
  return new;
end;
$$;

drop trigger if exists trg_contract_number on public.contracts;
create trigger trg_contract_number before insert on public.contracts
  for each row execute function public.generate_contract_number();

-- =====================================================================
-- 5. SECURITY-DEFINER HELPER FUNCTIONS
--    (Used inside RLS policies. SECURITY DEFINER + a fixed search_path
--    avoids the classic recursive-RLS trap of profiles policies calling
--    back into profiles.)
-- =====================================================================

create or replace function public.current_profile_id()
returns uuid
language sql stable security definer set search_path = public as $$
  select id from public.profiles where auth_user_id = auth.uid();
$$;

create or replace function public.is_admin()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where auth_user_id = auth.uid() and role = 'admin' and active = true
  );
$$;

create or replace function public.is_active_profile()
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where auth_user_id = auth.uid() and active = true
  );
$$;

-- Returns ONLY the caller's own aggregate performance row, plus their
-- rank among all employees for that month. It reads every employee's
-- contracts internally (security definer) but never exposes another
-- employee's raw rows to the caller — only the caller's own numbers
-- and an integer rank/headcount.
create or replace function public.get_my_performance(p_month date default date_trunc('month', now())::date)
returns table (
  employee_id uuid,
  full_name text,
  total_contracts bigint,
  confirmed_contracts bigint,
  paid_contracts bigint,
  cancelled_contracts bigint,
  total_sales numeric,
  monthly_sales numeric,
  weekly_sales numeric,
  average_contract_value numeric,
  monthly_target numeric,
  achievement_pct numeric,
  rank bigint,
  headcount bigint
)
language plpgsql stable security definer set search_path = public as $$
declare
  v_profile_id uuid := public.current_profile_id();
  v_month_start date := date_trunc('month', p_month)::date;
  v_month_end date := (date_trunc('month', p_month) + interval '1 month')::date;
begin
  if v_profile_id is null then
    return;
  end if;

  return query
  with sales as (
    select
      c.employee_id,
      count(*) filter (where true) as total_contracts,
      count(*) filter (where c.status = 'CONFIRMED') as confirmed_contracts,
      count(*) filter (where c.status = 'PAID') as paid_contracts,
      count(*) filter (where c.status = 'CANCELLED') as cancelled_contracts,
      coalesce(sum(c.total) filter (where c.status in ('CONFIRMED','PAID')), 0) as total_sales,
      coalesce(sum(c.total) filter (
        where c.status in ('CONFIRMED','PAID') and c.created_at >= v_month_start and c.created_at < v_month_end
      ), 0) as monthly_sales,
      coalesce(sum(c.total) filter (
        where c.status in ('CONFIRMED','PAID') and c.created_at >= (now() - interval '7 days')
      ), 0) as weekly_sales,
      coalesce(avg(c.total) filter (where c.status in ('CONFIRMED','PAID')), 0) as average_contract_value
    from public.contracts c
    group by c.employee_id
  ),
  ranked as (
    select
      p.id as employee_id,
      p.full_name,
      coalesce(s.total_contracts, 0) as total_contracts,
      coalesce(s.confirmed_contracts, 0) as confirmed_contracts,
      coalesce(s.paid_contracts, 0) as paid_contracts,
      coalesce(s.cancelled_contracts, 0) as cancelled_contracts,
      coalesce(s.total_sales, 0) as total_sales,
      coalesce(s.monthly_sales, 0) as monthly_sales,
      coalesce(s.weekly_sales, 0) as weekly_sales,
      coalesce(s.average_contract_value, 0) as average_contract_value,
      rank() over (order by coalesce(s.monthly_sales, 0) desc) as rank,
      count(*) over () as headcount
    from public.profiles p
    left join sales s on s.employee_id = p.id
    where p.role = 'employee'
  ),
  target as (
    select target from public.employee_targets
    where employee_id = v_profile_id and month = v_month_start
  )
  select
    r.employee_id,
    r.full_name,
    r.total_contracts,
    r.confirmed_contracts,
    r.paid_contracts,
    r.cancelled_contracts,
    r.total_sales,
    r.monthly_sales,
    r.weekly_sales,
    r.average_contract_value,
    coalesce((select target from target), 0) as monthly_target,
    case when coalesce((select target from target), 0) > 0
      then round(r.monthly_sales / (select target from target) * 100, 1)
      else 0
    end as achievement_pct,
    r.rank,
    r.headcount
  from ranked r
  where r.employee_id = v_profile_id;
end;
$$;

grant execute on function public.get_my_performance(date) to authenticated;

-- =====================================================================
-- 6. ROW LEVEL SECURITY
-- =====================================================================

alter table public.profiles enable row level security;
alter table public.employee_targets enable row level security;
alter table public.services enable row level security;
alter table public.quotations enable row level security;
alter table public.quotation_items enable row level security;
alter table public.contracts enable row level security;
alter table public.contract_items enable row level security;

-- ---- profiles ---------------------------------------------------------
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles for select
  using (auth_user_id = auth.uid() or public.is_admin());

-- No employee UPDATE policy at all: employees cannot change their own
-- role/active/name/target through the API. Only admins may write.
drop policy if exists profiles_admin_all on public.profiles;
create policy profiles_admin_all on public.profiles for all
  using (public.is_admin()) with check (public.is_admin());

-- ---- employee_targets ---------------------------------------------------
drop policy if exists employee_targets_select on public.employee_targets;
create policy employee_targets_select on public.employee_targets for select
  using (employee_id = public.current_profile_id() or public.is_admin());

drop policy if exists employee_targets_admin_write on public.employee_targets;
create policy employee_targets_admin_write on public.employee_targets for all
  using (public.is_admin()) with check (public.is_admin());

-- ---- services -----------------------------------------------------------
drop policy if exists services_select on public.services;
create policy services_select on public.services for select
  using (active = true or public.is_admin());

drop policy if exists services_admin_write on public.services;
create policy services_admin_write on public.services for all
  using (public.is_admin()) with check (public.is_admin());

-- ---- quotations -----------------------------------------------------------
drop policy if exists quotations_select on public.quotations;
create policy quotations_select on public.quotations for select
  using (
    (employee_id = public.current_profile_id() and public.is_active_profile())
    or public.is_admin()
  );

drop policy if exists quotations_insert on public.quotations;
create policy quotations_insert on public.quotations for insert
  with check (
    (employee_id = public.current_profile_id() and public.is_active_profile())
    or public.is_admin()
  );

drop policy if exists quotations_update on public.quotations;
create policy quotations_update on public.quotations for update
  using (
    (employee_id = public.current_profile_id() and status = 'DRAFT' and public.is_active_profile())
    or public.is_admin()
  )
  with check (
    employee_id = public.current_profile_id() or public.is_admin()
  );

drop policy if exists quotations_admin_delete on public.quotations;
create policy quotations_admin_delete on public.quotations for delete
  using (public.is_admin());

-- ---- quotation_items -----------------------------------------------------
drop policy if exists quotation_items_select on public.quotation_items;
create policy quotation_items_select on public.quotation_items for select
  using (
    public.is_admin() or exists (
      select 1 from public.quotations q
      where q.id = quotation_items.quotation_id
        and q.employee_id = public.current_profile_id()
    )
  );

drop policy if exists quotation_items_write on public.quotation_items;
create policy quotation_items_write on public.quotation_items for all
  using (
    public.is_admin() or exists (
      select 1 from public.quotations q
      where q.id = quotation_items.quotation_id
        and q.employee_id = public.current_profile_id()
        and q.status = 'DRAFT'
        and public.is_active_profile()
    )
  )
  with check (
    public.is_admin() or exists (
      select 1 from public.quotations q
      where q.id = quotation_items.quotation_id
        and q.employee_id = public.current_profile_id()
        and public.is_active_profile()
    )
  );

-- ---- contracts -----------------------------------------------------------
drop policy if exists contracts_select on public.contracts;
create policy contracts_select on public.contracts for select
  using (
    (employee_id = public.current_profile_id() and public.is_active_profile())
    or public.is_admin()
  );

drop policy if exists contracts_insert on public.contracts;
create policy contracts_insert on public.contracts for insert
  with check (
    (employee_id = public.current_profile_id() and public.is_active_profile())
    or public.is_admin()
  );

-- Employees may only edit their own contract while it is still PENDING.
-- Moving to CONFIRMED / PAID / CANCELLED (the statuses that count
-- toward sales & ranking) is admin-only, so performance numbers can't
-- be self-certified by the employee who benefits from them.
drop policy if exists contracts_update on public.contracts;
create policy contracts_update on public.contracts for update
  using (
    (employee_id = public.current_profile_id() and status = 'PENDING' and public.is_active_profile())
    or public.is_admin()
  )
  with check (
    -- An employee may edit their own contract's other fields, but the
    -- WITH CHECK forces the status to stay PENDING for them — only an
    -- admin can move a contract to CONFIRMED/PAID/CANCELLED, which is
    -- what feeds the counted sales/ranking numbers.
    (employee_id = public.current_profile_id() and status = 'PENDING')
    or public.is_admin()
  );

drop policy if exists contracts_admin_delete on public.contracts;
create policy contracts_admin_delete on public.contracts for delete
  using (public.is_admin());

-- ---- contract_items -----------------------------------------------------
drop policy if exists contract_items_select on public.contract_items;
create policy contract_items_select on public.contract_items for select
  using (
    public.is_admin() or exists (
      select 1 from public.contracts c
      where c.id = contract_items.contract_id
        and c.employee_id = public.current_profile_id()
    )
  );

drop policy if exists contract_items_write on public.contract_items;
create policy contract_items_write on public.contract_items for all
  using (
    public.is_admin() or exists (
      select 1 from public.contracts c
      where c.id = contract_items.contract_id
        and c.employee_id = public.current_profile_id()
        and c.status = 'PENDING'
        and public.is_active_profile()
    )
  )
  with check (
    public.is_admin() or exists (
      select 1 from public.contracts c
      where c.id = contract_items.contract_id
        and c.employee_id = public.current_profile_id()
        and public.is_active_profile()
    )
  );

-- =====================================================================
-- Done. Next: run supabase/seed.sql (optional demo services), then
-- create your first admin — see README.md "Create the first admin".
-- =====================================================================
