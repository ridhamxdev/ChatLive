'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { MessageCircle, Users, User, Mail } from 'lucide-react';

const navigation = [
  {
    name: 'Chat',
    href: '/dashboard/chat',
    icon: MessageCircle,
  },
  {
    name: 'Invites',
    href: '/dashboard/invites',
    icon: Mail,
  },
  {
    name: 'Profile',
    href: '/dashboard/profile',
    icon: User,
  },
];

export function MainNav() {
  const pathname = usePathname();

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
        <MessageCircle className="h-6 w-6" />
        <span className="font-bold">Chat App</span>
      </Link>
      {navigation.map((item) => {
        const Icon = item.icon;
        return (
          <Button
            key={item.name}
            variant={pathname === item.href ? 'default' : 'ghost'}
            className="flex items-center space-x-2"
            asChild
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          </Button>
        );
      })}
    </nav>
  );
}
