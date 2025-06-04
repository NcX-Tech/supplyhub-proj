"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"
import Link from "next/link"
import { Package, Search, Bell, Mail, Menu, Home, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useState } from "react"

export default function ProductsPage() {
  const { user, signOut } = useAuth()
  const [sidebarExpanded, setSidebarExpanded] = useState(true)

  const menuItems = [
    { icon: Home, label: "Início", href: "/", active: false },
    { icon: Package, label: "Produtos", href: "/produtos", active: true },
  ]

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

          {sidebarExpanded && user && (
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                  {user.email?.substring(0, 2).toUpperCase()}
                </div>
                <div className="ml-3">
                  <p className="font-medium">{user.user_metadata?.full_name || user.email}</p>
                  <p className="text-xs text-gray-400">{user.user_metadata?.user_type || "Usuário"}</p>
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
              onClick={signOut}
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
                <div className="relative">
                  <Input type="text" placeholder="Buscar produtos, fornecedores..." className="pl-10 w-80" />
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                </div>
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
                <Link href="/perfil">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold cursor-pointer">
                    {user?.email?.substring(0, 2).toUpperCase()}
                  </div>
                </Link>
              </div>
            </div>
          </header>

          <div className="p-6">
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-dark mb-2">Todos os Produtos</h1>
              <p className="text-gray-600">Explore nossa seleção completa de produtos sustentáveis</p>
            </div>

            <Card className="p-6">
              <CardContent>
                <div className="text-center py-12">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Produtos em breve</h3>
                  <p className="text-gray-600 mb-4">
                    Esta página está sendo desenvolvida. Em breve você poderá explorar todos os produtos disponíveis.
                  </p>
                  <Link href="/">
                    <Button className="bg-primary hover:bg-orange-600">Voltar ao Início</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
}
