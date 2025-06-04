-- Insert categories
INSERT INTO categories (id, name, slug, description) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d479', 'Matéria-prima', 'materia-prima', 'Materiais brutos para produção'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d480', 'Tecidos', 'tecidos', 'Tecidos para confecção', 'f47ac10b-58cc-4372-a567-0e02b2c3d479'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d481', 'Equipamentos', 'equipamentos', 'Máquinas e equipamentos'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d482', 'Serviços', 'servicos', 'Serviços para indústria');

-- Insert product badges
INSERT INTO product_badges (id, name, color) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d483', 'Orgânico', 'bg-green-100 text-green-800'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d484', 'Sustentável', 'bg-blue-100 text-blue-800'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d485', 'Equipamento', 'bg-purple-100 text-purple-800'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d486', 'Reciclado', 'bg-amber-100 text-amber-800');

-- Insert certifications
INSERT INTO certifications (id, name, description) VALUES
  ('f47ac10b-58cc-4372-a567-0e02b2c3d487', 'Produção Orgânica', 'Certificação para produtos orgânicos'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d488', 'Comércio Justo', 'Certificação de comércio justo'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d489', 'Carbono Neutro', 'Certificação de neutralidade de carbono'),
  ('f47ac10b-58cc-4372-a567-0e02b2c3d490', 'ISO 14001', 'Certificação de gestão ambiental');
