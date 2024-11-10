'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { User, Send } from 'lucide-react'

export default function Component() {
  const [recipient, setRecipient] = useState('')
  const [message, setMessage] = useState('')

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    alert(`Message sent to ${recipient}: ${message}`)
    setMessage('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md p-8">
        <div className="flex items-center justify-center mb-6">
          <User className="h-12 w-12 text-pink-500 mr-2" />
          <h1 className="text-3xl font-bold text-gray-800">Send a Message</h1>
        </div>
        <form onSubmit={handleSendMessage} className="space-y-4">
          <div>
            <Label htmlFor="recipient" className="text-sm font-medium text-gray-700">Recipient</Label>
            <Input
              id="recipient"
              type="text"
              placeholder="Enter recipient's username"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-pink-500 focus:border-pink-500"
              required
            />
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