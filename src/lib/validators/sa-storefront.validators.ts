import { z } from 'zod'

export const saHeroSlideSchema = z.object({
  imageUrl: z.string().min(1, 'Select an image from the Media Library'),
  mobileImageUrl: z.string().optional(),
  headline: z.string().min(3, 'Min 3 characters').max(80, 'Max 80 characters'),
  subheadline: z.string().max(140, 'Max 140 characters'),
  ctaText: z.string().min(2, 'Min 2 characters').max(30, 'Max 30 characters'),
  ctaLink: z.string().min(1, 'Link is required'),
  scheduledStart: z.string().optional(),
  scheduledEnd: z.string().optional(),
}).refine(d => !d.scheduledStart || !d.scheduledEnd || new Date(d.scheduledStart) < new Date(d.scheduledEnd), {
  message: 'Start date must be before end date',
  path: ['scheduledEnd'],
})

export const saAnnouncementBarSchema = z.object({
  message: z.string().min(5, 'Min 5 characters').max(150, 'Max 150 characters'),
  linkText: z.string().max(30, 'Max 30 characters').optional(),
  linkUrl: z.string().optional(),
  backgroundColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color (e.g. #FF7A00)'),
  textColor: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Must be a valid hex color'),
  dismissible: z.boolean(),
  displayPages: z.union([z.literal('all'), z.literal('homepage_only')]),
})

export const saStaticPageSchema = z.object({
  title: z.string().min(3, 'Min 3 characters').max(100, 'Max 100 characters'),
  contentMarkdown: z.string().min(20, 'Min 20 characters of content required'),
  versionNote: z.string().min(5, 'Describe what changed (min 5 chars)').max(200, 'Max 200 characters'),
})

export const saShippingZoneSchema = z.object({
  name: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
  states: z.array(z.string()).min(1, 'Select at least one state'),
  baseRate: z.coerce.number().min(0, 'Cannot be negative'),
  perKgRate: z.coerce.number().min(0, 'Cannot be negative'),
  freeShippingThreshold: z.coerce.number().min(0, 'Cannot be negative'),
  estimatedDaysMin: z.coerce.number().min(1, 'Minimum 1 day'),
  estimatedDaysMax: z.coerce.number().min(1, 'Minimum 1 day'),
}).refine(d => d.estimatedDaysMax >= d.estimatedDaysMin, {
  message: 'Max days must be ≥ min days',
  path: ['estimatedDaysMax'],
})

export const saSEOConfigSchema = z.object({
  metaTitleTemplate: z.string()
    .min(5, 'Min 5 characters')
    .max(70, 'Over 70 chars get truncated in search results'),
  metaDescriptionTemplate: z.string()
    .min(20, 'Min 20 characters')
    .max(160, 'Over 160 chars get truncated in search results'),
  noIndex: z.boolean(),
})

export const saNavMenuItemSchema = z.object({
  label: z.string().min(1, 'Label required').max(40, 'Max 40 characters'),
  href: z.string().min(1, 'Link required'),
  badge: z.string().max(10, 'Max 10 characters').optional(),
  isVisible: z.boolean(),
})

export const saTrendingSearchSchema = z.object({
  term: z.string().min(2, 'Min 2 characters').max(50, 'Max 50 characters'),
})

export const saPinnedProductSchema = z.object({
  searchTerm: z.string().min(1, 'Search term required'),
  productId: z.string().min(1, 'Product required'),
  productName: z.string().min(1),
  pinPosition: z.coerce.number().min(1, 'Position must be at least 1').max(10, 'Max position 10'),
})

export type SAHeroSlideInput = z.infer<typeof saHeroSlideSchema>
export type SAAnnouncementBarInput = z.infer<typeof saAnnouncementBarSchema>
export type SAStaticPageInput = z.infer<typeof saStaticPageSchema>
export type SAShippingZoneInput = z.infer<typeof saShippingZoneSchema>
export type SASEOConfigInput = z.infer<typeof saSEOConfigSchema>
