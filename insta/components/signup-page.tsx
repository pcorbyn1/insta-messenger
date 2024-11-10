'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { MessageCircle, User, LogIn } from 'lucide-react'

export function SignUpPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token')
      if (token) {
        const response = await fetch('/api/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'checkSession', token }),
        })
        const data = await response.json()
        if (data.success) {
          router.push('/message')
        }
      }
      setIsLoading(false)
    }
    checkSession()
  }, [router])

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password !== confirmPassword) {
      setError('Passwords do not match')
      return
    }

    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'signup', username, password }),
    })
    const data = await response.json()
    if (data.success) {
      localStorage.setItem('token', data.token)
      router.push('/message')
    } else {
      setError(data.error || 'Failed to sign up')
    }
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <Card className="w-full max-w-md p-8 transform hover:scale-105 transition-transform duration-300">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <MessageCircle className="h-16 w-16 text-pink-500" />
          </div>
          <CardTitle className="text-3xl font-bold text-center mb-6 text-gray-800">Sign Up for InstaMessage</CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <Label htmlFor="username" className="text-sm font-medium text-gray-700">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
            <div>
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
                required
              />
            </div>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSignup} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center">
            <User className="h-5 w-5 mr-2" />
            Sign Up
          </Button>
        </CardFooter>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Already have an account?</p>
          <Button variant="link" className="text-pink-500 hover:text-pink-600 font-semibold" onClick={() => router.push('/')}>
            Log In
          </Button>
        </div>
      </Card>
    </div>
  )
}