import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client
export const createServerClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

// Tipos para a estrutura correta da tabela users
export interface UserProfile {
  id_usuario: number
  nome_usuario: string
  email_usuario: string
  senha_usuario: string
  telefone_usuario?: string
  cpf_usuario?: string
  tipo_usuario?: string
  username?: string
  email?: string
}
