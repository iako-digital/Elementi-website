'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { supabase, Product, MESSENGER_LINK } from '../lib/supabase'
import { useLanguage } from '../lib/LanguageContext'
import { translations } from '../lib/translations'
import ProductCard from './ProductCard'
import QuickPinchZoom, { make3dTransformValue } from 'react-quick-pinch-zoom'

export default function ProductGrid() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]) // გაფილტრული სია
  const [activeCategory, setActiveCategory] = useState('All') // აქტიური ფილტრი
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const { lang } = useLanguage()
  const t = translations[lang]

  const pinchZoomRefs = useRef<(any | null)[]>([]);
  
  const onTransform = useCallback((refIndex: number, { x, y, scale }: any) => {
    const imgRef = pinchZoomRefs.current[refIndex];
    if (imgRef) {
      const value = make3dTransformValue({ x, y, scale });
      imgRef.style.transform = value;
    }
  }, []);

  useEffect(() => {
    async function getProducts() {
      const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
      if (data) {
        setProducts(data)
        setFilteredProducts(data)
      }
    }
    getProducts()
  }, [])

  // ფილტრაციის ლოგიკა
  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(products)
    } else {
      setFilteredProducts(products.filter(p => p.category === activeCategory))
    }
  }, [activeCategory, products])

  const handleShare = (product: Product) => {
    const shareData = {
      title: lang === 'en' ? product.name_en : product.name,
      text: `ELEMENTI - ${lang === 'en' ? product.name_en : product.name}`,
      url: window.location.href,
    }

    if (navigator.share) {
      navigator.share(shareData).catch(console.error)
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert(lang === 'en' ? 'Link copied!' : 'ლინკი დაკოპირებულია!')
    }
  }

  // კატეგორიების სია
  const categories = [
    { id: 'All', ka: 'ყველა', en: 'All' },
    { id: 'Scarves', ka: 'შარფები', en: 'Scarves' },
    { id: 'Accessories', ka: 'აქსესუარები', en: 'Accessories' },
    { id: 'New Arrival', ka: 'ახალი კოლექცია', en: 'New Arrival' }
  ]

  return (
    <section id="products" className="py-20 px-6 md:px-10 bg-[#0c0c0c]">
      <div className="max-w-7xl mx-auto">
        <h2 className="font-serif text-4xl mb-10 text-center text-white italic tracking-widest uppercase">
          {t.collection_title}
        </h2>

        {/* --- კატეგორიების ფილტრი --- */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-6 py-2 text-[10px] uppercase tracking-[0.2em] transition-all duration-300 border ${
                activeCategory === cat.id 
                ? 'bg-[#b11e1e] border-[#b11e1e] text-white' 
                : 'border-white/10 text-white/40 hover:border-white/30 hover:text-white'
              }`}
            >
              {lang === 'en' ? cat.en : cat.ka}
            </button>
          ))}
        </div>
        
        {/* პროდუქტების ბადე */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} onClick={() => setSelectedProduct(p)} />
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <p className="text-center text-white/20 uppercase text-xs tracking-widest py-20">
            {lang === 'en' ? 'No products found in this category' : 'ამ კატეგორიაში პროდუქტები არ მოიძებნა'}
          </p>
        )}
      </div>

      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-10">
          <div className="absolute inset-0 bg-black/95" onClick={() => setSelectedProduct(null)} />
          
          <div className="relative bg-[#161616] w-full max-w-5xl max-h-[90vh] overflow-y-auto border border-white/10 flex flex-col md:flex-row shadow-2xl">
            <button 
              onClick={() => setSelectedProduct(null)}
              className="absolute top-5 right-5 z-20 text-white/50 hover:text-white text-2xl transition-colors bg-black/50 p-2 rounded-full"
            >✕</button>

            <div className="w-full md:w-2/3 p-4 space-y-4 bg-black/20 text-white overflow-hidden">
              <div className="text-center text-white/30 text-[9px] uppercase tracking-widest mb-4">
                {lang === 'en' ? 'Double tap/click to zoom' : 'დააჭირეთ ორჯერ დაზუმებისთვის'}
              </div>
              
              {[selectedProduct.image_url, ...(selectedProduct.images_list || [])]
                .filter(url => url && url.trim() !== "")
                .map((url, i) => (
                <div key={i} className="w-full bg-[#1a1a1a] min-h-[300px] flex items-center justify-center overflow-hidden">
                  {url?.toLowerCase().includes('.mp4') ? (
                    <video 
                      src={url} 
                      autoPlay 
                      loop 
                      muted 
                      playsInline 
                      className="w-full h-auto" 
                    />
                  ) : (
                    <QuickPinchZoom
                      onTransform={(args) => onTransform(i, args)}
                      draggableUnZoomed={false}
                    >
                      <img 
                        ref={(el) => (pinchZoomRefs.current[i] = el)}
                        src={url} 
                        alt="" 
                        className="w-full h-auto object-contain cursor-zoom-in"
                        loading="lazy"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://via.placeholder.com/800x1000/161616/b11e1e?text=IMAGE+LOADING+ERROR';
                        }}
                      />
                    </QuickPinchZoom>
                  )}
                </div>
              ))}
            </div>

            <div className="w-full md:w-1/3 p-8 md:p-12 sticky top-0 h-fit bg-[#161616]">
              <div className="mb-2">
                 <span className="text-[10px] uppercase tracking-[0.3em] text-[#b11e1e] font-bold">
                   {selectedProduct.category}
                 </span>
              </div>
              <h2 className="font-serif text-3xl mb-4 text-white uppercase tracking-widest leading-tight">
                {lang === 'en' ? (selectedProduct.name_en || selectedProduct.name) : selectedProduct.name}
              </h2>

              {(selectedProduct as any).description && (
                <p className="text-white/60 text-sm mb-6 leading-relaxed font-light">
                  {lang === 'en' ? (selectedProduct as any).description_en : (selectedProduct as any).description}
                </p>
              )}

              <p className="text-[#b11e1e] text-3xl font-bold mb-8 tracking-tighter">
                {selectedProduct.price} ₾
              </p>
              
              <div className="space-y-4">
                <div className="h-[1px] bg-white/10 w-full mb-6" />
                
                <a 
                  href={MESSENGER_LINK} 
                  target="_blank" 
                  rel="noreferrer"
                  className="block w-full bg-[#b11e1e] text-white text-center py-5 font-bold tracking-[0.2em] uppercase hover:bg-[#8e1818] transition-all duration-300 shadow-lg shadow-[#b11e1e]/10"
                >
                  {t.order_now}
                </a>

                <button 
                  onClick={() => handleShare(selectedProduct)}
                  className="w-full border border-white/10 text-white/50 py-3 text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path><polyline points="16 6 12 2 8 6"></polyline><line x1="12" y1="2" x2="12" y2="15"></line></svg>
                  {lang === 'en' ? 'Share' : 'გაზიარება'}
                </button>

                <div className="pt-8 text-center md:text-left">
                  <p className="text-white/40 text-[9px] leading-loose uppercase tracking-[0.3em]">
                    Premium Quality Material<br/>
                    Authentic Georgian Design<br/>
                    Elementi Exclusive Collection
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}