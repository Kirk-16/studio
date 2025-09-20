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
import { Home, Users, Calendar } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Logo } from '@/components/logo';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
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
                <SidebarMenuButton
                  asChild
                  isActive={pathname.startsWith(item.href)}
                  tooltip={item.label}
                >
                  <Link href={item.href}>
                    <item.icon />
                    <span>{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
           <SidebarMenuButton asChild tooltip="Back to Home">
             <Link href="/">
                <Home />
                <span>Back to Home</span>
              </Link>
           </SidebarMenuButton>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex items-center justify-between p-4 border-b h-16 bg-background/80 backdrop-blur-sm sticky top-0 z-10">
            <SidebarTrigger/>
            <div className="flex items-center gap-4">
                <p className="font-semibold">Admin View</p>
            </div>
        </header>
        <main className="p-4 md:p-6 lg:p-8">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
