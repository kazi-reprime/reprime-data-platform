![][image1]

The Institutional Deal Intelligence Platform

**What Terminal Is**

Terminal is a proprietary deal intelligence engine that ingests raw commercial real estate data — offering memoranda, CoStar underwriting reports, rent rolls, T-12 operating statements, lease documents, environmental records, court filings, CMBS surveillance data, and federal economic indicators — and processes it through layered extraction, contextual modeling, and adversarial analysis. What comes out the other end is an institutional-grade acquisition package where every figure traces to its source document, every assumption has been stress-tested across three scenarios, and every conclusion has been challenged by the machine’s own adversarial layer before a human decision-maker sees it.

The architecture is built on Claude Opus and Sonnet as the analytical core, with Supabase providing the operational database, real-time subscriptions, row-level security, and vector search. The frontend runs on Next.js with server-side rendering. Every data source connects through a provenance spine — an unbroken audit trail from raw input to final output. No number exists in a Terminal package without a traceable origin.

**What’s Live Today**

Terminal is already operational with 22 live data sources connected, 59 asset-class-specific analytical models loaded, and a four-stage processing pipeline that has been validated on real deals. The proof of concept delivered results that exceeded every expectation — before the full platform build has even begun.

**The Connected Sources (Live Now)**

| Domain | What’s Connected |
| :---- | :---- |
| Macro & Rates | Federal Reserve (10-Year Treasury, 30-Year Mortgage, Fed Funds) · Bureau of Economic Analysis · Bureau of Labor Statistics · AlphaVantage · Finnhub · Polygon · Energy Information Administration |
| Location & Mapping | Google Maps (11 APIs: Places, Geocoding, Distance Matrix, Street View, Directions, Elevation, and more) · Walk Score · Foursquare Places · Mapbox · OpenWeather |
| Demographics | U.S. Census Bureau (45 datasets including ACS 5-year estimates) · HUD Fair Market Rent · HUD CHAS housing affordability |
| Climate & Hazard | FEMA National Flood Hazard Layer · NOAA storm event history · NOAA hurricane tracks · National Weather Service alerts · EPA Envirofacts (Superfund, brownfields, TRI, air quality) · FEMA disaster declarations |
| Legal & Compliance | CourtListener (federal court dockets) · PACER · OFAC sanctions screening · SEC EDGAR (REIT filings, fund disclosures) · Federal Register · State Secretary of State business entity records |
| Tenant Intelligence | Yelp Fusion (consumer analytics, store-level health) · Socrata municipal violations (200+ cities: code enforcement, HPD complaints, DOB violations) · Inforuptcy bankruptcy monitoring (active subscription) |
| Credit & Ratings | KBRA · S\&P Global Ratings · Fitch Connect · DBRS Morningstar (authenticated access) · CompStak lease comps (approved) · CoStar underwriting data |

Behind these live feeds sit 59 methodology files organized by asset class — retail, multifamily, office, industrial, self-storage — covering CAM reconciliation, percentage-rent modeling, vacancy and concession analysis, expense-stop methodology, rentable-versus-usable SF, turnover cost modeling, and more. Eleven institutional financial models handle acquisition, development, equity waterfall, construction draw, and loan analysis. Twenty-two industry benchmark reports from MBA, NCREIF, BOMA, ICSC, and CBRE provide the market context.

**How It Processes a Deal**

Every deal enters a four-stage pipeline. No stage can be skipped. No human can override the sequence.

**CAPTURE.** Raw documents are parsed automatically. Every financial figure, tenant name, lease term, and operating expense line is extracted and permanently linked to its source page. The CoStar extractor alone handles seven distinct report sections. The OM extractor normalizes cap rates, parses deal terms, and identifies every highlight the seller chose to emphasize — and everything they chose to leave out.

**ANALYZE.** Three scenarios — Base, Downside, Upside — are modeled simultaneously using three-constraint debt sizing (LTV, DSCR, debt yield). The binding constraint governs the capital structure. Models are loaded contextually per asset class. Full multi-year cash flow projections, IRR, equity multiples, and sensitivity matrices are generated. Analysis cost per deal: under $7.

**CHALLENGE.** The adversarial engine runs 12 rules against every deal and then escalates to a full adversarial review that asks: what would an investment committee reject? It checks seller-stated NOI against independently calculated NOI, vacancy assumptions against verified submarket data, expense ratios against BOMA and IREM benchmarks, anchor tenant health against consumer analytics and bankruptcy filings, insurance and reserve adequacy, environmental and flood zone exposure, and litigation against the property or its principals. Every finding carries a confidence score with source-document backing.

**DELIVER.** Only deals that survive all three stages produce output. The package includes a pre-LOI screening report, tenant intelligence reports (8 sections per tenant), an 84-item due diligence checklist tracked by asset class, and complete provenance records for every figure.

**What It Already Caught**

On the first deal processed through the full pipeline — before any optimization, before any refinement — Terminal produced findings that would have taken a human team weeks to assemble:

* The seller’s operating expense ratio was 28% below BOMA submarket benchmarks. Terminal recalculated NOI using verified market expense data and found the gap substantial enough to change the investment thesis entirely.

* FEMA records showed the parcel had been reclassified into a Special Flood Hazard Area since the last appraisal. Insurance cost implications were not reflected anywhere in the seller’s proforma.

* Tenant intelligence reports across 18 tenants revealed declining foot traffic patterns, municipal code violations, and early indicators of credit deterioration — none of which appeared in the offering memorandum.

* The 84-item diligence checklist was generated automatically, organized by asset class, with every received document tracked against every outstanding item.

* Total processing cost for the entire analysis: $6.92. Total time: minutes.

*This was the proof of concept. The system was not yet optimized. The full tool stack was not yet connected. And it already delivered results above and beyond what a traditional acquisitions team produces in weeks of manual work.*

**Where This Is Going**

What’s live today is 22 data sources. Within 18 months, Terminal will integrate over 230 tools, APIs, and intelligence feeds into a single unified platform — the most powerful deal acquisition and due diligence machine in the United States.

The full stack is mapped, scored, and prioritized. Here is what comes online:

**CMBS & Distress Intelligence**

Trepp (full CMBS surveillance universe, delinquency tracking, special servicing, workout monitoring) · CRED iQ ($2.3 trillion tracked, borrower contacts, audited financials, servicer workout strategy) · BankRegData (FDIC call report analysis identifying banks with CRE concentration above 300% of Tier 1 capital — the institutions most likely to sell non-performing loans) · DebtX (institutional NPL marketplace with credit scoring)

**Ownership & Parcel Intelligence**

ATTOM Data (54 million+ parcels, nationwide ownership source of truth) · Reonomy/Altus Group (ML-powered Likelihood to Sell scoring across 54 million properties) · Cherre (3.3 billion addresses unified in a single knowledge graph with AI agent deployment) · CoreLogic (mortgage risk datasets, insurance modeling) · BatchData (predictive seller propensity at scale)

**Underwriting Automation**

Clik.ai (automated rent roll and T-12 extraction directly into financial models — the AutoUW engine processed $7.9 billion in deal volume) · Built AI (10x underwriting speed from raw documents to cash flow models — CBRE client) · Dealpath (the institutional pipeline standard with $10 trillion+ in transactions, AI Extract at 95% accuracy, Connect marketplace covering 65% of institutional listings) · redIQ/Radix (institutional-standard rent roll normalization — CBRE, JLL, BH clients)

**Climate, Environmental & Hazard Modeling**

First Street Foundation (30-year flood, wind, and wildfire hazard projections at the parcel level) · HazardHub (multi-hazard insurance risk scoring: frozen pipe, hail, storm surge — beyond what FEMA covers) · ClimateCheck (insurance premium spike prediction and coverage withdrawal risk) · CREtelligent (integrated Phase I/II environmental, zoning, ALTA surveys) · LightBox (environmental screening, zoning API, virtual data rooms)

**Lease Intelligence & Legal**

CompStak (full API: 1.6 million+ verified lease comps with AI rent prediction and market analysis) · MRI Contract Intelligence (bulk lease abstraction across 25 languages, 500,000+ documents processed) · Prophia (source-linked portfolio lease intelligence) · DDee.ai (full due diligence software with IC memo generation) · Thomson Reuters CoCounsel (legal AI for contract review and compliance)

**Foot Traffic, Consumer & Market Analytics**

Placer.ai (near real-time foot traffic visitation data, return-to-office trajectory, retail performance quantification) · Foursquare Places (point-of-interest and behavioral analytics) · AirDNA (short-term rental RevPAR, ADR, and occupancy benchmarks) · RentCast (rental AVMs and real-time market trends) · CrimeoMeter (dynamic safety index with A+ to F grading)

**Institutional Financial Data**

FactSet · PitchBook · S\&P Global · Morningstar · MSCI · ICE Data Services — all connected via live MCP integrations for real-time credit analysis, fund intelligence, index benchmarking, and fixed-income data.

**Geospatial & Visualization**

Mapbox Enterprise (dark-theme interactive maps with satellite view, deal card overlays, and comp visualization) · Regrid (high-fidelity parcel boundaries) · Matterport (3D digital twins for immersive property visualization on deal pages) · DeepBlocks (automated zoning feasibility and 3D massing for urban infill analysis)

**What This Means**

Today, with 22 live sources and 59 analytical models, Terminal already processes over 100 deals per day and catches findings that human teams miss entirely. The adversarial layer alone — the machine attacking its own conclusions — has no equivalent in any acquisitions workflow operating today.

Within 18 months, when the full 233-tool stack comes online, Terminal will connect CMBS surveillance with ownership intelligence with climate hazard modeling with automated underwriting with lease abstraction with foot traffic analytics with parcel-level environmental screening — all flowing through a single provenance-backed pipeline that traces every conclusion to its source document.

No acquisitions office in the country operates anything like this. No combination of analysts, no amount of manual research, no existing platform connects these data sources at this depth, at this speed, with this level of adversarial rigor.

**Terminal is not an improvement to how deals are sourced and evaluated. It is a replacement for everything that came before it.**

**reprimeterminal.com**

info@reprime.com  ·  888-770-8770  ·  Confidential  ·  May 2026

[image1]: <data:image/png;base64,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>