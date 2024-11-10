'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { MessageCircle, User } from 'lucide-react'

export default function Component() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically validate credentials
    if (username === 'demo' && password === 'password') {
      router.push('/message')
    } else {
      alert('Invalid credentials')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="bg-white p-8 rounded-lg shadow-2xl w-96 transform hover:scale-105 transition-transform duration-300">
        <div className="flex justify-center mb-6">
          <MessageCircle className="h-16 w-16 text-pink-500" />
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">InstaMessage</h1>
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
          <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300">
            Log In
          </Button>
        </form>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Don't have an account?</p>
          <Button variant="link" className="text-pink-500 hover:text-pink-600 font-semibold" onClick={() => router.push('/signup')}>
            Sign Up Now
          </Button>
        </div>
      </div>
    </div>
  )
}