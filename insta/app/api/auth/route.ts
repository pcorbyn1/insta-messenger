import { NextRequest, NextResponse } from 'next/server'
import { executeQuery } from '@/lib/agentQL'

export async function POST(request: NextRequest) {
  const body = await request.json()
  const { action, username, password, token, searchTerm, from, to, content } = body

  let result;

  switch (action) {
    case 'login':
      result = await executeQuery({
        query: 'login',
        variables: { username, password }
      });
      return NextResponse.json(result && 'token' in result ? { success: true, token: result.token } : { success: false, message: 'Invalid credentials' });

    case 'checkSession':
      result = await executeQuery({
        query: 'checkSession',
        variables: { token }
      });
      return NextResponse.json({ success: result ?? false });

    case 'searchUsers':
      result = await executeQuery({
        query: 'searchUsers',
        variables: { searchTerm }
      });
      return NextResponse.json({ success: true, users: result });

    case 'sendMessage':
        const userExistsResult = await executeQuery({
            query: 'checkUserExists',
            variables: { username: to }
          });
          if (!userExistsResult) {
            return NextResponse.json({ success: false, message: 'Recipient does not exist' });
          }
      result = await executeQuery({
          query: 'sendMessage',
          variables: { from, to, content }
      }) as unknown as { success: boolean; message?: string };
      return NextResponse.json({ success: result?.success ?? false, message: result?.message ?? 'Failed to send message' });

    default:
      return NextResponse.json({ success: false, message: 'Invalid action' });
  }
}