import { z } from 'zod'

export const loginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const signupSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters long'),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  // roles are super admin, admin, user, seller, delivery partner. 
  // Normally new signups might default to 'user' or choose between 'user' / 'seller' / 'delivery partner'
  // Admin roles shouldn't be selectable on open signups.
  role: z.enum(['user', 'seller', 'delivery partner']).default('user'),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
