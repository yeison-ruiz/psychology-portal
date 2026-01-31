import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // 1. Inicializar cliente Supabase para leer cookies y verificar sesión
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          // Si la sesión se refresca, actualizamos cookies en request y response
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // 2. Obtener usuario autenticado
  const { data: { user } } = await supabase.auth.getUser()

  // 3. Reglas de Protección de Rutas
  // Si intenta entrar a /admin o /portal SIN usuario, mandar a login
  if (request.nextUrl.pathname.startsWith('/admin') || request.nextUrl.pathname.startsWith('/portal')) {
     if (!user) {
        return NextResponse.redirect(new URL('/login', request.url))
     }
  }

  // (Opcional) Si ya está logueado y va a /login, mandar a portal o admin
  if (request.nextUrl.pathname.startsWith('/login') && user) {
      if (user.email?.includes('dravillabon')) { // Lógica simple de admin
          return NextResponse.redirect(new URL('/admin', request.url))
      }
      return NextResponse.redirect(new URL('/portal', request.url))
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - extensiones de archivos (png, jpg, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
