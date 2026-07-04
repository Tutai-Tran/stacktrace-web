"use client";
import React, { useEffect, useState, Fragment } from "react";
import { site } from "./lib/data";
import { SubscribeForm } from "./SubscribeForm";

// split a string into the animated word spans (outline -> slide-in reveal)
const words = (s: string) =>
  s.split(" ").map((w, i, a) => (
    <Fragment key={i}>
      <span className="w"><span className="wi">{w}</span></span>
      {i < a.length - 1 ? " " : ""}
    </Fragment>
  ));

export default function Landing() {
  const [modal, setModal] = useState<null | "issue" | "rubric">(null);
  const s = site;

  useEffect(() => {
    // reveal on scroll (outline->fill, split words, fades)
    const revEls = Array.from(document.querySelectorAll(".stroke, .split, .fade"));
    let io: IntersectionObserver | null = null;
    try {
      io = new IntersectionObserver(
        (entries) => entries.forEach((e) => {
          if (e.isIntersecting) { e.target.classList.add("in"); io!.unobserve(e.target); }
        }),
        { threshold: 0.15, rootMargin: "0px 0px -8% 0px" }
      );
      revEls.forEach((n) => io!.observe(n));
    } catch {}
    const safety = window.setTimeout(() => revEls.forEach((n) => n.classList.add("in")), 2400);

    // magnetic buttons
    const mags = Array.from(document.querySelectorAll<HTMLElement>(".mag"));
    const cleanups: (() => void)[] = [];
    mags.forEach((b) => {
      const mm = (e: MouseEvent) => {
        const r = b.getBoundingClientRect();
        b.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.3}px,${(e.clientY - r.top - r.height / 2) * 0.45}px)`;
      };
      const ml = () => { b.style.transform = ""; };
      b.addEventListener("mousemove", mm);
      b.addEventListener("mouseleave", ml);
      cleanups.push(() => { b.removeEventListener("mousemove", mm); b.removeEventListener("mouseleave", ml); });
    });

    // scroll: active step, marquee velocity skew, hero parallax
    const steps = Array.from(document.querySelectorAll<HTMLElement>(".step"));
    const marqwrap = document.getElementById("marqwrap");
    const paras = Array.from(document.querySelectorAll<HTMLElement>("[data-para]"));
    let lastY = window.scrollY;
    let skewT = 0;
    const reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const onScroll = () => {
      const y = window.scrollY, vh = window.innerHeight;
      if (!reduce) paras.forEach((el) => {
        const r = el.getBoundingClientRect();
        const sp = parseFloat(el.getAttribute("data-speed") || "0.05");
        el.style.transform = `translateY(${(r.top + r.height / 2 - vh / 2) * -sp}px)`;
      });
      if (steps.length) {
        let best = -1, bestD = 1e9;
        steps.forEach((st, i) => {
          const r = st.getBoundingClientRect();
          const d = Math.abs((r.top + r.height / 2) - vh / 2);
          if (d < bestD) { bestD = d; best = i; }
        });
        steps.forEach((st, i) => st.classList.toggle("on", i === best && bestD < vh * 0.55));
      }
      if (marqwrap && !reduce) {
        const v = y - lastY;
        const sk = Math.max(-7, Math.min(7, v * 0.5));
        marqwrap.style.transform = `skewX(${sk}deg)`;
        if (skewT) window.clearTimeout(skewT);
        skewT = window.setTimeout(() => { if (marqwrap) marqwrap.style.transform = "skewX(0deg)"; }, 140);
      }
      lastY = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    onScroll();

    const esc = (e: KeyboardEvent) => { if (e.key === "Escape") setModal(null); };
    document.addEventListener("keydown", esc);

    return () => {
      io?.disconnect();
      window.clearTimeout(safety);
      cleanups.forEach((c) => c());
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("keydown", esc);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = modal ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [modal]);

  const FeedRows = () => (
    <div>
      {s.feed.map((f, i) => (
        <div className="feed-row" key={i}>
          <span className={`fdot ${f.tier}`} />
          <span className={`nm ${f.tier === "fyi" ? "dim" : ""}`}>{f.name}</span>
          <span className={`vv ${f.tier === "fyi" ? "dim" : ""}`}>{f.version}</span>
        </div>
      ))}
    </div>
  );

  return (
    <div style={{ background: "var(--paper)" }}>
      {/* nav */}
      <nav className="nav">
        <div className="wrap nav-inner">
          <div className="brand">
            <img className="brand-mark" src="/brand/logo-80.png" width={28} height={28} alt="" aria-hidden />
            <span className="brand-name">StackTrace</span>
          </div>
          <div className="navlinks">
            <a href="#tiers" className="navlink">severity</a>
            <button className="navlink" onClick={() => setModal("rubric")} style={{ background: "none", border: 0, cursor: "pointer" }}>rubric</button>
            <a href={s.subscribeUrl} className="pill mag">Subscribe</a>
          </div>
        </div>
      </nav>

      {/* hero */}
      <header className="hero">
        <div className="wrap herogrid">
          <div>
            <div className="fade kicker">ISSUE #{s.issueNo}, {s.issueDate}, {s.totalChanges} CHANGES GRADED</div>
            <h1 className="h1">
              <span className="stroke" style={{ display: "block" }}>What changed</span>
              <span className="split" style={{ display: "block" }}>{words("in your stack")}</span>
              <span className="split" style={{ display: "block" }}><span className="w"><span className="wi red">this week.</span></span></span>
            </h1>
            <p className="fade d1 lede">A weekly digest of what changed in 30 developer tools, classified by severity, so you catch the breaking changes before your next deploy.</p>
            <SubscribeForm variant="hero" />
          </div>

          {/* live triage console */}
          <div className="fade d1 hidesmall triage" data-para data-speed="0.04">
            <div className="triage-bar">
              <span className="l">live triage</span>
              <span className="r"><span className="d" />reading changelogs</span>
            </div>
            <div className="triage-body">
              <div className="vfeed"><FeedRows /><FeedRows /></div>
              <div className="triage-mask" />
            </div>
            <div className="triage-foot">
              <span>{s.totalChanges} releases in</span>
              <span><span className="c">{s.critCount}</span> crit · <span className="a">{s.notableCount}</span> notable</span>
            </div>
          </div>
        </div>
        <div className="scrolldown">↓ scroll</div>
      </header>

      {/* severity tiers */}
      <section id="tiers">
        <div className="wrap tiers-head">
          <h2 className="split h2">{words("Three tiers.")}<br />{words("One rubric.")}</h2>
          <p className="fade">Severity is always color plus a shape plus the word, never color alone. Open a tier to see the real thing from Issue #{s.issueNo}.</p>
        </div>

        <details className="tier tier-crit">
          <summary className="tsum">
            <span className="tmark" /><span className="tname">CRITICAL</span>
            <span className="tcount">{s.critCount} IN ISSUE #{s.issueNo}</span><span className="tplus">+</span>
          </summary>
          <div className="tiergrid">
            <p>A breaking change in a stable release, a security fix, or a forced migration, proven by a verbatim quote from the release notes. The only tier with a &quot;Do this:&quot; action box. Read it before your next deploy.</p>
            <div className="tcard">
              <div className="h"><span>{s.critical.tool.toUpperCase()}</span><span className="v">{s.critical.version}</span></div>
              <p>A bug in <span className="mono" style={{ fontSize: 13 }}>@liveblocks/client</span> could cause data loss by overwriting room storage when large WebSocket messages are sent.</p>
              <p className="do">Do this: update to {s.critical.version} immediately.</p>
            </div>
          </div>
        </details>

        <details className="tier tier-not">
          <summary className="tsum">
            <span className="tmark round" /><span className="tname">NOTABLE</span>
            <span className="tcount">{s.notableCount} IN ISSUE #{s.issueNo}</span><span className="tplus">+</span>
          </summary>
          <div className="tiergrid">
            <p>Worth knowing, new capabilities, meaningful features, or non-forced migrations you will want on your radar. Nothing that breaks on deploy.</p>
            <div className="tcard list">
              {s.notable.map((n, i) => (
                <div key={i}><b>{n.version}</b>, {n.summary.replace(/\.$/, "").toLowerCase()}</div>
              ))}
            </div>
          </div>
        </details>

        <details className="tier tier-fyi">
          <summary className="tsum">
            <span className="tmark ring" /><span className="tname">FYI</span>
            <span className="tcount">{s.fyiCount} IN ISSUE #{s.issueNo}</span><span className="tplus">+</span>
          </summary>
          <div className="tiergrid">
            <p>Patches, dependency bumps, and prereleases, collapsed into a single count so the signal stays clean. Prereleases are capped here in code and cannot be inflated.</p>
            <div className="tcard dash" style={{ display: "flex", alignItems: "center" }}>
              <p className="mono" style={{ fontSize: 13, lineHeight: 1.6 }}>+{s.fyiCount} patches, dependency bumps, and prereleases in Issue #{s.issueNo}, folded into one line so you can skip them with a clear conscience.</p>
            </div>
          </div>
        </details>
      </section>

      {/* how it works */}
      <section className="hiwsec">
        <div className="wrap hiw">
          <div className="hiwleft">
            <div className="lbl">HOW IT WORKS</div>
            <h2 className="split h2">{words("Read all of it,")}<br />{words("so you don't.")}</h2>
            <div className="hiwdots"><span>01</span><span>/</span><span>02</span><span>/</span><span>03</span></div>
          </div>
          <div className="steps">
            <div className="step">
              <div className="step-num crit">01</div>
              <div className="step-label">FETCH</div>
              <div className="step-title">Every release, 30 repos.</div>
              <p className="step-desc">The pipeline pulls new releases from 30 GitHub repos every day, patches to major versions, nothing skipped.</p>
            </div>
            <div className="step">
              <div className="step-num amber">02</div>
              <div className="step-label">CLASSIFY</div>
              <div className="step-title">Graded by a public rubric.</div>
              <p className="step-desc">Claude grades each release CRITICAL / NOTABLE / FYI. Every CRITICAL needs a verbatim quote from the notes; prereleases cap at FYI.</p>
            </div>
            <div className="step">
              <div className="step-num fyi">03</div>
              <div className="step-label">REVIEW</div>
              <div className="step-title">Human-supervised QA.</div>
              <p className="step-desc">A second AI editor re-reviews every classification each week; corrections are validated and applied, and the rubric is amended when a pattern repeats.</p>
            </div>
          </div>
        </div>
      </section>

      {/* the proof */}
      <section id="issue" className="issue-sec">
        <div className="inner">
          <div className="fade issue-kicker">THE PROOF, ISSUE #{s.issueNo}</div>
          <button className="issuebtn fade d1" onClick={() => setModal("issue")}>
            <div className="top">
              <div style={{ maxWidth: 640 }}>
                <div className="tag"><span className="sq" />CRITICAL, {s.critical.tool} {s.critical.version}</div>
                <div className="hl">The critical fix your production stack cannot skip this week.</div>
                <p className="p">{s.critical.summary} Open the full issue: {s.critCount} critical, {s.notableCount} notable, +{s.fyiCount} collapsed.</p>
              </div>
              <span className="open">OPEN FULL ISSUE →</span>
            </div>
          </button>
        </div>
      </section>

      {/* stats */}
      <section className="stats-sec">
        <div className="countgrid">
          <div className="stat"><div className="stroke stat-num">30</div><div className="stat-label">TOOLS TRACKED</div></div>
          <div className="stat"><div className="stroke stat-num">{s.totalChanges}</div><div className="stat-label">CHANGES · ISSUE #{s.issueNo}</div></div>
          <div className="stat"><div className="stroke critstroke stat-num">{s.critCount}</div><div className="stat-label">CRITICAL SURFACED</div></div>
        </div>
      </section>

      {/* tools marquee */}
      <section className="tools-sec">
        <div className="fade head"><h2 className="split h2">{words("30 tools, one signal.")}</h2></div>
        <div id="marqwrap" className="marqwrap">
          <div className="marqmask">
            <div className="marqtrack">
              {[...s.tools, ...s.tools].map((t, i) => <span className="chipx" key={i}>{t}</span>)}
            </div>
          </div>
        </div>
        <p className="fade tools-note">Payments · databases · auth · AI SDKs · frontend · runtimes · infra. Added to monthly by request.</p>
      </section>

      {/* faq */}
      <section className="faq">
        <h2 className="stroke h2">FAQ</h2>
        {[
          ["Why not just watch GitHub releases directly?", "Watching 30 repos is 30 noise streams with no triage, 8 Clerk packages bumping the same day, 6 Cloudflare Workers SDK releases in a week, and no signal about which ones actually break your app. StackTrace reads all of them and grades each against a public rubric, so you get the 1 thing that matters, not 100 things that don't."],
          ["How do you stop everything from being marked critical?", "The rubric is deterministic and conservative: CRITICAL requires a breaking change in a stable release, a security fix, or a forced migration, and a verbatim quote from the release notes proving it. Prereleases are capped at FYI in code, and any issue with more than 4 CRITICALs is automatically held for review. Ties go to the lower tier. We never promote to fill a slot."],
          ["Isn't this just an LLM summarizing changelogs?", "The classification uses Claude, but it runs inside code-enforced guardrails: ungrounded CRITICALs are rejected before an issue can ship, prereleases can't be inflated, and a second AI editor re-reviews every classification each week. The rubric is public, you can read the exact instructions the model gets."],
          ["Which tools do you cover, and can you add mine?", "30 tools today across payments, databases, auth, the AI SDKs, frontend, runtimes, and infra. The list is reviewed monthly and grows based on what subscribers use, reply to any issue to request one."],
          ["How often does it send, and what does it cost?", "One email a week, free. No account, one-click unsubscribe. Built to be read in two minutes: criticals first, notable next, everything else collapsed."],
        ].map(([q, a], i) => (
          <details className="qrow" key={i}>
            <summary className="qsum">{q}<span className="qplus">+</span></summary>
            <p className="qans">{a}</p>
          </details>
        ))}
      </section>

      {/* footer */}
      <footer className="footer">
        <div className="inner">
          <h2 className="stroke sw fade footer-h2">DEPLOY<br />SAFELY.</h2>
          <div className="fade d1 footer-row">
            <SubscribeForm variant="footer" />
            <p className="footer-note">AI-classified against a <a onClick={() => setModal("rubric")}>published rubric</a>. One email a week · unsubscribe anytime.</p>
          </div>
          <div className="footer-meta"><span>STACKTRACE WEEKLY</span><span>ISSUE #{s.issueNo}, {s.issueDate}</span></div>
        </div>
      </footer>

      {/* modal */}
      {modal && (
        <div className="backdrop" onClick={() => setModal(null)}>
          <div className="modal" role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
            <div className="modal-bar">
              <span className="modal-kicker">{modal === "rubric" ? "THE RUBRIC" : `STACKTRACE WEEKLY · #${s.issueNo}`}</span>
              <button className="modal-close" aria-label="Close" onClick={() => setModal(null)}>✕</button>
            </div>

            {modal === "issue" && (
              <div className="modal-body">
                <h3>What changed in your stack this week</h3>
                <p className="m-sub">ISSUE #{s.issueNo} · {s.issueDate} · {s.totalChanges} CHANGES · criticals first, everything else collapsed</p>
                <div className="m-crit">
                  <div className="h">
                    <span className="m-tag"><span className="sq" />CRITICAL</span>
                    <span className="nm">{s.critical.tool}</span>
                    <span className="m-ver">{s.critical.version}</span>
                  </div>
                  <p>{s.critical.summary}</p>
                  <div className="m-do"><b>Do this:</b> {s.critical.action}</div>
                </div>
                <div className="m-list">
                  {s.notable.map((n, i) => (
                    <div className="m-not" key={i}>
                      <div className="h">
                        <span className="tg"><span className="dt" />NOTABLE</span>
                        <span className="name">{n.tool}</span>
                        <span className="ver">{n.version}</span>
                      </div>
                      <p>{n.summary}</p>
                    </div>
                  ))}
                </div>
                <div className="m-fyi">
                  <span className="tg"><span className="dt" />FYI</span>
                  <span className="tx">+{s.fyiCount} patches, dependency bumps, and prereleases, collapsed so the signal stays clean.</span>
                </div>
                <a className="m-cta" href={s.subscribeUrl}>Get this in your inbox every week →</a>
              </div>
            )}

            {modal === "rubric" && (
              <div className="modal-body">
                <h3>How severity works</h3>
                <p className="m-sub" style={{ fontFamily: "var(--sans)", fontSize: 14, lineHeight: 1.6, color: "var(--slate)" }}>Every release is graded against a deterministic, conservative rubric. Severity is always color plus a shape plus the word, never color alone.</p>
                <div className="m-list">
                  <div className="m-crit" style={{ margin: "20px 0 0" }}>
                    <span className="m-tag"><span className="sq" />CRITICAL</span>
                    <p>A breaking change in a stable release, a security fix, or a forced migration, and requires a verbatim quote from the release notes proving it. Only this tier gets the red left-border and a &quot;Do this:&quot; action box.</p>
                  </div>
                  <div className="m-sub-card">
                    <span className="m-tag" style={{ color: "var(--notable)" }}><span className="dt" style={{ width: 9, height: 9, borderRadius: "50%", background: "var(--notable)" }} />NOTABLE</span>
                    <p style={{ margin: "9px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "var(--slate)" }}>Worth knowing, new capabilities, meaningful features, or non-forced migrations you will want on your radar, but nothing that breaks on deploy.</p>
                  </div>
                  <div className="m-sub-card">
                    <span className="m-tag" style={{ color: "var(--fyi)" }}><span className="dt" style={{ width: 9, height: 9, borderRadius: "50%", border: "1.5px solid var(--fyi)" }} />FYI</span>
                    <p style={{ margin: "9px 0 0", fontSize: 13.5, lineHeight: 1.55, color: "var(--slate)" }}>Patches, dependency bumps, and prereleases, collapsed into a single count so the signal stays clean. Prereleases are capped here in code and cannot be inflated.</p>
                  </div>
                </div>
                <div className="m-guard"><b>Guardrails:</b> ungrounded CRITICALs are rejected before an issue can ship, any issue with more than 4 CRITICALs is held for review, ties go to the lower tier, and a second AI editor re-reviews every classification each week. We never promote to fill a slot.</div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
