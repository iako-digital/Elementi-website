import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Product = {
  id: string
  name: string
  price: number
  category: string
  image_url: string
  description?: string
  created_at: string
}

export const CATEGORIES = [
  'All',
  'Scarves',
  'Accessories',
  'Collars',
  'Aprons',
  'Sets',
  'Custom Prints',
]

export const PRODUCT_CATEGORIES = CATEGORIES.slice(1)

// ბრენდის საკონტაქტო ლინკები
export const MESSENGER_LINK = 'https://m.me/955474514317799'
export const FACEBOOK_LINK  = 'https://www.facebook.com/profile.php?id=61587345721020'
export const INSTAGRAM_LINK = 'https://www.instagram.com/elementi.ge/'
export const PHONE          = '+995 551 872 888'
export const EMAIL          = 'elementi.ge@gmail.com'