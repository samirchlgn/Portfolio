import { layout, portrait, textLink, cross } from "../components.mjs";
import { site } from "../site.mjs";

export default function about() {
  return layout({
    title: "About",
    path: "/about/",
    current: "about",
    description:
      "From field surveying to civil design and community leadership. Meet Samir Chaulagain, a senior civil engineer based in Hamilton, New Zealand.",
    body: `
 <section class="page-heading wrap"><p class="page-context">About Samir</p><h1 class="display">A practical mind.<br>A wider view.</h1><p class="page-lead">An engineer by profession.<br>A builder of things, teams and community.</p></section>
 <section class="about-story wrap"><figure class="about-portrait">${portrait({ priority: true, sizes: "(max-width:720px) 90vw, 42vw" })}<figcaption>From Nepal to the Waikato. Still learning. Still building.</figcaption></figure><div class="about-story-copy"><span class="greeting" lang="ne">नमस्ते।</span><h2>I’m Samir Chaulagain.</h2><p>I’m a Senior Civil Engineer based in Hamilton, New Zealand. My work brings together land development, three-waters design, construction support and a steady interest in making the process better.</p><p>I started in practical roles: construction, surveying, set-out and site data. Working with levels and real site constraints taught me that a design is only as useful as its path to delivery.</p><p>That perspective has stayed with me as I’ve moved into technical leadership, mentoring, quality systems and digital engineering.</p><p>Outside project work, I help people connect through cultural programmes, professional events and community initiatives. The setting changes. The purpose stays close: make things work better for people.</p><div class="profile-links">${textLink(site.linkedin, "Connect with me on LinkedIn")}${site.cv ? textLink(site.cv, "Download my CV") : ""}</div></div></section>
 <section class="career-section wrap" aria-labelledby="career-title"><div class="section-heading"><h2 class="display" id="career-title">Built through<br>experience.</h2><p>A field foundation, a career developed at CKL, and an expanding role in technical delivery and leadership.</p></div><div class="career-list">
  <details open><summary><span>2024 onward</span><h3>Senior Civil Engineer</h3><span class="details-symbol" aria-hidden="true"></span></summary><div class="details-content"><p>Integrated civil design, construction-stage decisions, quality leadership, mentoring and digital workflow improvement.</p><p>My experience covers site assessment, earthworks, roads and access, stormwater, wastewater, water supply, approvals, contract support and close-out.</p></div></details>
  <details><summary><span>2018–2024</span><h3>Civil design & delivery</h3><span class="details-symbol" aria-hidden="true"></span></summary><div class="details-content"><p>Progressed from technician work into civil engineering at CKL, developing 12d and CAD capability alongside infrastructure assessments, detailed design, approvals and construction support.</p></div></details>
  <details><summary><span>2017–2018</span><h3>Surveying & construction</h3><span class="details-symbol" aria-hidden="true"></span></summary><div class="details-content"><p>Construction experience with Foster Construction, followed by survey assistance at CKL: topographical and land-transfer surveys, set-out, levels and practical field information.</p></div></details>
  <details><summary><span>2014–2017</span><h3>Study, people & operations</h3><span class="details-symbol" aria-hidden="true"></span></summary><div class="details-content"><p>Completed civil engineering diploma study while working as Front of House Manager at Viet Thai Village, building early experience in customer service, team coordination and responsibility.</p></div></details>
 </div></section>
 <section class="education-section"><div class="wrap education-inner"><div><h2 class="display">Keep learning.<br>Keep improving.</h2><p>Formal study alongside professional practice.<br>Working toward CPEng registration.</p></div><div class="qualification-list"><div><span>The University of Waikato</span><h3>BE(Hons), Civil Engineering</h3></div><div><span>The University of Waikato</span><h3>Graduate Diploma in<br>Engineering Management</h3></div><div><span>Wintec</span><h3>New Zealand Diploma<br>in Engineering (Civil)</h3></div></div></div></section>
 <section class="about-closing wrap"><span>${cross}</span><h2 class="display">A wider view of<br>what engineering can do.</h2><p>Good infrastructure matters. So do the people delivering it, the systems supporting it, and the communities living with the result.</p>${textLink("/work/community/", "Explore my community work")}</section>
 `,
  });
}
