'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { usePathname, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { MdCategory, MdClose } from 'react-icons/md';
import { RiMenu4Line } from 'react-icons/ri';
import { getMeta } from '@/store/metadata';
import { LucideShoppingBasket, SearchIcon } from 'lucide-react';
import { useCart } from '@/hooks/cart-context';
import { verifyUser } from '@/actions/auth';
import { FaShoppingCart, FaUserShield, FaRegUserCircle } from 'react-icons/fa';
import { IoLogInSharp } from "react-icons/io5";


const NavbarContent = () => {
    const { cartItemsCount } = useCart();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [role, setRole] = useState("user");
    const [profile, setProfile] = useState({ username: "none" });
    const router = useRouter();
    const pathname = usePathname();
    const metadata = getMeta();

    useEffect(() => {
        if (window !== undefined) {
            verifyUser().then((data) => {
                setIsLoggedIn(data.isAuthenticated);
                setProfile(Object(data?.user));
                setRole(Object(data?.user).role);
                localStorage.setItem('user', JSON.stringify(data?.user));
                localStorage.setItem('isLoggedIn', String(data?.isAuthenticated));
            });
        }
        setIsMenuOpen(false)
    }, [pathname]);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        router.push('/logout');
    };

    useEffect(() => {
        document.body.onclick = (e) => {
            const sidebar = document.getElementById('sidebar');
            const menuButton = document.getElementById('menu-button');
            const target = e.target as Node;
            if (!sidebar?.contains(target) && !menuButton?.contains(target)) {
                setIsMenuOpen(false);
            }
        };
        document.body.style.overflowY = isMenuOpen ? "hidden" : "auto";
    }, [isMenuOpen]);

    const navLinks = [
        { href: '/products', label: 'Products', icon: <LucideShoppingBasket /> },
        { href: '/categories', label: 'Categories', icon: <MdCategory /> },
        {
            href: isLoggedIn ? '/user' : null,
            label: isLoggedIn ? 'User' : null,
            icon: <FaRegUserCircle />,
        },
        {
            href: (isLoggedIn && role !== "user") ? '/admin' : null,
            label: (isLoggedIn && role !== "user") ? 'Admin' : null,
            icon: <FaUserShield />,
        },
        {
            href: isLoggedIn ? undefined : '/login',
            label: isLoggedIn ? 'Logout' : 'Login',
            onClick: isLoggedIn ? handleLogout : undefined,
            icon: <IoLogInSharp />,
        },
    ];

    return (
        <nav className='z-50 fixed top-0 w-full bg-primary-foreground text-secondary-foreground max-w-screen-2xl'>
            <motion.div
                initial={{ opacity: 0, y: '-10%' }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ width: "100%" }}
            >
                <div>
                    <div className="p-2 sm:p-3 sm:px-6 flex justify-between items-center">
                        <Link href={'/'}>
                            <div className="text-sm sm:text-lg md:text-2xl font-bold ml-2 md:ml-3">
                                <motion.h1 transition={{ duration: 0.2 }}>{metadata.siteTitle}</motion.h1>
                            </div>
                        </Link>
                        <div className='flex justify-center items-center'>
                            <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                            >
                                <ul className='hidden lg:flex justify-center items-center lg:gap-1'>
                                    {navLinks.map((link, index) => (
                                        link.label && (
                                            <li key={index}>
                                                {link.href ? (
                                                    <Button variant={'link'}>
                                                        <Link
                                                            href={link.href}
                                                            className={`hover:text-sidebar-foreground flex items-center ${pathname.includes(link.href) ? 'text-blue-600 dark:text-blue-300' : ''}`}
                                                        >
                                                            {link.icon && <span className="mr-2">{link.icon}</span>}
                                                            {link.label}
                                                        </Link>
                                                    </Button>
                                                ) : (
                                                    <Button variant={'secondary'} onClick={link.onClick} className="hover:text-sidebar-accent-foreground flex items-center">
                                                        {link.icon && <span className="mr-2">{link.icon}</span>}
                                                        {link.label}
                                                    </Button>
                                                )}
                                            </li>
                                        )
                                    ))}
                                </ul>
                            </motion.div>
                            <div className='ml-2 flex'>
                                <Link href={'/search'} passHref>
                                    <Button variant={'ghost'} id='menu-button'>
                                        <SearchIcon />
                                    </Button>
                                </Link>
                                <Link href={'/cart'}>
                                    <Button variant={'ghost'} id='menu-button'>
                                        <span className="relative inline-flex">
                                            <FaShoppingCart className="mr-2 dark:text-white" size={20} />
                                            {cartItemsCount > 0 && (
                                                <span className="absolute -top-3 -right-2 flex items-center justify-center w-5 h-5 rounded-full text-xs font-bold bg-red-600 text-white">
                                                    {cartItemsCount < 9 ? cartItemsCount : '9+'}
                                                </span>
                                            )}
                                        </span>
                                    </Button>
                                </Link>
                                <Button variant={'ghost'} className="lg:hidden" id='menu-button' onClick={toggleMenu}>
                                    <RiMenu4Line />
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Menu (optional) */}
                    <AnimatePresence>
                        {isMenuOpen && (
                            <>
                                {/* Background overlay */}
                                <button className="inline-block lg:hidden fixed top-0 left-0 h-screen inset-0 bg-black bg-opacity-70 backdrop-blur-sm z-50"
                                    onClick={toggleMenu}
                                >
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.3 }}
                                    ></motion.div>
                                </button>

                                {/* Sidebar */}
                                <div
                                    id="sidebar"
                                    className="lg:hidden fixed top-0 left-0 h-screen w-2/3 sm:w-1/3 bg-white dark:bg-black text-sidebar-text z-50 pt-10 transition-all duration-200"
                                >
                                    <Button variant="ghost" className="mb-4 absolute top-0 right-0 sm:right-4 sm:top-4 z-50" onClick={toggleMenu}>
                                        <MdClose />
                                    </Button>
                                    <motion.div
                                        initial={{ opacity: 0, x: '-10%' }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: '-10%' }}
                                        transition={{ duration: 0.1 }}
                                        style={{ height: "100%", width: "100%" }}
                                    >
                                        <ul className="flex flex-col space-y-8 text-center">
                                            {isLoggedIn && (
                                                <motion.li initial={{ y: -10 }} animate={{ y: 0 }}>
                                                    Hey, <span className="font-semibold">{profile?.username}</span>
                                                </motion.li>
                                            )}
                                            {navLinks.map((link, index) => (
                                                link.label && (
                                                    <motion.li key={index} initial={{ y: -10 }} animate={{ y: 0 }}>
                                                        {link.href ? (
                                                            <Button variant={`${pathname.includes(link.href) ? "default" : "outline"}`}>
                                                                <Link
                                                                    href={link.href}
                                                                >
                                                                    {link.icon && <span className="mr-2 inline-block">{link.icon}</span>}
                                                                    {link.label}
                                                                </Link>
                                                            </Button>
                                                        ) : (
                                                            <Button
                                                                variant="outline"
                                                                onClick={link.onClick}
                                                                className="hover:text-sidebar-accent-foreground"
                                                            >
                                                                {link.icon && <span className="mr-2 inline-block">{link.icon}</span>}
                                                                {link.label}
                                                            </Button>
                                                        )}
                                                    </motion.li>
                                                )
                                            ))}
                                        </ul>
                                    </motion.div>
                                </div>
                            </>
                        )}
                    </AnimatePresence>

                </div>
            </motion.div>
        </nav>
    );
};

export default NavbarContent;
