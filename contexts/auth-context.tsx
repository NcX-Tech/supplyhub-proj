"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { supabase, type UserProfile } from "@/lib/supabase"
import { useRouter } from "next/navigation"

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  isAdmin: boolean
  loading: boolean
  signIn: (emailOrUsername: string, password: string) => Promise<{ error?: any }>
  signUp: (email: string, password: string, userData: any) => Promise<{ error?: any }>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Verificar se é admin
  const isAdmin = userProfile?.tipo_usuario === "admin" || userProfile?.username === "admin" || true // Temporariamente, todos são admin

  useEffect(() => {
    // Obter sessão inicial
    const getInitialSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        setUser(session.user)
        await fetchUserProfile(session.user.email!)
      }
      setLoading(false)
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user)
        await fetchUserProfile(session.user.email!)
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchUserProfile = async (email: string) => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("*")
        .or(`email_usuario.eq.${email},email.eq.${email}`)
        .single()

      if (!error && data) {
        setUserProfile(data)
      }
    } catch (error) {
      console.error("Erro ao buscar perfil do usuário:", error)
    }
  }

  const signIn = async (emailOrUsername: string, password: string) => {
    try {
      // MODO DE DESENVOLVIMENTO: Aceitar qualquer usuário
      // Primeiro, tenta encontrar o usuário no banco de dados
      const { data: userData, error: userError } = await supabase
        .from("users")
        .select("*")
        .or(`email_usuario.eq.${emailOrUsername},username.eq.${emailOrUsername}`)
        .single()

      if (!userError && userData) {
        // Se encontrou o usuário, aceita qualquer senha
        setUserProfile({
          ...userData,
          tipo_usuario: "admin", // Temporariamente, todos são admin
        })

        const fakeUser = {
          id: userData.id_usuario.toString(),
          email: userData.email_usuario,
          user_metadata: {
            full_name: userData.nome_usuario,
            user_type: "admin", // Temporariamente, todos são admin
          },
        } as User

        setUser(fakeUser)
        return { error: null }
      } else {
        // Se não encontrou o usuário, cria um perfil temporário
        const tempProfile = {
          id_usuario: 999,
          nome_usuario: emailOrUsername,
          email_usuario: `${emailOrUsername}@temp.com`,
          senha_usuario: password,
          tipo_usuario: "admin",
          username: emailOrUsername,
        }

        setUserProfile(tempProfile)

        const fakeUser = {
          id: "999",
          email: `${emailOrUsername}@temp.com`,
          user_metadata: {
            full_name: emailOrUsername,
            user_type: "admin",
          },
        } as User

        setUser(fakeUser)
        return { error: null }
      }
    } catch (error: any) {
      console.error("Erro no login:", error)

      // MODO DE DESENVOLVIMENTO: Mesmo com erro, cria um perfil temporário
      const tempProfile = {
        id_usuario: 999,
        nome_usuario: emailOrUsername,
        email_usuario: `${emailOrUsername}@temp.com`,
        senha_usuario: password,
        tipo_usuario: "admin",
        username: emailOrUsername,
      }

      setUserProfile(tempProfile)

      const fakeUser = {
        id: "999",
        email: `${emailOrUsername}@temp.com`,
        user_metadata: {
          full_name: emailOrUsername,
          user_type: "admin",
        },
      } as User

      setUser(fakeUser)
      return { error: null }
    }
  }

  const signUp = async (email: string, password: string, userData: any) => {
    try {
      // Em modo de desenvolvimento, simula um registro bem-sucedido
      const tempProfile = {
        id_usuario: 1000,
        nome_usuario: userData.nome,
        email_usuario: email,
        senha_usuario: password,
        telefone_usuario: userData.telefone,
        tipo_usuario: "admin", // Temporariamente, todos são admin
        username: userData.username || email.split("@")[0],
      }

      setUserProfile(tempProfile)

      const fakeUser = {
        id: "1000",
        email: email,
        user_metadata: {
          full_name: userData.nome,
          user_type: "admin",
        },
      } as User

      setUser(fakeUser)
      return { error: null }
    } catch (error: any) {
      return { error: { message: error.message } }
    }
  }

  const signOut = async () => {
    setUser(null)
    setUserProfile(null)
    router.push("/login")
  }

  const value = {
    user,
    userProfile,
    isAdmin,
    loading,
    signIn,
    signUp,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}
