"use client"

import { SessionProvider } from 'next-auth/react'
import React, { ReactNode } from 'react'

export default function MySassion({children}:{children:ReactNode}) {
  return <>
  
  
<SessionProvider>

  {children}


</SessionProvider>
  
  
  
  </>
}
