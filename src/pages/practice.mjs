import {
  layout,
  practiceVisual,
  communityVisual,
  labVisual,
  textLink,
  arrow,
} from "../components.mjs";

const nextPractice = (href, title) =>
  `<div class="next-practice wrap"><span>Keep exploring</span><a href="${href}"><span>${title}</span>${arrow()}</a></div>`;

export function engineering() {
  return layout({
    title: "Civil engineering",
    path: "/work/engineering/",
    current: "work",
    description:
      "Integrated civil design across land development, earthworks, roads and three waters, from site assessment to construction close-out.",
    body: `
 <section class="page-heading wrap"><a class="back-link" href="/#work">All work</a><p class="page-context">Civil engineering</p><h1 class="display">The detail makes<br>the difference.</h1><p class="page-lead">Integrated design for land, roads and water.<br>Grounded in how things get built.</p></section>
 <div class="practice-cover wrap">${practiceVisual}</div>
 <section class="practice-intro wrap"><h2 class="display">From site question<br>to site solution.</h2><div><p>I work across the civil infrastructure lifecycle: understanding a site, testing options, coordinating a design, working through approvals, and supporting construction and close-out.</p><p>The work connects clients, councils, asset owners, contractors and other disciplines. Clear information and practical judgement matter at every handover.</p></div></section>
 <section class="capabilities wrap" aria-labelledby="capabilities-title"><h2 id="capabilities-title">What I bring to a project</h2><div class="capability-row"><h3>Land & access</h3><p>Site assessment, earthworks and grading, building platforms, road geometry, vehicle access and coordination with retaining and boundary constraints.</p><span>12d Model / CAD</span></div><div class="capability-row"><h3>Three waters</h3><p>Stormwater management, overland-flow planning, wastewater and water supply, with attention to levels, network interfaces and maintenance access.</p><span>Analysis / Coordination</span></div><div class="capability-row"><h3>Approvals & delivery</h3><p>Engineering-plan coordination, council responses, contract and procurement support, construction review, as-builts and certification support.</p><span>Design / Construction</span></div></section>
 <section class="method-section"><div class="wrap"><div class="section-heading"><h2 class="display">A clear path through<br>complex decisions.</h2><p>Good outcomes start with the right questions and continue through careful follow-through.</p></div><ol class="method-list"><li><span>01</span><h3>Read the site</h3><p>Check survey, levels, services, field evidence and the decision the project needs.</p></li><li><span>02</span><h3>Join the disciplines</h3><p>Coordinate landform, access, drainage, utilities and construction constraints.</p></li><li><span>03</span><h3>Test the thinking</h3><p>Compare options, challenge assumptions and make the review trail clear.</p></li><li><span>04</span><h3>Follow through</h3><p>Support delivery, resolve queries and carry lessons into the next design.</p></li></ol></div></section>
 <section class="practice-note wrap"><h2 class="display">Reliable design.<br>Reliable systems.</h2><p>Alongside project delivery, I contribute to technical checklists, calculation templates, 12d/CAD standards, review records, training and mentoring.</p>${textLink("/work/digital/", "See how I improve the workflow")}</section>
 ${nextPractice("/work/community/", "Community & leadership")}
 `,
  });
}

export function community() {
  return layout({
    title: "Community & leadership",
    path: "/work/community/",
    current: "work",
    description:
      "Samir’s volunteer leadership with NNZWFS, Engineering New Zealand Waikato Branch and Nepal Gardens New Zealand Trust.",
    body: `
 <section class="page-heading wrap"><a class="back-link" href="/#work">All work</a><p class="page-context">Community & leadership</p><h1 class="display">A place<br>to belong.</h1><p class="page-lead">Creating space for people to connect,<br>participate and move forward together.</p></section>
 <section class="community-intro wrap">${communityVisual}<div><h2 class="display">Leadership starts<br>with showing up.</h2><p>My volunteer work brings together culture, professional learning, young people and community wellbeing.</p><p>Some days that means helping a team deliver an event. Other days it means a governance discussion, a partnership, or a design conversation about a future public place.</p><p>It’s practical work, carried forward by volunteers and shared purpose.</p></div></section>
 <section class="community-roles wrap" aria-label="Volunteer leadership roles">
  <article class="community-role" id="nnzwfs"><div><span class="role-date">2025 onward</span><h2>NNZWFS</h2><p>President</p></div><div><h3>Nepal New Zealand Waikato<br>Friendship Society</h3><p>I help lead a volunteer organisation connecting families through language, culture, youth programmes, sport, wellbeing and community events.</p><ul class="quiet-list"><li>Language, culture & youth</li><li>Festivals & community connection</li><li>Sport, wellbeing & participation</li></ul><p class="small-copy">Previously General Secretary, 2021–2025.</p>${textLink("https://www.nnzwfs.co.nz/", "Visit NNZWFS")}</div></article>
  <article class="community-role" id="engineering-nz"><div><span class="role-date">2025 onward</span><h2>Engineering<br>New Zealand</h2><p>Vice Chair, Waikato Branch</p></div><div><h3>A stronger regional profession.</h3><p>I support technical events, project showcases, networking and industry engagement that help engineers exchange knowledge and build relationships.</p><ul class="quiet-list"><li>Technical learning & project stories</li><li>Member connection & industry relationships</li><li>STEM & future-engineer outreach</li></ul><p class="small-copy">Previously Branch Committee Member, 2024–2025.</p></div></article>
  <article class="community-role" id="nepal-gardens"><div><span class="role-date">2025 onward</span><h2>Nepal Gardens<br>NZ Trust</h2><p>Design Lead</p></div><div><h3>Culture expressed through place.</h3><p>I support a culturally meaningful garden and public-space vision connecting Nepali identity, landscape, storytelling and a practical path to delivery.</p><ul class="quiet-list"><li>Concept planning & visitor experience</li><li>Design communication & technical coordination</li><li>Staging & delivery thinking</li></ul><p class="small-copy">A place-making initiative in development.</p></div></article>
 </section>
 ${nextPractice("/work/digital/", "Digital engineering & the lab")}
 `,
  });
}

export function digital() {
  return layout({
    title: "Digital engineering",
    path: "/work/digital/",
    current: "work",
    description:
      "Practical automation, QA systems and digital tools built to support engineering judgement. Explore Samir’s digital practice and working lab.",
    body: `
 <section class="page-heading wrap"><a class="back-link" href="/#work">All work</a><p class="page-context">Digital engineering</p><h1 class="display">Less repetition.<br>More judgement.</h1><p class="page-lead">Useful tools and reliable workflows.<br>Built around the work engineers actually do.</p></section>
 <div class="digital-cover wrap">${labVisual}</div>
 <section class="practice-intro wrap"><h2 class="display">Start with<br>a real problem.</h2><div><p>A repeated check, an unclear handover, an awkward spreadsheet. Those are useful starting points for building something better.</p><p>I contribute to QA systems, calculation templates, 12d/CAD standards, Synergy workflows, dashboards, websites and responsible AI adoption. The goal is clearer decisions and more consistent work.</p></div></section>
 <section class="capabilities wrap"><h2>Where I focus</h2><div class="capability-row"><h3>Make quality repeatable</h3><p>Design checklists, technical-review records, drawing standards, pump-station and water-impact templates, and reusable calculation workflows.</p><span>QA / Templates</span></div><div class="capability-row"><h3>Make tools useful</h3><p>Small applications, spreadsheet automation and dashboards that reduce repeated effort and make assumptions easier to inspect.</p><span>JavaScript / Excel / Power BI</span></div><div class="capability-row"><h3>Keep people accountable</h3><p>Responsible AI guidance, training and practical demonstrations that support professional review and protect engineering judgement.</p><span>Training / Responsible AI</span></div></section>
 <section class="lab-invitation wrap"><div><h2 class="display">Built to try.<br>Open to improve.</h2><p>The lab contains four working tools. Calculations and prompt generation run in your browser.</p>${textLink("/lab/", "Open the lab")}</div><div class="tool-list"><a href="/lab/?tool=stormwater"><span>QuickFlow</span><span>Rational Method</span>${arrow()}</a><a href="/lab/?tool=pipe"><span>GradeCheck</span><span>Levels & gradient</span>${arrow()}</a><a href="/lab/?tool=earthworks"><span>BalanceCheck</span><span>Material balance</span>${arrow()}</a><a href="/lab/?tool=review"><span>Review Workspace</span><span>Review prompt builder</span>${arrow()}</a></div></section>
 ${nextPractice("/work/engineering/", "Civil engineering")}
 `,
  });
}
