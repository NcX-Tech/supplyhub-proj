"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ShoppingCart,
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
  Heart,
  Share,
  Calendar,
  Truck,
  Leaf,
  RecycleIcon as Recycling,
  Bell,
  Mail,
  Menu,
  Home,
  LogOut,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { useAuth } from "@/contexts/auth-context"

type ProductProps = {
  params: {
    id: string
  }
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  discount_price?: number
  unit: string
  min_order: number
  stock: number
  location: string
  category: string
  subcategory: string
  images: string[]
  specifications: Record<string, any>
  sustainability_info: Record<string, any>
  supplier_id: string
  created_at: string
  updated_at: string
  supplier?: {
    id: string
    full_name: string
    company_name: string
    rating: number
    review_count: number
    location: string
    bio: string
    created_at: string
  }
  reviews?: Array<{
    id: string
    rating: number
    comment: string
    created_at: string
    user: {
      full_name: string
    }
  }>
}

export default function ProductDescription({ params }: ProductProps) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const { toast } = useToast()
  const { user, signOut } = useAuth()

  const productId = params.id

  useEffect(() => {
    fetchProduct()
    fetchRelatedProducts()
  }, [productId])

  const fetchProduct = async () => {
    try {
      const { data: productData, error: productError } = await supabase
        .from("products")
        .select(`
          *,
          supplier:users!products_supplier_id_fkey (
            id,
            full_name,
            company_name,
            bio,
            city,
            state,
            created_at
          )
        `)
        .eq("id", productId)
        .single()

      if (productError) throw productError

      // Fetch reviews
      const { data: reviewsData, error: reviewsError } = await supabase
        .from("reviews")
        .select(`
          *,
          user:users!reviews_user_id_fkey (
            full_name
          )
        `)
        .eq("product_id", productId)
        .order("created_at", { ascending: false })

      if (reviewsError) throw reviewsError

      // Calculate supplier rating from reviews
      const supplierReviews = await supabase.from("reviews").select("rating").eq("supplier_id", productData.supplier_id)

      let supplierRating = 0
      if (supplierReviews.data && supplierReviews.data.length > 0) {
        const totalRating = supplierReviews.data.reduce((sum, review) => sum + review.rating, 0)
        supplierRating = totalRating / supplierReviews.data.length
      }

      setProduct({
        ...productData,
        reviews: reviewsData,
        supplier: {
          ...productData.supplier,
          rating: supplierRating,
          review_count: supplierReviews.data?.length || 0,
          location: `${productData.supplier.city}, ${productData.supplier.state}`,
        },
      })

      // Set initial quantity to minimum order
      setQuantity(productData.min_order || 1)
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao carregar produto",
        variant: "destructive",
      })
      console.error("Error fetching product:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchRelatedProducts = async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, discount_price, images")
        .neq("id", productId)
        .limit(4)

      if (error) throw error
      setRelatedProducts(data || [])
    } catch (error) {
      console.error("Error fetching related products:", error)
    }
  }

  const addToCart = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Login necessário",
          description: "Faça login para adicionar produtos ao carrinho",
          variant: "destructive",
        })
        return
      }

      const { error } = await supabase.from("cart_items").insert([
        {
          user_id: user.id,
          product_id: productId,
          quantity: quantity,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) throw error

      toast({
        title: "Sucesso!",
        description: "Produto adicionado ao carrinho",
      })
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao adicionar ao carrinho",
        variant: "destructive",
      })
    }
  }

  const toggleFavorite = async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        toast({
          title: "Login necessário",
          description: "Faça login para favoritar produtos",
          variant: "destructive",
        })
        return
      }

      if (isFavorite) {
        const { error } = await supabase.from("favorites").delete().eq("user_id", user.id).eq("product_id", productId)

        if (error) throw error
        setIsFavorite(false)
        toast({
          title: "Removido dos favoritos",
        })
      } else {
        const { error } = await supabase.from("favorites").insert([
          {
            user_id: user.id,
            product_id: productId,
            created_at: new Date().toISOString(),
          },
        ])

        if (error) throw error
        setIsFavorite(true)
        toast({
          title: "Adicionado aos favoritos",
        })
      }
    } catch (error: any) {
      toast({
        title: "Erro",
        description: "Erro ao favoritar produto",
        variant: "destructive",
      })
    }
  }

  const nextSlide = () => {
    if (product?.images) {
      setCurrentSlide((prev) => (prev + 1) % product.images.length)
    }
  }

  const prevSlide = () => {
    if (product?.images) {
      setCurrentSlide((prev) => (prev - 1 + product.images.length) % product.images.length)
    }
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

  const calculateAverageRating = () => {
    if (!product?.reviews || product.reviews.length === 0) return 0
    const total = product.reviews.reduce((sum, review) => sum + review.rating, 0)
    return total / product.reviews.length
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-primary mx-auto mb-4" />
          <p>Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p>Produto não encontrado</p>
          <Link href="/">
            <Button className="mt-4">Voltar ao início</Button>
          </Link>
        </div>
      </div>
    )
  }

  const averageRating = calculateAverageRating()

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
              <li>
                <Link
                  href="/"
                  className={`flex items-center p-2 rounded-md transition-colors text-gray-300 hover:bg-gray-700 hover:text-white`}
                >
                  <Home className="w-5 h-5" />
                  {sidebarExpanded && <span className="ml-3">Início</span>}
                </Link>
              </li>
              <li>
                <a href="#" className={`flex items-center p-2 rounded-md transition-colors bg-primary text-white`}>
                  <Package className="w-5 h-5" />
                  {sidebarExpanded && <span className="ml-3">Produtos</span>}
                </a>
              </li>
              <li>
                <button
                  onClick={signOut}
                  className="flex items-center p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors w-full"
                >
                  <LogOut className="w-5 h-5" />
                  {sidebarExpanded && <span className="ml-3">Sair</span>}
                </button>
              </li>
            </ul>
          </nav>
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
            {/* Breadcrumb */}
            <nav className="flex mb-6 text-sm text-gray-600">
              <ol className="flex items-center space-x-2">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Início
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    {product.category}
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li>
                  <Link href="#" className="hover:text-primary">
                    {product.subcategory}
                  </Link>
                </li>
                <li className="text-gray-400">/</li>
                <li className="text-gray-800">{product.name}</li>
              </ol>
            </nav>

            <Card className="p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Image Carousel */}
                <div>
                  <div className="relative overflow-hidden rounded-lg mb-6">
                    <div
                      className="flex transition-transform duration-500 ease-in-out"
                      style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                    >
                      {product.images && product.images.length > 0 ? (
                        product.images.map((image, index) => (
                          <div key={index} className="min-w-full">
                            <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={`${product.name} - Imagem ${index + 1}`}
                                className="w-full h-full object-cover rounded-lg"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none"
                                  e.currentTarget.nextElementSibling?.classList.remove("hidden")
                                }}
                              />
                              <Package className="w-24 h-24 text-gray-300 hidden" />
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="min-w-full">
                          <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
                            <Package className="w-24 h-24 text-gray-300" />
                          </div>
                        </div>
                      )}
                    </div>
                    {product.images && product.images.length > 1 && (
                      <>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow"
                          onClick={prevSlide}
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full shadow"
                          onClick={nextSlide}
                        >
                          <ChevronRight className="w-5 h-5" />
                        </Button>
                      </>
                    )}
                  </div>

                  {/* Thumbnail Gallery */}
                  {product.images && product.images.length > 1 && (
                    <div className="flex space-x-2 overflow-x-auto pb-2">
                      {product.images.map((image, index) => (
                        <button
                          key={index}
                          className={`flex-none w-20 h-20 rounded-md overflow-hidden border-2 ${
                            index === currentSlide ? "border-primary" : "border-transparent"
                          }`}
                          onClick={() => setCurrentSlide(index)}
                        >
                          <img
                            src={image || "/placeholder.svg"}
                            alt={`${product.name} - Miniatura ${index + 1}`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              e.currentTarget.style.display = "none"
                              e.currentTarget.nextElementSibling?.classList.remove("hidden")
                            }}
                          />
                          <div className="w-full h-full bg-gray-200 flex items-center justify-center hidden">
                            <Package className="w-8 h-8 text-gray-300" />
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Sustainability info */}
                  {product.sustainability_info && (
                    <div className="mt-6 bg-green-50 p-4 rounded-lg">
                      <h3 className="flex items-center text-green-800 font-medium mb-2">
                        <Leaf className="w-5 h-5 mr-2" />
                        Impacto Ambiental
                      </h3>
                      <div className="space-y-2 text-sm">
                        {Object.entries(product.sustainability_info).map(([key, value]) => (
                          <div key={key} className="flex items-start">
                            <Recycling className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                            <div>
                              <span className="font-medium">{key}:</span> {value as string}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div>
                  <h1 className="text-3xl font-bold text-dark mb-2">{product.name}</h1>

                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">{renderStars(averageRating)}</div>
                    <span className="text-dark/70">
                      {averageRating.toFixed(1)} ({product.reviews?.length || 0} avaliações)
                    </span>
                  </div>

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <span className="text-3xl font-bold text-primary">
                        R$ {(product.discount_price || product.price).toFixed(2)}
                      </span>
                      {product.discount_price && (
                        <span className="text-dark/70 line-through ml-2">R$ {product.price.toFixed(2)}</span>
                      )}
                      <span className="block text-sm text-gray-600">{product.unit}</span>
                    </div>
                    <span className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                      Em estoque: {product.stock} unidades
                    </span>
                  </div>

                  <div className="mb-6">
                    <p className="text-gray-700">{product.description}</p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span>Origem: {product.location}</span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Package className="w-4 h-4 mr-1" />
                      <span>
                        Pedido mínimo: {product.min_order} {product.unit.replace("/", "")}
                      </span>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Truck className="w-4 h-4 mr-1" />
                      <span>Envio em até 5 dias úteis</span>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    {/* Quantity Selector */}
                    <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-9 w-9 rounded-none"
                        onClick={() => setQuantity(Math.max(product.min_order, quantity - 1))}
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

                    <Button onClick={addToCart} className="bg-primary text-white hover:bg-orange-600 flex-grow">
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Adicionar ao Carrinho
                    </Button>

                    <Button className="bg-dark text-white hover:bg-gray-800 flex-grow">
                      <Zap className="w-4 h-4 mr-2" />
                      Comprar Agora
                    </Button>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={toggleFavorite}
                            className={isFavorite ? "text-red-500" : ""}
                          >
                            <Heart className={isFavorite ? "fill-current" : ""} />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>

                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button variant="outline" size="icon">
                            <Share />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Compartilhar produto</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  {/* Supplier Preview */}
                  {product.supplier && (
                    <Card className="bg-gray-50">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold text-dark">
                              {product.supplier.company_name || product.supplier.full_name}
                            </h3>
                            <div className="flex items-center text-sm mt-1">
                              <div className="flex mr-2">{renderStars(product.supplier.rating)}</div>
                              <span className="text-dark/70">
                                {product.supplier.rating.toFixed(1)} ({product.supplier.review_count} avaliações)
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              <Calendar className="inline w-4 h-4 mr-1" />
                              No Supply Hub desde {new Date(product.supplier.created_at).getFullYear()}
                            </p>
                          </div>
                          <Button className="border-primary text-primary hover:bg-primary hover:text-white">
                            Ver Perfil
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </Card>

            {/* Tabs */}
            <Card className="p-6 mb-6">
              <Tabs defaultValue="specifications" className="w-full">
                <TabsList className="grid grid-cols-3 mb-6">
                  <TabsTrigger value="specifications" className="text-sm md:text-base">
                    <Info className="w-4 h-4 mr-2 inline" />
                    Especificações
                  </TabsTrigger>
                  <TabsTrigger value="reviews" className="text-sm md:text-base">
                    <Star className="w-4 h-4 mr-2 inline" />
                    Avaliações
                  </TabsTrigger>
                  <TabsTrigger value="supplier" className="text-sm md:text-base">
                    <Building className="w-4 h-4 mr-2 inline" />
                    Fornecedor
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="specifications">
                  <div className="space-y-6">
                    <section>
                      <h3 className="text-lg font-semibold mb-3 text-dark">Especificações Técnicas</h3>
                      {product.specifications && Object.keys(product.specifications).length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {Object.entries(product.specifications).map(([key, value]) => (
                            <div key={key} className="flex">
                              <div className="w-40 font-medium text-gray-700">{key}:</div>
                              <div className="text-gray-900">{value as string}</div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Especificações não disponíveis</p>
                      )}
                    </section>

                    <section>
                      <h3 className="text-lg font-semibold mb-3 text-dark">Descrição</h3>
                      <p className="text-gray-700">{product.description}</p>
                    </section>
                  </div>
                </TabsContent>

                <TabsContent value="reviews">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-1">
                      <div className="text-center p-4 border rounded-lg">
                        <div className="text-5xl font-bold text-dark mb-2">{averageRating.toFixed(1)}</div>
                        <div className="flex justify-center mb-2">{renderStars(averageRating)}</div>
                        <div className="text-gray-500 text-sm">
                          Baseado em {product.reviews?.length || 0} avaliações
                        </div>

                        <Button className="mt-6 w-full">Escrever Avaliação</Button>
                      </div>
                    </div>

                    <div className="md:col-span-2">
                      <h3 className="text-lg font-semibold mb-4 text-dark">Avaliações de Clientes</h3>

                      {product.reviews && product.reviews.length > 0 ? (
                        <div className="space-y-6">
                          {product.reviews.map((review) => (
                            <article key={review.id} className="border-b border-gray-200 pb-6">
                              <header className="flex items-center mb-2">
                                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold mr-3">
                                  {review.user.full_name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <h4 className="font-medium text-dark">{review.user.full_name}</h4>
                                  <div className="flex">{renderStars(review.rating)}</div>
                                </div>
                                <time className="ml-auto text-sm text-dark/70">
                                  {new Date(review.created_at).toLocaleDateString("pt-BR")}
                                </time>
                              </header>
                              <p className="text-gray-700">{review.comment}</p>
                            </article>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500">Nenhuma avaliação ainda</p>
                      )}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="supplier">
                  {product.supplier && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                      <div className="md:col-span-1">
                        <div className="p-4 border rounded-lg text-center">
                          <div className="w-20 h-20 bg-gray-200 rounded-full mx-auto flex items-center justify-center mb-4">
                            <Building className="w-10 h-10 text-gray-400" />
                          </div>
                          <h3 className="font-bold text-dark text-xl mb-1">
                            {product.supplier.company_name || product.supplier.full_name}
                          </h3>
                          <div className="flex justify-center mb-2">{renderStars(product.supplier.rating)}</div>
                          <p className="text-gray-500 text-sm">{product.supplier.review_count} avaliações</p>
                          <div className="flex justify-center mt-4 gap-2">
                            <Button>Contactar</Button>
                            <Button variant="outline">Ver Todos os Produtos</Button>
                          </div>
                        </div>
                      </div>

                      <div className="md:col-span-2">
                        <div>
                          <h3 className="text-lg font-semibold mb-3 text-dark">Sobre o Fornecedor</h3>
                          <p className="text-gray-700 mb-4">{product.supplier.bio || "Informações não disponíveis"}</p>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                            <div className="flex items-center">
                              <MapPin className="w-5 h-5 text-gray-500 mr-2" />
                              <span className="text-gray-700">{product.supplier.location}</span>
                            </div>
                            <div className="flex items-center">
                              <Calendar className="w-5 h-5 text-gray-500 mr-2" />
                              <span className="text-gray-700">
                                Membro desde {new Date(product.supplier.created_at).getFullYear()}
                              </span>
                            </div>
                          </div>

                          <div className="bg-gray-100 p-4 rounded-lg">
                            <h4 className="font-medium text-dark mb-2">Certificações e Credenciais</h4>
                            <div className="flex flex-wrap gap-2">
                              <Badge className="bg-green-100 text-green-800">Sustentabilidade</Badge>
                              <Badge className="bg-blue-100 text-blue-800">Comércio Justo</Badge>
                              <Badge className="bg-purple-100 text-purple-800">ISO 14001</Badge>
                              <Badge className="bg-amber-100 text-amber-800">Carbono Neutro</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </Card>

            {/* Related Products */}
            <section>
              <h2 className="text-2xl font-bold mb-6 text-dark">Produtos Relacionados</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((relatedProduct) => (
                  <Card
                    key={relatedProduct.id}
                    className="overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-square bg-gray-200 flex items-center justify-center">
                      {relatedProduct.images && relatedProduct.images.length > 0 ? (
                        <img
                          src={relatedProduct.images[0] || "/placeholder.svg"}
                          alt={relatedProduct.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none"
                            e.currentTarget.nextElementSibling?.classList.remove("hidden")
                          }}
                        />
                      ) : null}
                      <Package className="w-16 h-16 text-gray-300 hidden" />
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-medium text-dark mb-2 line-clamp-2">{relatedProduct.name}</h3>
                      <div className="flex items-center">
                        <span className="text-primary font-bold">
                          R$ {(relatedProduct.discount_price || relatedProduct.price).toFixed(2)}
                        </span>
                        {relatedProduct.discount_price && (
                          <span className="text-dark/70 line-through ml-2 text-sm">
                            R$ {relatedProduct.price.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </section>
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
