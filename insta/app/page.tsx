import LoginPage from "@/components/login-page"
import SignUpPage from "@/components/signup-page"
import MessagePage from "@/components/message-page"

export default function Page({ searchParams }: { searchParams: { page?: string } }) {
  const page = searchParams.page || 'login'

  switch (page) {
    case 'signup':
      return <SignUpPage />
    case 'message':
      return <MessagePage />
    default:
      return <LoginPage />
  }
}