create schema if not exists private;
create type public.app_role as enum ('master_admin','admin','fisher');
create type public.consent_type as enum ('location','trip_location','notifications','privacy_policy','terms');
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    cpf TEXT UNIQUE,
    phone TEXT,
    birth_date DATE,
    community TEXT,
    locality TEXT,
    fisher_type TEXT CHECK (fisher_type IN ('Artesanal', 'Profissional', 'Amador', 'Marisqueiro', 'Outro')),
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    emergency_contact_relation TEXT,
    avatar_url TEXT,
    registration_completed BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    role app_role NOT NULL,
    UNIQUE (user_id, role)
);

CREATE TABLE public.boats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    registration_number TEXT,
    boat_type TEXT,
    length_meters NUMERIC,
    engine_brand TEXT,
    engine_power_hp NUMERIC,
    fuel_type TEXT,
    hull_material TEXT,
    color TEXT,
    home_port TEXT,
    photo_url TEXT,
    is_primary BOOLEAN DEFAULT false,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.weather_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    location_key TEXT,
    latitude DOUBLE PRECISION,
    longitude DOUBLE PRECISION,
    provider TEXT NOT NULL,
    data_type TEXT NOT NULL, -- 'current', 'hourly', 'alerts'
    payload JSONB NOT NULL,
    fetched_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.tide_cache (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    station_key TEXT NOT NULL,
    date DATE NOT NULL,
    provider TEXT NOT NULL,
    payload JSONB NOT NULL,
    fetched_at TIMESTAMPTZ DEFAULT now(),
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (station_key, date, provider)
);

CREATE TABLE public.fishing_trips (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    boat_id UUID NOT NULL REFERENCES public.boats(id) ON DELETE RESTRICT,
    destination_description TEXT,
    crew_count INTEGER NOT NULL DEFAULT 1 CHECK (crew_count >= 1),
    expected_return_at TIMESTAMPTZ,
    started_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    ended_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    location_sharing_enabled BOOLEAN NOT NULL DEFAULT false,
    last_location_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.trip_locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.fishing_trips(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    latitude NUMERIC NOT NULL,
    longitude NUMERIC NOT NULL,
    accuracy NUMERIC,
    speed NUMERIC,
    heading NUMERIC,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    received_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.emergency_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    trip_id UUID REFERENCES public.fishing_trips(id) ON DELETE SET NULL,
    boat_id UUID REFERENCES public.boats(id) ON DELETE SET NULL,
    incident_type TEXT,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'acknowledged', 'in_progress', 'resolved', 'cancelled')),
    priority TEXT NOT NULL DEFAULT 'high' CHECK (priority IN ('normal', 'high', 'critical')),
    latitude NUMERIC,
    longitude NUMERIC,
    accuracy NUMERIC,
    location_recorded_at TIMESTAMPTZ,
    location_source TEXT CHECK (location_source IN ('current', 'trip_last_known', 'none')),
    contact_phone TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    client_request_id TEXT UNIQUE,
    sos_number TEXT UNIQUE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    acknowledged_at TIMESTAMPTZ,
    resolved_at TIMESTAMPTZ
);

CREATE TABLE public.notices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    summary TEXT,
    content TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'secretaria_pesca', 
        'prefeitura', 
        'seguranca', 
        'clima', 
        'evento', 
        'beneficio', 
        'documentacao', 
        'defeso', 
        'saude', 
        'meio_ambiente', 
        'outro'
    )),
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'scheduled', 'published', 'archived')),
    source_type TEXT NOT NULL DEFAULT 'manual' CHECK (source_type IN ('manual', 'instagram', 'facebook', 'website', 'external')),
    source_name TEXT,
    source_url TEXT,
    external_id TEXT,
    image_url TEXT,
    published_at TIMESTAMPTZ,
    scheduled_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    pinned BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.notice_audiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notice_id UUID REFERENCES public.notices(id) ON DELETE CASCADE NOT NULL,
    audience_type TEXT NOT NULL CHECK (audience_type IN ('all', 'community', 'fisher_type', 'admin_defined_group')),
    audience_value TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.external_content_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL CHECK (platform IN ('instagram', 'facebook', 'website', 'other')),
    external_id TEXT NOT NULL,
    source_account TEXT NOT NULL,
    title TEXT,
    caption TEXT,
    media_url TEXT,
    permalink TEXT,
    published_at TIMESTAMPTZ,
    raw_payload JSONB,
    review_status TEXT NOT NULL DEFAULT 'pending' CHECK (review_status IN ('pending', 'approved', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(platform, external_id)
);

CREATE TABLE public.push_subscriptions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    provider TEXT NOT NULL,
    device_token TEXT NOT NULL,
    device_name TEXT,
    platform TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    last_seen_at TIMESTAMPTZ,
    UNIQUE (user_id, device_token)
);

CREATE TABLE public.notification_preferences (
    user_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    secretaria_enabled BOOLEAN DEFAULT true,
    prefeitura_enabled BOOLEAN DEFAULT true,
    weather_enabled BOOLEAN DEFAULT true,
    marine_enabled BOOLEAN DEFAULT true,
    trip_enabled BOOLEAN DEFAULT true,
    sos_enabled BOOLEAN DEFAULT true,
    events_enabled BOOLEAN DEFAULT true,
    quiet_hours_enabled BOOLEAN DEFAULT false,
    quiet_hours_start TIME,
    quiet_hours_end TIME,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type TEXT NOT NULL CHECK (type IN ('notice', 'weather_alert', 'marine_alert', 'trip_reminder', 'trip_overdue', 'sos_update', 'event', 'system')),
    title TEXT NOT NULL,
    body TEXT NOT NULL,
    priority TEXT NOT NULL CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    target_type TEXT NOT NULL CHECK (target_type IN ('user', 'community', 'fisher_type', 'all')),
    target_value TEXT,
    reference_type TEXT,
    reference_id UUID,
    scheduled_at TIMESTAMPTZ,
    sent_at TIMESTAMPTZ,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.notification_deliveries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    notification_id UUID REFERENCES public.notifications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES public.push_subscriptions(id) ON DELETE SET NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'sent', 'delivered', 'failed', 'skipped')),
    error_code TEXT,
    error_message TEXT,
    sent_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.document_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    boat_id UUID REFERENCES public.boats(id) ON DELETE SET NULL,
    category_id UUID REFERENCES public.document_categories(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    document_number TEXT,
    issuer TEXT,
    issued_at DATE,
    expires_at DATE,
    file_url TEXT,
    status TEXT NOT NULL CHECK (status IN ('valid', 'expiring', 'expired', 'pending_review', 'archived')) DEFAULT 'valid',
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.calendar_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    category TEXT NOT NULL CHECK (category IN ('reuniao', 'curso', 'defeso', 'prazo', 'atendimento', 'evento_pesqueiro', 'evento_nautico', 'importante')),
    starts_at TIMESTAMPTZ NOT NULL,
    ends_at TIMESTAMPTZ,
    location TEXT,
    source TEXT,
    is_public BOOLEAN DEFAULT true,
    priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'critical')),
    notice_id UUID REFERENCES public.notices(id) ON DELETE SET NULL,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.fish_species (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    common_name TEXT NOT NULL,
    scientific_name TEXT,
    image_url TEXT,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.fishing_regulations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    species_id UUID REFERENCES public.fish_species(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    rule_type TEXT NOT NULL CHECK (rule_type IN ('closed_season', 'minimum_size', 'prohibited_area', 'gear_restriction', 'general_rule', 'other')),
    starts_at DATE,
    ends_at DATE,
    region TEXT DEFAULT 'Paraty - RJ',
    minimum_size_cm NUMERIC,
    legal_reference TEXT,
    source_url TEXT,
    source_name TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'scheduled')),
    updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.trip_timeline_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    trip_id UUID NOT NULL REFERENCES public.fishing_trips(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

CREATE TABLE public.user_consents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    consent_type public.consent_type NOT NULL,
    version TEXT,
    granted BOOLEAN DEFAULT FALSE,
    granted_at TIMESTAMPTZ,
    revoked_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE (user_id, consent_type, version)
);

CREATE TABLE public.offline_sync_queue (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    client_request_id UUID NOT NULL, -- Para idempotência
    operation_type TEXT NOT NULL, -- 'SOS', 'LOCATION', 'TRIP_END', etc.
    payload JSONB NOT NULL,
    priority INTEGER DEFAULT 0,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    error_message TEXT,
    attempts INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now(),
    processed_at TIMESTAMPTZ,
    UNIQUE (client_request_id)
);

CREATE TABLE public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    actor_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    module TEXT NOT NULL,
    entity_type TEXT,
    entity_id TEXT,
    metadata JSONB,
    created_at TIMESTAMPTZ DEFAULT now()
);
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS nickname TEXT,
ADD COLUMN IF NOT EXISTS gender TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS neighborhood TEXT,
ADD COLUMN IF NOT EXISTS city TEXT DEFAULT 'Paraty',
ADD COLUMN IF NOT EXISTS state TEXT DEFAULT 'RJ',
ADD COLUMN IF NOT EXISTS cep TEXT,
ADD COLUMN IF NOT EXISTS fisher_registration TEXT,
ADD COLUMN IF NOT EXISTS municipal_registration TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending'));
create function private.is_admin() returns boolean language sql stable security definer set search_path='' as $$
select auth.uid() is not null and exists(select 1 from public.user_roles where user_id=auth.uid() and role in ('admin','master_admin'));
$$;
create function private.is_master() returns boolean language sql stable security definer set search_path='' as $$
select auth.uid() is not null and exists(select 1 from public.user_roles where user_id=auth.uid() and role='master_admin');
$$;
revoke all on schema private from public,anon;
grant usage on schema private to authenticated;
revoke all on all functions in schema private from public,anon;
grant execute on function private.is_admin(),private.is_master() to authenticated;

alter table public.profiles enable row level security;
revoke all on public.profiles from anon,authenticated;
grant all on public.profiles to service_role;
grant select,insert,update,delete on public.profiles to authenticated;
create policy admin_access on public.profiles for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy owner_select on public.profiles for select to authenticated using (id=(select auth.uid())) ;
create policy owner_insert on public.profiles for insert to authenticated  with check (id=(select auth.uid()));
create policy owner_update on public.profiles for update to authenticated using (id=(select auth.uid())) with check (id=(select auth.uid()));

alter table public.user_roles enable row level security;
revoke all on public.user_roles from anon,authenticated;
grant all on public.user_roles to service_role;
grant select,insert,update,delete on public.user_roles to authenticated;
create policy master_roles on public.user_roles for all to authenticated using ((select private.is_master())) with check ((select private.is_master()));
create policy reader on public.user_roles for select to authenticated using (user_id = (select auth.uid()));
create index user_roles_user_id_idx on public.user_roles(user_id);

alter table public.boats enable row level security;
revoke all on public.boats from anon,authenticated;
grant all on public.boats to service_role;
grant select,insert,update,delete on public.boats to authenticated;
create policy admin_access on public.boats for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy owner_select on public.boats for select to authenticated using (owner_id=(select auth.uid())) ;
create policy owner_insert on public.boats for insert to authenticated  with check (owner_id=(select auth.uid()));
create policy owner_update on public.boats for update to authenticated using (owner_id=(select auth.uid())) with check (owner_id=(select auth.uid()));
create index boats_owner_id_idx on public.boats(owner_id);

alter table public.weather_cache enable row level security;
revoke all on public.weather_cache from anon,authenticated;
grant all on public.weather_cache to service_role;
grant select,insert,update,delete on public.weather_cache to authenticated;
create policy admin_access on public.weather_cache for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy reader on public.weather_cache for select to authenticated using (true);

alter table public.tide_cache enable row level security;
revoke all on public.tide_cache from anon,authenticated;
grant all on public.tide_cache to service_role;
grant select,insert,update,delete on public.tide_cache to authenticated;
create policy admin_access on public.tide_cache for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy reader on public.tide_cache for select to authenticated using (true);

alter table public.fishing_trips enable row level security;
revoke all on public.fishing_trips from anon,authenticated;
grant all on public.fishing_trips to service_role;
grant select,insert,update,delete on public.fishing_trips to authenticated;
create policy admin_access on public.fishing_trips for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy owner_select on public.fishing_trips for select to authenticated using (user_id=(select auth.uid())) ;
create policy owner_insert on public.fishing_trips for insert to authenticated  with check (user_id=(select auth.uid()));
create policy owner_update on public.fishing_trips for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create index fishing_trips_user_id_idx on public.fishing_trips(user_id);
create index fishing_trips_boat_id_idx on public.fishing_trips(boat_id);

alter table public.trip_locations enable row level security;
revoke all on public.trip_locations from anon,authenticated;
grant all on public.trip_locations to service_role;
grant select,insert,update,delete on public.trip_locations to authenticated;
create policy admin_access on public.trip_locations for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create index trip_locations_trip_id_idx on public.trip_locations(trip_id);
create index trip_locations_user_id_idx on public.trip_locations(user_id);

alter table public.emergency_incidents enable row level security;
revoke all on public.emergency_incidents from anon,authenticated;
grant all on public.emergency_incidents to service_role;
grant select,insert,update,delete on public.emergency_incidents to authenticated;
create policy admin_access on public.emergency_incidents for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy owner_select on public.emergency_incidents for select to authenticated using (user_id=(select auth.uid())) ;
create policy owner_insert on public.emergency_incidents for insert to authenticated  with check (user_id=(select auth.uid()));
create index emergency_incidents_user_id_idx on public.emergency_incidents(user_id);
create index emergency_incidents_trip_id_idx on public.emergency_incidents(trip_id);
create index emergency_incidents_boat_id_idx on public.emergency_incidents(boat_id);

alter table public.notices enable row level security;
revoke all on public.notices from anon,authenticated;
grant all on public.notices to service_role;
grant select,insert,update,delete on public.notices to authenticated;
create policy admin_access on public.notices for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy reader on public.notices for select to authenticated using (status = 'published');
create index notices_created_by_idx on public.notices(created_by);

alter table public.notice_audiences enable row level security;
revoke all on public.notice_audiences from anon,authenticated;
grant all on public.notice_audiences to service_role;
grant select,insert,update,delete on public.notice_audiences to authenticated;
create policy admin_access on public.notice_audiences for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create index notice_audiences_notice_id_idx on public.notice_audiences(notice_id);

alter table public.external_content_queue enable row level security;
revoke all on public.external_content_queue from anon,authenticated;
grant all on public.external_content_queue to service_role;
grant select,insert,update,delete on public.external_content_queue to authenticated;
create policy admin_access on public.external_content_queue for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));

alter table public.push_subscriptions enable row level security;
revoke all on public.push_subscriptions from anon,authenticated;
grant all on public.push_subscriptions to service_role;
grant select,insert,update,delete on public.push_subscriptions to authenticated;
create policy admin_access on public.push_subscriptions for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy owner_select on public.push_subscriptions for select to authenticated using (user_id=(select auth.uid())) ;
create policy owner_insert on public.push_subscriptions for insert to authenticated  with check (user_id=(select auth.uid()));
create policy owner_update on public.push_subscriptions for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create index push_subscriptions_user_id_idx on public.push_subscriptions(user_id);

alter table public.notification_preferences enable row level security;
revoke all on public.notification_preferences from anon,authenticated;
grant all on public.notification_preferences to service_role;
grant select,insert,update,delete on public.notification_preferences to authenticated;
create policy admin_access on public.notification_preferences for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy owner_select on public.notification_preferences for select to authenticated using (user_id=(select auth.uid())) ;
create policy owner_insert on public.notification_preferences for insert to authenticated  with check (user_id=(select auth.uid()));
create policy owner_update on public.notification_preferences for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));

alter table public.notifications enable row level security;
revoke all on public.notifications from anon,authenticated;
grant all on public.notifications to service_role;
grant select,insert,update,delete on public.notifications to authenticated;
create policy admin_access on public.notifications for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy reader on public.notifications for select to authenticated using (target_type = 'all' or (target_type = 'user' and target_value = (select auth.uid())::text));
create index notifications_created_by_idx on public.notifications(created_by);

alter table public.notification_deliveries enable row level security;
revoke all on public.notification_deliveries from anon,authenticated;
grant all on public.notification_deliveries to service_role;
grant select,insert,update,delete on public.notification_deliveries to authenticated;
create policy admin_access on public.notification_deliveries for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy reader on public.notification_deliveries for select to authenticated using (user_id = (select auth.uid()));
create index notification_deliveries_notification_id_idx on public.notification_deliveries(notification_id);
create index notification_deliveries_user_id_idx on public.notification_deliveries(user_id);
create index notification_deliveries_subscription_id_idx on public.notification_deliveries(subscription_id);

alter table public.document_categories enable row level security;
revoke all on public.document_categories from anon,authenticated;
grant all on public.document_categories to service_role;
grant select,insert,update,delete on public.document_categories to authenticated;
create policy admin_access on public.document_categories for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy reader on public.document_categories for select to authenticated using (active = true);

alter table public.user_documents enable row level security;
revoke all on public.user_documents from anon,authenticated;
grant all on public.user_documents to service_role;
grant select,insert,update,delete on public.user_documents to authenticated;
create policy admin_access on public.user_documents for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy owner_select on public.user_documents for select to authenticated using (user_id=(select auth.uid())) ;
create policy owner_insert on public.user_documents for insert to authenticated  with check (user_id=(select auth.uid()));
create policy owner_update on public.user_documents for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create index user_documents_user_id_idx on public.user_documents(user_id);
create index user_documents_boat_id_idx on public.user_documents(boat_id);
create index user_documents_category_id_idx on public.user_documents(category_id);

alter table public.calendar_events enable row level security;
revoke all on public.calendar_events from anon,authenticated;
grant all on public.calendar_events to service_role;
grant select,insert,update,delete on public.calendar_events to authenticated;
create policy admin_access on public.calendar_events for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy reader on public.calendar_events for select to authenticated using (is_public = true);
create index calendar_events_notice_id_idx on public.calendar_events(notice_id);
create index calendar_events_created_by_idx on public.calendar_events(created_by);

alter table public.fish_species enable row level security;
revoke all on public.fish_species from anon,authenticated;
grant all on public.fish_species to service_role;
grant select,insert,update,delete on public.fish_species to authenticated;
create policy admin_access on public.fish_species for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy reader on public.fish_species for select to authenticated using (active = true);

alter table public.fishing_regulations enable row level security;
revoke all on public.fishing_regulations from anon,authenticated;
grant all on public.fishing_regulations to service_role;
grant select,insert,update,delete on public.fishing_regulations to authenticated;
create policy admin_access on public.fishing_regulations for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy reader on public.fishing_regulations for select to authenticated using (status = 'active');
create index fishing_regulations_species_id_idx on public.fishing_regulations(species_id);

alter table public.trip_timeline_events enable row level security;
revoke all on public.trip_timeline_events from anon,authenticated;
grant all on public.trip_timeline_events to service_role;
grant select,insert,update,delete on public.trip_timeline_events to authenticated;
create policy admin_access on public.trip_timeline_events for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create index trip_timeline_events_trip_id_idx on public.trip_timeline_events(trip_id);
create index trip_timeline_events_actor_id_idx on public.trip_timeline_events(actor_id);

alter table public.user_consents enable row level security;
revoke all on public.user_consents from anon,authenticated;
grant all on public.user_consents to service_role;
grant select,insert,update,delete on public.user_consents to authenticated;
create policy admin_access on public.user_consents for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy owner_select on public.user_consents for select to authenticated using (user_id=(select auth.uid())) ;
create policy owner_insert on public.user_consents for insert to authenticated  with check (user_id=(select auth.uid()));
create policy owner_update on public.user_consents for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create index user_consents_user_id_idx on public.user_consents(user_id);

alter table public.offline_sync_queue enable row level security;
revoke all on public.offline_sync_queue from anon,authenticated;
grant all on public.offline_sync_queue to service_role;
grant select,insert,update,delete on public.offline_sync_queue to authenticated;
create policy admin_access on public.offline_sync_queue for all to authenticated using ((select private.is_admin())) with check ((select private.is_admin()));
create policy owner_select on public.offline_sync_queue for select to authenticated using (user_id=(select auth.uid())) ;
create policy owner_insert on public.offline_sync_queue for insert to authenticated  with check (user_id=(select auth.uid()));
create policy owner_update on public.offline_sync_queue for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()));
create index offline_sync_queue_user_id_idx on public.offline_sync_queue(user_id);

alter table public.admin_audit_logs enable row level security;
revoke all on public.admin_audit_logs from anon,authenticated;
grant all on public.admin_audit_logs to service_role;
grant select,insert,update,delete on public.admin_audit_logs to authenticated;
create policy audit_read on public.admin_audit_logs for select to authenticated using ((select private.is_admin()));
create policy audit_insert on public.admin_audit_logs for insert to authenticated with check ((select private.is_admin()) and actor_id=(select auth.uid()));
create index admin_audit_logs_actor_id_idx on public.admin_audit_logs(actor_id);

alter table public.profiles alter column status set default 'pending';
drop policy owner_insert on public.profiles;
create policy owner_insert on public.profiles for insert to authenticated with check (id=(select auth.uid()) and status='pending' and municipal_registration is null);
drop policy owner_insert on public.fishing_trips;
drop policy owner_update on public.fishing_trips;
create policy owner_insert on public.fishing_trips for insert to authenticated with check (user_id=(select auth.uid()) and exists(select 1 from public.boats b where b.id=boat_id and b.owner_id=(select auth.uid())));
create policy owner_update on public.fishing_trips for update to authenticated using (user_id=(select auth.uid())) with check (user_id=(select auth.uid()) and exists(select 1 from public.boats b where b.id=boat_id and b.owner_id=(select auth.uid())));
create policy location_read on public.trip_locations for select to authenticated using(user_id=(select auth.uid()));
create policy location_insert on public.trip_locations for insert to authenticated with check(user_id=(select auth.uid()) and exists(select 1 from public.fishing_trips t where t.id=trip_id and t.user_id=(select auth.uid())));
create policy timeline_read on public.trip_timeline_events for select to authenticated using(exists(select 1 from public.fishing_trips t where t.id=trip_id and t.user_id=(select auth.uid())));
create index trips_user_status_idx on public.fishing_trips(user_id,status);
create index trip_locations_trip_recorded_idx on public.trip_locations(trip_id,recorded_at desc);
create index emergency_user_created_idx on public.emergency_incidents(user_id,created_at desc);
create function private.protect_profile_fields() returns trigger language plpgsql set search_path='' as $$
begin
 if auth.uid() is not null and not private.is_admin() and (new.status is distinct from old.status or new.municipal_registration is distinct from old.municipal_registration) then raise exception 'Campos reservados à administração'; end if;
 new.updated_at=now(); return new;
end; $$;
create trigger protect_profile before update on public.profiles for each row execute function private.protect_profile_fields();
create function private.handle_new_user() returns trigger language plpgsql security definer set search_path='' as $$
begin
 insert into public.profiles(id,full_name,status) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),'pending');
 insert into public.user_roles(user_id,role) values(new.id,'fisher');
 return new;
end; $$;
revoke all on function private.handle_new_user(),private.protect_profile_fields() from public,anon,authenticated;
create trigger on_auth_user_created after insert on auth.users for each row execute function private.handle_new_user();

-- Private document storage, already applied to the new Supabase project.
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types)
values ('fisher-documents','fisher-documents',false,10485760,array['application/pdf','image/jpeg','image/png'])
on conflict(id) do nothing;
create policy fisher_documents_read on storage.objects for select to authenticated
using(bucket_id='fisher-documents' and ((storage.foldername(name))[1]=(select auth.uid())::text or (select private.is_admin())));
create policy fisher_documents_insert on storage.objects for insert to authenticated
with check(bucket_id='fisher-documents' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy fisher_documents_update on storage.objects for update to authenticated
using(bucket_id='fisher-documents' and (storage.foldername(name))[1]=(select auth.uid())::text)
with check(bucket_id='fisher-documents' and (storage.foldername(name))[1]=(select auth.uid())::text);
create policy fisher_documents_delete on storage.objects for delete to authenticated
using(bucket_id='fisher-documents' and (storage.foldername(name))[1]=(select auth.uid())::text);

insert into public.document_categories(name,slug,display_order) values
('Documento de identidade','identidade',1),('CPF','cpf',2),('Comprovante de residência','residencia',3),
('Registro de pescador','registro-pescador',4),('Documento da embarcação','embarcacao',5),('Outros documentos','outros',6)
on conflict(slug) do nothing;

