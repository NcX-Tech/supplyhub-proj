import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Refresh session if expired - required for Server Components
  const {
    data: { session },
  } = await supabase.auth.getSession()

  // Rotas protegidas (requer autenticação)
  const protectedRoutes = ["/produtos", "/produto", "/perfil", "/admin"]
  const isProtectedRoute = protectedRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Rotas administrativas (requer admin)
  const adminRoutes = ["/admin"]
  const isAdminRoute = adminRoutes.some((route) => req.nextUrl.pathname.startsWith(route))

  // Se não há sessão em rota protegida, redirecionar para login
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL("/login", req.url))
  }

  // Para rotas administrativas, verificar se é admin
  if (isAdminRoute && session) {
    try {
      // Buscar perfil do usuário
      const { data: userProfile } = await supabase.from("users").select("user_type").eq("id", session.user.id).single()

      // Verificar se é admin
      const isAdmin = userProfile?.user_type === "admin" || session.user.email === "admin@admin.com"

      if (!isAdmin) {
        return NextResponse.redirect(new URL("/", req.url))
      }
    } catch (error) {
      console.error("Erro ao verificar permissões de admin:", error)
      return NextResponse.redirect(new URL("/", req.url))
    }
  }

  // Usuários autenticados não devem acessar login/registro
  if (session && (req.nextUrl.pathname === "/login" || req.nextUrl.pathname === "/registro")) {
    return NextResponse.redirect(new URL("/", req.url))
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
}
