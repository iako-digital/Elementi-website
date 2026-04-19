'use client'
import { Product, MESSENGER_LINK } from '../lib/supabase'
import { useLanguage } from '../lib/LanguageContext'
import { translations } from '../lib/translations'

interface Props {
  product: Product;
  onClick: () => void;
}

export default function ProductCard({ product, onClick }: Props) {
  const { lang } = useLanguage();
  const t = translations[lang];
  const displayName = lang === 'en' && product.name_en ? product.name_en : product.name;
  const isVideo = product.image_url?.toLowerCase().endsWith('.mp4');

  return (
    <div 
      onClick={onClick}
      className="bg-[#1a1a1a] border border-white/5 group hover:border-[#b11e1e]/50 transition-all duration-500 rounded-sm overflow-hidden cursor-pointer"
    >
      <div className="aspect-[1/1] bg-[#222] relative overflow-hidden">
        {isVideo ? (
          <video src={product.image_url} autoPlay loop muted playsInline className="w-full h-full object-cover" />
        ) : (
          <img 
            src={product.image_url || 'https://via.placeholder.com/500x500?text=ELEMENTI'} 
            alt={displayName} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
          />
        )}
        <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />
      </div>
      
      <div className="p-5 text-center">
        <h3 className="font-serif text-lg mb-2 text-white/90 tracking-wide uppercase">{displayName}</h3>
        <p className="text-[#b11e1e] font-bold text-xl mb-4">{product.price} ₾</p>
        
        <button className="inline-block w-full border border-[#b11e1e] py-3 text-[10px] tracking-[0.2em] uppercase text-white group-hover:bg-[#b11e1e] transition-all duration-300">
          {t.explore}
        </button>
      </div>
    </div>
  )
}