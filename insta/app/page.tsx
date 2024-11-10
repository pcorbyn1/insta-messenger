import { LoginPage } from "@/components/login-page"
import { SignUpPage } from "@/components/signup-page"
import { MessagePage } from "@/components/message-page"

export default function Page({ params }: { params: { slug?: string[] } }) {
  const path = params.slug?.[0] || ''

  switch (path) {
    case 'signup':
      return <SignUpPage />
    case 'message':
      return <MessagePage />
    default:
      return <LoginPage />
  }
}