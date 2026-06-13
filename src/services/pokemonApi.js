import{mockCards}from"../data/mockCards";
export async function searchCards(q=""){const l=q.toLowerCase();const f=l?mockCards.filter(c=>c.name.toLowerCase().includes(l)||c.set.toLowerCase().includes(l)):[...mockCards];return{cards:f,totalCount:f.length};}
export async function getCardById(id){return mockCards.find(c=>c.id===id)||null;}
export async function getMarketData(id){const c=mockCards.find(x=>x.id===id);if(!c)return null;const v=()=>(Math.random()-0.5)*0.1;const b=c.price;return{tcgplayer:+(b*(1+v())).toFixed(2),cardmarket:+(b*(0.95+v())).toFixed(2),ebaySold:+(b*(0.98+v())).toFixed(2)};}
