"use client"

import { useState } from "react"
import {
  Search,
  ShoppingCart,
  User,
  ChevronLeft,
  ChevronRight,
  Star,
  StarHalf,
  Info,
  Building,
  Minus,
  Plus,
  Zap,
  Package,
  MapPin,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

export default function ProductPage() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [activeTab, setActiveTab] = useState("reviews")
  const [quantity, setQuantity] = useState(1)

  const { user, signOut } = useAuth()

  const images = [
    { id: 1, alt: "Cadeira Ergonômica - Vista Frontal" },
    { id: 2, alt: "Cadeira Ergonômica - Vista Lateral" },
    { id: 3, alt: "Cadeira Ergonômica - Detalhes" },
  ]

  const reviews = [
    {
      id: 1,
      name: "Maria Silva",
      avatar: "M",
      rating: 5,
      date: "12/05/2023",
      comment:
        "Excelente cadeira! Muito confortável para longas horas de trabalho. A montagem foi fácil e o material é de ótima qualidade. Recomendo!",
    },
    {
      id: 2,
      name: "João Santos",
      avatar: "J",
      rating: 4,
      date: "08/05/2023",
      comment: "Boa qualidade, mas o preço poderia ser melhor. No geral, estou satisfeito com a compra.",
    },
  ]

  const relatedProducts = [
    {
      id: 1,
      name: "Apoio para Pés Ergonômico",
      rating: 4,
      price: 189.9,
    },
    {
      id: 2,
      name: "Mesa Ajustável",
      rating: 5,
      price: 899.9,
    },
    {
      id: 3,
      name: "Suporte para Monitor",
      rating: 4,
      price: 159.9,
    },
    {
      id: 4,
      name: "Luminária LED",
      rating: 5,
      price: 249.9,
    },
  ]

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % images.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + images.length) % images.length)
  }

  const renderStars = (rating: number) => {
    const stars = []
    const fullStars = Math.floor(rating)
    const hasHalfStar = rating % 1 !== 0

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-current text-primary" />)
    }

    if (hasHalfStar) {
      stars.push(<StarHalf key="half" className="w-4 h-4 fill-current text-primary" />)
    }

    const emptyStars = 5 - Math.ceil(rating)
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />)
    }

    return stars
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-white">
        {/* Header */}
        <header className="bg-primary text-white shadow-md sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold">
                Supply Hub
              </Link>
            </div>
            <nav className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                <Search className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                <ShoppingCart className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white hover:text-white/80">
                <User className="w-5 h-5" />
              </Button>
            </nav>
          </div>
        </header>

        <main className="container mx-auto px-4 py-6">
          <Card className="p-6 mb-6">
            {/* Breadcrumb */}
            <nav className="mb-6 text-sm text-gray-600">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    Mobiliário
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-800">Cadeira Ergonômica Profissional</li>
              </ol>
            </nav>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Image Carousel */}
              <div>
                <div className="relative overflow-hidden rounded-lg mb-6">
                  <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {images.map((image, index) => (
                      <div key={image.id} className="min-w-full">
                        <div className="h-80 bg-gray-200 flex items-center justify-center rounded-lg">
                          <Package className="w-24 h-24 text-gray-300" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={prevSlide}
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white"
                    onClick={nextSlide}
                  >
                    <ChevronRight className="w-5 h-5" />
                  </Button>
                </div>

                {/* Dots */}
                <div className="flex justify-center space-x-2">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentSlide ? "bg-primary" : "bg-gray-300"
                      }`}
                      onClick={() => setCurrentSlide(index)}
                    />
                  ))}
                </div>
              </div>

              {/* Product Info */}
              <div>
                <h1 className="text-3xl font-bold text-dark mb-2">Cadeira Ergonômica Profissional</h1>
                <div className="flex items-center mb-4">
                  <div className="flex mr-2">{renderStars(4.5)}</div>
                  <button className="text-dark/70 hover:text-primary">(127 avaliações)</button>
                </div>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <span className="text-3xl font-bold text-primary">R$ 1.299,90</span>
                    <span className="text-dark/70 line-through ml-2">R$ 1.599,90</span>
                  </div>
                  <span className="bg-primary/10 text-primary text-sm font-medium px-3 py-1 rounded-full">
                    Em estoque
                  </span>
                </div>

                <div className="flex flex-col md:flex-row gap-4 mb-6">
                  {/* Quantity Selector */}
                  <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-none"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                    <Input
                      type="text"
                      value={quantity}
                      readOnly
                      className="w-12 h-9 text-center border-0 rounded-none"
                    />
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 rounded-none"
                      onClick={() => setQuantity(quantity + 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>

                  <Button className="bg-primary text-white hover:bg-orange-600 flex-grow">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Adicionar ao Carrinho
                  </Button>

                  <Button className="bg-dark text-white hover:bg-gray-800 flex-grow">
                    <Zap className="w-4 h-4 mr-2" />
                    Comprar Agora
                  </Button>
                </div>
              </div>
            </div>

            {/* Tabs */}
            <div className="mt-8">
              <div className="border-b border-gray-300 mb-6">
                <div className="flex flex-wrap -mb-px">
                  <button
                    className={`inline-block p-4 border-b-2 rounded-t-lg font-medium transition-colors ${
                      activeTab === "reviews"
                        ? "text-primary border-primary"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("reviews")}
                  >
                    <Star className="w-4 h-4 mr-2 inline" />
                    Avaliações
                  </button>
                  <button
                    className={`inline-block p-4 border-b-2 rounded-t-lg font-medium transition-colors ${
                      activeTab === "details"
                        ? "text-primary border-primary"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("details")}
                  >
                    <Info className="w-4 h-4 mr-2 inline" />
                    Informações
                  </button>
                  <button
                    className={`inline-block p-4 border-b-2 rounded-t-lg font-medium transition-colors ${
                      activeTab === "supplier"
                        ? "text-primary border-primary"
                        : "text-gray-500 border-transparent hover:text-gray-700 hover:border-gray-300"
                    }`}
                    onClick={() => setActiveTab("supplier")}
                  >
                    <Building className="w-4 h-4 mr-2 inline" />
                    Fornecedor
                  </button>
                </div>
              </div>

              {/* Tab Content */}
              {activeTab === "reviews" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-dark">Avaliações de Clientes</h2>
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="flex mr-2">{renderStars(4.5)}</div>
                      <span className="text-lg font-medium text-dark">4.5 de 5</span>
                    </div>

                    <div className="space-y-4">
                      {reviews.map((review) => (
                        <article key={review.id} className="border-b border-gray-200 pb-4">
                          <header className="flex items-center mb-2">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3">
                              {review.avatar}
                            </div>
                            <div>
                              <h4 className="font-medium text-dark">{review.name}</h4>
                              <div className="flex">{renderStars(review.rating)}</div>
                            </div>
                            <time className="ml-auto text-sm text-dark/70">{review.date}</time>
                          </header>
                          <p className="text-dark">{review.comment}</p>
                        </article>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {activeTab === "details" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-dark">Detalhes do Produto</h2>
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold mb-3 text-dark">Descrição</h3>
                      <p className="text-dark">
                        A Cadeira Ergonômica Profissional foi projetada para oferecer o máximo de conforto durante
                        longas horas de trabalho. Com design moderno e materiais de alta qualidade, esta cadeira é
                        perfeita para escritórios e home offices.
                      </p>
                    </section>
                    <section>
                      <h3 className="text-lg font-semibold mb-3 text-dark">Especificações Técnicas</h3>
                      <ul className="list-disc pl-5 text-dark space-y-2">
                        <li>Material: Estrutura em aço cromado e assento em malha respirável</li>
                        <li>Dimensões: 65cm (L) x 65cm (P) x 110-120cm (A)</li>
                        <li>Peso máximo suportado: 120kg</li>
                        <li>Ajuste de altura: Pneumático</li>
                        <li>Apoio de braços: Ajustável</li>
                        <li>Rodízios: 5 rodas com trava</li>
                      </ul>
                    </section>
                  </div>
                </div>
              )}

              {activeTab === "supplier" && (
                <div>
                  <h2 className="text-xl font-semibold mb-4 text-dark">Informações do Fornecedor</h2>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-dark">Móveis Ergonômicos Ltda.</h3>
                      <p className="text-gray-600">Especializada em móveis para escritório há mais de 15 anos</p>
                    </div>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>São Paulo, SP</span>
                    </div>
                    <div className="flex items-center">
                      <div className="flex mr-2">{renderStars(4.8)}</div>
                      <span className="text-sm text-gray-600">(245 avaliações)</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </Card>

          {/* Related Products */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-dark">Produtos Relacionados</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {relatedProducts.map((product) => (
                <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-all duration-300">
                  <div className="h-48 bg-gray-200 flex items-center justify-center">
                    <Package className="w-16 h-16 text-gray-300" />
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-medium text-dark mb-2">{product.name}</h3>
                    <div className="flex mb-2">{renderStars(product.rating)}</div>
                    <p className="text-primary font-bold">R$ {product.price.toFixed(2)}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-white mt-10">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4">Supply Hub</h3>
                <p className="text-white/70">
                  Sua plataforma completa para compra de produtos industriais e corporativos.
                </p>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Produtos</h4>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <a href="#" className="hover:text-white">
                      Mobiliário
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Equipamentos
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Matéria-prima
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Suporte</h4>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <a href="#" className="hover:text-white">
                      Central de Ajuda
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Contato
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      FAQ
                    </a>
                  </li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-4">Empresa</h4>
                <ul className="space-y-2 text-white/70">
                  <li>
                    <a href="#" className="hover:text-white">
                      Sobre nós
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Carreiras
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      Imprensa
                    </a>
                  </li>
                </ul>
              </div>
            </div>
            <div className="border-t border-white/20 mt-8 pt-6 text-center text-white/70">
              <p>© {new Date().getFullYear()} Supply Hub. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </ProtectedRoute>
  )
}
