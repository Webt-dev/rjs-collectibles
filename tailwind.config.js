export default {
  darkMode:'class',
  content:["./index.html","./src/**/*.{js,jsx}"],
  theme:{extend:{
    colors:{
      brand:{50:"#fef2f2",100:"#fee2e2",200:"#fecaca",300:"#fca5a5",400:"#f87171",500:"#ef4444",600:"#dc2626",700:"#b91c1c",800:"#991b1b",900:"#7f1d1d",950:"#450a0a"},
      gold:{50:"#fefcf3",100:"#fdf6e3",200:"#fbecc5",300:"#f7df9a",400:"#f0c75a",500:"#c9a227",600:"#b8922f",700:"#966f23",800:"#7a591c",900:"#644a18",950:"#3a2a0c"},
      surface:{950:"#09090b",900:"#0f0f12",800:"#18181b",700:"#27272a",600:"#3f3f46",500:"#52525b"},
      tcgp:{DEFAULT:"#1a74e8",light:"#4d9ef5"},cardmkt:{DEFAULT:"#e85d1a",light:"#f5864d"},ebay:{DEFAULT:"#e53238",light:"#f06b6f"},
    },
    fontFamily:{display:['"Plus Jakarta Sans"',"system-ui","sans-serif"],body:['"Inter"',"system-ui","sans-serif"]},
    boxShadow:{"card":"0 2px 8px rgba(0,0,0,0.06)","card-hover":"0 8px 30px rgba(0,0,0,0.1),0 0 0 1px rgba(220,38,38,0.1)","glow-sm":"0 0 15px rgba(220,38,38,0.12)","glow-gold":"0 0 20px rgba(201,162,39,0.15)","brand-glow":"0 8px 30px rgba(220,38,38,0.12),0 4px 16px rgba(201,162,39,0.08)"},
    animation:{"fade-up":"fadeUp .4s ease-out","slide-right":"slideRight .35s ease-out"},
    keyframes:{fadeUp:{"0%":{opacity:"0",transform:"translateY(16px)"},"100%":{opacity:"1",transform:"translateY(0)"}},slideRight:{"0%":{opacity:"0",transform:"translateX(100%)"},"100%":{opacity:"1",transform:"translateX(0)"}}},
  }},plugins:[]};
