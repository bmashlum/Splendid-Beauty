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
        let ticking = false
        const handleScroll = () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const isScrolled = window.scrollY > 10
                    setScrolled(isScrolled)
                    ticking = false
                })
                ticking = true
            }
        }
        window.addEventListener('scroll', handleScroll, { passive: true })
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    return (
        <>
            <Navbar scrolled={scrolled} />
            {children}
        </>
    )
} 