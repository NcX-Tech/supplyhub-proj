"use client"

import type React from "react"

import { useState, useEffect } from "react"
import {
  Package,
  Bell,
  Mail,
  Menu,
  Home,
  ShoppingCart,
  TrendingUp,
  Handshake,
  DollarSign,
  Settings,
  LogOut,
  User,
  Building,
  MapPin,
  Edit,
  Save,
  X,
  Camera,
  Shield,
  Eye,
  EyeOff,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

interface UserProfile {
  id: string
  email: string
  full_name: string
  phone?: string
  user_type: string
  company_name?: string
  cnpj?: string
  address?: string
  city?: string
  state?: string
  zip_code?: string
  website?: string
  bio?: string
  avatar_url?: string
  newsletter_subscription: boolean
  created_at: string
  updated_at: string
}

export default function ProfilePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [showPasswordForm, setShowPasswordForm] = useState(false)
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  })
  const { toast } = useToast()
  const router = useRouter()
  const { user, signOut } = useAuth()

  const menuItems = [
    { icon: Home, label: "Início", href: "/", active: false },
    { icon: Package, label: "Produtos", href: "#", active: false },
    { icon: ShoppingCart, label: "Pedidos", href: "#", active: false },
    { icon: TrendingUp, label: "Análises", href: "#", active: false },
    { icon: Handshake, label: "Parcerias", href: "#", active: false },
    { icon: DollarSign, label: "Investimentos", href: "#", active: false },
    { icon: Settings, label: "Configurações", href: "/perfil", active: true },
  ]

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        router.push("/login")
        return
      }

      const { data: profileData, error } = await supabase.from("users").select("*").eq("id", user.id).single()

      if (error) throw error

      setProfile(profileData)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar perfil",
        variant: "destructive",
      })
      console.error("Error fetching profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleProfileChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setProfile((prev) => (prev ? { ...prev, [name]: value } : null))
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setProfile((prev) => (prev ? { ...prev, [name]: checked } : null))
  }

  const handleSaveProfile = async () => {
    if (!profile) return

    setSaving(true)
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: profile.full_name,
          phone: profile.phone,
          company_name: profile.company_name,
          cnpj: profile.cnpj,
          address: profile.address,
          city: profile.city,
          state: profile.state,
          zip_code: profile.zip_code,
          website: profile.website,
          bio: profile.bio,
          newsletter_subscription: profile.newsletter_subscription,
          updated_at: new Date().toISOString(),
        })
        .eq("id", profile.id)

      if (error) throw error

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso",
      })
      setIsEditing(false)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao salvar perfil",
        variant: "destructive",
      })
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Erro",
        description: "As senhas não coincidem",
        variant: "destructive",
      })
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast({
        title: "Erro",
        description: "A nova senha deve ter pelo menos 8 caracteres",
        variant: "destructive",
      })
      return
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword,
      })

      if (error) throw error

      toast({
        title: "Sucesso!",
        description: "Senha alterada com sucesso",
      })
      setShowPasswordForm(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: error.message || "Erro ao alterar senha",
        variant: "destructive",
      })
    }
  }

  const handleLogout = async () => {
    await signOut()
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-primary mx-auto mb-4" />
          <p>Carregando perfil...</p>
        </div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <User className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p>Perfil não encontrado</p>
          <Button onClick={() => router.push("/login")} className="mt-4">
            Fazer Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <aside
          className={`fixed left-0 top-0 h-screen bg-dark text-white z-30 transition-all duration-300 ${
            sidebarExpanded ? "w-64" : "w-20"
          }`}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-700">
            <div className="flex items-center">
              <Package className="w-8 h-8 text-primary" />
              {sidebarExpanded && (
                <span className="ml-2 text-xl font-bold">
                  Supply<span className="text-primary">Hub</span>
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="text-gray-300 hover:text-white"
            >
              <Menu className="w-5 h-5" />
            </Button>
          </div>

          {sidebarExpanded && (
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center">
                <Avatar className="w-10 h-10">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-white">
                    {profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="ml-3">
                  <p className="font-medium">{profile.full_name}</p>
                  <p className="text-xs text-gray-400 capitalize">{profile.user_type}</p>
                </div>
              </div>
            </div>
          )}

          <nav className="p-4">
            <ul className="space-y-2">
              {menuItems.map((item, index) => (
                <li key={index}>
                  <Link
                    href={item.href}
                    className={`flex items-center p-2 rounded-md transition-colors ${
                      item.active ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                    }`}
                  >
                    <item.icon className="w-5 h-5" />
                    {sidebarExpanded && <span className="ml-3">{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="mt-auto p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full"
            >
              <LogOut className="w-5 h-5" />
              {sidebarExpanded && <span className="ml-3">Sair</span>}
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarExpanded ? "ml-64" : "ml-20"}`}>
          {/* Header */}
          <header className="bg-white shadow-sm">
            <div className="flex justify-between items-center px-6 py-3">
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-dark">Gerenciar Perfil</h1>
              </div>
              <div className="flex items-center space-x-4">
                <Button variant="ghost" size="icon" className="relative">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
                </Button>
                <Button variant="ghost" size="icon" className="relative">
                  <Mail className="w-5 h-5" />
                  <span className="absolute top-0 right-0 h-2 w-2 bg-primary rounded-full"></span>
                </Button>
                <div className="border-l border-gray-300 h-6"></div>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                  <AvatarFallback className="bg-primary text-white">
                    {profile.full_name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </div>
            </div>
          </header>

          <div className="p-6">
            <Tabs defaultValue="profile" className="w-full">
              <TabsList className="grid grid-cols-3 mb-6">
                <TabsTrigger value="profile">
                  <User className="w-4 h-4 mr-2" />
                  Perfil
                </TabsTrigger>
                <TabsTrigger value="security">
                  <Shield className="w-4 h-4 mr-2" />
                  Segurança
                </TabsTrigger>
                <TabsTrigger value="notifications">
                  <Bell className="w-4 h-4 mr-2" />
                  Notificações
                </TabsTrigger>
              </TabsList>

              <TabsContent value="profile">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Profile Summary */}
                  <Card className="lg:col-span-1">
                    <CardHeader>
                      <CardTitle>Foto do Perfil</CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <Avatar className="w-32 h-32 mx-auto mb-4">
                        <AvatarImage src={profile.avatar_url || "/placeholder.svg"} />
                        <AvatarFallback className="bg-primary text-white text-2xl">
                          {profile.full_name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <Button variant="outline" className="mb-4">
                        <Camera className="w-4 h-4 mr-2" />
                        Alterar Foto
                      </Button>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">{profile.full_name}</h3>
                        <p className="text-gray-600 capitalize">{profile.user_type}</p>
                        {profile.company_name && <p className="text-sm text-gray-500 mt-1">{profile.company_name}</p>}
                        <Badge className="mt-2 bg-green-100 text-green-800">
                          Membro desde {new Date(profile.created_at).getFullYear()}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Profile Details */}
                  <Card className="lg:col-span-2">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>Informações Pessoais</CardTitle>
                        <CardDescription>Gerencie suas informações pessoais e de empresa</CardDescription>
                      </div>
                      <Button
                        variant={isEditing ? "outline" : "default"}
                        onClick={() => {
                          if (isEditing) {
                            setIsEditing(false)
                            fetchProfile() // Reset changes
                          } else {
                            setIsEditing(true)
                          }
                        }}
                      >
                        {isEditing ? (
                          <>
                            <X className="w-4 h-4 mr-2" />
                            Cancelar
                          </>
                        ) : (
                          <>
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </>
                        )}
                      </Button>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="full_name">Nome Completo</Label>
                          <Input
                            id="full_name"
                            name="full_name"
                            value={profile.full_name}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" name="email" value={profile.email} disabled className="mt-1 bg-gray-50" />
                          <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                        </div>
                        <div>
                          <Label htmlFor="phone">Telefone</Label>
                          <Input
                            id="phone"
                            name="phone"
                            value={profile.phone || ""}
                            onChange={handleProfileChange}
                            disabled={!isEditing}
                            placeholder="(00) 00000-0000"
                            className="mt-1"
                          />
                        </div>
                        <div>
                          <Label htmlFor="user_type">Tipo de Usuário</Label>
                          <Input
                            id="user_type"
                            name="user_type"
                            value={profile.user_type}
                            disabled
                            className="mt-1 bg-gray-50 capitalize"
                          />
                        </div>
                      </div>

                      {/* Company Information */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <Building className="w-5 h-5 mr-2" />
                          Informações da Empresa
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="company_name">Nome da Empresa</Label>
                            <Input
                              id="company_name"
                              name="company_name"
                              value={profile.company_name || ""}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="cnpj">CNPJ</Label>
                            <Input
                              id="cnpj"
                              name="cnpj"
                              value={profile.cnpj || ""}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              placeholder="00.000.000/0000-00"
                              className="mt-1"
                            />
                          </div>
                          <div className="md:col-span-2">
                            <Label htmlFor="website">Website</Label>
                            <Input
                              id="website"
                              name="website"
                              value={profile.website || ""}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              placeholder="https://www.exemplo.com"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Address Information */}
                      <div className="border-t pt-6">
                        <h3 className="text-lg font-semibold mb-4 flex items-center">
                          <MapPin className="w-5 h-5 mr-2" />
                          Endereço
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="md:col-span-2">
                            <Label htmlFor="address">Endereço</Label>
                            <Input
                              id="address"
                              name="address"
                              value={profile.address || ""}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              placeholder="Rua, número, bairro"
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="city">Cidade</Label>
                            <Input
                              id="city"
                              name="city"
                              value={profile.city || ""}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="state">Estado</Label>
                            <Input
                              id="state"
                              name="state"
                              value={profile.state || ""}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              className="mt-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="zip_code">CEP</Label>
                            <Input
                              id="zip_code"
                              name="zip_code"
                              value={profile.zip_code || ""}
                              onChange={handleProfileChange}
                              disabled={!isEditing}
                              placeholder="00000-000"
                              className="mt-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Bio */}
                      <div className="border-t pt-6">
                        <Label htmlFor="bio">Biografia</Label>
                        <Textarea
                          id="bio"
                          name="bio"
                          value={profile.bio || ""}
                          onChange={handleProfileChange}
                          disabled={!isEditing}
                          placeholder="Conte um pouco sobre você ou sua empresa..."
                          className="mt-1"
                          rows={4}
                        />
                      </div>

                      {isEditing && (
                        <div className="flex justify-end space-x-2 pt-6 border-t">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setIsEditing(false)
                              fetchProfile()
                            }}
                          >
                            Cancelar
                          </Button>
                          <Button onClick={handleSaveProfile} disabled={saving}>
                            {saving ? (
                              "Salvando..."
                            ) : (
                              <>
                                <Save className="w-4 h-4 mr-2" />
                                Salvar Alterações
                              </>
                            )}
                          </Button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="security">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Alterar Senha</CardTitle>
                      <CardDescription>Mantenha sua conta segura com uma senha forte</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {!showPasswordForm ? (
                        <div className="text-center py-6">
                          <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                          <p className="text-gray-600 mb-4">Última alteração: Nunca</p>
                          <Button onClick={() => setShowPasswordForm(true)}>Alterar Senha</Button>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="currentPassword">Senha Atual</Label>
                            <div className="relative">
                              <Input
                                id="currentPassword"
                                type={showPasswords.current ? "text" : "password"}
                                value={passwordData.currentPassword}
                                onChange={(e) =>
                                  setPasswordData((prev) => ({
                                    ...prev,
                                    currentPassword: e.target.value,
                                  }))
                                }
                                className="mt-1"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3"
                                onClick={() =>
                                  setShowPasswords((prev) => ({
                                    ...prev,
                                    current: !prev.current,
                                  }))
                                }
                              >
                                {showPasswords.current ? (
                                  <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <Eye className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="newPassword">Nova Senha</Label>
                            <div className="relative">
                              <Input
                                id="newPassword"
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordData.newPassword}
                                onChange={(e) =>
                                  setPasswordData((prev) => ({
                                    ...prev,
                                    newPassword: e.target.value,
                                  }))
                                }
                                className="mt-1"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3"
                                onClick={() =>
                                  setShowPasswords((prev) => ({
                                    ...prev,
                                    new: !prev.new,
                                  }))
                                }
                              >
                                {showPasswords.new ? (
                                  <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <Eye className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                            <div className="relative">
                              <Input
                                id="confirmPassword"
                                type={showPasswords.confirm ? "text" : "password"}
                                value={passwordData.confirmPassword}
                                onChange={(e) =>
                                  setPasswordData((prev) => ({
                                    ...prev,
                                    confirmPassword: e.target.value,
                                  }))
                                }
                                className="mt-1"
                              />
                              <button
                                type="button"
                                className="absolute right-3 top-3"
                                onClick={() =>
                                  setShowPasswords((prev) => ({
                                    ...prev,
                                    confirm: !prev.confirm,
                                  }))
                                }
                              >
                                {showPasswords.confirm ? (
                                  <EyeOff className="w-5 h-5 text-gray-400" />
                                ) : (
                                  <Eye className="w-5 h-5 text-gray-400" />
                                )}
                              </button>
                            </div>
                          </div>
                          <div className="flex space-x-2 pt-4">
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowPasswordForm(false)
                                setPasswordData({
                                  currentPassword: "",
                                  newPassword: "",
                                  confirmPassword: "",
                                })
                              }}
                            >
                              Cancelar
                            </Button>
                            <Button onClick={handlePasswordChange}>Alterar Senha</Button>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Sessões Ativas</CardTitle>
                      <CardDescription>Gerencie onde você está logado</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-lg">
                          <div>
                            <p className="font-medium">Navegador Atual</p>
                            <p className="text-sm text-gray-600">
                              {navigator.userAgent.includes("Chrome") ? "Chrome" : "Navegador"} • Agora
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800">Ativo</Badge>
                        </div>
                        <Button variant="outline" className="w-full">
                          Encerrar Todas as Outras Sessões
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="notifications">
                <Card>
                  <CardHeader>
                    <CardTitle>Preferências de Notificação</CardTitle>
                    <CardDescription>Configure como você deseja receber notificações</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="newsletter">Newsletter</Label>
                        <p className="text-sm text-gray-600">Receba novidades e ofertas por email</p>
                      </div>
                      <Switch
                        id="newsletter"
                        checked={profile.newsletter_subscription}
                        onCheckedChange={(checked) => {
                          handleSwitchChange("newsletter_subscription", checked)
                          // Auto-save notification preferences
                          supabase.from("users").update({ newsletter_subscription: checked }).eq("id", profile.id)
                        }}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notificações de Pedidos</Label>
                        <p className="text-sm text-gray-600">Receba atualizações sobre seus pedidos</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Mensagens</Label>
                        <p className="text-sm text-gray-600">Notificações de mensagens de fornecedores</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Promoções</Label>
                        <p className="text-sm text-gray-600">Ofertas especiais e descontos</p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Notificações Push</Label>
                        <p className="text-sm text-gray-600">Notificações no navegador</p>
                      </div>
                      <Switch />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Footer */}
          <footer className="bg-white border-t border-gray-200 py-4 mt-8">
            <div className="container mx-auto px-6">
              <div className="flex flex-col md:flex-row justify-between items-center">
                <div className="mb-4 md:mb-0">
                  <p className="text-sm text-gray-600">
                    © {new Date().getFullYear()} Supply Hub. Todos os direitos reservados.
                  </p>
                </div>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </ProtectedRoute>
  )
}
