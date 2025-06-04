"use client"

import { useState, useEffect } from "react"
import {
  Search,
  ChevronLeft,
  ChevronRight,
  Star,
  StarHalf,
  Package,
  Leaf,
  RecycleIcon,
  Bell,
  Mail,
  Menu,
  Home,
  User,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/db"
import Link from "next/link"
import { useRouter } from "next/navigation"

type ProductProps = {
  params: {
    id: string
  }
}

export default function ProductDescription({ params }: ProductProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [sidebarExpanded, setSidebarExpanded] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [product, setProduct] = useState<any>(null)
  const [supplier, setSupplier] = useState<any>(null)
  const [reviews, setReviews] = useState<any[]>([])
  const [relatedProducts, setRelatedProducts] = useState<any[]>([])
  const [user, setUser] = useState<any>(null)

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true)
      try {
        // Get current user
        const { data: { user } } = await supabase.auth.getUser()
        setUser(user)
        
        // Get product data
        const { data: productData, error: productError } = await supabase
          .from('products')
          .select(`
            *,
            category:categories(name),
            specifications:product_specifications(*),
            sustainability:product_sustainability(*),
            images:product_images(*)
          `)
          .eq('id', params.id)
          .single()
          
        if (productError) throw productError
        
        if (!productData) {
          toast({
            title: "Produto não encontrado",
            description: "O produto que você está procurando não existe ou foi removido.",
            variant: "destructive",
          })
          router.push('/')
          return
        }
        
        setProduct(productData)
        
        // Get product badges
        const { data: badgesData } = await supabase
          .from('product_badge_mapping')
          .select(`
            badge:product_badges(*)
          `)
          .eq('product_id', params.id)
          
        if (badgesData) {
          const badges = badgesData.map(item => item.badge)
          setProduct(prev => ({ ...prev, badges }))
        }
        
        // Get supplier data
        const { data: supplierData } = await supabase
          .from('users')
          .select(`
            *,
            profile:user_profiles(*),
            certifications:user_certifications(
              certification:certifications(*)
            )
          `)
          .eq('id', productData.supplier_id)
          .single()
          
        if (supplierData) {
          setSupplier(supplierData)
        }
        
        // Get reviews
        const { data: reviewsData } = await supabase
          .from('reviews')
          .select(`
            *,
            user:users(name)
          `)
          .eq('product_id', params.id)
          .order('created_at', { ascending: false })
          
        if (reviewsData) {
          setReviews(reviewsData)
        }
        
        // Get related products
        const { data: relatedData } = await supabase
          .from('products')
          .select(`
            id,
            name,
            price,
            discount_price,
            images:product_images(image_url, alt_text)
          `)
          .eq('category_id', productData.category_id)
          .neq('id', params.id)
          .limit(4)
          
        if (relatedData) {
          setRelatedProducts(relatedData)
        }
        
        // Check if product is in user's favorites
        if (user) {
          const { data: favoriteData } = await supabase
            .from('user_favorites')
            .select('*')
            .eq('user_id', user.id)
            .eq('product_id', params.id)
            .single()
            
          setIsFavorite(!!favoriteData)
        }
        
      } catch (error) {
        console.error('Error fetching product:', error)
        toast({
          title: "Erro ao carregar produto",
          description: "Ocorreu um erro ao carregar os dados do produto.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchProductData()
  }, [params.id, toast, router])
  
  const toggleFavorite = async () => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para adicionar produtos aos favoritos.",
        variant: "default",
      })
      return
    }
    
    try {
      if (isFavorite) {
        // Remove from favorites
        await supabase
          .from('user_favorites')
          .delete()
          .eq('user_id', user.id)
          .eq('product_id', params.id)
          
        toast({
          title: "Removido dos favoritos",
          description: "O produto foi removido dos seus favoritos.",
        })
      } else {
        // Add to favorites
        await supabase
          .from('user_favorites')
          .insert({
            user_id: user.id,
            product_id: params.id
          })
          
        toast({
          title: "Adicionado aos favoritos",
          description: "O produto foi adicionado aos seus favoritos.",
        })
      }
      
      setIsFavorite(!isFavorite)
    } catch (error) {
      console.error('Error toggling favorite:', error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar seus favoritos.",
        variant: "destructive",
      })
    }
  }
  
  const addToCart = async () => {
    if (!user) {
      toast({
        title: "Faça login",
        description: "Você precisa estar logado para adicionar produtos ao carrinho.",
        variant: "default",
      })
      return
    }
    
    try {
      // Check if product is already in cart
      const { data: existingItem } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', params.id)
        .single()
        
      if (existingItem) {
        // Update quantity
        await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + quantity })
          .eq('id', existingItem.id)
      } else {
        // Add new item
        await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: params.id,
            quantity: quantity,
            price: product.discount_price || product.price
          })
      }
      
      toast({
        title: "Produto adicionado",
        description: `${quantity} ${quantity > 1 ? 'unidades' : 'unidade'} adicionada ao carrinho.`,
      })
    } catch (error) {
      console.error('Error adding to cart:', error)
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao adicionar o produto ao carrinho.",
        variant: "destructive",
      })
    }
  }

  const nextSlide = () => {
    if (!product?.images?.length) return
    setCurrentSlide((prev) => (prev + 1) % product.images.length)
  }

  const prevSlide = () => {
    if (!product?.images?.length) return
    setCurrentSlide((prev) => (prev - 1 + product.images.length) % product.images.length)
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
  
  // Calculate average rating
  const averageRating = reviews.length 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0
    
  // Calculate rating distribution
  const ratingDistribution = [5, 4, 3, 2, 1].map(stars => {
    const count = reviews.filter(review => review.rating === stars).length
    const percentage = reviews.length ? Math.round((count / reviews.length) * 100) : 0
    return { stars, percentage, count }
  })

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando produto...</p>
        </div>
      </div>
    )
  }

  if (!product) return null

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

        {sidebarExpanded && user && (
          <div className="p-4 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                {user.email.substring(0, 2).toUpperCase()}
              </div>
              <div className="ml-3">
                <p className="font-medium">{user.email}</p>
                <p className="text-xs text-gray-400">{user.role || 'Usuário'}</p>
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
            {user ? (
              <li>
                <Link
                  href="/perfil"
                  className={`flex items-center p-2 rounded-md transition-colors text-gray-300 hover:bg-gray-700 hover:text-white`}
                >
                  <User className="w-5 h-5" />
                  {sidebarExpanded && <span className="ml-3">Meu Perfil</span>}
                </Link>
              </li>
            ) : (
              <li>
                <Link
                  href="/login"
                  className={`flex items-center p-2 rounded-md transition-colors text-gray-300 hover:bg-gray-700 hover:text-white`}
                >
                  <User className="w-5 h-5" />
                  {sidebarExpanded && <span className="ml-3">Entrar</span>}
                </Link>
              </li>
            )}
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
              {user ? (
                <Link href="/perfil">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-bold cursor-pointer">
                    {user.email.substring(0, 2).toUpperCase()}
                  </div>
                </Link>
              ) : (
                <Link href="/login">
                  <Button variant="ghost" size="sm">Entrar</Button>
                </Link>
              )}
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
                  {product.category?.name || 'Produtos'}
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
                      product.images.map((image: any, index: number) => (
                        <div key={image.id} className="min-w-full">
                          <div className="aspect-square bg-gray-200 flex items-center justify-center rounded-lg">
                            {image.image_url ? (
                              <img 
                                src={image.image_url || "/placeholder.svg"} 
                                alt={image.alt_text || product.name} 
                                className="w-full h-full object-cover rounded-lg"
                              />
                            ) : (
                              <Package className="w-24 h-24 text-gray-300" />
                            )}
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
                    {product.images.map((image: any, index: number) => (
                      <button
                        key={image.id}
                        className={`flex-none w-20 h-20 rounded-md overflow-hidden border-2 ${
                          index === currentSlide ? "border-primary" : "border-transparent"
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      >
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                          {image.image_url ? (
                            <img 
                              src={image.image_url || "/placeholder.svg"} 
                              alt={image.alt_text || `Thumbnail ${index + 1}`} 
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Package className="w-8 h-8 text-gray-300" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                )}

                {/* Product sustainability info */}
                {product.sustainability && product.sustainability.length > 0 && (
                  <div className="mt-6 bg-green-50 p-4 rounded-lg">
                    <h3 className="flex items-center text-green-800 font-medium mb-2">
                      <Leaf className="w-5 h-5 mr-2" />
                      Impacto Ambiental Reduzido
                    </h3>
                    <div className="space-y-2 text-sm">
                      {product.sustainability.map((item: any) => (
                        <div key={item.id} className="flex items-start">
                          <RecycleIcon className="w-4 h-4 text-green-600 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <span className="font-medium">{item.name}:</span> {item.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-2">
                  {product.badges && product.badges.map((badge: any) => (
                    <Badge key={badge.id} className={badge.color}>
                      {badge.name}
                    </Badge>
                  ))}
                </div>

                <h1 className="text-3xl font-bold text-dark mb-2">{product.name}</h1>

                <div className="flex items-center mb-4">
                  <div className="flex mr-2">{renderStars(averageRating)}</div>
                  <span className="text-dark/70">
                    {averageRating.toFixed(1)} ({reviews.length} avaliações)
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
                  </span\
