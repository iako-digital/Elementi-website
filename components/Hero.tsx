'use client'
import { motion } from 'framer-motion'
import { useLanguage } from '../lib/LanguageContext'
import { translations } from '../lib/translations'

export default function Hero() {
  const { lang } = useLanguage();
  const t = translations[lang];

  return (
    <section className="h-screen flex items-center justify-center bg-[#0c0c0c] text-center px-6">
      <div className="max-w-4xl">
        <motion.p 
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
          className="text-[#c4a882] text-xs tracking-[0.5em] uppercase mb-6"
        >
          {t.hero_subtitle}
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} 
          className="font-serif text-6xl md:text-8xl mb-10 text-white uppercase"
        >
          {t.hero_title}
        </motion.h1>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
           <a href="#products" className="border border-[#c4a882] text-[#c4a882] px-12 py-4 tracking-[0.3em] text-[10px] hover:bg-[#c4a882] hover:text-black transition-all">
             {t.explore}
           </a>
        </motion.div>
      </div>
    </section>
  )
}