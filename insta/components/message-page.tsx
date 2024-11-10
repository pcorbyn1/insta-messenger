'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { User, Send, Eye } from 'lucide-react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export function MessagePage() {
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [suggestions, setSuggestions] = useState([])
  const [isApiInput, setIsApiInput] = useState(false)
  const [jsonInput, setJsonInput] = useState('')
  const [previewData, setPreviewData] = useState<{ recipient: string; message: string } | null> (null)
  const [error, setError] = useState('')
  const router = useRouter()

  useEffect(() => {
    // Session handling logic
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
    setError('')
    const token = localStorage.getItem('token')
    if (!token) {
      setError('You must be logged in to send messages')
      return
    }
    const messageData = previewData || { recipient, message }
    const response = await fetch('/api/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        action: 'sendMessage', 
        from: token.split('_')[1], // simplified for demo purposes
        to: messageData.recipient, 
        content: messageData.message 
      }),
    })
    const data = await response.json()
    if (data.success) {
      alert(`Message sent to ${messageData.recipient}: ${messageData.message}`)
      setMessage('')
      setRecipient('')
      setJsonInput('')
      setPreviewData(null)
    } else {
      setError(data.message || 'Failed to send message')
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
  // JSON input handling logic
  const handleJsonInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setJsonInput(e.target.value)
    try {
      const parsedData = JSON.parse(e.target.value)
      setPreviewData(parsedData)
    } catch (error) {
      setPreviewData(null)
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
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center">
              <User className="h-8 w-8 text-pink-500 mr-2" />
              <span className="text-2xl font-bold text-gray-800">Send a Message</span>
            </div>
            <Button variant="outline" onClick={handleLogout} className="text-pink-500 hover:text-pink-600">
              Logout
            </Button>
          </CardTitle>
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
                    <p><strong>Recipient:</strong> {previewData.recipient}</p>
                    <p><strong>Message:</strong> {previewData.message}</p>
                  </CardContent>
                </Card>
              )}
            </div>
          ) : (
            <form onSubmit={handleSendMessage} className="space-y-4">
              <div>
                <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">Recipient</Label>
                <Input
                  id="recipient"
                  type="text"
                  placeholder="Enter recipient's username"
                  value={recipient}
                  onChange={handleRecipientChange}
                  className="mt-1 block w-full"
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
                        {user.username}
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
                  className="mt-1 block w-full"
                  required
                />
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={handleSendMessage} className="w-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold py-2 px-4 rounded-md transition-colors duration-300 flex items-center justify-center">
            <Send className="h-5 w-5 mr-2" />
            Send Message
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}