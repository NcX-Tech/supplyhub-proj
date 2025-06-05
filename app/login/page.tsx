"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Package, Eye, EyeOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context"

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("") 
  const { toast } = useToast()
  const router = useRouter()
  const { user, signIn } = useAuth() 

  // Redirecionar se já estiver autenticado
  useEffect(() => {
    if (user) {
      router.push("/")
    }
  }, [user, router])

  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
    remember: false,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleCheckboxChange = (checked: boolean) => {
    setFormData((prev) => ({ ...prev, remember: checked }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { error } = await signIn(formData.emailOrUsername, formData.password)

      if (error) throw error

      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso.",
      })

      // Forçar redirecionamento após login bem-sucedido
      router.push("/")
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer login",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

const handleLogin = async (e: React.FormEvent) => {
      e.preventDefault()

  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: formData.emailOrUsername,  
      password: formData.password
    });
    if (error) throw error;
    router.push('/protected');
  } catch (error: unknown) {
    setError(error instanceof Error ? error.message : 'An error occurred');
  } finally {
    setLoading(false);
  }
}
45  

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${window.location.origin}/`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao fazer login com Google",
        variant: "destructive",
      })
    }
  }

  const handleForgotPassword = async () => {
    if (!formData.emailOrUsername) {
      toast({
        title: "Erro",
        description: "Digite seu email primeiro",
        variant: "destructive",
      })
      return
    }

    // Verificar se é um email válido
    const isEmail = formData.emailOrUsername.includes("@")
    if (!isEmail) {
      toast({
        title: "Erro",
        description: "Para recuperar a senha, digite um email válido",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(formData.emailOrUsername, {
        redirectTo: `${window.location.origin}/reset-password`,
      })

      if (error) throw error

      toast({
        title: "Email enviado!",
        description: "Verifique sua caixa de entrada para redefinir sua senha.",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao enviar email de recuperação",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm py-4">
        <div className="container mx-auto px-4 flex items-center">
          <Link href="/" className="flex items-center">
            <Package className="w-8 h-8 text-primary mr-2" />
            <span className="text-xl font-bold">
              Supply<span className="text-primary">Hub</span>
            </span>
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4">
              <Package className="w-12 h-12 text-primary" />
            </div>
            <CardTitle className="text-2xl">Bem-vindo de volta</CardTitle>
            <CardDescription>Acesse sua conta para continuar</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="emailOrUsername">Email</Label>
                <Input
                  id="emailOrUsername"
                  name="emailOrUsername"
                  type="text"
                  placeholder="seu.email@exemplo.com"
                  value={formData.emailOrUsername}
                  onChange={handleChange}
                  required
                />
                <p className="text-xs text-gray-500">Digite seu email para fazer login</p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Senha</Label>
                  <button type="button" onClick={handleForgotPassword} className="text-xs text-primary hover:underline">
                    Esqueceu sua senha?
                  </button>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-3"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5 text-gray-400" />
                    ) : (
                      <Eye className="w-5 h-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="remember" checked={formData.remember} onCheckedChange={handleCheckboxChange} />
                <Label htmlFor="remember" className="text-sm cursor-pointer">
                  Lembrar-me
                </Label>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-orange-600" disabled={loading}>
                {loading ? "Entrando..." : "Entrar"}
              </Button>
              <span>
                    {error}
              </span>
            </form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="relative w-full">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">ou continue com</span>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-4 w-full">
              <Button variant="outline" className="w-full" onClick={handleGoogleLogin}>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continuar com Google
              </Button>
            </div>
            <div className="text-center text-sm">
              Não tem uma conta?{" "}
              <Link href="/registro" className="text-primary hover:underline font-medium">
                Registre-se
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>

      <footer className="bg-white py-4 text-center text-gray-500 text-sm">
        <div className="container mx-auto px-4">
          <p>© {new Date().getFullYear()} Supply Hub. Todos os direitos reservados.</p>
        </div>
      </footer>
    </div>
  )
}
