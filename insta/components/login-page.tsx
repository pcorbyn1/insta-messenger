'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MessageCircle, User, LogIn } from 'lucide-react'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isApiInput, setIsApiInput] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [previewData, setPreviewData] = useState<{ username: string } | null> (null)
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

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    const loginData = previewData || { username, password }
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', ...loginData }),
    })
    const data = await response.json()
    if (data.success) {
      localStorage.setItem('token', data.token)
      router.push('/message')
    } else {
      setError(data.message || 'Invalid credentials')
    }
  }

  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value)
    setError('')
    try {
      const parsedData = JSON.parse(e.target.value)
      if (typeof parsedData !== 'object' || parsedData === null) {
        throw new Error('Invalid JSON structure')
      }
      if (!parsedData.username || !parsedData.password) {
        throw new Error('JSON must include "username" and "password" fields')
      }
      setPreviewData(parsedData)
    } catch (error) {
      setPreviewData(null)
      if (e.target.value.trim() !== '') {
        setError(`Invalid JSON: ${(error as Error).message}`)
      }
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
          <CardTitle className="text-3xl font-bold text-center mb-6 text-gray-800">InstaMessage</CardTitle>
        </CardHeader>
        <CardContent>
        {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          <div className="flex items-center space-x-2 mb-4">
            <Switch
              id="api-toggle"
              checked={isApiInput}
              onChange={(e) => setIsApiInput(e.target.checked)}
            />
            <Label htmlFor="api-toggle">Use API Input</Label>
          </div>
          {isApiInput ? (
            <div className="space-y-4">
              <Textarea
                placeholder="Paste JSON here"
                value={jsonInput}
                onChange={handleJsonInputChange}
                className="min-h-[150px]"
              />
              {previewData && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Preview</CardTitle>
                  </CardHeader>
                  <CardContent>
                    
                    <p><strong>Username:</strong> {previewData.username}</p>
                    <p><strong>Password:</strong> ********</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <form onSubmit={handleLogin} className="space-y-4">
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
            </form>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleLogin} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center">
            <LogIn className="h-5 w-5 mr-2" />
            Log In
          </Button>
        </CardFooter>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Button variant="link" className="text-pink-500 hover:text-pink-600 font-semibold" onClick={() => router.push('/signup')}>
            Sign Up Now
          </Button>
        </div>
      </Card>
    </div>
  )
}