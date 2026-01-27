import { SignJWT, jwtVerify, JWTPayload } from 'jose'
import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

const secretKey = process.env.JWT_SECRET
if (!secretKey) {
  throw new Error('JWT_SECRET environment variable is required')
}
const key = new TextEncoder().encode(secretKey)

interface SessionPayload extends JWTPayload {
  user: {
    id: string
    email: string
    name: string
    role: 'agent' | 'admin'
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

// Agent login
export async function loginAgent(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Email and password required' }
  }

  try {
    const user = await prisma.users.findFirst({
      where: { email, role: 'agent' }
    })

    if (!user) {
      return { success: false, error: 'Invalid credentials' }
    }

    if (user.status !== 'active') {
      return { success: false, error: 'Account is not active' }
    }

    const isValid = await bcrypt.compare(password, user.hashed_password)
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Get profile name
    const profile = await prisma.profiles.findUnique({
      where: { id: user.id },
      select: { full_name: true }
    })

    // Create session
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: profile?.full_name || 'Agent',
      role: 'agent' as const,
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ user: sessionUser, expires })

    const cookieStore = await cookies()
    cookieStore.set('session', session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    })

    return { success: true }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Login failed' }
  }
}

// Admin login
export async function loginAdmin(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { success: false, error: 'Email and password required' }
  }

  try {
    const user = await prisma.users.findFirst({
      where: { email, role: 'admin' }
    })

    if (!user) {
      return { success: false, error: 'Invalid credentials' }
    }

    if (user.status !== 'active') {
      return { success: false, error: 'Account is not active' }
    }

    const isValid = await bcrypt.compare(password, user.hashed_password)
    if (!isValid) {
      return { success: false, error: 'Invalid credentials' }
    }

    // Create session
    const sessionUser = {
      id: user.id,
      email: user.email,
      name: 'Admin',
      role: 'admin' as const,
    }

    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
    const session = await encrypt({ user: sessionUser, expires })

    const cookieStore = await cookies()
    cookieStore.set('admin_session', session, {
      expires,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/admin'
    })

    return { success: true }
  } catch (error) {
    console.error('Admin login error:', error)
    return { success: false, error: 'Login failed' }
  }
}

export async function logout() {
  const cookieStore = await cookies()
  cookieStore.set('session', '', { expires: new Date(0) })
}

export async function logoutAdmin() {
  const cookieStore = await cookies()
  cookieStore.set('admin_session', '', { expires: new Date(0) })
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

export async function getAdminSession() {
  const cookieStore = await cookies()
  const session = cookieStore.get('admin_session')?.value
  if (!session) return null
  try {
    const payload = await decrypt(session)
    return payload.user.role === 'admin' ? payload : null
  } catch {
    return null
  }
}

export async function updateSession(request: NextRequest) {
  const session = request.cookies.get('session')?.value
  if (!session) return

  const parsed = await decrypt(session)
  parsed.expires = new Date(Date.now() + 24 * 60 * 60 * 1000)
  const res = NextResponse.next()
  res.cookies.set({
    name: 'session',
    value: await encrypt(parsed),
    httpOnly: true,
    expires: parsed.expires as Date,
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
    role: session.user.role,
  }
}

export async function verifyAdminSession() {
  const session = await getAdminSession()
  if (!session || !session.user || session.user.role !== 'admin') {
    return { isAuth: false, userId: null }
  }
  return {
    isAuth: true,
    userId: session.user.id,
  }
}
