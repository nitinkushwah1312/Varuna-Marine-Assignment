create table if not exists routes (
  id serial primary key,
  route_id text not null,
  vessel_type text not null,
  fuel_type text not null,
  year int not null,
  ghg_intensity double precision not null,
  fuel_consumption double precision not null,
  distance double precision not null,
  total_emissions double precision not null,
  is_baseline boolean not null default false
);

create table if not exists ship_compliance (
  id serial primary key,
  ship_id text not null,
  year int not null,
  cb_gco2eq double precision not null,
  unique (ship_id, year)
);

create table if not exists bank_entries (
  id serial primary key,
  ship_id text not null,
  year int not null,
  amount_gco2eq double precision not null,
  created_at timestamptz not null default now()
);

create table if not exists pools (
  id serial primary key,
  year int not null,
  created_at timestamptz not null default now()
);

create table if not exists pool_members (
  pool_id int not null references pools(id) on delete cascade,
  ship_id text not null,
  cb_before double precision not null,
  cb_after double precision not null
);

