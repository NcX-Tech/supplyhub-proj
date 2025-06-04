-- WARNING: This schema is for context only and is not meant to be run.
-- Table order and constraints may not be valid for execution.

CREATE TABLE public.avaliacao_imagens (
  id integer NOT NULL DEFAULT nextval('avaliacao_imagens_id_seq'::regclass),
  avaliacao_id integer NOT NULL,
  url character varying NOT NULL,
  alt_text character varying,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT avaliacao_imagens_pkey PRIMARY KEY (id),
  CONSTRAINT avaliacao_imagens_avaliacao_id_fkey FOREIGN KEY (avaliacao_id) REFERENCES public.avaliacoes(id)
);
CREATE TABLE public.avaliacoes (
  id integer NOT NULL DEFAULT nextval('avaliacoes_id_seq'::regclass),
  produto_id integer NOT NULL,
  usuario_id integer NOT NULL,
  pedido_item_id integer,
  nota integer NOT NULL CHECK (nota >= 1 AND nota <= 5),
  titulo character varying,
  comentario text,
  verificada boolean DEFAULT false,
  util_count integer DEFAULT 0,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT avaliacoes_pkey PRIMARY KEY (id),
  CONSTRAINT avaliacoes_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id_produto),
  CONSTRAINT avaliacoes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id_usuario),
  CONSTRAINT avaliacoes_pedido_item_id_fkey FOREIGN KEY (pedido_item_id) REFERENCES public.pedido_itens(id)
);
CREATE TABLE public.carrinho (
  id integer NOT NULL DEFAULT nextval('carrinho_id_seq'::regclass),
  usuario_id integer NOT NULL,
  produto_id integer NOT NULL,
  variacao_id integer,
  quantidade integer NOT NULL DEFAULT 1,
  preco_unitario numeric NOT NULL,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT carrinho_pkey PRIMARY KEY (id),
  CONSTRAINT carrinho_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id_usuario),
  CONSTRAINT carrinho_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id_produto),
  CONSTRAINT carrinho_variacao_id_fkey FOREIGN KEY (variacao_id) REFERENCES public.produto_variacoes(id)
);
CREATE TABLE public.categories (
  id integer NOT NULL DEFAULT nextval('categorias_id_seq'::regclass),
  nome character varying NOT NULL,
  slug character varying NOT NULL UNIQUE,
  descricao text,
  categoria_pai_id integer,
  icone character varying,
  ativa boolean DEFAULT true,
  ordem integer DEFAULT 0,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categorias_categoria_pai_id_fkey FOREIGN KEY (categoria_pai_id) REFERENCES public.categories(id)
);
CREATE TABLE public.certificacoes (
  id integer NOT NULL DEFAULT nextval('certificacoes_id_seq'::regclass),
  nome character varying NOT NULL,
  descricao text,
  orgao_emissor character varying,
  icone character varying,
  ativa boolean DEFAULT true,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT certificacoes_pkey PRIMARY KEY (id)
);
CREATE TABLE public.consumidor (
  id_consumidor integer NOT NULL DEFAULT nextval('consumidor_id_consumidor_seq'::regclass),
  cpf_consumidor character varying NOT NULL UNIQUE,
  endereco_consumidor character varying,
  data_cadastro_consumidor date,
  CONSTRAINT consumidor_pkey PRIMARY KEY (id_consumidor)
);
CREATE TABLE public.empresa (
  id_empresa integer NOT NULL DEFAULT nextval('empresa_id_empresa_seq'::regclass),
  cnpj_empresa character varying NOT NULL UNIQUE,
  razao_social_empresa character varying,
  loja_empresa character varying,
  endereco_empresa character varying,
  CONSTRAINT empresa_pkey PRIMARY KEY (id_empresa)
);
CREATE TABLE public.empresas (
  id integer NOT NULL DEFAULT nextval('empresas_id_seq'::regclass),
  usuario_id integer NOT NULL,
  nome_empresa character varying NOT NULL,
  cnpj character varying UNIQUE,
  descricao text,
  website character varying,
  logo_url character varying,
  verificada boolean DEFAULT false,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT empresas_pkey PRIMARY KEY (id),
  CONSTRAINT empresas_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id_usuario)
);
CREATE TABLE public.enderecos (
  id integer NOT NULL DEFAULT nextval('enderecos_id_seq'::regclass),
  usuario_id integer NOT NULL,
  tipo character varying DEFAULT 'principal'::character varying CHECK (tipo::text = ANY (ARRAY['principal'::character varying, 'entrega'::character varying, 'cobranca'::character varying]::text[])),
  endereco character varying NOT NULL,
  cidade character varying NOT NULL,
  estado character varying NOT NULL,
  cep character varying NOT NULL,
  pais character varying DEFAULT 'Brasil'::character varying,
  ativo boolean DEFAULT true,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT enderecos_pkey PRIMARY KEY (id),
  CONSTRAINT enderecos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id_usuario)
);
CREATE TABLE public.favoritos (
  id integer NOT NULL DEFAULT nextval('favoritos_id_seq'::regclass),
  usuario_id integer NOT NULL,
  produto_id integer NOT NULL,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT favoritos_pkey PRIMARY KEY (id),
  CONSTRAINT favoritos_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id_usuario),
  CONSTRAINT favoritos_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id_produto)
);
CREATE TABLE public.pedido_itens (
  id integer NOT NULL DEFAULT nextval('pedido_itens_id_seq'::regclass),
  pedido_id integer NOT NULL,
  produto_id integer NOT NULL,
  variacao_id integer,
  fornecedor_id integer NOT NULL,
  quantidade integer NOT NULL,
  preco_unitario numeric NOT NULL,
  subtotal numeric NOT NULL,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pedido_itens_pkey PRIMARY KEY (id),
  CONSTRAINT pedido_itens_pedido_id_fkey FOREIGN KEY (pedido_id) REFERENCES public.pedidos(id),
  CONSTRAINT pedido_itens_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id_produto),
  CONSTRAINT pedido_itens_variacao_id_fkey FOREIGN KEY (variacao_id) REFERENCES public.produto_variacoes(id),
  CONSTRAINT pedido_itens_fornecedor_id_fkey FOREIGN KEY (fornecedor_id) REFERENCES public.users(id_usuario)
);
CREATE TABLE public.pedidos (
  id integer NOT NULL DEFAULT nextval('pedidos_id_seq'::regclass),
  numero_pedido character varying NOT NULL UNIQUE,
  comprador_id integer NOT NULL,
  status character varying DEFAULT 'pendente'::character varying CHECK (status::text = ANY (ARRAY['pendente'::character varying, 'confirmado'::character varying, 'processando'::character varying, 'enviado'::character varying, 'entregue'::character varying, 'cancelado'::character varying]::text[])),
  subtotal numeric NOT NULL,
  desconto numeric DEFAULT 0,
  frete numeric DEFAULT 0,
  total numeric NOT NULL,
  endereco_entrega json NOT NULL,
  metodo_pagamento character varying,
  observacoes text,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT pedidos_pkey PRIMARY KEY (id),
  CONSTRAINT pedidos_comprador_id_fkey FOREIGN KEY (comprador_id) REFERENCES public.users(id_usuario)
);
CREATE TABLE public.produto (
  id_produto integer NOT NULL DEFAULT nextval('produto_id_produto_seq'::regclass),
  id_produtor_produto integer NOT NULL,
  nome_produto character varying NOT NULL,
  descricao_produto text,
  preco_produto numeric NOT NULL DEFAULT 0,
  quantidade_estoque_produto integer NOT NULL DEFAULT 0,
  categoria_produto character varying,
  data_cadastro_produto date DEFAULT CURRENT_DATE,
  CONSTRAINT produto_pkey PRIMARY KEY (id_produto),
  CONSTRAINT produto_id_produtor_produto_fkey FOREIGN KEY (id_produtor_produto) REFERENCES public.produtor(id_produtor)
);
CREATE TABLE public.produto_certificacoes (
  id integer NOT NULL DEFAULT nextval('produto_certificacoes_id_seq'::regclass),
  produto_id integer NOT NULL,
  certificacao_id integer NOT NULL,
  numero_certificado character varying NOT NULL,
  data_emissao date NOT NULL,
  data_validade date,
  verificada boolean DEFAULT false,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT produto_certificacoes_pkey PRIMARY KEY (id),
  CONSTRAINT produto_certificacoes_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id_produto),
  CONSTRAINT produto_certificacoes_certificacao_id_fkey FOREIGN KEY (certificacao_id) REFERENCES public.certificacoes(id)
);
CREATE TABLE public.produto_detalhes (
  id integer NOT NULL DEFAULT nextval('produto_detalhes_id_seq'::regclass),
  produto_id integer NOT NULL UNIQUE,
  slug character varying NOT NULL UNIQUE,
  descricao_detalhada text NOT NULL,
  preco_promocional numeric,
  unidade character varying DEFAULT 'unidade'::character varying,
  estoque_minimo integer DEFAULT 0,
  peso numeric,
  dimensoes json,
  sku character varying UNIQUE,
  status character varying DEFAULT 'ativo'::character varying CHECK (status::text = ANY (ARRAY['ativo'::character varying, 'inativo'::character varying, 'rascunho'::character varying]::text[])),
  destaque boolean DEFAULT false,
  sustentavel boolean DEFAULT false,
  data_atualizacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  categoria_id integer,
  CONSTRAINT produto_detalhes_pkey PRIMARY KEY (id),
  CONSTRAINT produto_detalhes_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id_produto),
  CONSTRAINT produto_detalhes_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categories(id)
);
CREATE TABLE public.produto_imagens (
  id integer NOT NULL DEFAULT nextval('produto_imagens_id_seq'::regclass),
  produto_id integer NOT NULL,
  url character varying NOT NULL,
  alt_text character varying NOT NULL,
  ordem integer DEFAULT 0,
  principal boolean DEFAULT false,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT produto_imagens_pkey PRIMARY KEY (id),
  CONSTRAINT produto_imagens_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id_produto)
);
CREATE TABLE public.produto_variacoes (
  id integer NOT NULL DEFAULT nextval('produto_variacoes_id_seq'::regclass),
  produto_id integer NOT NULL,
  nome character varying NOT NULL,
  valor character varying NOT NULL,
  preco_adicional numeric DEFAULT 0,
  estoque integer DEFAULT 0,
  sku character varying,
  ativa boolean DEFAULT true,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT produto_variacoes_pkey PRIMARY KEY (id),
  CONSTRAINT produto_variacoes_produto_id_fkey FOREIGN KEY (produto_id) REFERENCES public.produto(id_produto)
);
CREATE TABLE public.produtor (
  id_produtor integer NOT NULL DEFAULT nextval('produtor_id_produtor_seq'::regclass),
  id_usuario_produtor integer NOT NULL,
  nome_empresa_produtor character varying,
  descricao_produtor text,
  endereco_produtor character varying,
  certificado_sustentabilidade_produtor boolean,
  CONSTRAINT produtor_pkey PRIMARY KEY (id_produtor),
  CONSTRAINT produtor_id_usuario_produtor_fkey FOREIGN KEY (id_usuario_produtor) REFERENCES public.users(id_usuario)
);
CREATE TABLE public.users (
  id_usuario integer NOT NULL DEFAULT nextval('usuario_id_usuario_seq'::regclass),
  nome_usuario character varying NOT NULL,
  email_usuario character varying NOT NULL UNIQUE,
  senha_usuario character varying NOT NULL,
  telefone_usuario character varying,
  cpf_usuario character varying UNIQUE,
  tipo_usuario character varying,
  username character varying UNIQUE,
  email text,
  CONSTRAINT users_pkey PRIMARY KEY (id_usuario)
);
CREATE TABLE public.usuario_detalhes (
  id integer NOT NULL DEFAULT nextval('usuario_detalhes_id_seq'::regclass),
  usuario_id integer NOT NULL UNIQUE,
  email_verificado boolean DEFAULT false,
  data_criacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  data_atualizacao timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
  status_id integer DEFAULT 1,
  tipo_id integer,
  CONSTRAINT usuario_detalhes_pkey PRIMARY KEY (id),
  CONSTRAINT usuario_detalhes_usuario_id_fkey FOREIGN KEY (usuario_id) REFERENCES public.users(id_usuario),
  CONSTRAINT usuario_detalhes_status_id_fkey FOREIGN KEY (status_id) REFERENCES public.usuario_status(id),
  CONSTRAINT usuario_detalhes_tipo_id_fkey FOREIGN KEY (tipo_id) REFERENCES public.usuario_tipos(id)
);
CREATE TABLE public.usuario_status (
  id integer NOT NULL DEFAULT nextval('usuario_status_id_seq'::regclass),
  status character varying NOT NULL UNIQUE,
  CONSTRAINT usuario_status_pkey PRIMARY KEY (id)
);
CREATE TABLE public.usuario_tipos (
  id integer NOT NULL DEFAULT nextval('usuario_tipos_id_seq'::regclass),
  tipo character varying NOT NULL UNIQUE,
  CONSTRAINT usuario_tipos_pkey PRIMARY KEY (id)
);