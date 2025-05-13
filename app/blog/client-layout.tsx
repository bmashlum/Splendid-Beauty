'use client'

import React, { useState, useEffect } from 'react'
import Navbar from '@/components/navbar'

export default function ClientLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [scrolled, setScrolled] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            const isScrolled = window.scrollY > 10
            setScrolled(isScrolled)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <Navbar scrolled={scrolled} />
            {children}
        </>
    )
} 