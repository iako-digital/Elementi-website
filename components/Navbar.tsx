'use client'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { MESSENGER_LINK } from '../lib/supabase'
import { translations } from '../lib/translations'
import { useLanguage } from '../lib/LanguageContext'

export default function Navbar() {
  const { lang, setLang } = useLanguage();
  const t = translations[lang];

  return (
    <motion.header className="fixed top-0 inset-x-0 z-50 h-20 flex items-center justify-between px-10 bg-black/80 backdrop-blur-md">
      <Link href="/" className="font-serif text-2xl tracking-[0.3em] text-[#c4a882]">ELEMENTI</Link>
      
      <div className="flex items-center gap-8 text-[10px] tracking-widest uppercase text-white">
        <Link href="/#products">{t.shop}</Link>
        
        {/* გადამრთველი ღილაკი */}
        <button 
          onClick={() => setLang(lang === 'ka' ? 'en' : 'ka')}
          className="border border-[#c4a882]/30 px-3 py-1 text-[#c4a882] hover:bg-[#c4a882]/10 transition-all"
        >
          {lang === 'ka' ? 'EN' : 'KA'}
        </button>

        <a href={MESSENGER_LINK} target="_blank" className="bg-[#c4a882] text-black px-6 py-2 font-bold uppercase">
          {t.order}
        </a>
      </div>
    </motion.header>
  )
}