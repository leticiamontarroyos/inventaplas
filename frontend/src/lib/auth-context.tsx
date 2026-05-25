'use client'
import { createContext, useContext, useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from './api'

interface AuthUser { name: string; role: string }
interface AuthCtx { user: AuthUser | null; login: (email: string, password: string) => Promise<void>; logout: () => void }

const AuthContext = createContext<AuthCtx>({} as AuthCtx)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const router = useRouter()

  useEffect(() => {
    const name = localStorage.getItem('user_name')
    const role = localStorage.getItem('user_role')
    if (name && role) setUser({ name, role })
  }, [])

  const login = async (email: string, password: string) => {
    const { data } = await api.post('/api/auth/login', { email, password })
    localStorage.setItem('token', data.access_token)
    localStorage.setItem('user_name', data.user_name)
    localStorage.setItem('user_role', data.user_role)
    setUser({ name: data.user_name, role: data.user_role })
    router.push('/dashboard')
  }

  const logout = () => {
    localStorage.clear()
    setUser(null)
    router.push('/login')
  }

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)