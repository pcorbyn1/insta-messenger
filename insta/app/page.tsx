import {LoginPage }from "@/components/login-page"
import {SignUpPage }from "@/components/signup-page"
import {MessagePage }from "@/components/message-page"

export default function Page({ params, searchParams }: { params: { slug?: string[] }, searchParams: { page?: string } }) {
  const path = params.slug?.[0] || ''
  const page = searchParams.page || ''

  if (path === 'signup' || page === 'signup') {
    return <SignUpPage />
  } else if (path === 'message' || page === 'message') {
    return <MessagePage />
  } else {
    return <LoginPage />
  }
}