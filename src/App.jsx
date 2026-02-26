import { useState, useMemo, useEffect, useRef, useCallback } from "react";

/* ─── palette & tokens ─── */
const T = {
  bg: "#0e1117",
  surface: "#161b22",
  surfaceHover: "#1c2333",
  border: "#30363d",
  borderFocus: "#58a6ff",
  text: "#e6edf3",
  textMuted: "#8b949e",
  textDim: "#484f58",
  accent: "#58a6ff",
  accentSoft: "rgba(88,166,255,.12)",
  green: "#3fb950",
  greenSoft: "rgba(63,185,80,.15)",
  amber: "#d29922",
  amberSoft: "rgba(210,153,34,.15)",
  red: "#f85149",
  redSoft: "rgba(248,81,73,.12)",
  purple: "#bc8cff",
  purpleSoft: "rgba(188,140,255,.12)",
};

const UNITS = [
  { id: "found", label: "Foundations", icon: "◈", color: "#8b949e" },
  { id: "fx", label: "Exchange Rates & IMF", icon: "◉", color: "#58a6ff" },
  { id: "debt", label: "Sovereign Debt", icon: "◆", color: "#d29922" },
  { id: "coop", label: "Cooperation & Institutions", icon: "◇", color: "#bc8cff" },
  { id: "basel", label: "Basel & Capital Regulation", icon: "▣", color: "#3fb950" },
  { id: "tic", label: "Specific Topics", icon: "▤", color: "#f0883e" },
];

const SESSIONS = [
  {
    id: 1, unit: "found", date: "Jan 22", title: "Introductory Class",
    notes: `The core tension: finance is global, regulation is national. Three recurring problems drive the course:

1. CROSS-BORDER EXTERNALITIES — A banking crisis in one country spills over to others through trade, financial linkages, and confidence effects. No single regulator internalizes the full cost of lax regulation.
1. REGULATORY ARBITRAGE — Financial activity migrates to lightest-touch jurisdictions. "Race to the bottom" unless countries coordinate — but coordination is hard because national commercial interests diverge.
1. COLLECTIVE ACTION — Even when all countries benefit from coordination, each has incentives to free-ride or defect.

THE IMPOSSIBLE TRINITY (MUNDELL-FLEMING TRILEMMA)
Countries cannot simultaneously maintain: (a) fixed exchange rates, (b) free capital mobility, (c) independent monetary policy. Must choose two. No "optimal" architecture exists — every arrangement involves tradeoffs.

INSTITUTIONAL ARCHITECTURE
Political level: G-7/G-20 set agenda. Coordination: FSB monitors systemic risk. Standard-setting: BCBS (banking), IOSCO (securities), IAIS (insurance), FATF (AML). Surveillance: IMF, BIS. Implementation: national regulators.

CRITICAL INSIGHT: Almost none of this is "hard law." Soft law, political commitments, and peer pressure predominate. Understanding why — and when it works vs. fails — is a central theme.`,
    readings: [
      { text: "S&G 1-19, 25-30, 44-52, 94-106", priority: "essential", note: "Institutional landscape. Terms and frameworks recur throughout." }
    ],
    examTip: "Articulate fundamental reasons why international financial regulation is difficult (sovereignty, collective action, divergent interests) and the institutional responses. The trilemma should be second nature."
  },
  {
    id: 2, unit: "fx", date: "Jan 23", title: "Exchange Rate Regimes & the IMF",
    notes: `BRETTON WOODS (1944-1971)
Fixed but adjustable rates pegged to the dollar, dollar convertible to gold at $35/oz. IMF created to provide short-term financing so countries could maintain pegs without trade restrictions.

THE TRIFFIN DILEMMA: US had to run BoP deficits to supply dollars globally, but persistent deficits undermined confidence in gold convertibility. System contained the seeds of its own destruction.

NIXON SHOCK (1971): US suspends gold convertibility. By 1973, major currencies float. IMF's original purpose — managing fixed rates — is gone.

KEY QUESTION: What is the IMF's role in a floating-rate world?

IMF REINVENTION CYCLES (REINHART & TREBESCH)

- 1940s-60s: Bretton Woods manager
- 1970s: Searches for new role
- 1980s: Latin American debt crisis manager
- 1990s: EM crisis lender; promotes capital account liberalization
- 2000s: Shrinking relevance → 2008 restores centrality
- 2010s+: Macro-financial surveillance; lending to advanced economies (Greece)

Each reinvention expands authority in some dimensions while revealing limits in others. Legitimacy depends on governance keeping pace.`,
    readings: [
      { text: "Bordo, 'Operation and Demise of the Bretton Woods System'", priority: "high", note: "Best single account of how and why the system failed. Triffin dilemma is key." },
      { text: "Reinhart & Trebesch, 'The IMF: 70 Years of Reinvention'", priority: "essential", note: "Frames the IMF's evolution as serial adaptation to crises. Tarullo likely draws on this framing." },
      { text: "S&G 710-727", priority: "essential", note: "Legal and institutional foundations." },
      { text: "IMF, 'What Is the IMF?'", priority: "skim", note: "Basic orientation." }
    ],
    examTip: "Connection between Bretton Woods collapse and IMF's evolving mandate. The tension between original design and current functions is analytically rich."
  },
  {
    id: 3, unit: "fx", date: "Jan 29", title: "IMF Surveillance, Part 1",
    notes: `ARTICLE IV SURVEILLANCE
Legal basis: Article IV — members "collaborate with the Fund and other members to assure orderly exchange arrangements."

2012 INTEGRATED SURVEILLANCE DECISION — watershed: merged bilateral surveillance (individual countries) with multilateral surveillance (the system). Key innovation: domestic policies with "spillover effects" on other members now within scope.

WHAT SURVEILLANCE COVERS:

- Exchange rate policies (original mandate)
- Domestic policies affecting external stability
- "Outward spillovers" from major economies

THE ENFORCEMENT PROBLEM: Surveillance has no teeth. The IMF can name and shame but cannot compel policy changes from countries that don't need its money. Asymmetry: leverage over borrowers, toothless with systemically important non-borrowers (US, China, eurozone).

CURRENCY MANIPULATION VS. MISALIGNMENT
Manipulation requires intent — deliberately intervening for unfair trade advantage. Very hard to prove.
Misalignment is about outcomes — exchange rate deviating from fundamentals. Easier to identify but doesn't imply wrongdoing.

The IMF focuses on manipulation, but real policy debates concern misalignment — especially persistent current account imbalances. Obstfeld's External Balance Assessment methodology tries to quantify this but estimates are model-dependent and contested.`,
    readings: [
      { text: "S&G 728-737", priority: "essential", note: "" },
      { text: "IMF 2012 Integrated Surveillance Decision (esp. pp. 8-10)", priority: "essential", note: "The legal text matters — what can the IMF actually do?" },
      { text: "IMF Article IV: United States (Aug. 2022)", priority: "high", note: "How surveillance works in practice for the world's largest economy." },
      { text: "Krugman, 'Crises, Shadows, and Surveillance'", priority: "high", note: "Sharp critique of IMF surveillance effectiveness." },
      { text: "Obstfeld, 'Assessing Global Imbalances'", priority: "skim", note: "Technical but useful for misalignment methodology." }
    ],
    examTip: "Asymmetry of IMF surveillance — effective for borrowers, toothless for majors — is key. Understand what 'spillovers' means here and why the 2012 decision was significant."
  },
  {
    id: 4, unit: "fx", date: "Jan 30", title: "IMF Surveillance, Part 2",
    notes: `CURRENCY MANIPULATION IN US TRADE LAW
The US has enforcement mechanisms outside the IMF:

TREASURY SEMI-ANNUAL REPORT (Trade Facilitation & Enforcement Act 2015): Three criteria — (1) significant bilateral surplus with US, (2) material current account surplus, (3) persistent one-sided FX intervention. All three = "manipulation"; two = "monitoring list."

USMCA CHAPTER 33: First trade agreement with enforceable FX commitments. Parties commit to market-determined rates, transparency in intervention, IMF reporting. Includes dispute settlement.

KEY TENSION: US uses trade law tools for what is fundamentally a macro issue. Staiger & Sykes argue the WTO framework is poorly suited for currency issues.

BERGSTEN-GAGNON APPROACH: Argue for countervailing measures against currency manipulation — treating undervaluation as functionally equivalent to a subsidy. Counterarguments: conflates monetary/FX policy with trade policy, risks protectionist abuse, hard to operationalize given disagreements about equilibrium rates.`,
    readings: [
      { text: "Staiger & Sykes, 'Currency Manipulation and World Trade'", priority: "essential", note: "Key academic treatment of FX policy / trade law intersection. Likely exam-relevant." },
      { text: "Bergsten & Gagnon, Ch.1 Currency Conflict and Trade Policy", priority: "high", note: "Access via PIIE link. The 'hawkish' view." },
      { text: "S&G 1367-1374", priority: "essential", note: "" },
      { text: "Treasury Report to Congress (Nov. 2022) [excerpts]", priority: "high", note: "How the US applies its own framework." },
      { text: "USMCA Chapter 33", priority: "skim", note: "First enforceable FX provisions in a trade deal." }
    ],
    examTip: "Trade law vs. FX policy is analytically rich. Argue both sides: why currency manipulation is/isn't appropriately addressed through trade mechanisms. Staiger & Sykes framework likely important."
  },
  {
    id: 5, unit: "fx", date: "Feb 5", title: "Central Bank Swaps",
    notes: `FED SWAP LINES AS INTL LENDER OF LAST RESORT
During 2008 and COVID, the Fed extended dollar swap lines to foreign central banks. Mechanism: Fed lends dollars to e.g. ECB, which lends dollars to European banks needing dollar funding.

WHY THIS MATTERS: Effectively makes the Fed the international lender of last resort for dollar liquidity — a function the IMF was designed to perform but cannot at crisis speed/scale.

INSTITUTIONAL SIGNIFICANCE:

- Swap lines are bilateral, discretionary, outside multilateral frameworks
- Standing lines to five CBs (ECB, BoE, BoJ, BoC, SNB) — a de facto inner circle
- FIMA Repo Facility (COVID era): foreign CBs can repo Treasuries for dollars — more market-based

KEY TENSION: Effective crisis tools but raise governance questions. The Fed decides access based on US interests. Countries outside the circle rely on IMF or self-insurance (reserve accumulation). Reinforces dollar centrality while creating hierarchy among nations.`,
    readings: [
      { text: "Choi et al., 'The Fed's Central Bank Swap Lines and FIMA Repo Facility'", priority: "essential", note: "Best single treatment of how these work and their systemic role." },
      { text: "Central Bank Swap Arrangements", priority: "high", note: "Background." },
      { text: "US Dollar–British Pound Swap Agreement (2014)", priority: "skim", note: "Reference — see the legal structure." }
    ],
    examTip: "Swap lines illustrate a key theme: effective arrangements often emerge outside formal multilateral institutions. Discuss governance implications and tension with IMF's role."
  },
  {
    id: 6, unit: "fx", date: "Feb 6", title: "Dollar Dominance & CBDCs",
    notes: `DOLLAR DOMINANCE
Eichengreen: Dominance is durable but not inevitable. Network effects and incumbency are powerful, but sterling's decline shows displacement is possible — over decades, not overnight.

Frankel on rivals: Euro lacks fiscal union/safe asset. Renminbi lacks capital account openness/rule of law. Crypto/stablecoins lack stability/regulatory clarity.

Fed perspective: Dollar's international role provides "exorbitant privilege" (lower borrowing costs, seigniorage) but creates obligations (providing crisis liquidity) and vulnerabilities (appreciation during risk-off tightens global conditions).

CBDCs AND STABLECOINS
CBDCs could reshape cross-border payments and potentially challenge dollar dominance. China's e-CNY is most advanced but limited international uptake.

Stablecoins raise questions about monetary sovereignty, financial stability (run risk), and dollar dominance through private channels.

Eichengreen & Viswanath-Natraj: Regulatory framework for these instruments is being built in real time with significant cross-jurisdictional divergence.`,
    readings: [
      { text: "Eichengreen, 'Two Views of the International Monetary System'", priority: "essential", note: "Frames the dollar dominance debate." },
      { text: "Frankel, 'Dollar Rivals'", priority: "high", note: "Evaluates each potential challenger." },
      { text: "Fed Board, 'International Role of the Dollar'", priority: "high", note: "Official US perspective." },
      { text: "Eichengreen & Viswanath-Natraj on stablecoins/CBDCs", priority: "high", note: "Newer material — likely exam-relevant." },
      { text: "S&G 1545-1554", priority: "essential", note: "" }
    ],
    examTip: "Dollar dominance connects across topics (swap lines, sanctions, reserves, CBDCs). Be prepared to discuss what sustains it and what might erode it."
  },
  {
    id: 7, unit: "debt", date: "Feb 12", title: "Sovereign Debt, Part 1",
    notes: `WHY SOVEREIGN DEBT IS DIFFERENT

- No bankruptcy code for countries. No Chapter 11. Crises resolved through negotiation, not adjudication.
- Sovereign immunity protects most state assets (though eroded — FSIA allows suits for "commercial activity").
- Can't liquidate a country. Enforcement mechanism is primarily reputational — countries repay for future market access.

IMF'S ROLE: Provides crisis lending with conditionality. The Debt Sustainability Analysis (DSA) determines whether a country needs "adjustment" (austerity + continued service) or "restructuring" (haircuts). Enormously consequential determination.

IMF LENDING FRAMEWORK
Normal access: limited to % of quota, with conditionality. For temporary BoP problems.
Exceptional access: when normal limits are insufficient. Four criteria including debt sustainability.
2016 reforms (post-Greece): tried to force earlier restructuring decisions. When IMF lends into unsustainable situations, it's effectively bailing out private creditors.

MORAL HAZARD: IMF lending creates incentives for debtors (borrow too much expecting rescue) and creditors (lend recklessly expecting bailout). Managing this while providing crisis financing is the central design challenge.`,
    readings: [
      { text: "IMF, 'IMF Lending'", priority: "essential", note: "Understand the different facilities and conditions." },
      { text: "S&G 1257-1293; 512-514; 523-525", priority: "essential", note: "Core legal and institutional framework." }
    ],
    examTip: "The absence of a sovereign bankruptcy mechanism is foundational. Everything else — CACs, pari passu, the Common Framework — is an attempt to work around this gap."
  },
  {
    id: 8, unit: "debt", date: "Feb 13", title: "Sovereign Debt, Part 2",
    notes: `THE ARGENTINA PARI PASSU SAGA
Argentina defaulted 2001, restructured 2005/2010. ~93% of holders accepted ~30 cents. Holdouts (Elliott/NML Capital) sued for full payment.

JUDGE GRIESA'S RULING: Pari passu clause meant Argentina couldn't pay restructured holders without paying holdouts ratably. Injunctions blocked payments through US financial infrastructure.

CONSEQUENCES:

- Argentina locked out of US markets
- Eventually settled 2016, paying holdouts ~75 cents — massive holdout victory
- Accelerated adoption of enhanced CACs and reformed pari passu language
- Showed NY law gives creditors powerful tools, but aggressive holdout litigation can undermine orderly restructuring

ANALYTICAL QUESTION: Did the ruling improve or worsen the architecture?
PRO: strengthens contract enforcement → supports market access
CON: incentivizes holdouts → makes restructuring harder, delays resolution

COLLECTIVE ACTION CLAUSES (CACs)
Purpose: supermajority of holders can approve restructuring terms binding all, including dissenters.

Evolution: Traditional CACs (vote per series — holdouts can block one series) → Enhanced/aggregated CACs (cross-series voting — much harder to block).

Post-Argentina: enhanced CACs now standard. Eurozone bonds require CACs since 2013. ICMA model clauses widely adopted.

LIMITS: Only apply to bonds, not official debt or bank loans. Don't apply retroactively. Don't solve inter-creditor-class coordination.`,
    readings: [
      { text: "S&G 1293-1324", priority: "essential", note: "Legal mechanics and Argentina litigation in detail." },
      { text: "Argentina Pari Passu Judicial Decisions", priority: "essential", note: "Read the actual opinions — legal reasoning matters." },
      { text: "IMF Exceptional Access Lending Reforms (Jan. 2016)", priority: "high", note: "How Greek experience led to reforms." }
    ],
    examTip: "Argentina case is likely exam material. Discuss the pari passu interpretation, systemic consequences, and contractual vs. statutory debate it reinvigorated."
  },
  {
    id: 9, unit: "debt", date: "Feb 19", title: "Sovereign Debt, Part 3",
    notes: `CREDITOR COORDINATION PROBLEM
Three creditor classes, each wanting others to take losses first:

OFFICIAL BILATERAL (Paris Club + China): Governments that lent directly. Paris Club operates on comparability of treatment. China is NOT a member and resists these norms.

OFFICIAL MULTILATERAL (IMF, World Bank): Enjoy "preferred creditor status" — don't take haircuts. Justified as necessary for future lending capacity, but concentrates losses on others.

PRIVATE (bondholders, banks): Resist haircuts, demand comparability. CACs help intra-bondholder coordination but inter-class coordination is the core problem.

THE CHICKEN-AND-EGG: Private creditors won't agree until they know official terms. Officials won't commit until they know private contribution. IMF DSA is supposed to break the logjam, but all parties contest it.

STATUTORY VS. CONTRACTUAL APPROACHES
SDRM (Krueger, 2001-03): Proposed international sovereign bankruptcy mechanism — automatic stay, DIP financing, supermajority cramdown across all classes. Killed by US Treasury (John Taylor) and private sector.

CONTRACTUAL (enhanced CACs + reformed pari passu): Won in practice. ICMA model clauses now standard.

THE ONGOING GAP: Neither approach addresses cross-class coordination adequately. CACs solve intra-bondholder but not bondholder-vs-official. No mechanism binds official bilaterals (especially China).`,
    readings: [
      { text: "S&G 1325-1347", priority: "essential", note: "" },
      { text: "IMF, 'International Architecture for Resolving Sovereign Debt' (Oct. 2020)", priority: "essential", note: "IMF's own assessment — frank acknowledgment of gaps." }
    ],
    examTip: "Creditor coordination is the analytical heart of sovereign debt. Articulate why no existing mechanism solves it; evaluate statutory vs. contractual tradeoffs."
  },
  {
    id: 10, unit: "debt", date: "Feb 20", title: "Sovereign Debt, Part 4",
    notes: `THE COMMON FRAMEWORK AND ITS FAILURES
Context: COVID-era debt distress led G-20 to create DSSI (2020) and Common Framework for Debt Treatments.

Design: Bring Paris Club, China, and private creditors into coordinated restructuring. Apply comparability principles to wider creditor base.

Results: Painfully slow. Zambia ~3 years. Chad and Ethiopia extended delays.

WHY IT'S FAILING:

- China's institutional fragmentation — loans from CDB, Eximbank, commercial banks, BRI funds with different mandates
- Definitional disputes about "comparable treatment"
- No enforcement mechanism — voluntary participation
- Debtor countries bear delay costs (prolonged suffering, lost market access)

THE CHINA PROBLEM: World's largest bilateral creditor to developing countries, but not Paris Club member, lending often collateralized, institutional fragmentation, "hidden debt" makes DSA unreliable.

GELPERN, "A PROCESS FOR POLITICS": The real value of restructuring frameworks isn't technical efficiency but providing political cover for painful decisions. The Common Framework fails even at this.

HAGAN, "TOWARDS AN INTEGRATED FRAMEWORK" (2023): Argues for bridging official and private creditor coordination. Tries to accommodate China's institutional reality. Most recent reading — Tarullo included it for a reason (Hagan was IMF General Counsel).`,
    readings: [
      { text: "S&G 1347-1359", priority: "essential", note: "" },
      { text: "Gelpern, 'A Process for Politics' (2022)", priority: "essential", note: "Gelpern is casebook co-author and leading voice. Likely core exam material." },
      { text: "Hagan, 'Towards an Integrated Framework' (Nov. 2023)", priority: "essential", note: "Most recent reading — Hagan was IMF GC." },
      { text: "Global Sovereign Debt Roundtable Progress Report (Oct. 2023)", priority: "high", note: "Latest institutional development." },
      { text: "IMF, 'Debt Dynamics' (2022)", priority: "high", note: "" },
      { text: "G-20 Statement (Nov. 2020)", priority: "skim", note: "Founding document of the Common Framework." }
    ],
    examTip: "Common Framework failures illustrate limits of soft law and voluntary coordination. Connect to Brummer's framework on why soft law works in some contexts but not others."
  },
  {
    id: 11, unit: "fx", date: "Feb 26", title: "Capital Controls",
    notes: `IMF INSTITUTIONAL VIEW ON CAPITAL FLOWS
Evolution: From promoting capital account liberalization (1990s Washington Consensus) to accepting capital flow management measures (CFMs) can be appropriate.

2012 INSTITUTIONAL VIEW: Liberalization is generally beneficial but should be sequenced. CFMs appropriate when: (1) economy near potential, (2) reserves adequate, (3) exchange rate not undervalued, (4) macro policies appropriate.

KEY SHIFT: GFC demonstrated unfettered flows can be destabilizing. Institutional View is pragmatic middle ground.

REY'S "DILEMMA NOT TRILEMMA"
Argument: Because of the "global financial cycle" — driven primarily by US monetary policy and risk appetite — countries face a choice between monetary policy autonomy and free capital mobility, REGARDLESS of exchange rate regime.

Implication: Floating rates alone don't insulate from global financial conditions. Capital controls may be the ONLY way for many countries to maintain monetary autonomy.

Policy significance: If Rey is right, capital controls aren't second-best — they may be necessary. Direct implications for how IMF should assess CFMs.

BROOS & GRUND: Legal analysis of whether IMF has jurisdiction over the capital account — crucial institutional question. IMF Articles give jurisdiction over current account but capital account jurisdiction is ambiguous.`,
    readings: [
      { text: "Rey, 'Capital Account Management' (2014)", priority: "essential", note: "'Dilemma not trilemma' — one of the most important developments in international macro. Directly relevant to Fed spillovers." },
      { text: "Broos & Grund, 'IMF's Jurisdiction Over the Capital Account'", priority: "essential", note: "Does the IMF even have authority here?" },
      { text: "Evolution of IMF Institutional View on Capital Flows", priority: "high", note: "" },
      { text: "Williamson, Jeanne, Subramanian, 'International Rules for Capital Controls'", priority: "high", note: "" },
      { text: "S&G 746-748", priority: "essential", note: "" }
    ],
    examTip: "Capital controls connect to the trilemma, IMF surveillance, and developing country policy space. Rey's dilemma argument is likely exam-relevant — know it cold."
  },
  {
    id: 12, unit: "fx", date: "Feb 27", title: "Perspectives on the International Monetary System",
    notes: `IMF REFORM DEBATES
Governance: Voting power skewed toward advanced economies. 2010 quota reform (implemented 2016) increased EM representation but not enough. China's share still far underrepresents economic weight.

CGD CRITIQUE: IMF must reform to remain legitimate — governance reflects 1944, not 2024. Calls for quota realignment, flexible lending, reduced stigma.

SHAMBAUGH (US TREASURY): Supportive of incremental reform but resistant to governance overhaul diluting US veto power.

RAJAN, "RULES OF THE MONETARY GAME"
Former RBI Governor argues major central banks (especially the Fed) should internalize spillover effects. Proposal: informal "rules of the game" for monetary policy accounting for cross-border effects.

Challenge: Fed has domestic mandate (dual mandate). Asking it to consider global effects is politically difficult and legally ambiguous. But Fed policy dominates the global financial cycle (per Rey), so ignoring spillovers is untenable.

SYNTHESIS: This is the capstone of the exchange rate / IMF unit. Threads include: surveillance limitations, dollar dominance, capital controls, reform needs.`,
    readings: [
      { text: "CGD, 'The IMF Must Reform' (June 2023)", priority: "essential", note: "Leading reform proposal." },
      { text: "Rajan, 'Toward Rules of the Monetary Game' (2016)", priority: "essential", note: "One of the most important speeches on international monetary cooperation." },
      { text: "Shambaugh, Remarks at CGD (Sept. 2023)", priority: "high", note: "US official position — compare with CGD critique." }
    ],
    examTip: "Synthesize the exchange rate / IMF unit themes. Rajan's 'rules of the game' framework is strong exam-answer material."
  },
  {
    id: 13, unit: "coop", date: "Mar 4", title: "Incentives for Cooperation & Their Limits",
    notes: `BRUMMER'S SOFT LAW FRAMEWORK
Why soft law dominates international financial regulation:

- Sovereignty concerns: countries resist binding treaties constraining regulatory autonomy
- Speed and flexibility: soft law updates faster than treaties
- Technical complexity: financial regulation needs expertise treaty processes can't accommodate
- Club dynamics: small groups of regulators agree informally more easily

BUT SOFT LAW HAS REAL COMPLIANCE PULL:

- Reputational mechanisms (peer review, "comply or explain")
- Market discipline (investors reward well-regulated jurisdictions)
- Conditional access (Basel compliance as prerequisite for market participation)
- Institutional design (standard-setters have monitoring mechanisms)

LIMITS: Works best when interests are aligned and stakes are moderate. Breaks down when national commercial interests diverge sharply or compliance is costly.

KEY ANALYTICAL TOOL: For any international financial regulation issue, ask: (1) What are the incentives for cooperation? (2) Where do interests diverge? (3) What compliance mechanisms exist? (4) Are they sufficient given the divergence?`,
    readings: [
      { text: "Brummer pp. 23-61; 188-209", priority: "essential", note: "THE framework for understanding why international financial regulation takes its form. Critical for exam." },
      { text: "S&G 233-234, 368-376", priority: "essential", note: "" }
    ],
    examTip: "Brummer's soft law framework likely features prominently on the exam. Apply it: why did Basel achieve more compliance than the Common Framework? Why do swap lines work outside formal institutions?"
  },
  {
    id: 14, unit: "coop", date: "Mar 5", title: "Institutional Features",
    notes: `BASEL COMMITTEE ON BANKING SUPERVISION (BCBS)

- Housed at BIS in Basel. 45 members from 28 jurisdictions.
- No legal personality — operates through consensus
- Produces "standards" (highest implementation expectation), "guidelines," and "sound practices"

FINANCIAL STABILITY BOARD (FSB)

- Created 2009 (upgraded from Financial Stability Forum)
- Broader membership and mandate than BCBS
- Coordinates across standard-setters (BCBS, IOSCO, IAIS)
- Monitors systemic risk, designates G-SIBs/G-SIIs
- Conducts peer reviews of implementation

KEY INSTITUTIONAL QUESTIONS:

- Legitimacy: Who do these bodies represent? How are they accountable?
- Effectiveness: Can bodies without legal authority achieve consistent implementation?
- Governance: How do membership and voting rules affect outcomes?

BRUMMER (pp. 62-82, 98-118): How institutional design features — membership, decision rules, monitoring — affect compliance pull of soft law standards.`,
    readings: [
      { text: "Brummer pp. 62-82, 98-118", priority: "essential", note: "Institutional analysis of standard-setting bodies." },
      { text: "Basel Committee Introductory Materials", priority: "high", note: "Structure and processes." },
      { text: "Basel Committee Charter", priority: "skim", note: "Reference — note the legal status (or lack thereof)." },
      { text: "FSB Introductory Materials", priority: "high", note: "" }
    ],
    examTip: "Institutional design is key to why some standards achieve better compliance. Connect Brummer's framework to specific cases."
  },
  {
    id: 15, unit: "basel", date: "Mar 18", title: "Basel Capital Regulation",
    notes: `EVOLUTION OF BASEL CAPITAL STANDARDS

BASEL I (1988): Simple risk-weighted capital requirements. 8% minimum capital/RWA ratio. Four risk buckets (0%, 20%, 50%, 100%). Crude but revolutionary — established principle of internationally coordinated capital standards.

Problem created: Risk weights too blunt. Loan to Apple and loan to startup both 100%. Incentivized regulatory arbitrage — load up on risky assets that were "cheap" per capital charge.

BASEL II (2004): Three pillars:

- Pillar 1: Minimum capital (more risk-sensitive weights; Internal Ratings-Based approach lets banks use own models)
- Pillar 2: Supervisory review
- Pillar 3: Market discipline (disclosure)

THE IRB PROBLEM: Letting banks model own risk proved disastrous. Banks systematically underestimated risk, supervisors lacked capacity/will to challenge. GFC exposed this.

BASEL III (post-2008): Higher/better-quality capital (more CET1), leverage ratio backstop, liquidity requirements (LCR, NSFR), countercyclical buffers, G-SIB surcharges.

TARULLO'S BANKING ON BASEL (2008): Predicted many problems — argued IRB complexity would be unworkable, simpler measures needed. Written pre-crisis but remarkably prescient. This is Tarullo's intellectual home turf.`,
    readings: [
      { text: "Tarullo, Ch. 2 of Banking on Basel (2008)", priority: "essential", note: "Access via PIIE link. Pre-crisis but prescient. Tarullo's home turf." },
      { text: "S&G 630-659", priority: "essential", note: "Technical but necessary." }
    ],
    examTip: "Know Basel I → II → III evolution and key design choices. Tarullo's IRB critique is important — it motivated much of his regulatory work at the Fed."
  },
  {
    id: 16, unit: "basel", date: "Mar 19", title: "Basel Capital Regulation (cont.)",
    notes: `BASEL III DETAILS AND CURRENT AGENDA

KEY BASEL III ELEMENTS:

- Common Equity Tier 1 (CET1) minimum raised to 4.5% (from 2% effective under Basel II)
- Capital conservation buffer: additional 2.5% CET1
- Countercyclical buffer: 0-2.5% at national discretion
- G-SIB surcharge: 1-3.5% additional CET1
- Leverage ratio: 3% minimum (non-risk-weighted backstop)
- Liquidity Coverage Ratio (LCR): sufficient HQLA to survive 30-day stress
- Net Stable Funding Ratio (NSFR): match funding stability to asset maturity

BASEL III "ENDGAME" / BASEL 3.1:
Finalizes reforms to the risk-weighted framework — constrains use of internal models, introduces output floors (model-based RWA can't fall below 72.5% of standardized approach). Still being implemented in many jurisdictions.

US DEBATE: Fed's proposed Basel III endgame rule was controversial — industry argued it was gold-plating beyond Basel minimums and would reduce lending capacity. Still unresolved as of the syllabus date.

KEY ANALYTICAL QUESTIONS:

- Is complexity (risk sensitivity) or simplicity (leverage ratio) the better approach?
- How do you calibrate capital requirements to be high enough for stability without constraining economically useful lending?
- Can internal models ever be made reliable, or should regulation move toward standardized approaches?`,
    readings: [
      { text: "S&G 659-675", priority: "essential", note: "" },
      { text: "Materials on Basel Committee Agenda for Capital Regulation", priority: "high", note: "Current debates." }
    ],
    examTip: "The simplicity vs. risk-sensitivity debate is fundamental. Be able to argue both sides and connect to Tarullo's published views."
  },
  {
    id: 17, unit: "basel", date: "Mar 25", title: "National Implementation, Part 1",
    notes: `THE IMPLEMENTATION PROBLEM
Basel standards are only as good as national implementation. Key issues:

REGULATORY CONSISTENCY ASSESSMENT PROGRAMME (RCAP): Basel Committee's peer review mechanism. Assesses whether national rules are "compliant," "largely compliant," or "materially non-compliant" with Basel standards.

BRUMMER (pp. 119-151): Implementation varies significantly across jurisdictions. Some gold-plate (exceed minimums); some water down; some delay. The gap between Basel standards and national implementation is the "implementation gap."

CAROLYN ROGERS (BCBS Secretary General, 2021): Makes the case that Basel III implementation is essential for global financial stability and resisting backsliding requires sustained political will.

FORMS OF NON-COMPLIANCE:

- Outright non-implementation
- Delayed implementation
- Implementation with national modifications that weaken standards
- Implementation that gold-plates (exceeds standards) — can also create problems through fragmentation

THE RACE TO THE BOTTOM VS. RACE TO THE TOP: Do countries compete by offering lighter regulation (attracting financial activity) or stricter regulation (attracting depositors/investors who value safety)?`,
    readings: [
      { text: "Brummer pp. 119-151", priority: "essential", note: "Implementation analysis." },
      { text: "Basel Committee, Implementation of Basel III: Report to G-20 (2020) [Summary]", priority: "high", note: "" },
      { text: "Carolyn Rogers, Basel III and Global Cooperation (Sept. 2021)", priority: "high", note: "" },
      { text: "RCAP Review (Dec. 2014) [excerpts]", priority: "skim", note: "See how peer review works in practice." }
    ],
    examTip: "Implementation gaps are where soft law theory meets reality. Connect Brummer's compliance framework to actual Basel implementation experience."
  },
  {
    id: 18, unit: "basel", date: "Mar 26", title: "National Implementation, Part 2",
    notes: `TARULLO ON REGULATING INTERNATIONAL BANKS

"SHARED RESPONSIBILITY" (2015): Argues that home-country and host-country regulators both have legitimate interests in the safety of internationally active banks. Neither pure home-country nor pure host-country regulation works.

"REGULATING LARGE FOREIGN BANKING ORGANIZATIONS" (2014): Explains the Fed's decision to require foreign banks with large US operations to form US intermediate holding companies (IHCs) subject to US capital and liquidity requirements. This was controversial — seen by some as a retreat from international cooperation.

TARULLO'S RATIONALE: In a crisis, ring-fencing national resources is rational because international resolution frameworks don't work reliably. If you can't be sure a foreign parent will support its US subsidiary, you need the subsidiary to be self-sufficient.

ROMANO, "FOR DIVERSITY" (2014): Argues AGAINST harmonization — regulatory diversity allows jurisdictions to experiment and learn, and harmonization can amplify systemic risk if the common standard is wrong.

CORE TENSION: International coordination aims for level playing field and financial stability. But national regulators have legitimate reasons to deviate — and harmonization itself can be risky if standards are miscalibrated.`,
    readings: [
      { text: "Tarullo, 'Shared Responsibility' (2015) [excerpts]", priority: "essential", note: "Tarullo's own framework for intl bank regulation — expect exam relevance." },
      { text: "Tarullo, 'Regulating Large Foreign Banking Organizations' (2014)", priority: "essential", note: "Explains the IHC requirement — a major policy decision." },
      { text: "Romano, 'For Diversity in International Regulation' (2014) [excerpts]", priority: "high", note: "Counterpoint to harmonization orthodoxy." }
    ],
    examTip: "The tension between coordination and national regulatory autonomy is central. Be able to articulate Tarullo's 'shared responsibility' framework and engage with Romano's diversity argument."
  },
  {
    id: 19, unit: "tic", date: "Apr 1", title: "Derivatives and Swaps",
    notes: `OTC DERIVATIVES AND POST-CRISIS REFORM

THE PROBLEM: Before 2008, the OTC derivatives market was largely unregulated. Bilateral contracts meant counterparty risk was opaque — nobody knew who owed what to whom. AIG's collapse demonstrated systemic risk from concentrated derivatives exposures.

G-20 PITTSBURGH COMMITMENTS (2009):

- Standardized OTC derivatives → central clearing through CCPs
- Non-centrally cleared contracts → higher capital requirements
- All OTC derivatives → trade repositories for transparency

KEY CONCEPTS:

- Central counterparty (CCP): Interposes itself between buyer and seller, mutualizing counterparty risk. Reduces bilateral opacity but concentrates risk in CCPs themselves (which become systemic).
- Trade repositories: Record all derivatives trades for regulatory transparency.
- Margin requirements: Initial and variation margin for non-cleared derivatives.

US IMPLEMENTATION: Dodd-Frank Title VII — CFTC regulates swaps, SEC regulates security-based swaps.
EU IMPLEMENTATION: EMIR (European Market Infrastructure Regulation).`,
    readings: [
      { text: "S&G 1010-1015; 1018-1022; 1044-1064", priority: "essential", note: "Technical overview of derivatives regulation." },
      { text: "FSB, Making Derivatives Safer", priority: "high", note: "The international coordination perspective." }
    ],
    examTip: "Derivatives reform is a case study in post-crisis international coordination. Know the G-20 commitments and how they translated (unevenly) into national law."
  },
  {
    id: 20, unit: "tic", date: "Apr 2", title: "Derivatives and Swaps (cont.)",
    notes: `US-EU COORDINATION ON DERIVATIVES

POSNER CHAPTER: Examines the political dynamics of US-EU cooperation on derivatives regulation. Key insight: despite shared G-20 commitments, implementation diverged significantly due to different regulatory traditions, industry structures, and political dynamics.

KEY FRICTIONS:

- Extraterritoriality: US rules (Dodd-Frank) apply to foreign entities with US-facing derivatives activity. EU resisted this reach.
- Equivalence/substituted compliance: Whether each side recognizes the other's rules as "equivalent" — allowing firms to comply with home rules rather than duplicating.
- CCP standards: Differences in margin requirements, governance, and access rules.
- Trade reporting: Different formats, identifiers, and repositories.

THE EQUIVALENCE GAME: "Equivalence" determinations became a political tool — each side used the threat of denying equivalence as leverage in negotiations. Brexit added a new dimension (UK CCPs clearing euro-denominated derivatives).

BROADER LESSON: Even between jurisdictions with similar regulatory objectives and comparable financial systems, achieving consistent implementation of international standards is extremely difficult. Political economy, regulatory culture, and institutional path dependence all matter.`,
    readings: [
      { text: "Posner, 'Financial Regulatory Cooperation' in Helleiner et al.", priority: "essential", note: "Access through HOLLIS. Political dynamics of US-EU coordination." },
      { text: "Case Study in US-EU Cooperation on Derivatives Regulation", priority: "high", note: "" }
    ],
    examTip: "US-EU derivatives coordination is a case study in the limits of international harmonization. Be able to discuss why equivalence determinations are both technical and political."
  },
  {
    id: 21, unit: "tic", date: "Apr 8", title: "Financial Services in Trade Agreements",
    notes: `GATS AND FINANCIAL SERVICES
The WTO's General Agreement on Trade in Services covers financial services, but with a crucial exception:

THE PRUDENTIAL CARVE-OUT (GATS Annex on Financial Services, para. 2(a)): Members may take "measures for prudential reasons, including for the protection of investors, depositors, policy holders or persons to whom a fiduciary duty is owed, or to ensure the integrity and stability of the financial system."

KEY QUESTION: How broad is the carve-out? Can countries use "prudential" justification to block market access for protectionist reasons?

BARBEE & LESTER: Argue the prudential exception needs to be operationalized more clearly — otherwise it's either too narrow (chilling legitimate regulation) or too broad (excusing protectionism).

MITCHELL, HAWKINS & MISHRA: Analyze how investment and trade agreements interact with prudential regulation. Key concern: investor-state dispute settlement (ISDS) could challenge legitimate financial regulations as violations of investment protection.

TTIP DEBATE: Whether the EU-US trade deal (ultimately not concluded) should include financial services or carve them out entirely. Financial regulators (including the Fed/Treasury) resisted inclusion, fearing trade obligations would constrain regulatory autonomy.`,
    readings: [
      { text: "S&G 421-424", priority: "essential", note: "" },
      { text: "Barbee & Lester, 'Financial Services in the TTIP'", priority: "essential", note: "Key analysis of the prudential exception." },
      { text: "Mitchell et al., 'Dear Prudence'", priority: "high", note: "How trade/investment law interacts with financial regulation." },
      { text: "Prudential Carve-Out Provisions", priority: "high", note: "Compare the actual text across agreements." }
    ],
    examTip: "The prudential carve-out sits at the intersection of trade law and financial regulation. Be able to discuss the tension between trade liberalization commitments and regulatory autonomy."
  },
  {
    id: 22, unit: "tic", date: "Apr 9", title: "Money Laundering & Terrorist Financing",
    notes: `FATF: THE FINANCIAL ACTION TASK FORCE
Created 1989 by G-7. Now 39 members. Sets AML/CFT standards through its "Recommendations."

FATF AS A MODEL OF SOFT LAW ENFORCEMENT:

- Mutual evaluations: peer review of national implementation
- "Grey list" and "black list": countries with strategic deficiencies
- Grey-listing triggers market consequences — banks cut off correspondent relationships, investment flows decline
- Arguably the most effective soft law enforcement mechanism in international finance

THE COMPLIANCE PULL: FATF's grey/black lists create powerful market discipline because private banks use FATF assessments in their own risk management. Being grey-listed is costly even without formal sanctions.

BRUMMER ON FATF: Highlights FATF as exemplifying both the strengths and weaknesses of networked governance. Effective compliance pressure but legitimacy concerns (small-country voices marginalized, standards designed for developed-country financial systems).

KEY REGULATORY CONCEPTS:

- Know Your Customer (KYC) / Customer Due Diligence (CDD)
- Suspicious Activity Reports (SARs)
- Correspondent banking and de-risking: banks cutting off relationships with higher-risk jurisdictions to avoid regulatory risk — creates financial exclusion`,
    readings: [
      { text: "S&G 1436-1453, 1466-1468", priority: "essential", note: "" },
      { text: "FATF Description", priority: "high", note: "Understand the organization." },
      { text: "Brummer pp. 88-89, 154-61, 173-75", priority: "essential", note: "FATF as soft law case study." },
      { text: "FATF Outcomes (Oct. 2022)", priority: "skim", note: "Recent outputs." },
      { text: "FATF Recommendations [excerpts]", priority: "skim", note: "Reference." }
    ],
    examTip: "FATF is arguably the most successful soft law body — its grey/black list mechanism has real market consequences. Compare its compliance pull with Basel and the Common Framework."
  },
  {
    id: 23, unit: "tic", date: "Apr 15", title: "Payments Systems",
    notes: `[TBD on syllabus — likely topics include:]

CROSS-BORDER PAYMENTS INFRASTRUCTURE

- SWIFT: The messaging system connecting banks globally. Not a payment system itself but essential infrastructure.
- Correspondent banking: How cross-border payments actually work — chains of bank-to-bank relationships.
- Pain points: slow, expensive, opaque — especially for developing countries.

FASTER PAYMENTS INITIATIVES:

- FedNow (US real-time payments)
- BIS Innovation Hub projects on cross-border payment efficiency
- Nexus and other interlinking initiatives

WHOLESALE VS. RETAIL CBDC IMPLICATIONS FOR PAYMENTS

- Wholesale CBDCs could streamline interbank settlement
- Retail CBDCs raise questions about disintermediation of commercial banks

STABLECOINS AS PAYMENT RAILS

- Could stablecoins provide faster/cheaper cross-border payments?
- Regulatory concerns: run risk, AML compliance, monetary sovereignty`,
    readings: [
      { text: "TBD — check Canvas for updates", priority: "essential", note: "Syllabus marked TBD." }
    ],
    examTip: "Even though TBD, payments likely connects to dollar dominance, SWIFT/sanctions, and CBDC themes from earlier sessions."
  },
  {
    id: 24, unit: "tic", date: "Apr 16", title: "Payments & Geopolitics",
    notes: `[TBD on syllabus — likely topics include:]

WEAPONIZATION OF FINANCIAL INFRASTRUCTURE

- SWIFT disconnection as sanctions tool (Russia 2022, Iran)
- Freezing of central bank reserves (Russia's ~$300B)
- Secondary sanctions: threatening third-country banks/firms that deal with sanctioned entities

GEOPOLITICAL IMPLICATIONS:

- Dollar weaponization accelerates de-dollarization efforts (but alternatives remain limited)
- China's CIPS (Cross-border Interbank Payment System) as potential SWIFT alternative
- BRICS discussion of alternative payment systems
- Gold reserve accumulation as hedge against sanctions risk

THE FEEDBACK LOOP: Using financial infrastructure as a geopolitical weapon is effective in the short term but may erode the infrastructure's value over time by incentivizing alternatives.

SANCTIONS AND INTERNATIONAL LAW: Unilateral sanctions (especially US secondary sanctions) sit uneasily with international law principles. Other countries may comply not because they agree but because the cost of US financial exclusion is too high.`,
    readings: [
      { text: "TBD — check Canvas for updates", priority: "essential", note: "Syllabus marked TBD." }
    ],
    examTip: "Geopolitics of finance connects to dollar dominance, swap lines, and the broader question of whether the international financial architecture can survive great-power competition."
  }
];

/* priority styling */
const prioStyle = {
  essential: { bg: T.redSoft, color: T.red, label: "Essential" },
  high: { bg: T.amberSoft, color: T.amber, label: "High" },
  skim: { bg: T.accentSoft, color: T.accent, label: "Skim" },
};

/* ─── persistent storage helpers ─── */
const STORAGE_KEY = "tarullo-rif-notes";

function loadNotes() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch { return null; }
}

function saveNotes(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) { console.error("Save failed:", e); }
}

/* ─── main app ─── */
export default function App() {
  const [activeSession, setActiveSession] = useState(1);
  const [editedNotes, setEditedNotes] = useState({});
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loaded, setLoaded] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState("notes"); // notes | readings | exam
  const editRef = useRef(null);

  /* load persisted notes on mount */
  useEffect(() => {
    const saved = loadNotes();
    if (saved) setEditedNotes(saved);
    setLoaded(true);
  }, []);

  /* auto-save on change */
  useEffect(() => {
    if (!loaded) return;
    const t = setTimeout(() => {
      setSaving(true);
      saveNotes(editedNotes);
      setTimeout(() => setSaving(false), 600);
    }, 800);
    return () => clearTimeout(t);
  }, [editedNotes, loaded]);

  const session = SESSIONS.find(s => s.id === activeSession);
  const unit = UNITS.find(u => u.id === session?.unit);

  const getNotes = useCallback((sid) => editedNotes[sid] !== undefined ? editedNotes[sid] : SESSIONS.find(s => s.id === sid)?.notes || "", [editedNotes]);

  /* search */
  const searchResults = useMemo(() => {
    if (!search.trim()) return null;
    const q = search.toLowerCase();
    return SESSIONS.filter(s => {
      const n = getNotes(s.id);
      return s.title.toLowerCase().includes(q) || n.toLowerCase().includes(q) ||
        s.readings?.some(r => r.text.toLowerCase().includes(q));
    });
  }, [search, getNotes]);

  const handleEdit = () => {
    setEditing(true);
    setTimeout(() => editRef.current?.focus(), 50);
  };

  const handleSave = () => {
    setEditing(false);
  };

  const handleNotesChange = (val) => {
    setEditedNotes(prev => ({ ...prev, [activeSession]: val }));
  };

  const handleReset = () => {
    setEditedNotes(prev => {
      const next = { ...prev };
      delete next[activeSession];
      return next;
    });
    setEditing(false);
  };

  const currentNotes = getNotes(activeSession);
  const isModified = editedNotes[activeSession] !== undefined;

  /* completion tracking */
  const completedCount = Object.keys(editedNotes).length;

  return (
    <div style={{ display: "flex", height: "100vh", background: T.bg, color: T.text, fontFamily: "'IBM Plex Mono', 'SF Mono', 'Fira Code', monospace", fontSize: 13 }}>
      {/* Sidebar */}
      <div style={{
        width: sidebarOpen ? 300 : 0, minWidth: sidebarOpen ? 300 : 0,
        background: T.surface, borderRight: `1px solid ${T.border}`,
        overflow: "hidden", transition: "all .2s ease",
        display: "flex", flexDirection: "column"
      }}>
        {/* Header */}
        <div style={{ padding: "16px 14px 12px", borderBottom: `1px solid ${T.border}` }}>
          <div style={{ fontSize: 10, textTransform: "uppercase", letterSpacing: 2, color: T.textMuted, marginBottom: 4 }}>
            Tarullo &middot; Spring 2024
          </div>
          <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.3 }}>
            Regulation of<br/>International Finance
          </div>
          <div style={{ fontSize: 10, color: T.textDim, marginTop: 6 }}>
            {completedCount}/{SESSIONS.length} topics edited
          </div>
        </div>

        {/* Search */}
        <div style={{ padding: "8px 14px" }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search notes & readings..."
            style={{
              width: "100%", padding: "7px 10px", background: T.bg, border: `1px solid ${T.border}`,
              borderRadius: 4, color: T.text, fontSize: 12, fontFamily: "inherit",
              outline: "none", boxSizing: "border-box"
            }}
            onFocus={e => e.target.style.borderColor = T.borderFocus}
            onBlur={e => e.target.style.borderColor = T.border}
          />
        </div>

        {/* Session list */}
        <div style={{ flex: 1, overflowY: "auto", padding: "4px 0" }}>
          {searchResults ? (
            <div style={{ padding: "4px 14px 8px" }}>
              <div style={{ fontSize: 10, color: T.textMuted, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 }}>
                {searchResults.length} result{searchResults.length !== 1 ? "s" : ""}
              </div>
              {searchResults.map(s => {
                const u = UNITS.find(u2 => u2.id === s.unit);
                return (
                  <div key={s.id} onClick={() => { setActiveSession(s.id); setSearch(""); }}
                    style={{ padding: "6px 8px", cursor: "pointer", borderRadius: 4, marginBottom: 2, background: s.id === activeSession ? T.accentSoft : "transparent", borderLeft: `2px solid ${u?.color || T.textDim}` }}>
                    <div style={{ fontSize: 12, color: T.text }}>{s.title}</div>
                    <div style={{ fontSize: 10, color: T.textDim }}>{s.date}</div>
                  </div>
                );
              })}
            </div>
          ) : (
            UNITS.map(u2 => {
              const unitSessions = SESSIONS.filter(s => s.unit === u2.id);
              if (!unitSessions.length) return null;
              return (
                <div key={u2.id} style={{ marginBottom: 4 }}>
                  <div style={{ padding: "8px 14px 4px", fontSize: 10, textTransform: "uppercase", letterSpacing: 1.5, color: u2.color, fontWeight: 600 }}>
                    {u2.icon} {u2.label}
                  </div>
                  {unitSessions.map(s => {
                    const active = s.id === activeSession;
                    const modified = editedNotes[s.id] !== undefined;
                    return (
                      <div key={s.id} onClick={() => { setActiveSession(s.id); setEditing(false); setTab("notes"); }}
                        style={{
                          padding: "6px 14px 6px 24px", cursor: "pointer",
                          background: active ? T.accentSoft : "transparent",
                          borderLeft: active ? `2px solid ${T.accent}` : "2px solid transparent",
                          transition: "all .1s"
                        }}
                        onMouseEnter={e => { if (!active) e.currentTarget.style.background = T.surfaceHover; }}
                        onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
                      >
                        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                          <span style={{ fontSize: 12, color: active ? T.accent : T.text, fontWeight: active ? 600 : 400, flex: 1 }}>
                            {s.id}. {s.title}
                          </span>
                          {modified && <span style={{ width: 5, height: 5, borderRadius: "50%", background: T.green, flexShrink: 0 }} />}
                        </div>
                        <div style={{ fontSize: 10, color: T.textDim, marginTop: 1 }}>{s.date}</div>
                      </div>
                    );
                  })}
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top bar */}
        <div style={{
          padding: "10px 20px", borderBottom: `1px solid ${T.border}`,
          display: "flex", alignItems: "center", gap: 12, background: T.surface, flexShrink: 0
        }}>
          <button onClick={() => setSidebarOpen(!sidebarOpen)}
            style={{ background: "none", border: "none", color: T.textMuted, cursor: "pointer", fontSize: 16, padding: "2px 6px" }}>
            {sidebarOpen ? "\u25C0" : "\u25B6"}
          </button>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <span style={{ color: unit?.color, fontSize: 11 }}>{unit?.icon}</span>
              <span style={{ fontSize: 11, color: T.textMuted }}>{unit?.label}</span>
              <span style={{ color: T.textDim }}>&middot;</span>
              <span style={{ fontSize: 11, color: T.textDim }}>{session?.date}</span>
            </div>
            <div style={{ fontSize: 15, fontWeight: 600, marginTop: 2 }}>
              {session?.title}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            {saving && <span style={{ fontSize: 10, color: T.green }}>Saved &#10003;</span>}
            {isModified && (
              <button onClick={handleReset}
                style={{ padding: "4px 10px", fontSize: 10, background: T.surfaceHover, border: `1px solid ${T.border}`, borderRadius: 4, color: T.textMuted, cursor: "pointer", fontFamily: "inherit" }}>
                Reset
              </button>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: "flex", gap: 0, borderBottom: `1px solid ${T.border}`, background: T.surface, flexShrink: 0, paddingLeft: 20 }}>
          {[
            { id: "notes", label: "Notes" },
            { id: "readings", label: `Readings (${session?.readings?.length || 0})` },
            { id: "exam", label: "Exam Prep" }
          ].map(t2 => (
            <button key={t2.id} onClick={() => { setTab(t2.id); setEditing(false); }}
              style={{
                padding: "8px 16px", fontSize: 11, fontFamily: "inherit", cursor: "pointer",
                background: "none", border: "none", borderBottom: tab === t2.id ? `2px solid ${T.accent}` : "2px solid transparent",
                color: tab === t2.id ? T.accent : T.textMuted, fontWeight: tab === t2.id ? 600 : 400
              }}>
              {t2.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflow: "auto", padding: "20px 28px" }}>
          {tab === "notes" && (
            <div>
              <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 12 }}>
                {editing ? (
                  <button onClick={handleSave}
                    style={{ padding: "5px 14px", fontSize: 11, background: T.greenSoft, border: `1px solid ${T.green}`, borderRadius: 4, color: T.green, cursor: "pointer", fontFamily: "inherit", fontWeight: 600 }}>
                    Done Editing
                  </button>
                ) : (
                  <button onClick={handleEdit}
                    style={{ padding: "5px 14px", fontSize: 11, background: T.surfaceHover, border: `1px solid ${T.border}`, borderRadius: 4, color: T.textMuted, cursor: "pointer", fontFamily: "inherit" }}>
                    Edit Notes
                  </button>
                )}
              </div>
              {editing ? (
                <textarea ref={editRef} value={currentNotes}
                  onChange={e => handleNotesChange(e.target.value)}
                  style={{
                    width: "100%", minHeight: 500, padding: 16, background: T.surface,
                    border: `1px solid ${T.borderFocus}`, borderRadius: 6, color: T.text,
                    fontSize: 13, fontFamily: "inherit", lineHeight: 1.7, resize: "vertical",
                    outline: "none", boxSizing: "border-box"
                  }}
                />
              ) : (
                <div style={{
                  background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6,
                  padding: "20px 24px", lineHeight: 1.8, whiteSpace: "pre-wrap", wordBreak: "break-word"
                }}>
                  {currentNotes}
                </div>
              )}
            </div>
          )}

          {tab === "readings" && (
            <div>
              <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 16 }}>
                Reading Priorities
              </div>
              {["essential", "high", "skim"].map(prio => {
                const items = session?.readings?.filter(r => r.priority === prio) || [];
                if (!items.length) return null;
                const ps = prioStyle[prio];
                return (
                  <div key={prio} style={{ marginBottom: 20 }}>
                    <div style={{
                      display: "inline-block", padding: "2px 8px", borderRadius: 3, fontSize: 10,
                      fontWeight: 600, textTransform: "uppercase", letterSpacing: 1,
                      background: ps.bg, color: ps.color, marginBottom: 10
                    }}>
                      {ps.label}
                    </div>
                    {items.map((r, i) => (
                      <div key={i} style={{
                        padding: "12px 16px", background: T.surface, border: `1px solid ${T.border}`,
                        borderRadius: 6, marginBottom: 8, borderLeft: `3px solid ${ps.color}`
                      }}>
                        <div style={{ fontSize: 13, color: T.text, fontWeight: 500 }}>{r.text}</div>
                        {r.note && <div style={{ fontSize: 11, color: T.textMuted, marginTop: 6, lineHeight: 1.5 }}>{r.note}</div>}
                      </div>
                    ))}
                  </div>
                );
              })}
              {(!session?.readings || session.readings.length === 0) && (
                <div style={{ color: T.textDim, fontStyle: "italic" }}>No readings listed for this session.</div>
              )}
            </div>
          )}

          {tab === "exam" && (
            <div>
              <div style={{
                background: T.purpleSoft, border: `1px solid rgba(188,140,255,.25)`, borderRadius: 6,
                padding: "20px 24px"
              }}>
                <div style={{ fontSize: 10, color: T.purple, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10, fontWeight: 600 }}>
                  Exam Strategy
                </div>
                <div style={{ fontSize: 13, color: T.text, lineHeight: 1.8, whiteSpace: "pre-wrap" }}>
                  {session?.examTip}
                </div>
              </div>

              <div style={{ marginTop: 24, padding: "16px 20px", background: T.surface, border: `1px solid ${T.border}`, borderRadius: 6 }}>
                <div style={{ fontSize: 10, color: T.textMuted, textTransform: "uppercase", letterSpacing: 1.5, marginBottom: 10 }}>
                  Cross-References
                </div>
                <div style={{ fontSize: 12, color: T.textMuted, lineHeight: 1.7, whiteSpace: "pre-wrap" }}>
                  {session?.unit === "found" && "\u2192 Trilemma returns in: IMF Surveillance, Capital Controls, Rajan's 'Rules of the Game'\n\u2192 Soft law theme: Brummer (Session 13), FATF (Session 22), Basel implementation (Sessions 17-18)"}
                  {session?.unit === "fx" && "\u2192 Dollar dominance: Swap lines (5), CBDCs (6), Payments/Geopolitics (23-24)\n\u2192 IMF effectiveness: Surveillance (3-4) vs. Lending (7) vs. Reform (12)\n\u2192 Capital controls connect to: Trilemma (1), Rey's dilemma (11), Rajan (12)"}
                  {session?.unit === "debt" && "\u2192 Soft law limits: Compare Common Framework failures with Basel compliance (17) and FATF success (22)\n\u2192 Contractual approach: CACs/pari passu connect to trade law prudential carve-out (21)\n\u2192 China problem: Connects to dollar dominance (6), geopolitics (24)"}
                  {session?.unit === "coop" && "\u2192 Apply Brummer framework to: Basel (15-18), FATF (22), Common Framework (10), swap lines (5)\n\u2192 Institutional design: Compare BCBS, FSB, FATF, IMF as governance models"}
                  {session?.unit === "basel" && "\u2192 Implementation gaps: Connect to Brummer's compliance theory (13)\n\u2192 National autonomy vs. coordination: Romano (18) vs. Tarullo (18)\n\u2192 Simplicity vs. complexity: Leverage ratio vs. IRB debate runs through Basel I-III"}
                  {session?.unit === "tic" && "\u2192 Derivatives: Case study in post-crisis coordination and US-EU friction\n\u2192 Trade/finance intersection: Prudential carve-out (21), currency manipulation (4)\n\u2192 FATF: Most successful soft law body \u2014 compare with Basel and Common Framework\n\u2192 Payments/geopolitics: Connects to dollar dominance, sanctions, CBDCs"}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
