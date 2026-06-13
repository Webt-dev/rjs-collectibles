import React, { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { useApp } from "../context/AppContext";
import { Eye, EyeOff, Trash2, Plus, Search, X, Edit3, MoreHorizontal, MessageSquare, Loader2, ChevronDown, Star } from "lucide-react";

const rarityColors = {
  "Rare Holo": "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "Ultra Rare": "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
  "Secret Rare": "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800",
  "Rare Holo V": "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800",
  "Rare Holo VMAX": "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800",
};

const GRADING_COMPANIES = ["None", "PSA", "BGS (Beckett)", "CGC", "ACE"];
const CONDITIONS = ["Mint", "Near Mint", "Light Play", "Moderate Play", "Heavy Play"];
const PAGE_SIZE = 36;

const getMarket = (c) => {
  if (!c) return 0;
  const tp = c?.tcgplayer?.prices;
  const cm = c?.cardmarket?.prices;
  if (tp) {
    for (const k of ["holofoil","normal","1stEditionHolofoil","reverseHolofoil","1stEditionNormal","unlimitedHolofoil"]) {
      if (tp[k]?.market) return tp[k].market;
      if (tp[k]?.mid) return tp[k].mid;
    }
  }
  if (cm?.averageSellPrice) return cm.averageSellPrice;
  if (cm?.trendPrice) return cm.trendPrice;
  return 0;
};

const parseNum = (n) => { const m = (n||"").match(/^(\d+)/); return m ? parseInt(m[1],10) : 9999; };

const GradingBadge = ({ grading }) => {
  if (!grading || grading.company === "None") return null;
  const label = grading.company === "BGS (Beckett)" ? "BGS" : grading.company;
  return (
    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-gradient-to-r from-red-50 to-amber-50 dark:from-red-950/30 dark:to-amber-950/30 border border-amber-200 dark:border-amber-800 rounded text-[10px] font-semibold text-amber-700 dark:text-amber-400">
      {label} {grading.grade}
    </span>
  );
};

const NoteIndicator = ({ notes }) => {
  if (!notes) return null;
  return (
    <span className="relative group">
      <MessageSquare className="w-3.5 h-3.5 text-amber-500 cursor-help" />
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1.5 px-2.5 py-1.5 bg-zinc-800 text-white text-[11px] rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-pre-wrap max-w-[200px] z-30">
        {notes}
      </span>
    </span>
  );
};

const emptyForm = { price:"", stock:"1", condition:"Near Mint", company:"None", grade:"", cert:"", notes:"" };

export default function AdminDashboard() {
  const { cards, isAdmin, updateCard, deleteCard, addCard, showToast } = useApp();

  const [showAdd, setShowAdd] = useState(false);
  const [editingCard, setEditingCard] = useState(null);
  const [sets, setSets] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedSet, setSelectedSet] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState(null);
  const [invSearch, setInvSearch] = useState("");
  const [openMenu, setOpenMenu] = useState(null);
  const [addForm, setAddForm] = useState({...emptyForm});
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);

  const abortRef = useRef(null);
  const cacheRef = useRef({});

  useEffect(() => {
    fetch("https://api.pokemontcg.io/v2/sets?orderBy=-releaseDate&pageSize=250")
      .then(r => r.json()).then(d => setSets(d.data || [])).catch(() => {});
  }, []);

  const buildQ = useCallback((s, setId) => {
    const p = [];
    if (s) {
      const c = s.trim().replace(/-/g, " ").replace(/\s+/g, " ");
      const w = c.split(" ").filter(Boolean);
      if (w.length === 1) p.push('name:"' + w[0] + '*"');
      else p.push(w.map(x => 'name:"' + x + '*"').join(" "));
    }
    if (setId) p.push("set.id:" + setId);
    return p.join(" ");
  }, []);

  const doFetch = useCallback(async (q, pg, append) => {
    const key = q + "||" + pg;
    if (!append && cacheRef.current[key]) {
      const cached = cacheRef.current[key];
      setResults(cached.data);
      setHasMore(cached.hasMore);
      setPage(pg);
      return;
    }
    if (abortRef.current) abortRef.current.abort();
    const ctrl = new AbortController();
    abortRef.current = ctrl;
    append ? setLoadingMore(true) : setLoading(true);
    try {
      const url = "https://api.pokemontcg.io/v2/cards?" + (q ? "q=" + encodeURIComponent(q) + "&" : "") + "orderBy=-set.releaseDate,number&pageSize=" + PAGE_SIZE + "&page=" + pg;
      const res = await fetch(url, { signal: ctrl.signal });
      const d = await res.json();
      const newData = d.data || [];
      const more = newData.length === PAGE_SIZE;
      if (append) {
        setResults(prev => { const combined = [...prev, ...newData]; cacheRef.current[key] = { data: combined, hasMore: more }; return combined; });
      } else {
        setResults(newData);
        cacheRef.current[key] = { data: newData, hasMore: more };
      }
      setHasMore(more);
      setPage(pg);
    } catch (e) { if (e.name !== "AbortError") console.error(e); }
    finally { setLoading(false); setLoadingMore(false); }
  }, []);

  useEffect(() => {
    if (!showAdd) return;
    const q = buildQ(search, selectedSet);
    setPage(1);
    const t = setTimeout(() => doFetch(q, 1, false), search || selectedSet ? 500 : 0);
    return () => clearTimeout(t);
  }, [search, selectedSet, showAdd, buildQ, doFetch]);

  const loadMore = () => {
    const q = buildQ(search, selectedSet);
    doFetch(q, page + 1, true);
  };

  const sortedResults = useMemo(() => {
    const a = [...results];
    switch (sortBy) {
      case "name": return a.sort((x, y) => x.name.localeCompare(y.name));
      case "price-desc": return a.sort((x, y) => getMarket(y) - getMarket(x));
      case "price-asc": return a.sort((x, y) => getMarket(x) - getMarket(y));
      default: return a.sort((x, y) => {
        const d = (y.set?.releaseDate || "").localeCompare(x.set?.releaseDate || "");
        return d !== 0 ? d : parseNum(x.number) - parseNum(y.number);
      });
    }
  }, [results, sortBy]);

  const filtered = useMemo(() => cards.filter(c => !invSearch || c.name.toLowerCase().includes(invSearch.toLowerCase())), [cards, invSearch]);

  const toggleVis = (c) => {
    const ns = c.status === "active" ? "draft" : "active";
    updateCard(c.id, { status: ns });
    showToast(ns === "active" ? "Visible in store" : "Hidden from store");
    setOpenMenu(null);
  };

  const openAdd = () => { setShowAdd(true); setSearch(""); setSelectedSet(""); setSortBy("default"); setSelected(null); setAddForm({...emptyForm}); };
  const closeAdd = () => { setShowAdd(false); setSelected(null); };

  const handleAddCard = () => {
    if (!selected) return;
    addCard({
      id: "c" + Date.now(),
      name: selected.name, set: selected.set.name, setCode: selected.set.id,
      number: selected.number, rarity: selected.rarity || "Common",
      image: selected.images.large, thumb: selected.images.small,
      price: Number(addForm.price) || getMarket(selected),
      stock: Number(addForm.stock) || 1,
      condition: addForm.condition,
      variant: selected.supertype || "Standard", status: "active", featured: false,
      description: selected.name + " from " + selected.set.name + ".",
      grading: addForm.company !== "None" ? { company: addForm.company, grade: addForm.grade, cert: addForm.cert } : null,
      notes: addForm.notes || "",
      marketPrice: {
        tcgplayer: selected.tcgplayer?.prices?.holofoil?.market || selected.tcgplayer?.prices?.normal?.market || null,
        cardmarket: selected.cardmarket?.prices?.averageSellPrice || null, ebaySold: null,
      },
    });
    closeAdd();
    showToast("Added");
  };

  const handleSaveEdit = () => {
    if (!editingCard) return;
    updateCard(editingCard.id, {
      price: Number(editingCard.price) || 0,
      stock: Number(editingCard.stock) || 0,
      condition: editingCard.condition,
      grading: editingCard.gradingCompany !== "None" ? { company: editingCard.gradingCompany, grade: editingCard.gradingGrade, cert: editingCard.gradingCert } : null,
      notes: editingCard.notes || "",
    });
    setEditingCard(null);
    showToast("Saved");
  };

  const startEdit = (c) => {
    setEditingCard({
      ...c,
      gradingCompany: c.grading?.company || "None",
      gradingGrade: c.grading?.grade || "",
      gradingCert: c.grading?.cert || "",
    });
    setOpenMenu(null);
  };

  if (!isAdmin) return <div className="py-20 text-center text-zinc-500">Admin only</div>;

  return (
    <div className="min-h-screen bg-[#fcfbf8] dark:bg-zinc-950 text-zinc-900 dark:text-white" onClick={() => setOpenMenu(null)}>
      <div className="max-w-[1500px] mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {/* HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-5">
          <div>
            <h1 className="text-[24px] sm:text-[28px] font-semibold tracking-tight">Inventory</h1>
            <p className="text-sm text-zinc-500 dark:text-zinc-400 mt-0.5">{filtered.length} cards</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:flex-none">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
              <input value={invSearch} onChange={e => setInvSearch(e.target.value)} placeholder="Search..." className="w-full sm:w-56 pl-9 pr-3 h-9 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500" />
            </div>
            <button onClick={openAdd} className="h-9 px-3 sm:px-4 bg-gradient-to-r from-[#dc2626] to-[#c9a227] hover:from-red-600 hover:to-amber-600 text-white rounded-lg text-sm font-medium flex items-center gap-1.5 shrink-0 shadow-sm">
              <Plus className="w-4 h-4" /><span className="hidden sm:inline">Add</span>
            </button>
          </div>
        </div>

        {/* TABLE */}
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl overflow-hidden shadow-sm">
          <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 text-[11px] font-medium text-zinc-500 dark:text-zinc-400 uppercase tracking-wider border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
            <div className="col-span-5">Card</div>
            <div className="col-span-2">Details</div>
            <div>Stock</div>
            <div>Price</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
          <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
            {filtered.map(c => (
              <div key={c.id} className="group hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
                {/* MOBILE */}
                <div className="md:hidden p-3.5 flex gap-3">
                  <div className="relative shrink-0">
                    <img src={c.thumb} className="w-14 h-[76px] object-cover rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-800" />
                    {c.grading && c.grading.company !== "None" && <div className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-gradient-to-r from-[#dc2626] to-[#c9a227] rounded-full flex items-center justify-center text-[9px] font-bold text-white">{c.grading.grade}</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-medium text-[15px] truncate text-zinc-900 dark:text-white">{c.name}</span>
                          {c.status !== "active" && <span className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] rounded font-medium">HIDDEN</span>}
                        </div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-[12px] text-zinc-500 dark:text-zinc-400 truncate">{c.set}</span>
                          <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">{c.number}</span>
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === c.id ? null : c.id); }} className="p-1.5 -mr-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg shrink-0">
                        <MoreHorizontal className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      </button>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-1 text-[10px] rounded-md border ${rarityColors[c.rarity] || "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>{c.rarity?.split(" ")[0] || "Common"}</span>
                      <span className="text-[11px] text-zinc-400 dark:text-zinc-600">&middot;</span>
                      <span className="text-[11px] text-zinc-500 dark:text-zinc-400">{c.condition}</span>
                      <GradingBadge grading={c.grading} />
                      <NoteIndicator notes={c.notes} />
                    </div>
                    <div className="flex items-center justify-between mt-2.5">
                      <div className="flex items-center gap-3">
                        <div><div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Stock</div><div className={`text-[13px] font-medium ${c.stock > 3 ? "text-emerald-600 dark:text-emerald-400" : "text-amber-600 dark:text-amber-400"}`}>{c.stock}</div></div>
                        <div><div className="text-[10px] text-zinc-500 dark:text-zinc-400 uppercase">Price</div><div className="text-[15px] font-semibold bg-gradient-to-r from-[#dc2626] to-[#c9a227] bg-clip-text text-transparent">${c.price}</div></div>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); updateCard(c.id, { featured: !c.featured }); showToast(c.featured ? "Removed from featured" : "Added to featured"); }} className={`p-2 rounded-lg transition-all ${c.featured ? "text-amber-500 hover:text-amber-600" : "text-zinc-400 dark:text-zinc-500 hover:text-amber-500"}`} title={c.featured ? "Remove from featured" : "Add to featured"}><Star size={16} fill={c.featured ? "currentColor" : "none"} /></button>
                      <button onClick={() => toggleVis(c)} className="p-2 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                        {c.status === "active" ? <Eye className="w-4 h-4 text-zinc-600 dark:text-zinc-400" /> : <EyeOff className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />}
                      </button>
                    </div>
                  </div>
                  {openMenu === c.id && (
                    <div className="absolute right-4 mt-12 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 py-1" onClick={e => e.stopPropagation()}>
                      <button onClick={() => startEdit(c)} className="w-full px-3 py-2.5 text-left text-[14px] hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300"><Edit3 className="w-4 h-4" />Edit</button>
                      <button onClick={() => { if (confirm("Delete?")) { deleteCard(c.id); showToast("Deleted"); } }} className="w-full px-3 py-2.5 text-left text-[14px] hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center gap-2.5"><Trash2 className="w-4 h-4" />Delete</button>
                    </div>
                  )}
                </div>

                {/* DESKTOP */}
                <div className="hidden md:grid grid-cols-12 gap-3 px-5 py-3 items-center">
                  <div className="col-span-5 flex items-center gap-3 min-w-0">
                    <div className="relative">
                      <img src={c.thumb} className="w-12 h-16 object-cover rounded-lg ring-1 ring-zinc-200 dark:ring-zinc-800" />
                      {c.grading && c.grading.company !== "None" && <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-[#dc2626] to-[#c9a227] rounded-full flex items-center justify-center text-[9px] font-bold text-white">{c.grading.grade}</div>}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate text-zinc-900 dark:text-white">{c.name}</span>
                        {c.status !== "active" && <span className="px-1.5 py-0.5 bg-zinc-200 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400 text-[10px] rounded">HIDDEN</span>}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-zinc-500 dark:text-zinc-400">{c.set}</span>
                        <span className="text-[10px] px-1.5 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-zinc-600 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700">{c.number}</span>
                        <GradingBadge grading={c.grading} />
                        <NoteIndicator notes={c.notes} />
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2 flex items-center gap-2">
                    <span className={`px-2 py-1 text-[10px] rounded-md border ${rarityColors[c.rarity] || "bg-zinc-100 text-zinc-600 border-zinc-200"}`}>{c.rarity}</span>
                    <span className="text-xs text-zinc-400">&middot;</span>
                    <span className="text-xs text-zinc-500 dark:text-zinc-400">{c.condition}</span>
                  </div>
                  <div><span className={`inline-flex items-center justify-center w-8 h-6 rounded-md text-xs font-medium ${c.stock > 3 ? "bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800" : "bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800"}`}>{c.stock}</span></div>
                  <div><span className="text-[15px] font-medium bg-gradient-to-r from-[#dc2626] to-[#c9a227] bg-clip-text text-transparent">${c.price}</span></div>
                  <div className="col-span-2 flex items-center justify-end gap-1">
                    <button onClick={(e) => { e.stopPropagation(); updateCard(c.id, { featured: !c.featured }); showToast(c.featured ? "Removed from featured" : "Added to featured"); setOpenMenu(null); }} className={`p-1.5 rounded-lg transition-all ${c.featured ? "text-amber-500 hover:text-amber-600" : "text-zinc-400 dark:text-zinc-500 hover:text-amber-500"}`} title={c.featured ? "Remove from featured" : "Add to featured"}><Star size={16} fill={c.featured ? "currentColor" : "none"} /></button>
                    <button onClick={() => toggleVis(c)} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg" title={c.status === "active" ? "Hide" : "Show"}>
                      {c.status === "active" ? <Eye className="w-4 h-4 text-zinc-600 dark:text-zinc-400" /> : <EyeOff className="w-4 h-4 text-zinc-400 dark:text-zinc-500" />}
                    </button>
                    <div className="relative">
                      <button onClick={e => { e.stopPropagation(); setOpenMenu(openMenu === c.id ? null : c.id); }} className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg">
                        <MoreHorizontal className="w-4 h-4 text-zinc-500 dark:text-zinc-400" />
                      </button>
                      {openMenu === c.id && (
                        <div className="absolute right-0 top-8 w-44 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-xl z-20 py-1" onClick={e => e.stopPropagation()}>
                          <button onClick={() => startEdit(c)} className="w-full px-3 py-2 text-left text-sm hover:bg-zinc-50 dark:hover:bg-zinc-800 flex items-center gap-2.5 text-zinc-700 dark:text-zinc-300"><Edit3 className="w-3.5 h-3.5" />Edit details</button>
                          <button onClick={() => { if (confirm("Delete?")) { deleteCard(c.id); showToast("Deleted"); } }} className="w-full px-3 py-2 text-left text-sm hover:bg-red-50 dark:hover:bg-red-950/30 text-red-600 dark:text-red-400 flex items-center gap-2.5"><Trash2 className="w-3.5 h-3.5" />Delete</button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ===== ADD MODAL ===== */}
      {showAdd && (
        <div className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-zinc-900 border-t sm:border border-zinc-200 dark:border-zinc-800 rounded-t-[24px] sm:rounded-[20px] w-full max-w-[1100px] h-[92vh] sm:h-[86vh] flex flex-col shadow-2xl">
            <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-zinc-200 dark:border-zinc-800">
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-zinc-900 dark:text-white">Add Card</h2>
                <p className="text-xs text-zinc-400 dark:text-zinc-500 mt-0.5">{sortedResults.length} results{hasMore ? "+" : ""}</p>
              </div>
              <button onClick={closeAdd} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg"><X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" /></button>
            </div>

            <div className="px-4 sm:px-6 py-3 border-b border-zinc-200 dark:border-zinc-800 flex flex-wrap gap-2 sm:gap-3 bg-zinc-50 dark:bg-zinc-950">
              <div className="relative flex-1 min-w-[160px]">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                <input autoFocus value={search} onChange={e => setSearch(e.target.value)} placeholder="Search (e.g. Dark Charizard, Pikachu ex)..." className="w-full h-10 pl-10 pr-4 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 text-zinc-900 dark:text-white placeholder-zinc-400 dark:placeholder-zinc-500" />
              </div>
              <select value={selectedSet} onChange={e => setSelectedSet(e.target.value)} className="h-10 px-2 sm:px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm w-32 sm:min-w-[180px] text-zinc-900 dark:text-white">
                <option value="">All Sets</option>
                {sets.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <select value={sortBy} onChange={e => setSortBy(e.target.value)} className="h-10 px-2 sm:px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm w-28 sm:w-auto text-zinc-900 dark:text-white">
                <option value="default">Newest First</option>
                <option value="name">Name A-Z</option>
                <option value="price-desc">Price High-Low</option>
                <option value="price-asc">Price Low-High</option>
              </select>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row min-h-0">
              <div className="flex-1 p-3 sm:p-5 overflow-auto bg-zinc-50 dark:bg-zinc-950/50">
                {loading ? (
                  <div className="flex items-center justify-center h-full"><div className="text-center"><Loader2 className="w-8 h-8 animate-spin text-zinc-400 dark:text-zinc-500 mx-auto" /><p className="text-sm text-zinc-400 dark:text-zinc-500 mt-3">Loading cards...</p></div></div>
                ) : sortedResults.length === 0 ? (
                  <div className="flex items-center justify-center h-full"><p className="text-sm text-zinc-400 dark:text-zinc-500">No cards found.</p></div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2 sm:gap-3">
                      {sortedResults.map(card => {
                        const p = getMarket(card);
                        return (
                          <button key={card.id} onClick={() => { setSelected(card); setAddForm(f => ({...f, price: p > 0 ? p.toFixed(2) : ""})); }}
                            className={`group bg-white dark:bg-zinc-800 border rounded-xl p-2 text-left shadow-sm hover:shadow-md transition-shadow ${selected?.id === card.id ? "border-amber-400 ring-2 ring-amber-200 dark:ring-amber-900/50" : "border-zinc-200 dark:border-zinc-700"}`}>
                            <div className="aspect-[2.5/3.5] rounded-lg overflow-hidden bg-zinc-100 dark:bg-zinc-900 mb-1.5"><img src={card.images.small} alt={card.name} className="w-full h-full object-cover" loading="lazy" /></div>
                            <div className="text-[11px] font-medium truncate text-zinc-900 dark:text-white">{card.name}</div>
                            <div className="flex items-center gap-1 mt-0.5">
                              <span className="text-[9px] text-zinc-500 dark:text-zinc-400 truncate">{card.set.name}</span>
                              <span className="text-[9px] px-1 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-zinc-500 dark:text-zinc-400 border border-zinc-200 dark:border-zinc-700 shrink-0">{card.number}</span>
                            </div>
                            {p > 0 && <div className="text-[12px] font-semibold mt-1 bg-gradient-to-r from-[#dc2626] to-[#c9a227] bg-clip-text text-transparent">${p.toFixed(2)}</div>}
                          </button>
                        );
                      })}
                    </div>
                    {hasMore && (
                      <div className="flex justify-center mt-4">
                        <button onClick={loadMore} disabled={loadingMore} className="h-9 px-6 bg-white dark:bg-zinc-800 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-700 flex items-center gap-2 disabled:opacity-50">
                          {loadingMore ? <Loader2 className="w-4 h-4 animate-spin" /> : <ChevronDown className="w-4 h-4" />}
                          Load More
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* SIDEBAR */}
              {selected && (
                <div className="w-full lg:w-[340px] border-t lg:border-t-0 lg:border-l border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 sm:p-5 max-h-[50vh] lg:max-h-none overflow-auto">
                  <div className="flex lg:block gap-3">
                    <img src={selected.images.small} className="w-20 lg:w-32 lg:mx-auto rounded-xl border border-zinc-200 dark:border-zinc-800" />
                    <div className="flex-1 lg:text-center lg:mt-3">
                      <h3 className="font-semibold text-zinc-900 dark:text-white">{selected.name}</h3>
                      <p className="text-xs text-zinc-500 dark:text-zinc-400">{selected.set.name} &middot; {selected.number}</p>
                      {selected.rarity && <p className="text-[10px] text-zinc-400 dark:text-zinc-500 mt-0.5">{selected.rarity}</p>}
                      {getMarket(selected) > 0 && <p className="text-sm font-semibold mt-1 bg-gradient-to-r from-[#dc2626] to-[#c9a227] bg-clip-text text-transparent">Market: ${getMarket(selected).toFixed(2)}</p>}
                    </div>
                  </div>

                  <div className="mt-4 space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <div><label className="block text-[11px] text-zinc-500 dark:text-zinc-400 uppercase mb-1">Price ($)</label><input type="number" step="0.01" value={addForm.price} onChange={e => setAddForm({...addForm, price: e.target.value})} className="w-full h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white" /></div>
                      <div><label className="block text-[11px] text-zinc-500 dark:text-zinc-400 uppercase mb-1">Stock</label><input type="number" value={addForm.stock} onChange={e => setAddForm({...addForm, stock: e.target.value})} className="w-full h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white" /></div>
                    </div>

                    <div><label className="block text-[11px] text-zinc-500 dark:text-zinc-400 uppercase mb-1">Condition</label>
                      <select value={addForm.condition} onChange={e => setAddForm({...addForm, condition: e.target.value})} className="w-full h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white">
                        {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
                      <label className="block text-[11px] text-zinc-500 dark:text-zinc-400 uppercase mb-1">Grading</label>
                      <select value={addForm.company} onChange={e => setAddForm({...addForm, company: e.target.value})} className="w-full h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white">
                        {GRADING_COMPANIES.map(g => <option key={g} value={g}>{g === "None" ? "No Grading" : g}</option>)}
                      </select>
                      {addForm.company !== "None" && (
                        <div className="grid grid-cols-2 gap-2 mt-2">
                          <input type="text" placeholder="Grade (e.g. 10)" value={addForm.grade} onChange={e => setAddForm({...addForm, grade: e.target.value})} className="h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white" />
                          <input type="text" placeholder="Cert #" value={addForm.cert} onChange={e => setAddForm({...addForm, cert: e.target.value})} className="h-9 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white" />
                        </div>
                      )}
                    </div>

                    <div className="border-t border-zinc-100 dark:border-zinc-800 pt-3">
                      <label className="block text-[11px] text-zinc-500 dark:text-zinc-400 uppercase mb-1">Internal Notes</label>
                      <textarea value={addForm.notes} onChange={e => setAddForm({...addForm, notes: e.target.value})} placeholder="Condition details, special info..." rows={2} className="w-full px-3 py-2 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-lg text-sm text-zinc-900 dark:text-white resize-none" />
                    </div>
                  </div>

                  <button onClick={handleAddCard} className="w-full mt-4 h-10 bg-gradient-to-r from-[#dc2626] to-[#c9a227] hover:from-red-600 hover:to-amber-600 text-white rounded-xl font-medium text-sm shadow-sm">Add to Inventory</button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===== EDIT MODAL ===== */}
      {editingCard && (
        <div className="fixed inset-0 bg-zinc-900/20 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-white dark:bg-zinc-900 border-t sm:border border-zinc-200 dark:border-zinc-800 rounded-t-[24px] sm:rounded-[20px] w-full sm:max-w-[420px] max-h-[90vh] overflow-auto shadow-2xl">
            <div className="sticky top-0 bg-white dark:bg-zinc-900 px-5 pt-5 pb-4 border-b border-zinc-200 dark:border-zinc-800 z-10">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-[17px] font-semibold text-zinc-900 dark:text-white">Edit Card</h3>
                  <p className="text-[12px] text-zinc-500 dark:text-zinc-400 mt-0.5">{editingCard.name}</p>
                </div>
                <button onClick={() => setEditingCard(null)} className="w-8 h-8 flex items-center justify-center hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg -mr-2"><X className="w-4 h-4 text-zinc-500 dark:text-zinc-400" /></button>
              </div>
            </div>
            <div className="px-5 py-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><label className="block text-[11px] text-zinc-600 dark:text-zinc-400 uppercase mb-1.5">Price ($)</label><input type="number" step="0.01" value={editingCard.price} onChange={e => setEditingCard({...editingCard, price: e.target.value})} className="w-full h-11 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white" /></div>
                <div><label className="block text-[11px] text-zinc-600 dark:text-zinc-400 uppercase mb-1.5">Stock</label><input type="number" value={editingCard.stock} onChange={e => setEditingCard({...editingCard, stock: e.target.value})} className="w-full h-11 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-center text-zinc-900 dark:text-white" /></div>
              </div>

              <div><label className="block text-[11px] text-zinc-600 dark:text-zinc-400 uppercase mb-1.5">Condition</label>
                <select value={editingCard.condition} onChange={e => setEditingCard({...editingCard, condition: e.target.value})} className="w-full h-11 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white">
                  {CONDITIONS.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <label className="block text-[11px] text-zinc-600 dark:text-zinc-400 uppercase mb-1.5">Grading</label>
                <select value={editingCard.gradingCompany} onChange={e => setEditingCard({...editingCard, gradingCompany: e.target.value})} className="w-full h-11 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white">
                  {GRADING_COMPANIES.map(g => <option key={g} value={g}>{g === "None" ? "No Grading" : g}</option>)}
                </select>
                {editingCard.gradingCompany !== "None" && (
                  <div className="grid grid-cols-2 gap-3 mt-2">
                    <div><label className="block text-[10px] text-zinc-500 dark:text-zinc-400 mb-1">Grade</label><input type="text" placeholder="e.g. 10" value={editingCard.gradingGrade} onChange={e => setEditingCard({...editingCard, gradingGrade: e.target.value})} className="w-full h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white" /></div>
                    <div><label className="block text-[10px] text-zinc-500 dark:text-zinc-400 mb-1">Cert #</label><input type="text" placeholder="Certificate" value={editingCard.gradingCert} onChange={e => setEditingCard({...editingCard, gradingCert: e.target.value})} className="w-full h-10 px-3 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-zinc-900 dark:text-white" /></div>
                  </div>
                )}
              </div>

              <div className="border-t border-zinc-100 pt-4">
                <label className="block text-[11px] text-zinc-600 dark:text-zinc-400 uppercase mb-1.5">Internal Notes</label>
                <textarea value={editingCard.notes || ""} onChange={e => setEditingCard({...editingCard, notes: e.target.value})} placeholder="Condition details, special info..." rows={3} className="w-full px-3 py-2.5 bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded-xl text-sm text-zinc-900 dark:text-white resize-none" />
              </div>

              <button onClick={handleSaveEdit} className="w-full h-11 bg-gradient-to-r from-[#dc2626] to-[#c9a227] text-white rounded-xl font-medium shadow-sm">Save Changes</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
