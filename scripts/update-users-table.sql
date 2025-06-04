-- Adicionar campo username à tabela users se não existir
ALTER TABLE users ADD COLUMN IF NOT EXISTS username VARCHAR(50) UNIQUE;

-- Criar índice para username para melhor performance
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);

-- Atualizar o usuário admin para ter username
UPDATE users 
SET username = 'admin' 
WHERE email = 'admin@admin.com' AND username IS NULL;
