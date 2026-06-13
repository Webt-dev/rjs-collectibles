import React, { useState } from "react";
import { ArrowLeft, Plus, Trash2, Star } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getPlaceholderImage } from "../data/mockCards";

export default function InventoryManager({ onBack }) {
  const { cards, updateCard, deleteCard, addCard, showToast } = useApp();
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name:'', set:'', price:'', stock:'1', image:'', grade:'', company:'PSA' });

  const saveEdit = (card, field, value) => {
    updateCard(card.id, { [field]: field==='price'||field==='stock'?Number(value):value });
  };

  const handleAdd = () => {
    const id = 'c'+Date.now();
    addCard({
      id, name: form.name||'New Card', set: form.set||'Set', number:'001',
      rarity:'Secret Rare', condition:'Mint', variant:'Holo', stock:Number(form.stock)||1,
      price:Number(form.price)||0, image:form.image, thumb:form.image, status:'active', featured:true,
      description:'PSA graded card',
      grading: form.company!=='None'? {company:form.company, grade:form.grade} : null
    });
    setShowAdd(false);
    setForm({name:'',set:'',price:'',stock:'1',image:'',grade:'',company:'PSA'});
    showToast("Card added");
  };

  return (
    <div className="py-8 px-4 max-w-7xl mx-auto bg-[#fcfbf8] dark:bg-zinc-950 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <button onClick={onBack} className="flex items-center gap-2 text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white text-sm">
          <ArrowLeft className="w-4 h-4"/> Back to Menu
        </button>
        <button onClick={()=>setShowAdd(!showAdd)} className="px-4 py-2 rounded-lg bg-gradient-to-r from-[#dc2626] to-[#c9a227] hover:from-red-600 hover:to-amber-600 text-white text-sm font-medium flex items-center gap-1.5 shadow-sm">
          <Plus className="w-4 h-4"/> Add Card
        </button>
      </div>

      {showAdd && (
        <div className="mb-6 p-4 rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm">
          <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
            <input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-sm col-span-2 text-zinc-900 dark:text-white"/>
            <input placeholder="Set" value={form.set} onChange={e=>setForm({...form,set:e.target.value})} className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-white"/>
            <input placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-sm col-span-2 text-zinc-900 dark:text-white"/>
            <select value={form.company} onChange={e=>setForm({...form,company:e.target.value})} className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-white">
              <option>PSA</option><option>Beckett</option><option>CGC</option><option>None</option>
            </select>
            <input placeholder="Grade" value={form.grade} onChange={e=>setForm({...form,grade:e.target.value})} className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-white"/>
            <input type="number" placeholder="Price" value={form.price} onChange={e=>setForm({...form,price:e.target.value})} className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-white"/>
            <input type="number" placeholder="Stock" value={form.stock} onChange={e=>setForm({...form,stock:e.target.value})} className="px-3 py-2 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded text-sm text-zinc-900 dark:text-white"/>
            <button onClick={handleAdd} className="px-4 py-2 bg-gradient-to-r from-[#dc2626] to-[#c9a227] hover:from-red-600 hover:to-amber-600 rounded text-sm font-medium text-white">Save</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
        {cards.map(card => (
          <div key={card.id} className="group relative bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-2.5 hover:border-amber-400 dark:hover:border-amber-600 hover:shadow-md transition-all">
            <div className="relative aspect-[2.5/3.5] mb-2.5 rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-800">
              <img src={card.thumb||card.image||getPlaceholderImage(card.name)} alt={card.name} className="w-full h-full object-cover"/>
              {card.grading && (
                <div className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded bg-white/90 text-[9px] font-bold text-amber-700 border border-amber-200">
                  {card.grading.company} {card.grading.grade}
                </div>
              )}
              {/* Featured Star - ALWAYS VISIBLE */}
              <button onClick={()=>{updateCard(card.id,{featured:!card.featured});showToast(card.featured?'Removed from featured':'Added to featured')}} className={`absolute top-1.5 right-11 p-1 rounded transition-all shadow-sm ${card.featured?'bg-amber-500 text-white':'bg-black/60 text-white/70 hover:bg-amber-500 hover:text-white'}`} title={card.featured?'Featured - click to remove':'Add to featured'}>
                <Star className="w-3 h-3" fill={card.featured?'currentColor':'none'}/>
              </button>
              <button onClick={()=>{deleteCard(card.id);showToast('Deleted','error')}} className="absolute top-1.5 right-1.5 p-1 rounded bg-black/60 text-white/70 hover:bg-red-500 hover:text-white transition-all shadow-sm">
                <Trash2 className="w-3 h-3"/>
              </button>
            </div>
            <input defaultValue={card.name} onBlur={e=>saveEdit(card,'name',e.target.value)} className="w-full bg-transparent text-[13px] font-medium truncate focus:outline-none focus:text-amber-600 text-zinc-900 dark:text-white"/>
            <input defaultValue={card.set} onBlur={e=>saveEdit(card,'set',e.target.value)} className="w-full bg-transparent text-[11px] text-zinc-500 dark:text-zinc-400 truncate focus:outline-none mb-1"/>
            <div className="flex justify-between items-center pt-1.5 border-t border-zinc-200 dark:border-zinc-700">
              <input type="number" defaultValue={card.price} onBlur={e=>saveEdit(card,'price',e.target.value)} className="w-16 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded px-1 py-0.5 text-xs text-zinc-900 dark:text-white"/>
              <div className="flex items-center gap-1">
                <span className={`text-[10px] px-1.5 py-0.5 rounded ${card.featured?'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400':'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-500'}`}>★</span>
                <input type="number" defaultValue={card.stock} onBlur={e=>saveEdit(card,'stock',e.target.value)} className="w-10 bg-zinc-50 dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-600 rounded px-1 py-0.5 text-xs text-center text-zinc-900 dark:text-white"/>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
