import React from"react";
import CardItem from"./CardItem";
export default function CardGrid({cards=[]}){return(<div className="grid grid-cols-2 gap-3 sm:gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">{cards.map(c=><CardItem key={c.id} card={c}/>)}</div>);}
