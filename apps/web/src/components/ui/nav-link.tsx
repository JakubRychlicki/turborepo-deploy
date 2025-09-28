'use client';


import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NAVIGATION } from '@/config/constants';

export default function NavLink({
  href,
  exact = false,
  children,
  className = '',
  onClick,
  ...props
}: {
  href: string;
  exact?: boolean;
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
}) {
  const pathname = usePathname();

  const isActive = href === NAVIGATION.DASHBOARD
    ? pathname === NAVIGATION.DASHBOARD
    : exact
      ? pathname === href
      : pathname.startsWith(href);

  const newClassName = isActive ? `${className} active` : className;

  return (
    <Link prefetch={false} href={href} className={newClassName} onClick={onClick} {...props}>
      {children}
    </Link>
  );
}
