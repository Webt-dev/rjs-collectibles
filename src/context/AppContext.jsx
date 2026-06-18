import React, {createContext,useContext,useReducer,useCallback,useState,useEffect} from "react";

const init = {
  cards: [],
  cart: [],
  toasts: [],
  isAdmin: false,
  selectedCard: null,
  showCartDrawer: false,
  mobileMenuOpen: false
};

function reducer(s,{type:t,payload:p}){switch(t){
  case"SET_CARDS":return{...s,cards:p};
  case"UC":return{...s,cards:s.cards.map(c=>c.id===p.id?{...c,...p.u}:c)};
  case"AC":return{...s,cards:[p,...s.cards]};
  case"DC":return{...s,cards:s.cards.filter(c=>c.id!==p)};
  case"ATC":{
    const addQty = p.qtyToAdd || 1;
    const e=s.cart.find(i=>i.id===p.id);
    if(e){
      const newQty = Math.min(e.qty + addQty, p.stock || 99);
      return {...s,cart:s.cart.map(i=>i.id===p.id?{...i,qty:newQty}:i)}
    }
    return {...s,cart:[...s.cart,{...p,qty:Math.min(addQty, p.stock || 1)}]};
  }
  case"RFC":return{...s,cart:s.cart.filter(i=>i.id!==p)};
  case"UQ":return{...s,cart:s.cart.map(i=>i.id===p.id?{...i,qty:Math.min(p.qty, i.stock || 99)}:i)};
  case"CC":return{...s,cart:[]};
  case"TC":return{...s,showCartDrawer:!s.showCartDrawer};
  case"SC":return{...s,selectedCard:p};
  case"TA":return{...s,isAdmin:!s.isAdmin};
  case"TM":return{...s,mobileMenuOpen:!s.mobileMenuOpen};
  case"AT":return{...s,toasts:[...s.toasts,p]};
  case"RT":return{...s,toasts:s.toasts.filter(t=>t.id!==p)};
  default:return s;}}

const Ctx=createContext(null);

export function AppProvider({children}){
  const[s,d]=useReducer(reducer,init);
  const getTheme=()=>{try{return localStorage.getItem("rjs-theme")||"light"}catch{return"light"}};
  const[theme,setTheme]=useState(getTheme);
  useEffect(()=>{const r=document.documentElement;r.classList.toggle("dark",theme==="dark");r.setAttribute("data-theme",theme);try{localStorage.setItem("rjs-theme",theme)}catch{}},[theme]);
  const toggleTheme=useCallback(()=>setTheme(p=>p==="light"?"dark":"light"),[]);

  // ---- SHOPIFY LOAD WITH TAGS ----
  useEffect(()=>{
    const load = async () => {
      const domain = import.meta.env.VITE_SHOPIFY_DOMAIN;
      const token = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN;

      // fallback mock if no keys
      if (!domain ||!token) {
        const mock = [
          {id:'1',name:'Charizard ex',set:'Scarlet & Violet 151',price:89.99,image:'https://images.pokemontcg.io/sv3pt5/199_hires.png',thumb:'https://images.pokemontcg.io/sv3pt5/199_hires.png',stock:5,status:'active',tags:['New Arrivals','Booster Boxes','featured']},
          {id:'2',name:'Pikachu',set:'Crown Zenith',price:42.99,image:'https://images.pokemontcg.io/swsh12pt5/160_hires.png',thumb:'https://images.pokemontcg.io/swsh12pt5/160_hires.png',stock:12,status:'active',tags:['Booster Packs','Japanese Products']},
          {id:'3',name:'Mewtwo',set:'Pokémon GO',price:34.5,image:'https://images.pokemontcg.io/pgo/72_hires.png',thumb:'https://images.pokemontcg.io/pgo/72_hires.png',stock:2,status:'active',tags:['Tins & Theme Decks']},
        ];
        d({type:"SET_CARDS", payload: mock});
        return;
      }

      try {
        const query = `{products(first:100,sortKey:UPDATED_AT,reverse:true){edges{node{id title productType tags images(first:1){edges{node{url}}}variants(first:1){edges{node{price{amount}quantityAvailable}}}}}}}`;
        const res = await fetch(`https://${domain}/api/2024-04/graphql.json`,{
          method:'POST',
          headers:{'Content-Type':'application/json','X-Shopify-Storefront-Access-Token':token},
          body:JSON.stringify({query})
        });
        const json = await res.json();
        const products = json.data?.products?.edges || [];
        const mapped = products.map(({node})=>{
          const v=node.variants.edges[0]?.node;
          const img=node.images.edges[0]?.node?.url;
          return {
            id: node.id,
            name: node.title,
            set: node.productType || 'Pokémon TCG',
            price: parseFloat(v?.price?.amount || 0),
            image: img,
            thumb: img,
            stock: v?.quantityAvailable?? 0,
            status: 'active',
            tags: node.tags || [] // <-- THIS IS THE NEW PART
          };
        });
        if(mapped.length) d({type:"SET_CARDS", payload: mapped});
      } catch(e){ console.error('Shopify load failed', e) }
    };
    load();
  }, []);

  const showToast=useCallback((msg,type="success",dur=3000)=>{const id=Date.now()+Math.random();d({type:"AT",payload:{id,message:msg,type}});setTimeout(()=>d({type:"RT",payload:id}),dur);},[]);

  const v={...s,theme,toggleTheme,
    setCards:useCallback((cards)=>d({type:"SET_CARDS",payload:cards}),[]),
    updateCard:useCallback((id,u)=>d({type:"UC",payload:{id,u}}),[]),
    addCard:useCallback(c=>d({type:"AC",payload:c}),[]),
    deleteCard:useCallback(id=>d({type:"DC",payload:id}),[]),
    addToCart:useCallback((product, qty=1)=>{
      const inCart = s.cart.find(i=>i.id===product.id)?.qty || 0;
      if(inCart + qty > product.stock) {
        showToast(`Only ${product.stock} in stock (${inCart} in cart)`,"error");
        return;
      }
      d({type:"ATC",payload:{...product, qtyToAdd: qty}});
      showToast(`${qty}x ${product.name} added`,"success");
    },[s.cart,showToast]),
    removeFromCart:useCallback(id=>d({type:"RFC",payload:id}),[]),
    updateCartQty:useCallback((id,qty)=>d({type:"UQ",payload:{id,qty}}),[]),
    clearCart:useCallback(()=>d({type:"CC"}),[]),
    toggleCart:useCallback(()=>d({type:"TC"}),[]),
    selectCard:useCallback(c=>d({type:"SC",payload:c}),[]),
    toggleAdmin:useCallback(()=>d({type:"TA"}),[]),
    toggleMobileMenu:useCallback(()=>d({type:"TM"}),[]),
    showToast,
  };
  return<Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
export const useApp=()=>{const c=useContext(Ctx);if(!c)throw new Error("useApp needs AppProvider");return c;};