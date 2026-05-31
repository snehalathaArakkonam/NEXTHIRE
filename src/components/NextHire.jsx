import React, { useState, useEffect, useRef, useCallback } from "react";

const css = `
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#060609;--bg2:#0c0c16;--surface:rgba(255,255,255,0.04);--surface2:rgba(255,255,255,0.08);
    --border:rgba(255,255,255,0.08);--border2:rgba(255,255,255,0.15);
    --text:#eeeef8;--text2:#8888aa;--text3:#44445a;
    --accent:#7c6aff;--accent2:#a855f7;--cyan:#06b6d4;
    --green:#22c55e;--red:#ef4444;--amber:#f59e0b;
    --r:14px;--r2:10px;--r3:6px;
    --font:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
  }
  html{scroll-behavior:smooth}
  body{font-family:var(--font);background:var(--bg);color:var(--text);overflow-x:hidden;-webkit-font-smoothing:antialiased}
  ::-webkit-scrollbar{width:5px}::-webkit-scrollbar-track{background:var(--bg2)}::-webkit-scrollbar-thumb{background:var(--accent);border-radius:3px}

  /* AURORA (background only, must not affect layout) */
  .aurora{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}
  .orb{position:absolute;border-radius:50%;filter:blur(90px);opacity:.1}
  .orb1{width:500px;height:500px;background:radial-gradient(#7c6aff,transparent);top:-150px;left:-100px;animation:fo 14s ease-in-out infinite}
  .orb2{width:400px;height:400px;background:radial-gradient(#a855f7,transparent);top:30%;right:-100px;animation:fo 14s ease-in-out -5s infinite}
  .orb3{width:350px;height:350px;background:radial-gradient(#06b6d4,transparent);bottom:5%;left:25%;animation:fo 14s ease-in-out -9s infinite}
  @keyframes fo{0%,100%{transform:translate(0,0)}50%{transform:translate(25px,-25px)}}

  /* NAV */
  .nav{position:fixed;top:18px;left:50%;transform:translateX(-50%);z-index:100;background:rgba(8,8,16,.75);backdrop-filter:blur(18px);border:1px solid var(--border2);border-radius:100px;padding:9px 22px;display:flex;align-items:center;gap:28px;box-shadow:0 6px 28px rgba(0,0,0,.4)}
  .nav-logo{font-size:17px;font-weight:800;background:linear-gradient(135deg,#fff,var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;letter-spacing:-.5px}
  .nav-links{display:flex;gap:2px}
  .nav-link{background:none;border:none;color:var(--text2);font-size:14px;font-weight:500;padding:6px 13px;border-radius:100px;cursor:pointer;transition:.2s}
  .nav-link:hover,.nav-link.on{color:var(--text);background:var(--surface2)}
  .nav-cta{background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;color:#fff;font-size:13px;font-weight:700;padding:8px 18px;border-radius:100px;cursor:pointer;transition:.2s;box-shadow:0 4px 14px rgba(124,106,255,.35)}
  .nav-cta:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(124,106,255,.5)}
  @media(max-width:650px){.nav-links{display:none}.nav{gap:14px}}

  /* HERO */
  .hero{position:relative;z-index:2;min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;padding:110px 20px 70px}
  .badge{display:inline-flex;align-items:center;gap:7px;background:rgba(124,106,255,.1);border:1px solid rgba(124,106,255,.3);border-radius:100px;padding:5px 14px;font-size:13px;color:var(--accent);font-weight:600;margin-bottom:28px;animation:fu .6s ease both}
  .bdot{width:6px;height:6px;background:var(--accent);border-radius:50%;animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1}50%{opacity:.3}}
  .h-title{font-size:clamp(44px,7.5vw,90px);font-weight:800;line-height:1;letter-spacing:-2.5px;margin-bottom:20px;animation:fu .6s .1s ease both}
  .h-t1{display:block;color:var(--text)}
  .h-t2{display:block;background:linear-gradient(135deg,var(--accent) 0%,var(--accent2) 50%,var(--cyan) 100%);-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .h-sub{font-size:17px;color:var(--text2);max-width:520px;line-height:1.7;margin-bottom:40px;animation:fu .6s .2s ease both}
  .h-btns{display:flex;gap:14px;flex-wrap:wrap;justify-content:center;animation:fu .6s .3s ease both}
  .btn-p{background:linear-gradient(135deg,var(--accent),var(--accent2));border:none;color:#fff;font-size:15px;font-weight:700;padding:13px 30px;border-radius:100px;cursor:pointer;transition:.3s;box-shadow:0 7px 26px rgba(124,106,255,.4)}
  .btn-p:hover{transform:translateY(-2px);box-shadow:0 11px 36px rgba(124,106,255,.6)}
  .btn-s{background:var(--surface);border:1px solid var(--border2);color:var(--text);font-size:15px;font-weight:600;padding:13px 30px;border-radius:100px;cursor:pointer;transition:.25s;backdrop-filter:blur(8px)}
  .btn-s:hover{background:var(--surface2);border-color:var(--accent)}
  @keyframes fu{from{opacity:0;transform:translateY(18px)}to{opacity:1;transform:translateY(0)}}

  /* STATS (centered flex strip) */
  .stats{position:relative;z-index:2;display:flex;justify-content:center;max-width:720px;margin:0 auto 60px;padding:0 20px;flex-wrap:wrap;width:100%}
  .stat{flex:1;min-width:140px;text-align:center;padding:22px 18px;border:1px solid var(--border);background:var(--surface)}
  .stat:first-child{border-radius:var(--r) 0 0 var(--r)}
  .stat:last-child{border-radius:0 var(--r) var(--r) 0}
  .stat+.stat{border-left:none}
  .snum{font-size:34px;font-weight:800;background:linear-gradient(135deg,var(--text),var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent}
  .slbl{font-size:12px;color:var(--text2);margin-top:3px}

  /* MARQUEE */
  .mq{position:relative;z-index:2;overflow:hidden;width:100%;padding:26px 0;border-top:1px solid var(--border);border-bottom:1px solid var(--border);margin-bottom:70px}
  .mq-inner{display:flex;flex-direction:row;white-space:nowrap;width:max-content;gap:40px;animation:mq 28s linear infinite}
  .mq-item{font-size:13px;font-weight:600;color:var(--text2);display:flex;align-items:center;gap:10px}
  .mq-item span{color:var(--accent)}
  @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}

  /* SECTION wrapper (tools, features) — center container */
  .sec{position:relative;z-index:2;max-width:1160px;margin:0 auto;padding:70px 20px;width:100%}
  .sec-tag{font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;color:var(--accent);margin-bottom:10px}
  .sec-title{font-size:clamp(28px,3.5vw,48px);font-weight:800;letter-spacing:-1px;margin-bottom:14px}
  .sec-sub{font-size:16px;color:var(--text2);max-width:500px;line-height:1.7;margin-bottom:40px}

  /* TABS (left-aligned within section) */
  .tabs{display:flex;gap:6px;background:var(--surface);border:1px solid var(--border);border-radius:100px;padding:5px;width:fit-content;margin-bottom:36px}
  .tab{background:none;border:none;color:var(--text2);font-size:14px;font-weight:600;padding:9px 24px;border-radius:100px;cursor:pointer;transition:.25s;white-space:nowrap}
  .tab.on{background:linear-gradient(135deg,var(--accent),var(--accent2));color:#fff;box-shadow:0 4px 16px rgba(124,106,255,.4)}

  /* TOOL GRID */
  .tgrid{display:grid;grid-template-columns:1fr 1fr;gap:20px;width:100%}
  @media(max-width:860px){.tgrid{grid-template-columns:1fr}}

  /* BENTO (features grid) */
  .bento{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;width:100%}
  @media(max-width:860px){.bento{grid-template-columns:1fr 1fr}}
  @media(max-width:560px){.bento{grid-template-columns:1fr}}
  .bc{background:var(--surface);border:1px solid var(--border);border-radius:var(--r);padding:24px;transition:.3s;position:relative;overflow:hidden}
  .bc:hover{border-color:var(--border2);transform:translateY(-2px)}
  .bc.lg{grid-column:span 2}
  .bc-ico{font-size:30px;margin-bottom:14px;display:block}
  .bc-ttl{font-size:18px;font-weight:800;margin-bottom:7px;letter-spacing:-.3px}
  .bc-desc{font-size:13px;color:var(--text2);line-height:1.7}

  /* PANEL and form elements should sit above aurora */
  .panel{background:rgba(255,255,255,0.025);backdrop-filter:blur(16px);border:1px solid var(--border);border-radius:var(--r);padding:24px;position:relative;z-index:2;overflow:hidden;transition:border-color .3s}

  /* FOOTER */
  .footer{width:100%;text-align:center;padding:44px 20px;position:relative;z-index:2;border-top:1px solid var(--border)}
  .f-logo{font-size:22px;font-weight:800;background:linear-gradient(135deg,#fff,var(--accent));-webkit-background-clip:text;-webkit-text-fill-color:transparent;margin-bottom:10px}
  .f-sub{font-size:13px;color:var(--text3)}

  /* Ensure visible sections render above background */
  .hero, .sec, .stats, .mq, .panel, .bento, .footer { position: relative; z-index: 2 }

  /* small helpers */
  .lbl{font-size:13px;font-weight:600;color:var(--text2);margin-bottom:7px;display:block}
  .ta{width:100%;background:var(--surface);border:1px solid var(--border2);border-radius:var(--r2);color:var(--text);font-family:var(--font);font-size:14px;line-height:1.7;padding:14px;resize:vertical;min-height:160px;outline:none;transition:border-color .2s}
  .inp{width:100%;background:var(--surface);border:1px solid var(--border2);border-radius:var(--r2);color:var(--text);font-family:var(--font);font-size:14px;padding:11px 14px;outline:none;transition:border-color .2s}

  /* MARQUEE animation remains */
  @keyframes mq{from{transform:translateX(0)}to{transform:translateX(-50%)}}
`;

const MQ_ITEMS = ["ATS Score Analysis","Skill Gap Detection","AI Resume Improvements","Professional Email Writer","Tone Customization","Keyword Optimizer","Cover Letter Generator","LinkedIn Summary","Job Match Score","Real-time Feedback"];

const TONES = [
  {id:"professional",name:"Professional",desc:"Formal & polished",e:"💼"},
  {id:"friendly",name:"Friendly",desc:"Warm & approachable",e:"😊"},
  {id:"confident",name:"Confident",desc:"Bold & assertive",e:"🚀"},
  {id:"concise",name:"Concise",desc:"Short & direct",e:"⚡"},
  {id:"persuasive",name:"Persuasive",desc:"Compelling & strong",e:"🎯"},
  {id:"formal",name:"Formal",desc:"Corporate & precise",e:"🏛️"},
];

const EMAIL_TYPES = [
  {id:"job_application",label:"Job Application"},
  {id:"follow_up",label:"Follow-up"},
  {id:"cold_outreach",label:"Cold Outreach"},
  {id:"cover_letter",label:"Cover Letter"},
  {id:"thank_you",label:"Thank You"},
  {id:"networking",label:"Networking"},
];

function sc(s){if(s>=80)return"#22c55e";if(s>=60)return"#f59e0b";return"#ef4444"}
function sl(s){if(s>=85)return"Excellent";if(s>=70)return"Good";if(s>=55)return"Average";return"Needs Work"}

async function ai(sys,usr){
  const r=await fetch("https://api.anthropic.com/v1/messages",{
    method:"POST",
    headers:{"Content-Type":"application/json"},
    body:JSON.stringify({model:"claude-haiku-4-5",max_tokens:1500,system:sys,messages:[{role:"user",content:usr}]})
  });
  if(!r.ok){const e=await r.json().catch(()=>({}));throw new Error(e?.error?.message||`Error ${r.status}`)}
  const d=await r.json();
  return d.content?.[0]?.text||"";
}

const RSYS=`You are an expert ATS resume analyst. Analyze the resume and return ONLY valid JSON (no markdown, no backticks, no extra text):
{"ats_score":<0-100>,"score_breakdown":{"keywords":<0-100>,"formatting":<0-100>,"experience":<0-100>,"skills":<0-100>},"present_skills":["4-8 skills found"],"missing_skills":["3-6 missing skills"],"suggested_skills":["3-5 to add"],"improvements":["exactly 5 actionable suggestions"],"summary":"2 sentence summary"}
Be accurate and honest. Score based on actual content.`;

const ESYS=`You are an expert professional email writer. Return ONLY the complete email. Start with "Subject: ..." then blank line then full body. No JSON, no markdown, no explanation. Ready to send.`;

function Ring({score}){
  const R=36,C=2*Math.PI*R,off=C-(score/100)*C,col=sc(score);
  return(
    <div className="ring">
      <svg width="90" height="90" viewBox="0 0 90 90">
        <circle fill="none" stroke="rgba(255,255,255,.07)" strokeWidth="7" cx="45" cy="45" r={R}/>
        <circle fill="none" stroke={col} strokeWidth="7" strokeLinecap="round" cx="45" cy="45" r={R}
          strokeDasharray={C} strokeDashoffset={off}/>
      </svg>
      <div className="rc"><span className="rnum" style={{color:col}}>{score}</span><span className="rlbl">ATS</span></div>
    </div>
  );
}

function PBar({label,val,color}){
  return(
    <div className="pbar">
      <div className="pbl"><span>{label}</span><span style={{color}}>{val}%</span></div>
      <div className="pbt"><div className="pbf" style={{width:`${val}%`,background:color}}/></div>
    </div>
  );
}

function ResumeTab(){
  const [txt,setTxt]=useState("");const [jd,setJd]=useState("");
  const [load,setLoad]=useState(false);const [res,setRes]=useState(null);
  const [err,setErr]=useState("");const [cop,setCop]=useState(false);
  const fRef=useRef();

  const readFile=useCallback(f=>{
    if(!f)return;
    if(f.type==="application/pdf"){setTxt(`[PDF: ${f.name}]\n\nPlease also paste your resume text below for accurate analysis.`);return;}
    const r=new FileReader();r.onload=e=>setTxt(e.target.result);r.readAsText(f);
  },[]);

  const onDrop=useCallback(e=>{e.preventDefault();readFile(e.dataTransfer.files[0]);},[readFile]);

  const analyze=async()=>{
    if(!txt.trim()||txt.trim().length<50){setErr("Please paste your resume text (at least 50 characters) for accurate analysis.");return;}
    setErr("");setLoad(true);setRes(null);
    try{
      const raw=await ai(RSYS,`RESUME:\n${txt}\n\n${jd.trim()?`JOB DESCRIPTION:\n${jd}`:"No JD provided — use general standards."}`);
      let c=raw.trim();if(c.startsWith("```"))c=c.replace(/```json?\n?/g,"").replace(/```$/g,"").trim();
      setRes(JSON.parse(c));
    }catch(e){setErr("Analysis failed: "+e.message);} 
    finally{setLoad(false);} 
  };

  const copy=()=>{if(!res)return;navigator.clipboard.writeText(res.improvements.join("\n"));setCop(true);setTimeout(()=>setCop(false),2000);};

  return(
    <div className="tgrid">
      <div className="panel">
        <div className="ptitle">📄 Resume Input</div>
        <div className="ff">
          <label className="lbl">Upload or Paste Resume</label>
          <div className={`upzone ${txt?"ok":""}`} onDrop={onDrop} onDragOver={e=>e.preventDefault()} onClick={()=>fRef.current?.click()}>
            <input ref={fRef} type="file" accept=".txt,.pdf,.doc" className="up-input" onChange={e=>readFile(e.target.files[0])}/>
            <span className="up-icon">{txt?"✅":"📁"}</span>
            <div className="up-txt">{txt?"File loaded!":"Drop resume here"}</div>
            <div className="up-sub">{txt?"Or edit text below":"TXT, PDF — or paste below"}</div>
          </div>
        </div>
        <div className="ff">
          <label className="lbl">Resume Text <span style={{color:"var(--text3)"}}>*paste for best results</span></label>
          <textarea className="ta" placeholder={"Paste your full resume here...\n\nInclude: Work experience, education, skills, certifications..."} value={txt} onChange={e=>setTxt(e.target.value)} style={{minHeight:190}}/>
          <div className="cc">{txt.length} chars</div>
        </div>
        <div className="ff">
          <label className="lbl">Job Description <span style={{color:"var(--text3)"}}>optional</span></label>
          <textarea className="ta" placeholder="Paste JD for targeted ATS match score..." value={jd} onChange={e=>setJd(e.target.value)} style={{minHeight:110}}/>
        </div>
        {err&&<div className="err">{err}</div>}
        <button className="abtn" onClick={analyze} disabled={load||!txt.trim()}>
          {load?"Analyzing...":"🔍 Analyze Resume"}
          {!load&&<div className="shimmer"/>}
        </button>
      </div>

      <div className="panel">
        <div className="ptitle">📊 Analysis Results</div>
        {load&&<div className="ldwrap"><div className="spin"/><div className="ldtxt">Running ATS analysis...</div></div>}
        {!load&&!res&&<div className="empty"><div className="empty-ico">🤖</div><div className="empty-ttl">Ready to analyze</div><div className="empty-sub">Paste your resume and click Analyze</div></div>}
        {!load&&res&&(
          <div className="res">
            <div className="rsec">
              <div className="ring-wrap">
                <Ring score={res.ats_score}/>
                <div className="ri"><h3 style={{color:sc(res.ats_score)}}>{sl(res.ats_score)}</h3><p>{res.summary}</p></div>
              </div>
              {res.score_breakdown&&<>
                <PBar label="Keywords" val={res.score_breakdown.keywords} color="#7c6aff"/>
                <PBar label="Formatting" val={res.score_breakdown.formatting} color="#06b6d4"/>
                <PBar label="Experience" val={res.score_breakdown.experience} color="#a855f7"/>
                <PBar label="Skills" val={res.score_breakdown.skills} color="#22c55e"/>
              </>}
            </div>
            <div className="rsec">
              <div className="rsh"><div className="dot" style={{background:"#22c55e"}}/>Skills Found</div>
              <div className="stags">{(res.present_skills||[]).map((s,i)=><span key={i} className="stag sg">{s}</span>)}</div>
            </div>
            <div className="rsec">
              <div className="rsh"><div className="dot" style={{background:"#ef4444"}}/>Missing Skills</div>
              <div className="stags">{(res.missing_skills||[]).map((s,i)=><span key={i} className="stag sr">{s}</span>)}</div>
            </div>
            <div className="rsec">
              <div className="rsh"><div className="dot" style={{background:"var(--accent)"}}/>Add These Skills</div>
              <div className="stags">{(res.suggested_skills||[]).map((s,i)=><span key={i} className="stag sp">{s}</span>)}</div>
            </div>
            <div className="rsec">
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:12}}>
                <div className="rsh" style={{marginBottom:0}}><div className="dot" style={{background:"#f59e0b"}}/>AI Improvements</div>
                <button className={`cbtn ${cop?"ok":""}`} onClick={copy}>{cop?"✓ Copied!":"Copy"}</button>
              </div>
              <div className="implist">{(res.improvements||[]).map((m,i)=><div key={i} className="impitem"><div className="impico">✦</div><span>{m}</span></div>)}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function EmailTab(){
  const [tone,setTone]=useState("professional");const [etype,setEtype]=useState("job_application");
  const [ctx,setCtx]=useState("");const [rn,setRn]=useState("");const [yn,setYn]=useState("");
  const [co,setCo]=useState("");const [rl,setRl]=useState("");
  const [load,setLoad]=useState(false);const [email,setEmail]=useState("");
  const [err,setErr]=useState("");const [cop,setCop]=useState(false);

  const gen=async()=>{
    if(!ctx.trim()){setErr("Please describe what this email is about.");return;}
    setErr("");setLoad(true);setEmail("");
    try{
      const tl=TONES.find(t=>t.id===tone)?.name||tone;
      const et=EMAIL_TYPES.find(t=>t.id===etype)?.label||etype;
      const r=await ai(ESYS,`Write a ${et} email with ${tl} tone.\nFrom: ${yn||"Applicant"}\nTo: ${rn||"Hiring Manager"}\nCompany: ${co||"the company"}\nRole: ${rl||"the position"}\nContext: ${ctx}`);
      setEmail(r.trim());
    }catch(e){setErr("Failed: "+e.message);} 
    finally{setLoad(false);} 
  };

  const copy=()=>{navigator.clipboard.writeText(email);setCop(true);setTimeout(()=>setCop(false),2000);};

  return(
    <div className="tgrid">
      <div className="panel">
        <div className="ptitle">✉️ Email Setup</div>
        <div className="ff">
          <label className="lbl">Email Type</label>
          <div className="chips">{EMAIL_TYPES.map(t=><button key={t.id} className={`chip ${etype===t.id?"on":""}`} onClick={()=>setEtype(t.id)}>{t.label}</button>)}</div>
        </div>
        <div className="ff">
          <label className="lbl">Tone</label>
          <div className="tones">{TONES.map(t=><div key={t.id} className={`tone ${tone===t.id?"on":""}`} onClick={()=>setTone(t.id)}><div className="tn">{t.e} {t.name}</div><div className="td">{t.desc}</div></div>)}</div>
        </div>
        <div className="g2">
          <div><label className="lbl">Your Name</label><input className="inp" placeholder="Alex Johnson" value={yn} onChange={e=>setYn(e.target.value)}/></div>
          <div><label className="lbl">Recipient</label><input className="inp" placeholder="Sarah Smith" value={rn} onChange={e=>setRn(e.target.value)}/></div>
          <div><label className="lbl">Company</label><input className="inp" placeholder="Google" value={co} onChange={e=>setCo(e.target.value)}/></div>
          <div><label className="lbl">Role</label><input className="inp" placeholder="Software Engineer" value={rl} onChange={e=>setRl(e.target.value)}/></div>
        </div>
        <div className="ff">
          <label className="lbl">Context & Key Points</label>
          <textarea className="ta" placeholder={"What is this email about?\n\nE.g. Following up on application, 5 years React experience, completed major project..."} value={ctx} onChange={e=>setCtx(e.target.value)} style={{minHeight:130}}/>
          <div className="cc">{ctx.length} chars</div>
        </div>
        {err&&<div className="err">{err}</div>}
        <button className="abtn" onClick={gen} disabled={load||!ctx.trim()}>
          {load?"Writing email...":"✍️ Generate Email"}
          {!load&&<div className="shimmer"/>}
        </button>
      </div>

      <div className="panel">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:18}}>
          <div className="ptitle" style={{marginBottom:0}}>📬 Generated Email</div>
          {email&&<div className="info-chip">{TONES.find(t=>t.id===tone)?.e} {TONES.find(t=>t.id===tone)?.name}</div>}
        </div>
        {load&&<div className="ldwrap"><div className="spin"/><div className="ldtxt">Crafting your email...</div></div>}
        {!load&&!email&&<div className="empty"><div className="empty-ico">✉️</div><div className="empty-ttl">Ready to write</div><div className="empty-sub">Fill in the details and generate</div></div>}
        {!load&&email&&<>
          <div className="eout">{email}</div>
          <div className="eacts">
            <button className={`cbtn ${cop?"ok":""}`} onClick={copy} style={{flex:1}}>{cop?"✓ Copied!":"📋 Copy Email"}</button>
            <button className="cbtn" onClick={gen} style={{flex:1}}>🔄 Regenerate</button>
          </div>
        </>}
      </div>
    </div>
  );
}

export default function NextHire(){
  const [tab,setTab]=useState("resume");
  const [anav,setAnav]=useState("home");

  useEffect(()=>{
    const s=document.createElement("style");s.textContent=css;document.head.appendChild(s);
    return()=>document.head.removeChild(s);
  },[]);

  const go=id=>{document.getElementById(id)?.scrollIntoView({behavior:"smooth"});setAnav(id);};

  const BENTO=[
    {i:"🎯",t:"ATS Score",d:"Real ATS scoring with keyword analysis and category breakdown.",lg:false},
    {i:"🔍",t:"Skill Gap Analysis",d:"Identify missing skills vs job requirements instantly.",lg:false},
    {i:"✨",t:"AI Improvements",d:"Get 5 specific, actionable suggestions to make your resume stand out to ATS systems and recruiters.",lg:true},
    {i:"✉️",t:"Email Writer",d:"Generate professional emails with 6 tone options.",lg:false},
    {i:"🎭",t:"Tone Selection",d:"Professional, friendly, confident, concise, persuasive, formal.",lg:false},
    {i:"⚡",t:"Instant Results",d:"AI-powered analysis in seconds.",lg:false},
  ];

  const MQ2=[...MQ_ITEMS,...MQ_ITEMS,...MQ_ITEMS];

  return(
    <div>
      <div className="aurora"><div className="orb orb1"/><div className="orb orb2"/><div className="orb orb3"/></div>

      <nav className="nav">
        <div className="nav-logo">NextHire</div>
        <div className="nav-links">
          { ["home","tools","features"].map(n=>(
            <button key={n} className={`nav-link ${anav===n?"on":""}`} onClick={()=>go(n)}>
              {n[0].toUpperCase()+n.slice(1)}
            </button>
          ))}
        </div>
        <button className="nav-cta" onClick={()=>go("tools")}>Get Started →</button>
      </nav>

      <section id="home" className="hero">
        <div className="badge"><div className="bdot"/>AI-Powered Career Tools</div>
        <h1 className="h-title"><span className="h-t1">Land Your</span><span className="h-t2">Dream Job</span></h1>
        <p className="h-sub">Optimize your resume with ATS scoring, identify skill gaps, and craft perfect professional emails — powered by AI.</p>
        <div className="h-btns">
          <button className="btn-p" onClick={()=>go("tools")}>Analyze Resume →</button>
          <button className="btn-s" onClick={()=>{go("tools");setTimeout(()=>setTab("email"),400);}}>Write Email</button>
        </div>
      </section>

      <div className="stats">
        {[["95%","ATS Accuracy"],["6","Tone Options"],["5s","Analysis Time"],["Free","To Use"]].map(([n,l])=>(
          <div key={l} className="stat"><div className="snum">{n}</div><div className="slbl">{l}</div></div>
        ))}
      </div>

      <div className="mq">
        <div className="mq-inner">
          {MQ2.map((item,i)=><div key={i} className="mq-item"><span>✦</span>{item}</div>)}
        </div>
      </div>

      <section id="tools" className="sec">
        <div className="sec-tag">AI Tools</div>
        <h2 className="sec-title">Your Career Toolkit</h2>
        <p className="sec-sub">Powerful AI tools to get you hired faster. Real analysis, no fluff.</p>
        <div className="tabs">
          <button className={`tab ${tab==="resume"?"on":""}`} onClick={()=>setTab("resume")}>📄 Resume Analyzer</button>
          <button className={`tab ${tab==="email"?"on":""}`} onClick={()=>setTab("email")}>✉️ Email Writer</button>
        </div>
        {tab==="resume"?<ResumeTab/>:<EmailTab/>}
      </section>

      <section id="features" className="sec">
        <div className="sec-tag">Features</div>
        <h2 className="sec-title">Everything You Need</h2>
        <p className="sec-sub">Built for job seekers who want results, not busywork.</p>
        <div className="bento">
          {BENTO.map((f,i)=>(
            <div key={i} className={`bc ${f.lg?"lg":""}`}>
              <span className="bc-ico">{f.i}</span>
              <div className="bc-ttl">{f.t}</div>
              <div className="bc-desc">{f.d}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="footer">
        <div className="f-logo">NextHire</div>
        <p className="f-sub">AI-powered career tools — built to get you hired.</p>
        <p style={{marginTop:12,fontSize:11,color:"var(--text3)"}}>Powered by Claude AI · 2026</p>
      </footer>
    </div>
  );
}
