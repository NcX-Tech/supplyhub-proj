-- Criar ou atualizar usuário administrador
INSERT INTO auth.users (
  id,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at,
  raw_app_meta_data,
  raw_user_meta_data,
  is_super_admin,
  role
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@admin.com',
  crypt('admin123', gen_salt('bf')),
  now(),
  now(),
  now(),
  '{"provider": "email", "providers": ["email"]}',
  '{"full_name": "Administrador", "user_type": "admin"}',
  false,
  'authenticated'
)
ON CONFLICT (email) DO UPDATE SET
  encrypted_password = crypt('admin123', gen_salt('bf')),
  updated_at = now();

-- Criar perfil do usuário admin
INSERT INTO public.users (
  id,
  email,
  full_name,
  user_type,
  phone,
  company_name,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000001',
  'admin@admin.com',
  'Administrador',
  'admin',
  '+55 11 99999-9999',
  'Supply Hub Admin',
  now(),
  now()
)
ON CONFLICT (id) DO UPDATE SET
  user_type = 'admin',
  updated_at = now();
