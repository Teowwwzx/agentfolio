import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

const secretKey = process.env.JWT_SECRET || 'secret'
const key = new TextEncoder().encode(secretKey)

interface SessionPayload extends JWTPayload {
  user: {
    id: string
    email: string | unknown
    name: string
    role: string
  }
  expires: Date | string
}

export async function encrypt(payload: SessionPayload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(key)
}

export async function decrypt(input: string): Promise<SessionPayload> {
  const { payload } = await jwtVerify(input, key, {
    algorithms: ['HS256'],
  })
  return payload as unknown as SessionPayload
}

export async function login(formData: FormData) {
  // Verify credentials && get the user
  // For MVP, hardcoded check. In real app, check against DB users table or Neon Auth
  const email = formData.get('email')
  const password = formData.get('password')

  // Simple hardcoded check for MVP
  if (email === 'admin@example.com' && password === 'admin123') {
     // Use the seeded agent ID
     const user = { 
       id: '9a3b1d8c-1a6f-4d8f-bc7e-2b1a4c77e9f2',
       email, 
       name: 'Agent User', 
       role: 'agent' 
     }
     
     // Create the session
     const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
     const session = await encrypt({ user, expires })
    
     // Save the session in a cookie
     const cookieStore = await cookies()
     cookieStore.set('session', session, { expires, httpOnly: true })
     
     return true
  }

  if (email === 'super@example.com' && password === 'super123') {
    const user = { 
      id: '00000000-0000-0000-0000-000000000000', // Special ID for super admin
      email, 
      name: 'Super Admin', 
      role: 'super_admin' 
    }
    
    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ user, expires })
   
    // Save the session in a cookie
    const cookieStore = await cookies()
    cookieStore.set('session', session, { expires, httpOnly: true })
    
    return true
 }
  
  return false
}

export async function logout() {
  // Destroy the session
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
}

export async function getSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('session')?.value
  if (!session) return null
  try {
    return await decrypt(session)
  } catch {
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  // Refresh the session so it doesn't expire
  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires,
  })
  return res
}

export async function verifySession() {
  const session = await getSession()
  if (!session || !session.user) {
    return { isAuth: false, userId: null, role: null }
  }
  return { 
    isAuth: true, 
    userId: session.user.id, 
    role: session.user.role 
  }
}
