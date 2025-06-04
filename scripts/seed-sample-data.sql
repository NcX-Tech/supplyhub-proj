-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
('Matéria-prima', 'Materiais básicos para produção'),
('Equipamentos', 'Máquinas e equipamentos industriais'),
('Serviços', 'Serviços especializados'),
('Produtos acabados', 'Produtos finalizados para venda');

-- Insert sample products (you'll need to replace supplier_id with actual user IDs)
INSERT INTO public.products (
    supplier_id, 
    name, 
    description, 
    price, 
    discount_price,
    unit, 
    min_order, 
    stock, 
    category, 
    subcategory,
    location,
    specifications,
    sustainability_info
) VALUES
(
    '00000000-0000-0000-0000-000000000000', -- Replace with actual supplier ID
    'Tecido Orgânico Premium',
    'Tecido 100% algodão orgânico para confecção sustentável. Produzido com algodão cultivado sem pesticidas ou fertilizantes sintéticos.',
    45.00,
    39.90,
    '/metro',
    10,
    500,
    'Matéria-prima',
    'Tecidos',
    'São Paulo, SP',
    '{"Material": "100% Algodão Orgânico", "Peso": "180 g/m²", "Largura": "1,60 m", "Acabamento": "Pré-lavado e Pré-encolhido", "Certificações": "GOTS, OEKO-TEX Standard 100"}',
    '{"Pegada de Carbono": "Reduzida em 40% comparado ao algodão convencional", "Consumo de Água": "60% menor que o processo tradicional", "Reciclabilidade": "100% biodegradável"}'
),
(
    '00000000-0000-0000-0000-000000000000', -- Replace with actual supplier ID
    'Máquina de Corte Industrial',
    'Máquina de corte industrial para tecidos com precisão e eficiência energética.',
    2800.00,
    NULL,
    '/unidade',
    1,
    5,
    'Equipamentos',
    'Máquinas de Corte',
    'Belo Horizonte, MG',
    '{"Potência": "2.5 kW", "Velocidade": "1200 rpm", "Capacidade": "Até 50mm de espessura", "Dimensões": "120x80x100 cm", "Peso": "150 kg"}',
    '{"Eficiência Energética": "Classe A+", "Ruído": "Baixo nível de ruído", "Materiais": "Componentes recicláveis"}'
);

-- Note: You'll need to update the supplier_id values with actual user IDs after users are created
