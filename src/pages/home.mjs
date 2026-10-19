import {
  layout,
  arrow,
  cross,
  button,
  textLink,
  portrait,
  practiceVisual,
  communityVisual,
  labVisual,
} from "../components.mjs";

export default function home() {
  return layout({
    body: `
 <section class="hero wrap" aria-labelledby="hero-title">
  <div class="hero-copy"><div class="hero-intro"><span>Senior civil engineer</span><span class="location"><span></span>Hamilton, New Zealand</span></div>
   <h1 class="display hero-title" id="hero-title"><span>Places.</span><span>People.</span><span>Possibility.</span></h1>
   <div class="hero-description"><p>I’m Samir. I design civil infrastructure, lead community initiatives, and build tools that make engineering work better.</p>${button("/#work", "Explore my work")}</div>
  </div>
  <div class="hero-person"><figure class="portrait-frame">${portrait({ priority: true })}<figcaption><span>Kia ora. <span lang="ne">नमस्ते।</span></span><span>Samir Chaulagain</span></figcaption><span class="portrait-corner" aria-hidden="true">${cross}</span></figure><div class="hero-person-note"><span>Grounded in Aotearoa.<br>Connected to Nepal.</span><a href="/#work" aria-label="Scroll to selected work">${arrow("down")}</a></div></div>
 </section>
 <div class="discipline-strip wrap"><span>Civil engineering</span><span>Community leadership</span><span>Digital possibilities</span></div>
 <section class="work-section wrap" id="work" aria-labelledby="work-title">
  <div class="section-heading"><h2 class="display" id="work-title">Work, with a<br>wider purpose.</h2><p>Engineering is my profession. Building things that help people is the thread that connects it all.</p></div>
  <div class="work-grid">
   <a class="work-card engineering-card" href="/work/engineering/">${practiceVisual}<div class="work-card-info"><div><p class="card-category">Civil engineering</p><h3>Land, roads<br>& three waters.</h3></div><span class="card-arrow">${arrow()}</span></div><p class="card-description">Practical design, from the first site question to construction close-out.</p></a>
   <a class="work-card community-card" href="/work/community/">${communityVisual}<div class="work-card-info"><div><p class="card-category">Leadership & service</p><h3>A place to belong.</h3></div><span class="card-arrow">${arrow()}</span></div><p class="card-description">Culture, connection and opportunities for people to take part.</p></a>
   <a class="digital-card" href="/work/digital/">${labVisual}<div class="digital-card-copy"><p class="card-category">Digital engineering</p><h3 class="display">Less repetition.<br>More judgement.</h3><p>QA systems, practical automation and small tools that earn their place in the workflow.</p><span class="digital-card-link">Explore the digital practice${arrow()}</span></div></a>
  </div>
 </section>
 <section class="about-preview"><div class="wrap about-preview-inner"><div class="about-preview-heading"><span>Behind the work</span>${cross}</div><div class="about-preview-body"><h2 class="display">Good design has to<br>work on the ground.</h2><div><p>My career began in surveying and construction. That field experience still shapes how I design, lead and solve problems.</p><p>Today, I bring that practical foundation to civil infrastructure, better engineering systems and community life in the Waikato.</p>${textLink("/about/", "A little more about me")}</div></div><div class="role-strip"><a href="/work/community/#nnzwfs"><span>President</span><strong>NNZWFS</strong></a><a href="/work/community/#engineering-nz"><span>Vice Chair, Waikato Branch</span><strong>Engineering New Zealand</strong></a><a href="/work/community/#nepal-gardens"><span>Design Lead</span><strong>Nepal Gardens NZ Trust</strong></a></div></div></section>
 <section class="lab-invitation wrap"><div><h2 class="display">Ideas are better<br>when they work.</h2><p>A few useful things I’ve built. Try a calculation, explore an assumption, or shape a better review.</p>${textLink("/lab/", "Step into the lab")}</div><div class="tool-list"><a href="/lab/?tool=stormwater"><span>QuickFlow</span><span>Peak runoff</span>${arrow()}</a><a href="/lab/?tool=pipe"><span>GradeCheck</span><span>Pipe grade & fall</span>${arrow()}</a><a href="/lab/?tool=earthworks"><span>BalanceCheck</span><span>Cut & fill</span>${arrow()}</a><a href="/lab/?tool=review"><span>Review Workspace</span><span>Structured prompts</span>${arrow()}</a></div></section>
 `,
  });
}
