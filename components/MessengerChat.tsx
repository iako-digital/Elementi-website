'use client'
import { MESSENGER_LINK } from '../lib/supabase'

export default function MessengerChat() {
  return (
    <a 
      href={MESSENGER_LINK}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-8 right-8 z-[999] bg-[#b11e1e] text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 group"
      aria-label="Contact us on Messenger"
    >
      {/* მესენჯერის აიკონი */}
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.908 1.457 5.495 3.732 7.126V22l3.417-1.875c.87.24 1.794.372 2.751.372 5.523 0 10-4.145 10-9.258S17.523 2 12 2zm1.086 12.333l-2.571-2.738-5.014 2.738 5.513-5.856 2.643 2.738 4.942-2.738-5.513 5.856z"/>
      </svg>
      
      {/* პატარა ტექსტი, რომელიც ჰოვერზე გამოჩნდება (სურვილისამებრ) */}
      <span className="absolute right-full mr-3 bg-white text-black text-[10px] py-1 px-3 uppercase tracking-widest font-bold opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none border border-black/10">
        მოგვწერეთ
      </span>
    </a>
  )
}