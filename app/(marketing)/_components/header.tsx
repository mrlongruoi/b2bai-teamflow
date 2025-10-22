'use client'
import Link from 'next/link'
import { Menu, X } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import React from 'react'
import { cn } from '@/lib/utils'
import Logo from '@/public/logo.png'
import Image from 'next/image'
import { RegisterLink, LoginLink, LogoutLink } from "@kinde-oss/kinde-auth-nextjs/components";
import { useKindeBrowserClient } from '@kinde-oss/kinde-auth-nextjs'

const menuItems = [
    { name: 'Tính Năng', href: '#link' },
    { name: 'Hướng Dẫn', href: '#link' },
    { name: 'Thanh Toán', href: '#link' },
    { name: 'Giới Thiệu', href: '#link' },
]

export const HeroHeader = () => {
    const [menuState, setMenuState] = React.useState(false)
    const [isScrolled, setIsScrolled] = React.useState(false)
    const { getUser, isLoading } = useKindeBrowserClient();
    const user = getUser();

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    return (
        <header>
            <nav
                data-state={menuState && 'active'}
                className="fixed z-20 w-full px-2">
                <div className={cn('mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', isScrolled && 'bg-background/50 max-w-4xl rounded-2xl border backdrop-blur-lg lg:px-5')}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
                        <div className="flex w-full justify-between lg:w-auto">
                            <Link
                                href="/"
                                aria-label="home"
                                className="flex items-center space-x-2">
                                <Image
                                    src={Logo}
                                    alt="Logo"
                                    width={32}
                                    height={32}
                                />
                                <h1 className="text-2xl font-bold">
                                    Process<span className='text-primary'>Flow</span>
                                </h1>
                            </Link>

                            <button
                                onClick={() => setMenuState(!menuState)}
                                aria-label={menuState == true ? 'Close Menu' : 'Open Menu'}
                                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden">
                                <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                                <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                            </button>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex gap-8 text-sm">
                                {menuItems.map((item, index) => (
                                    <li key={index}>
                                        <Link
                                            href={item.href}
                                            className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                            <span>{item.name}</span>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                            <div className="lg:hidden">
                                <ul className="space-y-6 text-base">
                                    {menuItems.map((item, index) => (
                                        <li key={index}>
                                            <Link
                                                href={item.href}
                                                className="text-muted-foreground hover:text-accent-foreground block duration-150">
                                                <span>{item.name}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {isLoading ? null : (
                                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                                    {user ? (
                                        <>
                                            <Link
                                                className={buttonVariants({
                                                    size: "sm",
                                                })}
                                                href="/workspace">
                                                <span>Trang Chủ</span>
                                            </Link>

                                            <LogoutLink
                                                className={buttonVariants({
                                                    size: "sm",
                                                    variant: "outline",
                                                })}
                                            >
                                                <span className="dark:invert-20">Đăng Xuất</span>
                                            </LogoutLink>
                                        </>
                                    ) : (
                                        <>
                                            <LoginLink
                                                className={buttonVariants({
                                                    variant: 'outline',
                                                    size: 'sm',
                                                    className: cn(isScrolled && 'lg:hidden'),
                                                })}
                                            >
                                                Đăng Nhập
                                            </LoginLink>

                                            <RegisterLink
                                                className={buttonVariants({
                                                    size: 'sm',
                                                    className: cn(isScrolled && 'lg:hidden'),
                                                })}
                                            >
                                                Đăng Ký
                                            </RegisterLink>

                                            <div className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                                <RegisterLink
                                                    className={buttonVariants({
                                                        size: 'sm',
                                                    })}
                                                >
                                                    Bắt Đầu Ngay Bây Giờ
                                                </RegisterLink>
                                            </div>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}


