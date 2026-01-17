import { createBrowserClient } from '@supabase/ssr'

export const createClient = () =>
  createBrowserClient(
    "https://tdzuzmnvghvbnmbqwgra.supabase.co", // Ton URL ici entre guillemets
    "sb_publishable_HwZ8hdtXFZ3GVu8gTOR6Ng_2aXVYoWI" // Ta clé ANON ici entre guillemets
  )
