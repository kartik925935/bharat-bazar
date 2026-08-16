import type { SAPanel } from '@/types/super-admin.types'
import {
  LayoutDashboard, Users, UserCheck, Package, ShoppingCart,
  Truck, DollarSign, FileCheck, Star, Tag, Bell,
  BarChart3, Shield, Settings, Headphones, Gift,
  UserCog, ClipboardList, Home, Megaphone, Menu,
  Image, Search, FileText, MapPin, Palette, Calendar
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export interface SANavSubItem {
  label: string
  href: string
  panel: SAPanel
}

export interface SANavItem {
  label: string
  href: string
  panel: SAPanel
  icon: LucideIcon
  badge?: 'unread' | 'pending' | string
  description: string
  subItems?: SANavSubItem[]
}

export interface SANavSection {
  title: string
  items: SANavItem[]
}

export function getSANavigation(token: string): SANavSection[] {
  return [
    {
      title: 'MAIN',
      items: [
        {
          label: 'Dashboard',
          href: `/${token}/dashboard`,
          panel: 'dashboard',
          icon: LayoutDashboard,
          description: 'Platform overview & metrics',
        },
        {
          label: 'Analytics',
          href: `/${token}/analytics`,
          panel: 'analytics',
          icon: BarChart3,
          description: 'Deep platform analytics',
        },
        {
          label: 'Notifications',
          href: `/${token}/notifications`,
          panel: 'notifications',
          icon: Bell,
          badge: 'unread',
          description: 'System alerts & notifications',
        },
      ],
    },
    {
      title: 'ADMIN MANAGEMENT',
      items: [
        {
          label: 'Admin Control',
          href: `/${token}/admin-control`,
          panel: 'admin-control',
          icon: UserCog,
          description: 'Manage sub-admins & roles',
        },
        {
          label: 'Panel Requests',
          href: `/${token}/panel-requests`,
          panel: 'panel-requests',
          icon: ClipboardList,
          badge: 'pending',
          description: 'Access requests from admins',
        },
      ],
    },
    {
      title: 'USER MANAGEMENT',
      items: [
        {
          label: 'Customers',
          href: `/${token}/customers`,
          panel: 'customers',
          icon: Users,
          description: 'Manage platform customers',
        },
        {
          label: 'Sellers',
          href: `/${token}/sellers`,
          panel: 'sellers',
          icon: UserCheck,
          description: 'Manage sellers & shops',
        },
        {
          label: 'Delivery Partners',
          href: `/${token}/delivery`,
          panel: 'delivery',
          icon: Truck,
          description: 'Manage delivery partners',
        },
        {
          label: 'KYC Verification',
          href: `/${token}/kyc-verification`,
          panel: 'kyc-verification',
          icon: FileCheck,
          description: 'Verify seller documents',
        },
      ],
    },
    {
      title: 'CATALOGUE',
      items: [
        {
          label: 'Products',
          href: `/${token}/products`,
          panel: 'products',
          icon: Package,
          description: 'Product approvals & management',
        },
        {
          label: 'Reviews',
          href: `/${token}/reviews`,
          panel: 'reviews',
          icon: Star,
          description: 'Moderate product reviews',
        },
        {
          label: 'Coupons',
          href: `/${token}/coupons`,
          panel: 'coupons',
          icon: Tag,
          description: 'Create & manage coupons',
        },
        {
          label: 'Offers',
          href: `/${token}/offers`,
          panel: 'offers',
          icon: Gift,
          description: 'Flash sales & promotions',
        },
      ],
    },
    {
      title: 'OPERATIONS',
      items: [
        {
          label: 'Orders',
          href: `/${token}/orders`,
          panel: 'orders',
          icon: ShoppingCart,
          description: 'All platform orders',
        },
        {
          label: 'Support',
          href: `/${token}/support`,
          panel: 'support',
          icon: Headphones,
          badge: 'tickets',
          description: 'Customer support tickets',
        },
      ],
    },
    {
      title: 'FINANCE & SETTLEMENTS',
      items: [
        {
          label: 'Finance',
          href: `/${token}/finance`,
          panel: 'finance',
          icon: DollarSign,
          description: 'Revenue, commissions & settlements',
          subItems: [
            { label: 'Overview', href: `/${token}/finance`, panel: 'finance' },
            { label: 'Commissions', href: `/${token}/finance/commissions`, panel: 'finance' },
            { label: 'Settlements', href: `/${token}/finance/settlements`, panel: 'finance' },
            { label: 'Payout Calendar', href: `/${token}/finance/payout-calendar`, panel: 'finance' },
          ],
        },
      ],
    },
    {
      title: 'STOREFRONT',
      items: [
        {
          label: 'Homepage Builder',
          href: `/${token}/storefront/homepage`,
          panel: 'settings',
          icon: Home,
          description: 'Manage hero, sections & layout',
        },
        {
          label: 'Announcement Bar',
          href: `/${token}/storefront/announcement`,
          panel: 'settings',
          icon: Megaphone,
          description: 'Site-wide announcement banners',
        },
        {
          label: 'Navigation & Menus',
          href: `/${token}/storefront/navigation`,
          panel: 'settings',
          icon: Menu,
          description: 'Manage nav links & mega-menu',
        },
        {
          label: 'Media Library',
          href: `/${token}/storefront/media`,
          panel: 'settings',
          icon: Image,
          description: 'Images, banners & assets',
        },
        {
          label: 'SEO Manager',
          href: `/${token}/storefront/seo`,
          panel: 'settings',
          icon: Search,
          description: 'Meta titles, descriptions & OG',
        },
        {
          label: 'Static Pages',
          href: `/${token}/storefront/pages`,
          panel: 'settings',
          icon: FileText,
          description: 'About, Terms, Privacy, etc.',
        },
        {
          label: 'Search & Merchandising',
          href: `/${token}/storefront/search`,
          panel: 'settings',
          icon: Search,
          description: 'Trending, pins & synonyms',
        },
        {
          label: 'Shipping Zones',
          href: `/${token}/storefront/shipping`,
          panel: 'settings',
          icon: MapPin,
          description: 'Delivery zones & rates',
        },
        {
          label: 'Theme & Branding',
          href: `/${token}/storefront/theme`,
          panel: 'settings',
          icon: Palette,
          description: 'Storefront colors, fonts & logo',
        },
      ],
    },
    {
      title: 'AUDIT & SECURITY',
      items: [
        {
          label: 'Audit Logs',
          href: `/${token}/audit-logs`,
          panel: 'audit-logs',
          icon: Shield,
          description: 'Full platform audit trail',
        },
      ],
    },
    {
      title: 'SYSTEM',
      items: [
        {
          label: 'Settings',
          href: `/${token}/settings`,
          panel: 'settings',
          icon: Settings,
          description: 'Platform configuration',
        },
      ],
    },
  ]
}

