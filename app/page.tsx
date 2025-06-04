"use client"

import { useState } from "react"
import {
  Search,
  Bell,
  Mail,
  Home,
  Package,
  ShoppingCart,
  TrendingUp,
  Handshake,
  DollarSign,
  Settings,
  LogOut,
  Menu,
  Grid3X3,
  List,
  MapPin,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function HomePage() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")

  const stats = [
    { icon: Package, label: "Produtos Disponíveis", value: "1,254", color: "bg-orange-100 text-primary" },
    { icon: Home, label: "Produtores Ativos", value: "328", color: "bg-green-100 text-green-600" },
    { icon: Handshake, label: "Parcerias Realizadas", value: "86", color: "bg-blue-100 text-blue-600" },
    { icon: CheckCircle, label: "Certificações Sustentáveis", value: "42", color: "bg-purple-100 text-purple-600" },
  ]

  const products = [
    {
      id: 1,
      name: "Tecido Orgânico",
      description: "Tecido 100% algodão orgânico para confecção",
      price: 45.0,
      unit: "/metro",
      location: "São Paulo, SP",
      badge: "Orgânico",
      badgeColor: "bg-green-100 text-green-800",
      featured: true,
    },
    {
      id: 2,
      name: "Máquina de Corte",
      description: "Máquina de corte industrial para tecidos",
      price: 2800.0,
      unit: "/unidade",
      location: "Belo Horizonte, MG",
      badge: "Equipamento",
      badgeColor: "bg-blue-100 text-blue-800",
      featured: false,
    },
  ]

  const partners = [
    { name: "EcoTêxtil", color: "bg-green-100 text-green-600" },
    { name: "GreenTech Solutions", color: "bg-blue-100 text-blue-600" },
    { name: "Bio Embalagens Brasil", color: "bg-purple-100 text-purple-600" },
    { name: "Consultoria EcoViva", color: "bg-yellow-100 text-yellow-600" },
  ]

  const menuItems = [
    { icon: Home, label: "Início", active: true },
    { icon: Package, label: "Produtos", active: false },
    { icon: ShoppingCart, label: "Pedidos", active: false },
    { icon: TrendingUp, label: "Análises", active: false },
    { icon: Handshake, label: "Parcerias", active: false },
    { icon: DollarSign, label: "Investimentos", active: false },
    { icon: Settings, label: "Configurações", active: false },
  ]

  return (
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
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                JP
              </div>
              <div className="ml-3">
                <p className="font-medium">João Paulo</p>
                <p className="text-xs text-gray-400">Produtor</p>
              </div>
            </div>
          </div>
        )}

        <nav className="p-4">
          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a
                  href="#"
                  className={`flex items-center p-2 rounded-md transition-colors ${
                    item.active ? "bg-primary text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white"
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  {sidebarExpanded && <span className="ml-3">{item.label}</span>}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto p-4 border-t border-gray-700">
          <a
            href="#"
            className="flex items-center p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {sidebarExpanded && <span className="ml-3">Sair</span>}
          </a>
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
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                JP
              </div>
            </div>
          </div>
        </header>

        <div className="p-6">
          {/* Welcome Banner */}
          <section className="bg-gradient-to-r from-primary to-orange-500 rounded-lg shadow-lg p-6 mb-6 text-white">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Bem-vindo ao Supply Hub!</h1>
                <p className="mb-4">Conectando pequenos produtores e indústrias de forma sustentável.</p>
                <Button className="bg-white text-primary font-medium hover:bg-gray-100">Explorar Produtos</Button>
              </div>
              <div className="mt-4 md:mt-0">
                <div className="w-40 h-40 relative">
                  <div className="absolute inset-0 rounded-full bg-white/10"></div>
                  <div className="absolute inset-8 bg-white/20 rounded-lg border-2 border-white"></div>
                  <div className="absolute inset-16 bg-white rounded-lg"></div>
                </div>
              </div>
            </div>
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {stats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className={`p-3 rounded-full ${stat.color}`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-gray-500 text-sm">{stat.label}</h3>
                      <p className="text-2xl font-semibold text-dark">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </section>

          {/* Products Section */}
          <section className="mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-dark">Produtos em Destaque</h2>
              <div className="flex items-center space-x-2">
                <Button
                  variant={viewMode === "grid" ? "default" : "secondary"}
                  size="icon"
                  onClick={() => setViewMode("grid")}
                  className="rounded-l-md rounded-r-none"
                >
                  <Grid3X3 className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "secondary"}
                  size="icon"
                  onClick={() => setViewMode("list")}
                  className="rounded-r-md rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Filters */}
            <Card className="p-4 mb-4">
              <div className="flex flex-wrap items-end gap-4">
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Categoria</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as categorias" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as categorias</SelectItem>
                      <SelectItem value="raw">Matéria-prima</SelectItem>
                      <SelectItem value="equipment">Equipamentos</SelectItem>
                      <SelectItem value="services">Serviços</SelectItem>
                      <SelectItem value="finished">Produtos acabados</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Localização</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as localizações" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as localizações</SelectItem>
                      <SelectItem value="north">Norte</SelectItem>
                      <SelectItem value="northeast">Nordeste</SelectItem>
                      <SelectItem value="midwest">Centro-Oeste</SelectItem>
                      <SelectItem value="southeast">Sudeste</SelectItem>
                      <SelectItem value="south">Sul</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-[200px]">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Certificação</label>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Todas as certificações" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Todas as certificações</SelectItem>
                      <SelectItem value="organic">Orgânico</SelectItem>
                      <SelectItem value="fair">Comércio Justo</SelectItem>
                      <SelectItem value="carbon">Carbono Neutro</SelectItem>
                      <SelectItem value="iso">ISO 14001</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button className="bg-primary text-white hover:bg-orange-600">Filtrar</Button>
              </div>
            </Card>

            {/* Products Grid/List */}
            <div
              className={
                viewMode === "grid"
                  ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }
            >
              {products.map((product) => (
                <Card
                  key={product.id}
                  className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                >
                  {viewMode === "grid" ? (
                    <>
                      <div className="h-48 bg-gray-200 relative">
                        {product.featured && (
                          <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-xs font-bold">
                            Destaque
                          </div>
                        )}
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-300" />
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <h3 className="font-bold text-dark">{product.name}</h3>
                          <span className={`text-xs px-2 py-1 rounded-full ${product.badgeColor}`}>
                            {product.badge}
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm mt-1">{product.description}</p>
                        <div className="mt-3 flex items-center">
                          <span className="text-primary font-bold">R$ {product.price.toFixed(2)}</span>
                          <span className="text-xs text-gray-500 ml-1">{product.unit}</span>
                        </div>
                        <div className="mt-3 flex items-center text-sm text-gray-500">
                          <MapPin className="w-4 h-4 mr-1" />
                          <span>{product.location}</span>
                        </div>
                        <div className="mt-4 flex justify-between">
                          <Button size="sm" className="bg-primary text-white hover:bg-orange-600">
                            Ver detalhes
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="border-primary text-primary hover:bg-primary hover:text-white"
                          >
                            <ShoppingCart className="w-4 h-4 mr-1" />
                            Adicionar
                          </Button>
                        </div>
                      </CardContent>
                    </>
                  ) : (
                    <div className="flex flex-col md:flex-row">
                      <div className="md:w-1/4 h-48 md:h-auto bg-gray-200 relative">
                        {product.featured && (
                          <div className="absolute top-0 right-0 bg-primary text-white px-2 py-1 text-xs font-bold">
                            Destaque
                          </div>
                        )}
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-16 h-16 text-gray-300" />
                        </div>
                      </div>
                      <CardContent className="p-4 md:w-3/4">
                        <div className="flex flex-col md:flex-row justify-between items-start">
                          <div className="flex-grow">
                            <div className="flex items-center">
                              <h3 className="font-bold text-dark text-lg">{product.name}</h3>
                              <span className={`text-xs px-2 py-1 rounded-full ml-2 ${product.badgeColor}`}>
                                {product.badge}
                              </span>
                            </div>
                            <p className="text-gray-600 mt-2 text-sm">{product.description}</p>
                            <div className="mt-3 flex items-center">
                              <span className="text-primary font-bold text-lg">R$ {product.price.toFixed(2)}</span>
                              <span className="text-xs text-gray-500 ml-1">{product.unit}</span>
                            </div>
                            <div className="mt-2 flex items-center text-sm text-gray-500">
                              <MapPin className="w-4 h-4 mr-1" />
                              <span>{product.location}</span>
                            </div>
                          </div>
                          <div className="flex flex-col space-y-2 mt-4 md:mt-0 md:ml-4">
                            <Button className="bg-primary text-white hover:bg-orange-600">Ver detalhes</Button>
                            <Button
                              variant="outline"
                              className="border-primary text-primary hover:bg-primary hover:text-white"
                            >
                              <ShoppingCart className="w-4 h-4 mr-1" />
                              Adicionar
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <nav className="mt-6 flex justify-center">
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon">
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button className="bg-primary text-white">1</Button>
                <Button variant="ghost">2</Button>
                <Button variant="ghost">3</Button>
                <Button variant="ghost" size="icon">
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </nav>
          </section>

          {/* Partners Section */}
          <section className="mb-6">
            <h2 className="text-xl font-bold text-dark mb-4">Parceiros Sustentáveis</h2>
            <Card className="p-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {partners.map((partner, index) => (
                  <div key={index} className="flex flex-col items-center">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center ${partner.color}`}>
                      <CheckCircle className="w-8 h-8" />
                    </div>
                    <p className="mt-2 text-center font-medium">{partner.name}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Button variant="outline" className="border-primary text-primary hover:bg-primary hover:text-white">
                  Ver todos os parceiros
                </Button>
              </div>
            </Card>
          </section>
        </div>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 py-4">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div className="mb-4 md:mb-0">
                <p className="text-sm text-gray-600">
                  © {new Date().getFullYear()} Supply Hub. Todos os direitos reservados.
                </p>
              </div>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-600 hover:text-primary">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-primary">
                  <i className="fab fa-instagram"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-primary">
                  <i className="fab fa-linkedin"></i>
                </a>
                <a href="#" className="text-gray-600 hover:text-primary">
                  <i className="fab fa-twitter"></i>
                </a>
              </div>
            </div>
          </div>
        </footer>
      </main>
    </div>
  )
}
