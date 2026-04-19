'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import Script from 'next/script'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState<any[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '', name_en: '', price: '', category: 'Scarves', // ნაგულისხმევი კატეგორია
    image_url: '', images_list: '', description: '', description_en: ''
  })

  useEffect(() => {
    if (isAuthorized) fetchProducts()
  }, [isAuthorized])

  async function fetchProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    if (data) setProducts(data)
  }

  const openWidget = (target: 'main' | 'list') => {
    // @ts-ignore
    if (window.cloudinary) {
      // @ts-ignore
      const widget = window.cloudinary.createUploadWidget(
        { cloudName: 'dmcabui00', uploadPreset: 'elementi_preset' },
        (error: any, result: any) => {
          if (!error && result && result.event === "success") {
            if (target === 'main') {
              setFormData(prev => ({ ...prev, image_url: result.info.secure_url }));
            } else {
              setFormData(prev => ({ 
                ...prev, 
                images_list: prev.images_list ? `${prev.images_list}, ${result.info.secure_url}` : result.info.secure_url 
              }));
            }
          }
        }
      );
      widget.open();
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const payload = { 
      ...formData, 
      price: parseFloat(formData.price),
      images_list: formData.images_list ? formData.images_list.split(',').map(s => s.trim()).filter(s => s !== '') : []
    }

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId)
      setEditingId(null)
    } else {
      await supabase.from('products').insert([payload])
    }
    
    alert('წარმატებით შესრულდა!')
    setFormData({ name: '', name_en: '', price: '', category: 'Scarves', image_url: '', images_list: '', description: '', description_en: '' })
    fetchProducts()
    setLoading(false)
  }

  const handleEdit = (p: any) => {
    setEditingId(p.id)
    setFormData({
      name: p.name, name_en: p.name_en || '', price: p.price.toString(),
      category: p.category || 'Scarves', image_url: p.image_url || '',
      images_list: p.images_list ? p.images_list.join(', ') : '',
      description: p.description || '', description_en: p.description_en || ''
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id: string) => {
    const proceed = window.confirm('ნამდვილად გსურთ ამ პროდუქტის წაშლა?');
    if (proceed) {
      // მომენტალური გაქრობა ეკრანიდან (Optimistic Update)
      setProducts(prev => prev.filter(p => p.id !== id));

      try {
        const { error } = await supabase.from('products').delete().eq('id', id);
        if (error) throw error;
        alert('წაშლილია!');
      } catch (error: any) {
        alert('შეცდომა ბაზასთან: ' + error.message);
        fetchProducts(); // თუ ბაზაში არ წაიშალა, სია თავიდან წამოვიღოთ
      }
    }
  }

  if (!isAuthorized) {
    return (
      <div className="h-screen bg-black flex items-center justify-center p-6 text-white">
        <div className="bg-[#1a1a1a] p-10 border border-[#b11e1e]/30 max-w-sm w-full shadow-2xl">
          <h1 className="text-[#b11e1e] mb-6 tracking-widest uppercase text-center font-bold font-serif italic text-2xl text-white">Elementi Admin</h1>
          <input type="password" placeholder="პაროლი" className="bg-black border border-white/10 p-3 text-white mb-4 w-full outline-none focus:border-[#b11e1e] text-sm" onChange={(e) => setPassword(e.target.value)} />
          <button onClick={() => password === 'elementi2024' && setIsAuthorized(true)} className="w-full bg-[#b11e1e] text-white font-bold py-4 uppercase text-[10px] tracking-widest">შესვლა</button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white p-4 md:p-10 font-sans tracking-tight">
      <Script src="https://upload-widget.cloudinary.com/global/all.js" strategy="beforeInteractive" />

      <div className="max-w-4xl mx-auto space-y-10 text-white">
        <div className="bg-[#1a1a1a] p-8 border border-white/5 shadow-2xl">
          <h2 className="text-[#b11e1e] text-xl mb-10 tracking-[0.3em] uppercase font-bold text-center italic font-serif">
            {editingId ? 'რედაქტირება' : 'ახალი პროდუქტის დამატება'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/40 tracking-widest">სახელი (KA)</label>
                <input className="bg-black border border-white/10 p-4 w-full outline-none focus:border-[#b11e1e] text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/40 tracking-widest text-white">Name (EN)</label>
                <input className="bg-black border border-white/10 p-4 w-full outline-none focus:border-[#b11e1e] text-white" value={formData.name_en} onChange={e => setFormData({...formData, name_en: e.target.value})} required />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/40 tracking-widest text-white">ფასი (₾)</label>
                <input type="number" className="bg-black border border-white/10 p-4 w-full outline-none focus:border-[#b11e1e] text-white" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} required />
              </div>
              
              {/* --- კატეგორიების არჩევანი --- */}
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/40 tracking-widest text-white">კატეგორია</label>
                <select 
                  className="bg-black border border-white/10 p-4 w-full outline-none focus:border-[#b11e1e] text-white h-[58px]"
                  value={formData.category}
                  onChange={e => setFormData({...formData, category: e.target.value})}
                >
                  <option value="Scarves">შარფები</option>
                  <option value="Accessories">აქსესუარები</option>
                  <option value="New Arrival">ახალი კოლექცია</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-white">
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/40 tracking-widest text-white">აღწერა (KA)</label>
                <textarea className="bg-black border border-white/10 p-4 w-full h-32 outline-none focus:border-[#b11e1e] text-white" value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] uppercase text-white/40 tracking-widest text-white">Description (EN)</label>
                <textarea className="bg-black border border-white/10 p-4 w-full h-32 outline-none focus:border-[#b11e1e] text-white" value={formData.description_en} onChange={e => setFormData({...formData, description_en: e.target.value})} />
              </div>
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase text-white/40 tracking-widest block text-white">მთავარი ფოტო/ვიდეო</label>
              {formData.image_url ? (
                <div className="relative w-full aspect-video bg-black border border-[#b11e1e]/30 overflow-hidden">
                   <img src={formData.image_url} className="w-full h-full object-contain" alt="" />
                   <button type="button" onClick={() => setFormData({...formData, image_url: ''})} className="absolute top-2 right-2 bg-red-600 p-2 text-xs uppercase font-bold text-white">წაშლა</button>
                </div>
              ) : (
                <button type="button" onClick={() => openWidget('main')} className="w-full bg-white/5 border border-dashed border-white/20 p-12 text-[10px] uppercase tracking-widest hover:bg-white/10 transition-all flex flex-col items-center gap-3 text-white">
                  <span className="text-2xl opacity-50">📷</span>
                  მთავარი ფოტოს არჩევა
                </button>
              )}
            </div>

            <div className="space-y-4">
              <label className="text-[10px] uppercase text-white/40 tracking-widest block text-white">გალერეა</label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {formData.images_list.split(',').filter(u => u.trim()).map((url, i) => (
                  <div key={i} className="aspect-square bg-black border border-white/10 relative">
                    <img src={url.trim()} className="w-full h-full object-cover" alt="" />
                  </div>
                ))}
                <button type="button" onClick={() => openWidget('list')} className="aspect-square bg-white/5 border border-dashed border-white/10 flex items-center justify-center text-xl hover:bg-white/10 text-white">+</button>
              </div>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#b11e1e] text-white font-bold py-5 uppercase tracking-[0.4em] text-xs hover:bg-[#8e1818] transition-all">
              {loading ? 'მიმდინარეობს...' : editingId ? 'მონაცემების განახლება' : 'პროდუქტის გამოქვეყნება'}
            </button>
          </form>
        </div>

        <div className="bg-[#1a1a1a] border border-white/5 overflow-hidden shadow-2xl">
          <table className="w-full text-left text-sm">
            <thead className="bg-black text-[#b11e1e] uppercase text-[9px] tracking-widest font-bold border-b border-white/5">
              <tr>
                <th className="p-6">მედია</th>
                <th className="p-6">სახელი / კატეგორია</th>
                <th className="p-6 text-right">მოქმედება</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="p-6">
                    <img src={p.image_url} className="w-14 h-14 object-cover border border-white/10" alt="" />
                  </td>
                  <td className="p-6 text-white">
                    <div className="font-serif italic text-base mb-1">{p.name}</div>
                    <div className="flex gap-2 items-center">
                      <span className="text-[#b11e1e] font-bold">{p.price} ₾</span>
                      <span className="text-[9px] uppercase tracking-widest text-white/30 border border-white/10 px-2 py-0.5 rounded">
                        {p.category}
                      </span>
                    </div>
                  </td>
                  <td className="p-6 text-right space-x-3">
                    <button onClick={() => handleEdit(p)} className="text-white/50 hover:text-white uppercase text-[10px] font-bold transition-colors">რედაქტირება</button>
                    <button 
                      onClick={() => handleDelete(p.id)} 
                      className="bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white uppercase text-[10px] font-bold py-2 px-4 rounded border border-red-600/20 transition-all duration-200"
                    >
                      წაშლა
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}