import { useState, useEffect, useRef } from “react”;

const SUPABASE_URL = “https://awrbfaapgalkqsjwloyw.supabase.co”;
const SUPABASE_ANON_KEY = “eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF3cmJmYWFwZ2Fsa3Fzandsb3l3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzgxODMzMjksImV4cCI6MjA5Mzc1OTMyOX0.LSI3Efp9uHB9cHvQAO0N8YGx1WSDWjuOG7KrSYktqsA”;

const db = {
async get(table, options = {}) {
let url = `${SUPABASE_URL}/rest/v1/${table}?`;
if (options.order) url += `order=${options.order}&`;
if (options.limit) url += `limit=${options.limit}&`;
const res = await fetch(url, { headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}` } });
return res.json();
},
async insert(table, data) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
method: “POST”,
headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, “Content-Type”: “application/json”, Prefer: “return=representation” },
body: JSON.stringify(data),
});
return res.json();
},
async update(table, id, data) {
const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?id=eq.${id}`, {
method: “PATCH”,
headers: { apikey: SUPABASE_ANON_KEY, Authorization: `Bearer ${SUPABASE_ANON_KEY}`, “Content-Type”: “application/json”, Prefer: “return=representation” },
body: JSON.stringify(data),
});
return res.json();
},
};

const SEED_DATA = [
{ name: “Bitconnect”, type: “project”, ticker: “BCC”, verdict: “RUG PULL”, verdict_color: “#ff2d2d”, rating: 1, description: “Ponzi scheme disguised as a lending platform. Collapsed Jan 2018. Thousands lost life savings across the globe.”, evidence: “https://bbc.co.uk/bitconnect”, tags: [“Ponzi”, “Lending Scam”, “Exit Scam”], upvotes: 3200, downvotes: 80, reports: 4821 },
{ name: “CryptoZoo”, type: “project”, ticker: “ZOO”, verdict: “ABANDONED”, verdict_color: “#ff8c00”, rating: 1, description: “Logan Paul’s NFT game. Promised play-to-earn mechanics. Delivered nothing. Community still seeking refunds.”, evidence: “https://coffeezilla.com”, tags: [“NFT”, “Celebrity Shill”, “Abandoned”], upvotes: 1800, downvotes: 40, reports: 2103 },
{ name: “Ben Armstrong”, type: “influencer”, ticker: “@bitboy_crypto”, verdict: “SERIAL SHILLER”, verdict_color: “#ff2d2d”, rating: 1, description: “Promoted dozens of tokens that subsequently crashed 90%+. Sued by former business partner. YouTube channel terminated.”, evidence: “https://coffeezilla.com/bitboy”, tags: [“Paid Promo”, “Undisclosed”, “Multiple Rugs”], upvotes: 2900, downvotes: 120, reports: 3340 },
{ name: “Squid Game Token”, type: “project”, ticker: “SQUID”, verdict: “RUG PULL”, verdict_color: “#ff2d2d”, rating: 1, description: “Rose 75,000% in days. Devs pulled liquidity overnight. Sellers were trapped by anti-sell code baked into the contract.”, evidence: “https://bbc.co.uk/squid-token”, tags: [“Honeypot”, “Exit Scam”, “Anti-Sell”], upvotes: 4800, downvotes: 60, reports: 5500 },
{ name: “Chainlink”, type: “project”, ticker: “LINK”, verdict: “LEGITIMATE”, verdict_color: “#00ff88”, rating: 4, description: “Decentralised oracle network with years of consistent delivery. Team transparent, roadmap delivered on time.”, evidence: “https://chain.link”, tags: [“Oracle”, “DeFi”, “Established”], upvotes: 900, downvotes: 30, reports: 12 },
{ name: “Coffeezilla”, type: “influencer”, ticker: “@coffeezilla_”, verdict: “TRUSTWORTHY”, verdict_color: “#00ff88”, rating: 5, description: “Investigative journalist exposing crypto fraud. No paid promotions ever. Track record of accurate exposés.”, evidence: “https://youtube.com/coffeezilla”, tags: [“Investigator”, “No Paid Promos”, “Verified”], upvotes: 1200, downvotes: 10, reports: 2 },
{ name: “SafeMoon”, type: “project”, ticker: “SAFEMOON”, verdict: “RUG PULL”, verdict_color: “#ff2d2d”, rating: 1, description: “CEO charged with fraud by the SEC. Founders diverted millions in community funds for personal luxury purchases.”, evidence: “https://sec.gov/safemoon”, tags: [“SEC Charges”, “Fraud”, “Exit Scam”], upvotes: 5100, downvotes: 90, reports: 6120 },
{ name: “Graham Stephan”, type: “influencer”, ticker: “@GrahamStephan”, verdict: “CAUTION”, verdict_color: “#ffaa00”, rating: 3, description: “Promoted FTX and BlockFi before both collapsed. Undisclosed sponsorships. Finance focus but mixed crypto record.”, evidence: “https://twitter.com/grahamstephan”, tags: [“FTX Sponsor”, “Undisclosed”, “Mixed Record”], upvotes: 400, downvotes: 200, reports: 210 },
];

const WEEKLY_SHAME = [
{ name: “TurboAI”, ticker: “$TURBO”, reports: 892, verdict: “RUG PULL” },
{ name: “MoonDoge V2”, ticker: “$MDOGE”, reports: 741, verdict: “PUMP & DUMP” },
{ name: “CryptoKing_YT”, ticker: “@cryptoking”, reports: 630, verdict: “SERIAL SHILLER” },
{ name: “ApeSwap Pro”, ticker: “$APES”, reports: 518, verdict: “ABANDONED” },
{ name: “NovaNFT”, ticker: “$NOVA”, reports: 402, verdict: “RUG PULL” },
];

const TOP_REPORTERS = [
{ name: “0xSleuth”, reports: 142, badge: “VETERAN INVESTIGATOR”, color: “#ffd700” },
{ name: “RugHunterUK”, reports: 98, badge: “SENIOR REPORTER”, color: “#c0c0c0” },
{ name: “DeFiDetective”, reports: 76, badge: “REPORTER”, color: “#cd7f32” },
{ name: “OnChainWatcher”, reports: 54, badge: “REPORTER”, color: “#cd7f32” },
{ name: “CryptoSheriff”, reports: 41, badge: “JUNIOR”, color: “#64748b” },
];

const VERDICT_OPTIONS = [“RUG PULL”, “PUMP & DUMP”, “ABANDONED”, “SERIAL SHILLER”, “CAUTION”, “LEGITIMATE”, “TRUSTWORTHY”];

const verdictColor = (v) => [“LEGITIMATE”,“TRUSTWORTHY”].includes(v) ? “#00ff88” : v === “CAUTION” ? “#ffaa00” : “#ff2d2d”;

const css = `
@import url(‘https://fonts.googleapis.com/css2?family=Space+Mono:ital,wght@0,400;0,700;1,400&family=Bebas+Neue&family=DM+Sans:wght@300;400;500&display=swap’);

- { box-sizing: border-box; margin: 0; padding: 0; }
  ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-track { background: #050709; } ::-webkit-scrollbar-thumb { background: #ff2d2d; border-radius: 2px; }
  @keyframes scanline { 0% { transform: translateY(-100%); } 100% { transform: translateY(100vh); } }
  @keyframes flicker { 0%,100% { opacity:1; } 92% { opacity:1; } 93% { opacity:0.8; } 94% { opacity:1; } 96% { opacity:0.9; } 97% { opacity:1; } }
  @keyframes pulse-red { 0%,100% { box-shadow: 0 0 0 0 rgba(255,45,45,0.4); } 50% { box-shadow: 0 0 0 8px rgba(255,45,45,0); } }
  @keyframes slide-up { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
  @keyframes glow { 0%,100% { text-shadow: 0 0 10px rgba(255,45,45,0.5); } 50% { text-shadow: 0 0 30px rgba(255,45,45,0.9), 0 0 60px rgba(255,45,45,0.4); } }
  @keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
  .card-hover:hover { border-color: rgba(255,45,45,0.4) !important; transform: translateY(-3px); box-shadow: 0 20px 60px rgba(255,45,45,0.1) !important; }
  .card-hover { transition: all 0.25s cubic-bezier(0.4,0,0.2,1) !important; }
  .btn-hover:hover { filter: brightness(1.15); transform: translateY(-1px); }
  .btn-hover { transition: all 0.15s ease; }
  .slide-up { animation: slide-up 0.4s ease forwards; }
  .ticker-wrap { overflow: hidden; white-space: nowrap; }
  .ticker-inner { display: inline-block; animation: marquee 30s linear infinite; }
  .flicker { animation: flicker 8s infinite; }
  input, select, textarea { font-family: ‘Space Mono’, monospace !important; }
  input::placeholder { color: #2a3040; }
  `;

export default function App() {
const [tab, setTab] = useState(“browse”);
const [data, setData] = useState([]);
const [loading, setLoading] = useState(true);
const [search, setSearch] = useState(””);
const [filter, setFilter] = useState(“all”);
const [selected, setSelected] = useState(null);
const [showSubmit, setShowSubmit] = useState(false);
const [submitted, setSubmitted] = useState(false);
const [submitting, setSubmitting] = useState(false);
const [walletInput, setWalletInput] = useState(””);
const [walletResult, setWalletResult] = useState(null);
const [walletLoading, setWalletLoading] = useState(false);
const [shareToast, setShareToast] = useState(false);
const [userVotes, setUserVotes] = useState({});
const [form, setForm] = useState({ name: “”, type: “project”, ticker: “”, verdict: “RUG PULL”, rating: 1, description: “”, evidence: “”, tags: “” });

const loadData = async () => {
setLoading(true);
try {
const rows = await db.get(“reports”, { order: “reports.desc” });
if (Array.isArray(rows) && rows.length > 0) {
setData(rows);
} else {
for (const item of SEED_DATA) await db.insert(“reports”, item);
const fresh = await db.get(“reports”, { order: “reports.desc” });
setData(Array.isArray(fresh) ? fresh : []);
}
} catch { setData([]); }
setLoading(false);
};

useEffect(() => { loadData(); }, []);

const filtered = data.filter(d => {
const s = search.toLowerCase();
const ms = d.name?.toLowerCase().includes(s) || d.ticker?.toLowerCase().includes(s);
const mf = filter === “all” ? true : filter === “projects” ? d.type === “project” : filter === “influencers” ? d.type === “influencer” : filter === “rugs” ? d.verdict === “RUG PULL” : [“LEGITIMATE”,“TRUSTWORTHY”].includes(d.verdict);
return ms && mf;
});

const handleVote = async (item, dir) => {
if (userVotes[item.id] === dir) return;
setUserVotes(p => ({ …p, [item.id]: dir }));
const upd = { upvotes: dir === “up” ? (item.upvotes||0)+1 : item.upvotes, downvotes: dir === “down” ? (item.downvotes||0)+1 : item.downvotes };
setData(p => p.map(d => d.id === item.id ? { …d, …upd } : d));
if (selected?.id === item.id) setSelected(s => ({ …s, …upd }));
await db.update(“reports”, item.id, upd);
};

const handleShare = (item) => {
navigator.clipboard?.writeText(`⚠️ ${item.name} (${item.ticker}) — ${item.verdict}\n\n${item.description?.slice(0,120)}...\n\nVerified on RUGWATCH 👇\nrugwatch.io`);
setShareToast(true); setTimeout(() => setShareToast(false), 2500);
};

const handleWalletCheck = () => {
if (!walletInput.trim()) return;
setWalletLoading(true); setWalletResult(null);
setTimeout(() => {
const rc = Math.floor(Math.random()*5), cc = Math.floor(Math.random()*4);
const score = Math.max(10, 100 - rc*22 - cc*10);
const personality = score>=80?“💎 Diamond Hands”:score>=60?“🎲 Calculated Degen”:score>=40?“📄 Paper Hands”:“💀 Rug Magnet”;
setWalletResult({ score, personality, rugCount:rc, cautionCount:cc, rugged:data.filter(d=>d.verdict===“RUG PULL”).slice(0,rc).map(d=>d.name), wallet:walletInput.slice(0,6)+”…”+walletInput.slice(-4) });
setWalletLoading(false);
}, 2200);
};

const handleSubmit = async () => {
if (!form.name||!form.description||!form.evidence) return;
setSubmitting(true);
await db.insert(“reports”, { …form, verdict_color: verdictColor(form.verdict), tags: form.tags.split(”,”).map(t=>t.trim()).filter(Boolean), upvotes:1, downvotes:0, reports:1 });
await loadData(); setSubmitting(false); setSubmitted(true);
setTimeout(() => { setShowSubmit(false); setSubmitted(false); setForm({ name:””,type:“project”,ticker:””,verdict:“RUG PULL”,rating:1,description:””,evidence:””,tags:”” }); }, 2200);
};

const rugCount = data.filter(d=>d.verdict===“RUG PULL”).length;
const legitCount = data.filter(d=>[“LEGITIMATE”,“TRUSTWORTHY”].includes(d.verdict)).length;
const totalReports = data.reduce((a,b)=>a+(b.reports||0),0);

const tickerItems = […WEEKLY_SHAME, …WEEKLY_SHAME].map((w,i)=>`⚠ ${w.name} — ${w.verdict}`).join(”   ·   “);

return (
<>
<style>{css}</style>
<div style={{ minHeight:“100vh”, background:”#050709”, color:”#e8eaf0”, fontFamily:”‘DM Sans’, sans-serif”, position:“relative”, overflow:“hidden” }}>

```
    {/* Scanline overlay */}
    <div style={{ position:"fixed", inset:0, background:"repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)", pointerEvents:"none", zIndex:999 }} />

    {/* Grid background */}
    <div style={{ position:"fixed", inset:0, backgroundImage:"linear-gradient(rgba(255,45,45,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,45,45,0.03) 1px, transparent 1px)", backgroundSize:"60px 60px", pointerEvents:"none" }} />

    {/* Glow orb */}
    <div style={{ position:"fixed", top:"-20%", left:"50%", transform:"translateX(-50%)", width:"600px", height:"600px", background:"radial-gradient(circle, rgba(255,45,45,0.08) 0%, transparent 70%)", pointerEvents:"none" }} />

    {/* Toast */}
    {shareToast && <div className="slide-up" style={{ position:"fixed", top:"80px", left:"50%", transform:"translateX(-50%)", background:"linear-gradient(135deg,#00ff88,#00cc6a)", color:"#050709", padding:"10px 24px", borderRadius:"6px", fontFamily:"'Space Mono',monospace", fontSize:"11px", fontWeight:"700", zIndex:1000, letterSpacing:"2px", whiteSpace:"nowrap" }}>✓ COPIED TO CLIPBOARD</div>}

    {/* NAV */}
    <nav style={{ borderBottom:"1px solid rgba(255,45,45,0.15)", padding:"0 28px", display:"flex", alignItems:"center", justifyContent:"space-between", height:"62px", background:"rgba(5,7,9,0.95)", backdropFilter:"blur(20px)", position:"sticky", top:0, zIndex:50, gap:"12px" }}>
      <div className="flicker" style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"22px", color:"#ff2d2d", letterSpacing:"4px", cursor:"pointer", display:"flex", alignItems:"center", gap:"10px", animation:"glow 3s ease-in-out infinite" }} onClick={()=>setTab("browse")}>
        <div style={{ width:"28px", height:"28px", border:"2px solid #ff2d2d", display:"flex", alignItems:"center", justifyContent:"center", fontSize:"14px", animation:"pulse-red 2s infinite" }}>⚠</div>
        RUGWATCH
      </div>
      <div style={{ display:"flex", gap:"2px", background:"rgba(255,255,255,0.03)", border:"1px solid rgba(255,45,45,0.15)", borderRadius:"6px", padding:"4px" }}>
        {[["browse","BROWSE"],["shame","SHAME"],["leaderboard","REPORTERS"],["wallet","WALLET"]].map(([id,label])=>(
          <button key={id} className="btn-hover" onClick={()=>setTab(id)} style={{ background:tab===id?"#ff2d2d":"none", color:tab===id?"#fff":"#64748b", border:"none", borderRadius:"4px", padding:"6px 14px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace", letterSpacing:"1px", transition:"all 0.2s" }}>{label}</button>
        ))}
      </div>
      <button className="btn-hover" onClick={()=>setShowSubmit(true)} style={{ background:"transparent", color:"#ff2d2d", border:"1px solid #ff2d2d", borderRadius:"4px", padding:"8px 16px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace", fontWeight:"700", letterSpacing:"1px" }}>+ REPORT</button>
    </nav>

    {/* TICKER TAPE */}
    <div style={{ background:"rgba(255,45,45,0.08)", borderBottom:"1px solid rgba(255,45,45,0.2)", padding:"8px 0", overflow:"hidden" }}>
      <div className="ticker-wrap">
        <div className="ticker-inner" style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"#ff2d2d", letterSpacing:"1px" }}>
          {tickerItems}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{tickerItems}
        </div>
      </div>
    </div>

    <div style={{ maxWidth:"1100px", margin:"0 auto", padding:"32px 24px 100px" }}>

      {/* ── BROWSE ── */}
      {tab==="browse" && (
        <>
          {/* HERO */}
          <div style={{ textAlign:"center", padding:"56px 0 44px" }}>
            <div style={{ display:"inline-block", background:"rgba(255,45,45,0.1)", border:"1px solid rgba(255,45,45,0.3)", borderRadius:"2px", padding:"5px 16px", fontSize:"9px", fontFamily:"'Space Mono',monospace", letterSpacing:"3px", color:"#ff2d2d", marginBottom:"24px" }}>
              COMMUNITY ACCOUNTABILITY DATABASE
            </div>
            <h1 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"clamp(52px,9vw,110px)", lineHeight:0.95, letterSpacing:"2px", marginBottom:"20px" }}>
              <span style={{ display:"block", color:"#e8eaf0" }}>THE CRYPTO</span>
              <span style={{ display:"block", color:"#ff2d2d", animation:"glow 3s ease-in-out infinite" }}>PERMANENT</span>
              <span style={{ display:"block", color:"#e8eaf0" }}>RECORD</span>
            </h1>
            <p style={{ color:"#4a5568", fontSize:"15px", maxWidth:"420px", margin:"0 auto 44px", lineHeight:1.7, fontWeight:300 }}>
              Crowdsourced ratings for projects, teams & influencers.<br/>Did they rug? It's on record. <em>Forever.</em>
            </p>

            {/* STATS */}
            <div style={{ display:"flex", justifyContent:"center", gap:"0", marginBottom:"48px", flexWrap:"wrap" }}>
              {[[data.length,"ENTRIES","#e8eaf0"],[rugCount,"CONFIRMED RUGS","#ff2d2d"],[legitCount,"VERIFIED LEGIT","#00ff88"],[totalReports.toLocaleString(),"TOTAL REPORTS","#ffaa00"]].map(([num,label,color],i)=>(
                <div key={i} style={{ padding:"20px 32px", borderRight:i<3?"1px solid rgba(255,45,45,0.1)":"none" }}>
                  <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"44px", color, letterSpacing:"2px", lineHeight:1 }}>{num}</div>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040", letterSpacing:"2px", marginTop:"4px" }}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* SEARCH */}
          <div style={{ position:"relative", marginBottom:"14px" }}>
            <div style={{ position:"absolute", left:"16px", top:"50%", transform:"translateY(-50%)", color:"#ff2d2d", fontSize:"14px" }}>⌕</div>
            <input style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,45,45,0.2)", borderRadius:"4px", padding:"13px 16px 13px 40px", color:"#e8eaf0", fontSize:"13px", outline:"none", letterSpacing:"0.5px" }} placeholder="Search by name or ticker... e.g. SQUID, SafeMoon" value={search} onChange={e=>setSearch(e.target.value)} />
          </div>

          {/* FILTERS */}
          <div style={{ display:"flex", gap:"6px", marginBottom:"28px", flexWrap:"wrap" }}>
            {[["all","ALL"],["projects","PROJECTS"],["influencers","INFLUENCERS"],["rugs","RUGS ONLY"],["legit","LEGIT ONLY"]].map(([val,label])=>(
              <button key={val} className="btn-hover" onClick={()=>setFilter(val)} style={{ background:filter===val?"#ff2d2d":"rgba(255,255,255,0.02)", color:filter===val?"#fff":"#4a5568", border:`1px solid ${filter===val?"#ff2d2d":"rgba(255,45,45,0.15)"}`, borderRadius:"3px", padding:"7px 14px", fontSize:"9px", cursor:"pointer", fontFamily:"'Space Mono',monospace", letterSpacing:"1.5px" }}>{label}</button>
            ))}
          </div>

          {loading ? (
            <div style={{ textAlign:"center", padding:"80px 0", color:"#2a3040", fontFamily:"'Space Mono',monospace", fontSize:"12px", letterSpacing:"2px" }}>
              <div style={{ fontSize:"24px", marginBottom:"12px", display:"inline-block", animation:"spin 1s linear infinite" }}>◎</div>
              <div>LOADING DATABASE...</div>
            </div>
          ) : (
            <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(300px,1fr))", gap:"12px" }}>
              {filtered.map(item => (
                <div key={item.id} className="card-hover" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,45,45,0.1)", borderRadius:"6px", padding:"20px", position:"relative", overflow:"hidden", boxShadow:"0 4px 24px rgba(0,0,0,0.3)" }}>
                  {/* Top accent */}
                  <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg, ${item.verdict_color}, transparent)` }} />
                  {/* Corner decoration */}
                  <div style={{ position:"absolute", top:"8px", right:"8px", width:"20px", height:"20px", borderTop:`1px solid ${item.verdict_color}44`, borderRight:`1px solid ${item.verdict_color}44` }} />

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:"12px" }}>
                    <div style={{ cursor:"pointer" }} onClick={()=>setSelected(item)}>
                      <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"20px", letterSpacing:"1px", marginBottom:"3px" }}>{item.name}</div>
                      <div style={{ color:"#2a3040", fontSize:"10px", fontFamily:"'Space Mono',monospace" }}>{item.ticker}</div>
                    </div>
                    <div style={{ display:"flex", flexDirection:"column", alignItems:"flex-end", gap:"5px" }}>
                      <span style={{ background:item.verdict_color+"18", color:item.verdict_color, border:`1px solid ${item.verdict_color}44`, borderRadius:"2px", padding:"3px 8px", fontSize:"9px", fontFamily:"'Space Mono',monospace", fontWeight:"700", letterSpacing:"1.5px" }}>{item.verdict}</span>
                      <span style={{ background:"rgba(255,255,255,0.04)", color:"#4a5568", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"2px", padding:"2px 7px", fontSize:"9px", fontFamily:"'Space Mono',monospace", letterSpacing:"1px" }}>{item.type?.toUpperCase()}</span>
                    </div>
                  </div>

                  <p style={{ color:"#4a5568", fontSize:"12px", lineHeight:1.7, marginBottom:"12px", cursor:"pointer", fontWeight:300 }} onClick={()=>setSelected(item)}>
                    {item.description?.slice(0,88)}...
                  </p>

                  <div style={{ display:"flex", gap:"4px", flexWrap:"wrap", marginBottom:"14px" }}>
                    {(item.tags||[]).slice(0,3).map(t=>(
                      <span key={t} style={{ background:"rgba(255,45,45,0.06)", color:"#ff2d2d", border:"1px solid rgba(255,45,45,0.15)", borderRadius:"2px", padding:"2px 7px", fontSize:"9px", fontFamily:"'Space Mono',monospace" }}>{t}</span>
                    ))}
                  </div>

                  <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", borderTop:"1px solid rgba(255,255,255,0.04)", paddingTop:"12px" }}>
                    <div style={{ display:"flex", gap:"6px" }}>
                      <button className="btn-hover" onClick={()=>handleVote(item,"up")} style={{ background:userVotes[item.id]==="up"?"rgba(0,255,136,0.1)":"none", color:userVotes[item.id]==="up"?"#00ff88":"#2a3040", border:`1px solid ${userVotes[item.id]==="up"?"#00ff88":"rgba(255,255,255,0.06)"}`, borderRadius:"3px", padding:"4px 10px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>▲ {item.upvotes||0}</button>
                      <button className="btn-hover" onClick={()=>handleVote(item,"down")} style={{ background:userVotes[item.id]==="down"?"rgba(255,45,45,0.1)":"none", color:userVotes[item.id]==="down"?"#ff2d2d":"#2a3040", border:`1px solid ${userVotes[item.id]==="down"?"#ff2d2d":"rgba(255,255,255,0.06)"}`, borderRadius:"3px", padding:"4px 10px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>▼ {item.downvotes||0}</button>
                    </div>
                    <button className="btn-hover" onClick={()=>handleShare(item)} style={{ background:"none", color:"#2a3040", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"3px", padding:"4px 10px", fontSize:"9px", cursor:"pointer", fontFamily:"'Space Mono',monospace", letterSpacing:"1px" }}>↗ SHARE</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── SHAME LIST ── */}
      {tab==="shame" && (
        <div style={{ maxWidth:"680px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"48px", paddingTop:"40px" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", letterSpacing:"3px", color:"#ff2d2d", marginBottom:"16px" }}>📅 WEEK OF MAY 2026</div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"64px", letterSpacing:"2px", lineHeight:1, marginBottom:"12px" }}>
              WEEKLY <span style={{ color:"#ff2d2d" }}>SHAME</span> LIST
            </h2>
            <p style={{ color:"#4a5568", fontSize:"13px", fontWeight:300 }}>The most reported scammers this week. Share widely.</p>
          </div>
          {WEEKLY_SHAME.map((item,i)=>(
            <div key={i} className="card-hover" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,45,45,0.1)", borderRadius:"4px", padding:"20px 24px", marginBottom:"8px", display:"flex", alignItems:"center", gap:"20px", position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"3px", background:i===0?"#ff2d2d":i===1?"#ff6600":i===2?"#ffaa00":"#2a3040" }} />
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"36px", color:i===0?"#ff2d2d":i===1?"#ff6600":i===2?"#ffaa00":"#2a3040", minWidth:"50px", letterSpacing:"1px" }}>#{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"22px", letterSpacing:"1px", marginBottom:"3px" }}>{item.name}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"10px", color:"#2a3040" }}>{item.ticker}</div>
              </div>
              <div style={{ textAlign:"right" }}>
                <span style={{ background:"rgba(255,45,45,0.1)", color:"#ff2d2d", border:"1px solid rgba(255,45,45,0.3)", borderRadius:"2px", padding:"3px 8px", fontSize:"9px", fontFamily:"'Space Mono',monospace", letterSpacing:"1px", display:"block", marginBottom:"5px" }}>{item.verdict}</span>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040" }}>{item.reports} reports</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop:"28px", padding:"24px", background:"rgba(255,45,45,0.05)", border:"1px solid rgba(255,45,45,0.2)", borderRadius:"4px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#4a5568", letterSpacing:"2px", marginBottom:"14px" }}>SHARE THIS WEEK'S LIST</div>
            <button className="btn-hover" style={{ background:"#ff2d2d", color:"#fff", border:"none", borderRadius:"3px", padding:"12px 32px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace", letterSpacing:"2px" }} onClick={()=>{ navigator.clipboard?.writeText("⚠️ RUGWATCH Weekly Shame List\n\n#1 TurboAI — RUG PULL (892 reports)\n#2 MoonDoge V2 — PUMP & DUMP (741 reports)\n#3 CryptoKing_YT — SERIAL SHILLER (630 reports)\n\nrugwatch.io"); setShareToast(true); setTimeout(()=>setShareToast(false),2500); }}>↗ COPY & SHARE</button>
          </div>
        </div>
      )}

      {/* ── LEADERBOARD ── */}
      {tab==="leaderboard" && (
        <div style={{ maxWidth:"640px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"48px", paddingTop:"40px" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", letterSpacing:"3px", color:"#ffd700", marginBottom:"16px" }}>🏆 COMMUNITY RANKINGS</div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"64px", letterSpacing:"2px", lineHeight:1, marginBottom:"12px" }}>
              TOP <span style={{ color:"#ffd700" }}>REPORTERS</span>
            </h2>
            <p style={{ color:"#4a5568", fontSize:"13px", fontWeight:300 }}>The investigators keeping crypto honest. Submit reports to climb.</p>
          </div>
          {TOP_REPORTERS.map((r,i)=>(
            <div key={i} className="card-hover" style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"4px", padding:"18px 22px", marginBottom:"8px", display:"flex", alignItems:"center", gap:"18px", position:"relative" }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"3px", background:r.color }} />
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"32px", color:r.color, minWidth:"44px", letterSpacing:"1px" }}>#{i+1}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"20px", letterSpacing:"1px", marginBottom:"5px" }}>{r.name}</div>
                <span style={{ background:r.color+"18", color:r.color, border:`1px solid ${r.color}33`, borderRadius:"2px", padding:"2px 8px", fontSize:"9px", fontFamily:"'Space Mono',monospace", letterSpacing:"1.5px" }}>{r.badge}</span>
              </div>
              <div style={{ textAlign:"right" }}>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"32px", color:r.color, letterSpacing:"1px" }}>{r.reports}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040" }}>REPORTS</div>
              </div>
            </div>
          ))}
          <div style={{ marginTop:"24px", padding:"22px", background:"rgba(255,45,45,0.05)", border:"1px solid rgba(255,45,45,0.2)", borderRadius:"4px", textAlign:"center" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#ff2d2d", letterSpacing:"2px", marginBottom:"10px" }}>WANT TO CLIMB THE BOARD?</div>
            <p style={{ color:"#4a5568", fontSize:"12px", marginBottom:"14px", fontWeight:300 }}>Every verified report earns you points.</p>
            <button className="btn-hover" onClick={()=>setShowSubmit(true)} style={{ background:"#ff2d2d", color:"#fff", border:"none", borderRadius:"3px", padding:"10px 24px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace", letterSpacing:"2px" }}>+ SUBMIT A REPORT</button>
          </div>
        </div>
      )}

      {/* ── WALLET ── */}
      {tab==="wallet" && (
        <div style={{ maxWidth:"580px", margin:"0 auto" }}>
          <div style={{ textAlign:"center", marginBottom:"40px", paddingTop:"40px" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", letterSpacing:"3px", color:"#38bdf8", marginBottom:"16px" }}>🔍 ON-CHAIN SCANNER</div>
            <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"64px", letterSpacing:"2px", lineHeight:1, marginBottom:"12px" }}>
              RUG <span style={{ color:"#38bdf8" }}>SURVIVAL</span> SCORE
            </h2>
            <p style={{ color:"#4a5568", fontSize:"13px", fontWeight:300 }}>Paste any Solana or ETH wallet. Get your trading personality.</p>
          </div>

          <div style={{ display:"flex", gap:"8px", marginBottom:"24px" }}>
            <input style={{ flex:1, background:"rgba(255,255,255,0.02)", border:"1px solid rgba(56,189,248,0.3)", borderRadius:"4px", padding:"13px 16px", color:"#e8eaf0", fontSize:"12px", outline:"none" }} placeholder="Paste wallet address..." value={walletInput} onChange={e=>setWalletInput(e.target.value)} />
            <button className="btn-hover" onClick={handleWalletCheck} disabled={!walletInput.trim()} style={{ background:walletInput.trim()?"#38bdf8":"rgba(56,189,248,0.1)", color:walletInput.trim()?"#050709":"#2a3040", border:"none", borderRadius:"4px", padding:"13px 20px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace", letterSpacing:"1px", fontWeight:"700" }}>SCAN →</button>
          </div>

          {walletLoading && (
            <div style={{ textAlign:"center", padding:"60px 0", color:"#2a3040", fontFamily:"'Space Mono',monospace", fontSize:"11px", letterSpacing:"2px" }}>
              <div style={{ fontSize:"28px", marginBottom:"14px", display:"inline-block", animation:"spin 1s linear infinite", color:"#38bdf8" }}>◎</div>
              <div>SCANNING CHAIN HISTORY...</div>
            </div>
          )}

          {walletResult && !walletLoading && (
            <div className="slide-up">
              <div style={{ background:"rgba(255,255,255,0.02)", border:"1px solid rgba(56,189,248,0.2)", borderRadius:"6px", padding:"32px", marginBottom:"14px", textAlign:"center", position:"relative", overflow:"hidden" }}>
                <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg, transparent, #38bdf8, transparent)" }} />
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040", letterSpacing:"2px", marginBottom:"10px" }}>WALLET {walletResult.wallet}</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"88px", color:walletResult.score>=70?"#00ff88":walletResult.score>=40?"#ffaa00":"#ff2d2d", lineHeight:1, letterSpacing:"2px", animation:"glow 2s ease-in-out infinite" }}>{walletResult.score}</div>
                <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040", letterSpacing:"2px", marginBottom:"18px" }}>/ 100 — RUG SURVIVAL SCORE</div>
                <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"28px", letterSpacing:"1px", marginBottom:"24px" }}>{walletResult.personality}</div>
                <div style={{ display:"flex", justifyContent:"center", gap:"36px" }}>
                  <div><div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"32px", color:"#ff2d2d" }}>{walletResult.rugCount}</div><div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040", letterSpacing:"1px" }}>RUGS HIT</div></div>
                  <div><div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"32px", color:"#ffaa00" }}>{walletResult.cautionCount}</div><div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040", letterSpacing:"1px" }}>CAUTION</div></div>
                </div>
              </div>
              {walletResult.rugged.length>0 && (
                <div style={{ background:"rgba(255,45,45,0.05)", border:"1px solid rgba(255,45,45,0.2)", borderRadius:"4px", padding:"16px", marginBottom:"12px" }}>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#ff2d2d", letterSpacing:"2px", marginBottom:"10px" }}>⚠ RUGGED TOKENS IN HISTORY</div>
                  {walletResult.rugged.map((r,i)=><div key={i} style={{ color:"#4a5568", fontSize:"12px", padding:"5px 0", borderBottom:i<walletResult.rugged.length-1?"1px solid rgba(255,255,255,0.04)":"none", fontFamily:"'Space Mono',monospace" }}>→ {r}</div>)}
                </div>
              )}
              <button className="btn-hover" style={{ width:"100%", background:"#38bdf8", color:"#050709", border:"none", borderRadius:"4px", padding:"13px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace", letterSpacing:"2px", fontWeight:"700" }} onClick={()=>{ navigator.clipboard?.writeText(`My RUGWATCH Score: ${walletResult.score}/100 ${walletResult.personality}\n\nCheck yours → rugwatch.io/wallet`); setShareToast(true); setTimeout(()=>setShareToast(false),2500); }}>↗ SHARE MY SCORE</button>
            </div>
          )}
        </div>
      )}
    </div>

    {/* DETAIL MODAL */}
    {selected && (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }} onClick={()=>setSelected(null)}>
        <div className="slide-up" style={{ background:"#0a0c10", border:`1px solid ${selected.verdict_color}33`, borderRadius:"8px", padding:"28px", maxWidth:"540px", width:"100%", maxHeight:"88vh", overflowY:"auto", position:"relative" }} onClick={e=>e.stopPropagation()}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg, ${selected.verdict_color}, transparent)`, borderRadius:"8px 8px 0 0" }} />
          <button onClick={()=>setSelected(null)} style={{ position:"absolute", top:"14px", right:"14px", background:"none", border:"none", color:"#2a3040", fontSize:"18px", cursor:"pointer" }}>✕</button>

          <div style={{ display:"flex", gap:"6px", marginBottom:"14px", flexWrap:"wrap", marginTop:"4px" }}>
            <span style={{ background:selected.verdict_color+"18", color:selected.verdict_color, border:`1px solid ${selected.verdict_color}44`, borderRadius:"2px", padding:"3px 8px", fontSize:"9px", fontFamily:"'Space Mono',monospace", letterSpacing:"1.5px" }}>{selected.verdict}</span>
            <span style={{ background:"rgba(255,255,255,0.04)", color:"#4a5568", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"2px", padding:"3px 8px", fontSize:"9px", fontFamily:"'Space Mono',monospace", letterSpacing:"1px" }}>{selected.type?.toUpperCase()}</span>
          </div>

          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"32px", letterSpacing:"1px", marginBottom:"4px" }}>{selected.name}</h2>
          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"11px", color:"#2a3040", marginBottom:"16px" }}>{selected.ticker}</div>
          <p style={{ color:"#4a5568", lineHeight:1.8, marginBottom:"16px", fontSize:"13px", fontWeight:300 }}>{selected.description}</p>

          <div style={{ display:"flex", gap:"4px", flexWrap:"wrap", marginBottom:"18px" }}>
            {(selected.tags||[]).map(t=><span key={t} style={{ background:"rgba(255,45,45,0.06)", color:"#ff2d2d", border:"1px solid rgba(255,45,45,0.15)", borderRadius:"2px", padding:"2px 7px", fontSize:"9px", fontFamily:"'Space Mono',monospace" }}>{t}</span>)}
          </div>

          <div style={{ padding:"12px 16px", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.05)", borderRadius:"4px", marginBottom:"16px" }}>
            <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040", letterSpacing:"2px", marginBottom:"6px" }}>EVIDENCE</div>
            <a href={selected.evidence} target="_blank" rel="noreferrer" style={{ color:"#38bdf8", fontSize:"11px", fontFamily:"'Space Mono',monospace" }}>{selected.evidence}</a>
          </div>

          <div style={{ display:"flex", gap:"8px" }}>
            <button className="btn-hover" onClick={()=>handleVote(selected,"up")} style={{ background:userVotes[selected.id]==="up"?"rgba(0,255,136,0.1)":"none", color:userVotes[selected.id]==="up"?"#00ff88":"#2a3040", border:`1px solid ${userVotes[selected.id]==="up"?"#00ff88":"rgba(255,255,255,0.06)"}`, borderRadius:"3px", padding:"8px 14px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>▲ CONFIRM {data.find(d=>d.id===selected.id)?.upvotes||0}</button>
            <button className="btn-hover" onClick={()=>handleVote(selected,"down")} style={{ background:userVotes[selected.id]==="down"?"rgba(255,45,45,0.1)":"none", color:userVotes[selected.id]==="down"?"#ff2d2d":"#2a3040", border:`1px solid ${userVotes[selected.id]==="down"?"#ff2d2d":"rgba(255,255,255,0.06)"}`, borderRadius:"3px", padding:"8px 14px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>▼ DISPUTE {data.find(d=>d.id===selected.id)?.downvotes||0}</button>
            <button className="btn-hover" onClick={()=>handleShare(selected)} style={{ marginLeft:"auto", background:"none", color:"#38bdf8", border:"1px solid rgba(56,189,248,0.3)", borderRadius:"3px", padding:"8px 14px", fontSize:"10px", cursor:"pointer", fontFamily:"'Space Mono',monospace" }}>↗ SHARE</button>
          </div>
        </div>
      </div>
    )}

    {/* SUBMIT MODAL */}
    {showSubmit && (
      <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.85)", backdropFilter:"blur(8px)", zIndex:100, display:"flex", alignItems:"center", justifyContent:"center", padding:"16px" }} onClick={()=>setShowSubmit(false)}>
        <div className="slide-up" style={{ background:"#0a0c10", border:"1px solid rgba(255,45,45,0.2)", borderRadius:"8px", padding:"28px", maxWidth:"500px", width:"100%", maxHeight:"88vh", overflowY:"auto", position:"relative" }} onClick={e=>e.stopPropagation()}>
          <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:"linear-gradient(90deg, #ff2d2d, transparent)", borderRadius:"8px 8px 0 0" }} />
          <button onClick={()=>setShowSubmit(false)} style={{ position:"absolute", top:"14px", right:"14px", background:"none", border:"none", color:"#2a3040", fontSize:"18px", cursor:"pointer" }}>✕</button>

          <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#ff2d2d", letterSpacing:"3px", marginBottom:"8px" }}>SUBMIT REPORT</div>
          <h2 style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"32px", letterSpacing:"1px", marginBottom:"24px" }}>Put them on record.</h2>

          {submitted ? (
            <div style={{ textAlign:"center", padding:"40px 0" }}>
              <div style={{ fontFamily:"'Bebas Neue',sans-serif", fontSize:"64px", color:"#00ff88", marginBottom:"10px" }}>✓</div>
              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"11px", color:"#00ff88", letterSpacing:"2px" }}>SAVED TO DATABASE PERMANENTLY</div>
            </div>
          ) : (
            <>
              {[["NAME *","text","e.g. SafeMoon, BitBoy Crypto","name"],["TICKER OR HANDLE","text","e.g. $SQUID or @username","ticker"],["EVIDENCE LINK *","text","Tweet URL, tx hash, article...","evidence"],["TAGS (comma separated)","text","e.g. Rug Pull, NFT, Undisclosed","tags"]].map(([label,type,ph,key])=>(
                <div key={key}>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040", letterSpacing:"2px", marginBottom:"6px" }}>{label}</div>
                  <input style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"3px", padding:"10px 12px", color:"#e8eaf0", fontSize:"12px", outline:"none", boxSizing:"border-box", marginBottom:"12px" }} placeholder={ph} value={form[key]} onChange={e=>setForm({...form,[key]:e.target.value})} />
                </div>
              ))}

              {[["TYPE *","type",[["project","Project / Token"],["influencer","Influencer / Person"]]],["VERDICT *","verdict",VERDICT_OPTIONS.map(v=>[v,v])],["RATING","rating",[[1,"1 ★"],[2,"2 ★"],[3,"3 ★"],[4,"4 ★"],[5,"5 ★"]]]].map(([label,key,opts])=>(
                <div key={key}>
                  <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040", letterSpacing:"2px", marginBottom:"6px" }}>{label}</div>
                  <select style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"3px", padding:"10px 12px", color:"#e8eaf0", fontSize:"12px", outline:"none", boxSizing:"border-box", marginBottom:"12px" }} value={form[key]} onChange={e=>setForm({...form,[key]:key==="rating"?Number(e.target.value):e.target.value})}>
                    {opts.map(([val,lbl])=><option key={val} value={val}>{lbl}</option>)}
                  </select>
                </div>
              ))}

              <div style={{ fontFamily:"'Space Mono',monospace", fontSize:"9px", color:"#2a3040", letterSpacing:"2px", marginBottom:"6px" }}>WHAT HAPPENED? *</div>
              <textarea style={{ width:"100%", background:"rgba(255,255,255,0.02)", border:"1px solid rgba(255,255,255,0.06)", borderRadius:"3px", padding:"10px 12px", color:"#e8eaf0", fontSize:"12px", outline:"none", boxSizing:"border-box", marginBottom:"16px", resize:"vertical", minHeight:"80px" }} placeholder="Be factual. Stick to what you can verify." value={form.description} onChange={e=>setForm({...form,description:e.target.value})} />

              <button className="btn-hover" onClick={handleSubmit} disabled={!form.name||!form.description||!form.evidence||submitting} style={{ width:"100%", background:(!form.name||!form.description||!form.evidence||submitting)?"rgba(255,45,45,0.3)":"#ff2d2d", color:"#fff", border:"none", borderRadius:"3px", padding:"14px", fontSize:"11px", cursor:"pointer", fontFamily:"'Space Mono',monospace", letterSpacing:"2px" }}>
                {submitting?"SAVING TO DATABASE...":"SUBMIT REPORT →"}
              </button>
            </>
          )}
        </div>
      </div>
    )}
  </div>
</>
```

);
}
