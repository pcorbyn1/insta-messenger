'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Send } from 'lucide-react'

export function MessagePage() {
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [suggestions, setSuggestions] = useState([])
  const router = useRouter()

  useEffect(() => {
    const checkSession = async () => {
      const token = localStorage.getItem('token')
      if (!token) {
        router.push('/')
        return
      }
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'checkSession', token }),
      })
      const data = await response.json()
      if (!data.success) {
        router.push('/')
      } else {
        setIsLoading(false)
      }
    }
    checkSession()
  }, [router])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    const token = localStorage.getItem('token')
    if (!token) {
      alert('You must be logged in to send messages')
      return
    }
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'sendMessage', 
        from: token.split('_')[1], // This is a simplification. In a real app, you'd decode the token properly.
        to: recipient, 
        content: message 
      }),
    })
    const data = await response.json()
    if (data.success) {
      alert(`Message sent to ${recipient}: ${message}`)
      setMessage('')
    } else {
      alert('Failed to send message')
    }
  }

  const handleRecipientChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setRecipient(value)
    if (value.length > 1) {
      const response = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'searchUsers', searchTerm: value }),
      })
      const data = await response.json()
      if (data.success) {
        setSuggestions(data.users)
      }
    } else {
      setSuggestions([])
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/')
  }

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
      <div className="text-white text-2xl">Loading...</div>
    </div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center">
            <User className="h-12 w-12 text-pink-500 mr-2" />
            <h1 className="text-3xl font-bold text-gray-800">Send a Message</h1>
          </div>
          <Button variant="outline" onClick={handleLogout} className="text-pink-500 hover:text-pink-600">
            Logout
          </Button>
        </div>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">Recipient</Label>
            <Input
              id="recipient"
              type="text"
              placeholder="Enter recipient's username"
              value={recipient}
              onChange={handleRecipientChange}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
              required
            />
            {suggestions.length > 0 && (
              <ul className="mt-1 bg-white border border-gray-300 rounded-md shadow-sm">
                {suggestions.map((user: { id: string; username: string }) => (
                  <li
                    key={user.id}
                    className="px-3 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setRecipient(user.username)
                      setSuggestions([])
                    }}
                  >
                    {user?.username}
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div>
            <Label htmlFor="message" className="text-sm font-medium text-gray-700">Message</Label>
            <Input
              id="message"
              type="text"
              placeholder="Type your message here"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
              required
            />
          </div>
          <Button type="submit" className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center">
            <Send className="h-5 w-5 mr-2" />
            Send Message
          </Button>
        </form>
      </div>
    </div>
  )
}