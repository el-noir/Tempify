import type React from 'react'

import {Toaster} from "@/components/ui/sonner"

export default function AuthLayout({children}: {children: React.ReactNode}){
    return (
        <div className='min-h-screen'>
            {children}
            <Toaster />
        </div>
    )
}