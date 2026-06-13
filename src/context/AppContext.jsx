import React,{createContext,useContext,useReducer,useCallback,useState,useEffect}from"react";
import{mockCards}from"../data/mockCards";
const init={cards:JSON.parse(JSON.stringify(mockCards)),cart:[],toasts:[],isAdmin:false,selectedCard:null,showCartDrawer:false,mobileMenuOpen:false};
function reducer(s,{type:t,payload:p}){switch(t){
case"UC":return{...s,cards:s.cards.map(c=>c.id===p.id?{...c,...p.u}:c)};
case"AC":return{...s,cards:[p,...s.cards]};
case"DC":return{...s,cards:s.cards.filter(c=>c.id!==p)};
case"ATC":{const e=s.cart.find(i=>i.id===p.id);return e?{...s,cart:s.cart.map(i=>i.id===p.id?{...i,qty:i.qty+1}:i)}:{...s,cart:[...s.cart,{...p,qty:1}]};}
case"RFC":return{...s,cart:s.cart.filter(i=>i.id!==p)};
case"UQ":return{...s,cart:s.cart.map(i=>i.id===p.id?{...i,qty:p.qty}:i)};
case"CC":return{...s,cart:[]};
case"TC":return{...s,showCartDrawer:!s.showCartDrawer};
case"SC":return{...s,selectedCard:p};
case"TA":return{...s,isAdmin:!s.isAdmin};
case"TM":return{...s,mobileMenuOpen:!s.mobileMenuOpen};
case"AT":return{...s,toasts:[...s.toasts,p]};
case"RT":return{...s,toasts:s.toasts.filter(t=>t.id!==p)};
default:return s;}}
const Ctx=createContext(null);
function getTheme(){try{return localStorage.getItem("rjs-theme")||"light"}catch{return"light"}}
export function AppProvider({children}){
const[s,d]=useReducer(reducer,init);
const[theme,setTheme]=useState(getTheme);
useEffect(()=>{const r=document.documentElement;r.classList.toggle("dark",theme==="dark");document.body.classList.toggle("dark",theme==="dark");r.setAttribute("data-theme",theme);try{localStorage.setItem("rjs-theme",theme)}catch{}},[theme]);
useEffect(()=>{const h=e=>{if(e.key==="rjs-theme"&&e.newValue)setTheme(e.newValue)};window.addEventListener("storage",h);return()=>window.removeEventListener("storage",h)},[]);
const toggleTheme=useCallback(()=>setTheme(p=>p==="light"?"dark":"light"),[]);
const v={...s,theme,toggleTheme,
updateCard:useCallback((id,u)=>d({type:"UC",payload:{id,u}}),[]),
addCard:useCallback(c=>d({type:"AC",payload:c}),[]),
deleteCard:useCallback(id=>d({type:"DC",payload:id}),[]),
addToCart:useCallback(c=>d({type:"ATC",payload:c}),[]),
removeFromCart:useCallback(id=>d({type:"RFC",payload:id}),[]),
updateCartQty:useCallback((id,qty)=>d({type:"UQ",payload:{id,qty}}),[]),
clearCart:useCallback(()=>d({type:"CC"}),[]),
toggleCart:useCallback(()=>d({type:"TC"}),[]),
selectCard:useCallback(c=>d({type:"SC",payload:c}),[]),
toggleAdmin:useCallback(()=>d({type:"TA"}),[]),
toggleMobileMenu:useCallback(()=>d({type:"TM"}),[]),
showToast:useCallback((msg,type="success",dur=3000)=>{const id=Date.now()+Math.random();d({type:"AT",payload:{id,message:msg,type}});setTimeout(()=>d({type:"RT",payload:id}),dur);},[]),
};
return<Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
export function useApp(){const c=useContext(Ctx);if(!c)throw new Error("useApp needs AppProvider");return c;}
