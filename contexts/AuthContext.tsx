"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from "react"

type UserType = {
  id: number
  username: string
  email: string
  avatar?: string
  rank?: string
}

type AuthContextType = {
  user: UserType | null
  login: (email: string, password: string) => Promise<void>
  register: (username: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  getUser: () => Promise<void>
  isLoading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<UserType | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const getAuthHeader = () => {
    const token = localStorage.getItem('accessToken')
    return {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {})
    }
  }

  const refreshToken = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (!refreshToken) {
        throw new Error('No refresh token available')
      }

      const res = await fetch("http://localhost:8000/auth/token/refresh/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ refresh: refreshToken }),
        credentials: 'include'
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('accessToken', data.access)
        return true
      }
      return false
    } catch (err) {
      console.error("Token refresh error:", err)
      return false
    }
  }

  const getUser = async () => {
    try {
      const res = await fetch("http://localhost:8000/api/auth/user/", {
        method: "GET",
        headers: getAuthHeader(),
        credentials: 'include'
      })
      
      if (res.ok) {
        const data = await res.json()
        setUser(data)
        return true
      } else if (res.status === 401) {
        // Try to refresh token
        const refreshSuccess = await refreshToken()
        if (refreshSuccess) {
          // Retry the request with new token
          return getUser()
        }
      }
      
      // If we get here, either refresh failed or other error
      setUser(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return false
    } catch (err) {
      console.error("Failed to fetch user:", err)
      setUser(null)
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const login = async (email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8000/auth/token/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ 
          username: email,
          password: password 
        }),
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('accessToken', data.access)
        localStorage.setItem('refreshToken', data.refresh)
        await getUser()
      } else {
        const error = await res.json()
        console.error("Login response:", error)
        const errorMessage = typeof error === 'object' && error !== null 
          ? (error.detail || Object.values(error)[0] as string)
          : 'Login failed'
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error("Login error:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (username: string, email: string, password: string) => {
    setIsLoading(true)
    try {
      const res = await fetch("http://localhost:8000/api/auth/register/", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password1: password,
          password2: password,
        }),
      })

      if (res.ok) {
        const data = await res.json()
        localStorage.setItem('accessToken', data.access)
        localStorage.setItem('refreshToken', data.refresh)
        await getUser()
      } else {
        const error = await res.json()
        console.error("Register response:", error)
        const errorMessage = typeof error === 'object' && error !== null 
          ? (error.detail || Object.values(error)[0] as string)
          : 'Registration failed'
        throw new Error(errorMessage)
      }
    } catch (err) {
      console.error("Register error:", err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await fetch("http://localhost:8000/api/auth/logout/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...getAuthHeader()
          },
          body: JSON.stringify({ refresh: refreshToken }),
        })
      }
    } catch (err) {
      console.error("Logout error:", err)
    } finally {
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      setUser(null)
    }
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      getUser, 
      isLoading,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  )
}
