import { Link, usePage } from '@inertiajs/react';
import { BookOpen, Dumbbell, Folder, LayoutGrid, Users, ClipboardList, Activity, ShieldCheck, Key, UserCog } from 'lucide-react';

import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { type NavItem } from '@/types';

import AppLogo from './app-logo';

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: Folder,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { auth } = usePage().props as any;
    const permissions = auth?.user?.permissions || [];

    const mainNavItems: NavItem[] = [
        {
            title: 'Dashboard',
            href: '/dashboard',
            icon: LayoutGrid,
        },
    ];

    // Admin/Trainer menu items
    if (permissions.includes('view clients')) {
        mainNavItems.push({
            title: 'Clientes',
            href: '/clients',
            icon: Users,
        });
    }

    if (permissions.includes('view exercises')) {
        mainNavItems.push({
            title: 'Ejercicios',
            href: '/exercises',
            icon: Dumbbell,
        });
    }

    if (permissions.includes('view routines')) {
        mainNavItems.push({
            title: 'Rutinas',
            href: '/routines',
            icon: ClipboardList,
        });
    }

    // Admin menu items - Roles and Permissions
    if (auth?.user?.roles?.includes('admin')) {
        mainNavItems.push({
            title: 'Usuarios',
            href: '/users',
            icon: UserCog,
        });
        
        mainNavItems.push({
            title: 'Roles',
            href: '/roles',
            icon: ShieldCheck,
        });
        
        mainNavItems.push({
            title: 'Permisos',
            href: '/permissions',
            icon: Key,
        });
    }

    // Client menu items
    if (permissions.includes('view own routines')) {
        mainNavItems.push({
            title: 'Mis Rutinas',
            href: '/my-routines',
            icon: ClipboardList,
        });
        
        mainNavItems.push({
            title: 'Mi Progreso',
            href: '/my-progress',
            icon: Activity,
        });
    }

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
