-- Location: supabase/migrations/20250117151706_real_estate_marketplace.sql
-- Schema Analysis: Fresh project - no existing schema
-- Integration Type: Complete new real estate marketplace schema
-- Dependencies: None (fresh implementation)

-- 1. Create Types and Enums
CREATE TYPE public.user_role AS ENUM ('admin', 'agent', 'buyer', 'seller');
CREATE TYPE public.property_type AS ENUM ('can_ho', 'biet_thu', 'nha_pho', 'chung_cu', 'penthouse', 'studio', 'dat_nen', 'kho_xuong', 'van_phong');
CREATE TYPE public.property_status AS ENUM ('dang_ban', 'da_ban', 'cho_thue', 'da_cho_thue', 'tam_ngung');
CREATE TYPE public.listing_status AS ENUM ('draft', 'active', 'pending', 'sold', 'expired');

-- 2. Core Tables (no foreign keys)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    phone TEXT,
    role public.user_role DEFAULT 'buyer'::public.user_role,
    avatar_url TEXT,
    bio TEXT,
    is_verified BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Location and Category Tables
CREATE TABLE public.provinces (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE,
    code TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE public.districts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    province_id UUID REFERENCES public.provinces(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code, province_id)
);

CREATE TABLE public.wards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    code TEXT NOT NULL,
    district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(code, district_id)
);

-- 4. Properties Table (main business table)
CREATE TABLE public.properties (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    property_type public.property_type NOT NULL,
    status public.property_status DEFAULT 'dang_ban'::public.property_status,
    listing_status public.listing_status DEFAULT 'draft'::public.listing_status,
    price BIGINT NOT NULL CHECK (price > 0),
    area DECIMAL(10,2) NOT NULL CHECK (area > 0),
    bedrooms INTEGER DEFAULT 0 CHECK (bedrooms >= 0),
    bathrooms INTEGER DEFAULT 0 CHECK (bathrooms >= 0),
    floors INTEGER DEFAULT 1 CHECK (floors >= 1),
    address TEXT NOT NULL,
    ward_id UUID REFERENCES public.wards(id) ON DELETE SET NULL,
    district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
    province_id UUID REFERENCES public.provinces(id) ON DELETE SET NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    agent_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    owner_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    featured BOOLEAN DEFAULT false,
    days_on_market INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 5. Property Images Table
CREATE TABLE public.property_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    is_primary BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 6. User Favorites/Saved Properties
CREATE TABLE public.user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE CASCADE,
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, property_id)
);

-- 7. Property Views/Analytics
CREATE TABLE public.property_views (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    property_id UUID REFERENCES public.properties(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.user_profiles(id) ON DELETE SET NULL,
    ip_address INET,
    user_agent TEXT,
    viewed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 8. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_properties_type ON public.properties(property_type);
CREATE INDEX idx_properties_status ON public.properties(status);
CREATE INDEX idx_properties_listing_status ON public.properties(listing_status);
CREATE INDEX idx_properties_price ON public.properties(price);
CREATE INDEX idx_properties_area ON public.properties(area);
CREATE INDEX idx_properties_bedrooms ON public.properties(bedrooms);
CREATE INDEX idx_properties_agent_id ON public.properties(agent_id);
CREATE INDEX idx_properties_owner_id ON public.properties(owner_id);
CREATE INDEX idx_properties_featured ON public.properties(featured);
CREATE INDEX idx_properties_location ON public.properties(province_id, district_id, ward_id);
CREATE INDEX idx_properties_created_at ON public.properties(created_at);
CREATE INDEX idx_property_images_property_id ON public.property_images(property_id);
CREATE INDEX idx_property_images_is_primary ON public.property_images(is_primary);
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_property_id ON public.user_favorites(property_id);
CREATE INDEX idx_property_views_property_id ON public.property_views(property_id);

-- 9. Functions (MUST BE BEFORE RLS POLICIES)
CREATE OR REPLACE FUNCTION public.update_property_views_count()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    UPDATE public.properties 
    SET views_count = views_count + 1,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = NEW.property_id;
    RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
  INSERT INTO public.user_profiles (id, email, full_name, role)
  VALUES (
    NEW.id, 
    NEW.email, 
    COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'role', 'buyer')::public.user_role
  );
  RETURN NEW;
END;
$$;

-- 10. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.property_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.provinces ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wards ENABLE ROW LEVEL SECURITY;

-- 11. RLS Policies - Pattern 1: Core User Tables
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- Pattern 4: Public Read, Private Write for Properties
CREATE POLICY "public_can_read_properties"
ON public.properties
FOR SELECT
TO public
USING (listing_status = 'active');

CREATE POLICY "agents_manage_own_properties"
ON public.properties
FOR ALL
TO authenticated
USING (agent_id = auth.uid() OR owner_id = auth.uid())
WITH CHECK (agent_id = auth.uid() OR owner_id = auth.uid());

-- Pattern 2: Simple User Ownership
CREATE POLICY "users_manage_own_favorites"
ON public.user_favorites
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "users_manage_own_views"
ON public.property_views
FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- Pattern 4: Public Read for Property Images
CREATE POLICY "public_can_read_property_images"
ON public.property_images
FOR SELECT
TO public
USING (
    EXISTS (
        SELECT 1 FROM public.properties p 
        WHERE p.id = property_id 
        AND p.listing_status = 'active'
    )
);

CREATE POLICY "property_owners_manage_images"
ON public.property_images
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.properties p 
        WHERE p.id = property_id 
        AND (p.agent_id = auth.uid() OR p.owner_id = auth.uid())
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.properties p 
        WHERE p.id = property_id 
        AND (p.agent_id = auth.uid() OR p.owner_id = auth.uid())
    )
);

-- Pattern 4: Public Read for Location Tables
CREATE POLICY "public_can_read_provinces"
ON public.provinces
FOR SELECT
TO public
USING (true);

CREATE POLICY "public_can_read_districts"
ON public.districts
FOR SELECT
TO public
USING (true);

CREATE POLICY "public_can_read_wards"
ON public.wards
FOR SELECT
TO public
USING (true);

-- 12. Triggers
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE TRIGGER on_property_view_created
  AFTER INSERT ON public.property_views
  FOR EACH ROW EXECUTE FUNCTION public.update_property_views_count();

-- 13. Storage Buckets for Property Images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'property-images',
    'property-images',
    true,
    10485760, -- 10MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/jpg']
);

-- Storage RLS Policies for Property Images
CREATE POLICY "public_can_view_property_images"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'property-images');

CREATE POLICY "authenticated_users_upload_property_images"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'property-images');

CREATE POLICY "property_owners_manage_property_images"
ON storage.objects
FOR ALL
TO authenticated
USING (bucket_id = 'property-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'property-images' AND owner = auth.uid());

-- 14. Mock Data Generation
DO $$
DECLARE
    admin_uuid UUID := gen_random_uuid();
    agent1_uuid UUID := gen_random_uuid();
    agent2_uuid UUID := gen_random_uuid();
    buyer_uuid UUID := gen_random_uuid();
    hcm_province_id UUID := gen_random_uuid();
    hanoi_province_id UUID := gen_random_uuid();
    danang_province_id UUID := gen_random_uuid();
    quan1_district_id UUID := gen_random_uuid();
    caugiay_district_id UUID := gen_random_uuid();
    sontra_district_id UUID := gen_random_uuid();
    property1_id UUID := gen_random_uuid();
    property2_id UUID := gen_random_uuid();
    property3_id UUID := gen_random_uuid();
BEGIN
    -- Create auth users with required fields
    INSERT INTO auth.users (
        id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
        created_at, updated_at, raw_user_meta_data, raw_app_meta_data,
        is_sso_user, is_anonymous, confirmation_token, confirmation_sent_at,
        recovery_token, recovery_sent_at, email_change_token_new, email_change,
        email_change_sent_at, email_change_token_current, email_change_confirm_status,
        reauthentication_token, reauthentication_sent_at, phone, phone_change,
        phone_change_token, phone_change_sent_at
    ) VALUES
        (admin_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'admin@batdongsan.vn', crypt('admin123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Quản Trị Viên", "role": "admin"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (agent1_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'agent1@batdongsan.vn', crypt('agent123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Trần Thị Hương", "role": "agent"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (agent2_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'agent2@batdongsan.vn', crypt('agent123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Nguyễn Văn Minh", "role": "agent"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null),
        (buyer_uuid, '00000000-0000-0000-0000-000000000000', 'authenticated', 'authenticated',
         'buyer@batdongsan.vn', crypt('buyer123', gen_salt('bf', 10)), now(), now(), now(),
         '{"full_name": "Khách Hàng Demo", "role": "buyer"}'::jsonb, '{"provider": "email", "providers": ["email"]}'::jsonb,
         false, false, '', null, '', null, '', '', null, '', 0, '', null, null, '', '', null);

    -- Insert Location Data
    INSERT INTO public.provinces (id, name, code) VALUES
        (hcm_province_id, 'Thành phố Hồ Chí Minh', 'SG'),
        (hanoi_province_id, 'Hà Nội', 'HN'),
        (danang_province_id, 'Đà Nẵng', 'DN');

    INSERT INTO public.districts (id, name, code, province_id) VALUES
        (quan1_district_id, 'Quận 1', 'Q1', hcm_province_id),
        (caugiay_district_id, 'Cầu Giấy', 'CG', hanoi_province_id),
        (sontra_district_id, 'Sơn Trà', 'ST', danang_province_id);

    -- Insert Sample Properties
    INSERT INTO public.properties (
        id, title, description, property_type, status, listing_status, price, area, 
        bedrooms, bathrooms, address, province_id, district_id, agent_id, owner_id, 
        featured, days_on_market
    ) VALUES
        (property1_id, 'Căn Hộ Cao Cấp Vinhomes', 
         'Căn hộ 2 phòng ngủ tại trung tâm Quận 1, full nội thất cao cấp, view thành phố tuyệt đẹp', 
         'can_ho', 'dang_ban', 'active', 4500000000, 75.5, 2, 2, 
         'Số 123 Đường Lê Lợi, Phường Bến Nghé', hcm_province_id, quan1_district_id, 
         agent1_uuid, agent1_uuid, true, 5),
        (property2_id, 'Biệt Thự Gia Đình', 
         'Biệt thự 4 phòng ngủ khu vực Cầu Giấy, có sân vườn rộng, gần trường học và bệnh viện', 
         'biet_thu', 'dang_ban', 'active', 8500000000, 150.0, 4, 3, 
         'Số 456 Đường Nguyễn Khánh Toàn, Phường Quan Hoa', hanoi_province_id, caugiay_district_id, 
         agent2_uuid, agent2_uuid, true, 12),
        (property3_id, 'Penthouse View Biển', 
         'Penthouse 3 phòng ngủ view biển Đà Nẵng, nội thất hiện đại, tiện ích 5 sao', 
         'penthouse', 'dang_ban', 'active', 12000000000, 120.0, 3, 2, 
         'Số 789 Đường Võ Văn Kiệt, Phường An Hải Bắc', danang_province_id, sontra_district_id, 
         agent1_uuid, agent1_uuid, true, 3);

    -- Insert Sample Property Images
    INSERT INTO public.property_images (property_id, image_url, alt_text, is_primary, display_order) VALUES
        (property1_id, 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', 'Căn hộ Vinhomes', true, 1),
        (property2_id, 'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', 'Biệt thự gia đình', true, 1),
        (property3_id, 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600', 'Penthouse view biển', true, 1);

EXCEPTION
    WHEN foreign_key_violation THEN
        RAISE NOTICE 'Foreign key error: %', SQLERRM;
    WHEN unique_violation THEN
        RAISE NOTICE 'Unique constraint error: %', SQLERRM;
    WHEN OTHERS THEN
        RAISE NOTICE 'Unexpected error: %', SQLERRM;
END $$;