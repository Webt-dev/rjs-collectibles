import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { useApp } from "../context/AppContext";
import { getPlaceholderImage } from "../data/mockCards";

const rarityConfig = {
  "Common": {
    type: "static",
    border: "border-2 border-zinc-300 dark:border-zinc-600",
    glow: "",
  },
  "Uncommon": {
    type: "static",
    border: "border-2 border-emerald-400/70 dark:border-emerald-600/70",
    glow: "hover:shadow-lg hover:shadow-emerald-400/15",
  },
  "Rare": {
    type: "static",
    border: "border-2 border-blue-400 dark:border-blue-600",
    glow: "shadow-md shadow-blue-400/10 hover:shadow-lg hover:shadow-blue-500/25",
  },
  "Rare Holo": {
    type: "animated",
    colors: "#3b82f6, #22d3ee, #0ea5e9, #818cf8, #3b82f6, #22d3ee, #0ea5e9, #818cf8, #3b82f6",
    speed: 3,
    thickness: 4,
  },
  "Rare Holo V": {
    type: "animated",
    colors: "#3b82f6, #06b6d4, #6366f1, #0ea5e9, #3b82f6, #06b6d4, #6366f1, #0ea5e9, #3b82f6",
    speed: 2.8,
    thickness: 4,
  },
  "Rare Holo VMAX": {
    type: "animated",
    colors: "#7c3aed, #a855f7, #d946ef, #8b5cf6, #a855f7, #7c3aed, #d946ef, #8b5cf6, #7c3aed",
    speed: 2.5,
    thickness: 4,
  },
  "Rare Holo GX": {
    type: "animated",
    colors: "#14b8a6, #06b6d4, #22d3ee, #2dd4bf, #14b8a6, #06b6d4, #22d3ee, #2dd4bf, #14b8a6",
    speed: 2.8,
    thickness: 4,
  },
  "Rare Holo EX": {
    type: "animated",
    colors: "#ef4444, #f97316, #eab308, #ef4444, #f97316, #eab308, #ef4444, #f97316, #ef4444",
    speed: 2.8,
    thickness: 4,
  },
  "Ultra Rare": {
    type: "animated",
    colors: "#8b5cf6, #d946ef, #ec4899, #a855f7, #d946ef, #8b5cf6, #ec4899, #a855f7, #8b5cf6",
    speed: 2,
    thickness: 5,
  },
  "Secret Rare": {
    type: "animated",
    colors: "#f59e0b, #fbbf24, #ef4444, #f97316, #eab308, #fbbf24, #ef4444, #f59e0b, #fbbf24, #f59e0b",
    speed: 1.8,
    thickness: 5,
  },
  "Illustration Rare": {
    type: "animated",
    colors: "#ec4899, #f43f5e, #fb923c, #f472b6, #ec4899, #f43f5e, #fb923c, #f472b6, #ec4899",
    speed: 2.5,
    thickness: 4,
  },
  "Special Art Rare": {
    type: "animated",
    colors: "#f59e0b, #ec4899, #8b5cf6, #06b6d4, #f59e0b, #ec4899, #8b5cf6, #06b6d4, #f59e0b",
    speed: 2.2,
    thickness: 5,
  },
  "Hyper Rare": {
    type: "animated",
    colors: "#fbbf24, #fde68a, #f59e0b, #fbbf24, #fde68a, #f59e0b, #fbbf24, #fde68a, #fbbf24",
    speed: 1.6,
    thickness: 5,
  },
  "Double Rare": {
    type: "animated",
    colors: "#6366f1, #818cf8, #a78bfa, #c4b5fd, #6366f1, #818cf8, #a78bfa, #c4b5fd, #6366f1",
    speed: 2.5,
    thickness: 4,
  },
};

export default function CardItem({ card }) {
  const { selectCard, addToCart, showToast } = useApp();
  const [err, setErr] = useState(false);
  const low = card.stock <= 3;
  const gText = card.grading
    ? `${card.grading.company === "BGS (Beckett)" ? "BGS" : card.grading.company} ${card.grading.grade}`
    : null;

  const rarity = rarityConfig[card.rarity] || rarityConfig["Common"];
  const isAnimated = rarity.type === "animated";

  useEffect(() => {
    if (document.getElementById("rarity-spin-keyframes")) return;
    const style = document.createElement("style");
    style.id = "rarity-spin-keyframes";
    style.textContent = `
      @keyframes spin-border {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
    `;
    document.head.appendChild(style);
  }, []);

  if (isAnimated) {
    const gradient = `conic-gradient(${rarity.colors})`;

    return (
      <div
        className="relative group cursor-pointer"
        onClick={() => selectCard(card)}
      >
        {/* Border container - overflow hidden clips the spinning gradient into a border */}
        <div
          style={{
            position: "relative",
            borderRadius: "16px",
            overflow: "hidden",
            padding: `${rarity.thickness}px`,
          }}
        >
          {/* Large spinning gradient - 300% to fully cover portrait cards during rotation */}
          <div
            style={{
              position: "absolute",
              top: "-100%",
              left: "-100%",
              width: "300%",
              height: "300%",
              background: gradient,
              animation: `spin-border ${rarity.speed}s linear infinite`,
            }}
          />
          {/* Card content on top */}
          <div
            className="relative z-10 bg-white dark:bg-zinc-900"
            style={{
              borderRadius: `${16 - rarity.thickness}px`,
              overflow: "hidden",
            }}
          >
            <CardContent
              card={card} err={err} setErr={setErr}
              gText={gText} low={low}
              addToCart={addToCart} showToast={showToast}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`group cursor-pointer rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-lg ${rarity.border} ${rarity.glow || ""}`}
      onClick={() => selectCard(card)}
    >
      <CardContent
        card={card} err={err} setErr={setErr}
        gText={gText} low={low}
        addToCart={addToCart} showToast={showToast}
      />
    </div>
  );
}

function CardContent({ card, err, setErr, gText, low, addToCart, showToast }) {
  return (
    <>
      <div className="relative aspect-[5/7] bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
        <img
          src={err ? getPlaceholderImage(card.name) : card.image || card.thumb}
          alt={card.name}
          onError={() => setErr(true)}
          loading="lazy"
          className="w-full h-full object-contain"
        />
        {card.grading && card.grading.company !== "None" && (
          <div className="absolute top-2 right-2 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {card.grading.grade}
          </div>
        )}
      </div>
      <div className="p-3">
        {gText && (
          <div className="text-[10px] text-zinc-500 dark:text-zinc-400 mb-0.5 font-medium">
            {gText}
          </div>
        )}
        <h4 className="text-sm font-semibold text-zinc-900 dark:text-white truncate">
          {card.name}
        </h4>
        <p className="text-xs text-zinc-500 dark:text-zinc-400 truncate">{card.set}</p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#dc2626]">
              ${card.price.toFixed ? card.price.toFixed(2) : card.price}
            </span>
            {low && (
              <span className="text-[10px] text-red-500 font-medium -mt-0.5">
                Only {card.stock} left
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              addToCart(card);
              showToast(`${card.name} added`);
            }}
            className="p-1.5 rounded-lg bg-gradient-to-r from-[#dc2626] to-[#c9a227] hover:from-red-600 hover:to-amber-600 text-white transition-all shadow-sm hover:shadow-md hover:scale-105 active:scale-95"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </>
  );
}
