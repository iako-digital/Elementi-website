import Navbar from '../components/Navbar'
import Hero from '../components/Hero'
import ProductGrid from '../components/ProductGrid'
import MessengerChat from '../components/MessengerChat' // 1. შემოვიტანეთ მესენჯერის ღილაკი

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0c0c0c] relative">
      <Navbar />
      <Hero />
      <ProductGrid />
      
      {/* 2. მესენჯერის ღილაკი, რომელიც ეკრანის კუთხეში იქნება */}
      <MessengerChat />
    </main>
  )
}