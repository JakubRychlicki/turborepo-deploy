'use server'

import { cookies } from 'next/headers'

export const getServerSession = async () => {
  try {
    const cookieStore = await cookies()
    const sessionToken = cookieStore.get('better-auth.session_token')?.value

    const session = await fetch(
      `${process.env.NEXT_PUBLIC_SERVER_URL}/api/auth/get-session`,
      {
        credentials: 'include',
        headers: {
          'Cookie': sessionToken ? `better-auth.session_token=${sessionToken}` : ''
        }
      }
    )
    const data = await session.json()

    return data
  } catch (error) {
    console.error(error)
    return null
  }
}
