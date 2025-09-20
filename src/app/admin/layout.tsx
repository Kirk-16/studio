'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Home, Users, Calendar, Settings, LogOut, LayoutGrid } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutGrid },
    { href: '/admin/scholars', label: 'Scholars', icon: Users },
    { href: '/admin/events', label: 'Events', icon: Calendar },
  ];

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Logo className="w-8 h-8" />
            <span className="text-lg font-semibold">BS Scholars</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href} legacyBehavior passHref>
                  <SidebarMenuButton
                    isActive={pathname === item.href}
                    tooltip={item.label}
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <Link href="/" legacyBehavior passHref>
             <SidebarMenuButton tooltip="Back to Home">
                <Home />
                <span>Back to Home</span>
              </SidebarMenuButton>
           </Link>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b h-16 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger/>
            <div className="flex items-center gap-4">
                <p className="font-semibold">Admin Panel</p>
                <Avatar className="h-9 w-9">
                  <AvatarImage src="https://picsum.photos/seed/admin/100/100" alt="Admin" data-ai-hint="person face" />
                  <AvatarFallback>A</AvatarFallback>
                </Avatar>
            </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
