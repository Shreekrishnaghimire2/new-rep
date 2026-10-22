# SKG ENTERPRISES — Official Website

Official website for **SKG ENTERPRISES** (`IDEAS → TECHNOLOGY → IMPACT`).  
Engineered as a premium, human-friendly, bilingual (English & Nepali) digital presence designed to communicate capabilities, present transparent demonstrations, and capture qualified project inquiries.

---

## 1. Technology Stack

- **Frontend:** React 19, TypeScript, Vite 8
- **Styling:** Tailwind CSS v4, custom design tokens matching the approved brand identity:
  - Deep Navy: `#071426`
  - Electric Blue: `#087BFF`
  - Cyan: `#21D4F4`
  - Gold Accent: `#FFAA18`
- **Typography:** Plus Jakarta Sans & Noto Sans Devanagari (Google Fonts)
- **Icons:** Lucide React
- **Backend Service:** Express 4 on Node.js / `server.ts` with Vite middlewares in development
- **Inquiry Pipeline:** REST endpoint `/api/contact` with rate-limiting, honeypot spam protection, content sanitization, and structured storage

---

## 2. Project Architecture

```
├── .env.example
├── index.html                   # HTML5 entry with SEO tags, favicon, and JSON-LD structured schema
├── metadata.json                # Project title, description, and capabilities
├── package.json
├── server.ts                    # Full-stack Express server with /api/contact & /api/health
├── src/
│   ├── App.tsx                  # Main app layout, language state, and modal orchestration
│   ├── index.css                # Tailwind v4 configuration, font variables, and WCAG focus rings
│   ├── main.tsx                 # React entry mount
│   ├── types.ts                 # TypeScript data contracts
│   ├── translations.ts          # Comprehensive English & Nepali dictionaries
│   ├── assets/images/           # Generated high-resolution visuals (Himalayan Hero & Tech Cube)
│   └── components/
│       ├── Navbar.tsx           # Strict Top Bar contract, EN/नेपाली switch, responsive drawer
│       ├── Hero.tsx             # Value proposition, Himalayan hero visual, 4 proof metrics
│       ├── ServicesSection.tsx  # 3 Service groups, 6 core services, filter tabs, detail modal
│       ├── FutureProductsSection.tsx # Glowing holographic cube visual, R&D concept lab modal
│       ├── ProjectsSection.tsx  # 3 Interactive live simulators & verified architecture models
│       ├── ProcessSection.tsx   # 4-stage methodology: Discover → Plan → Build → Launch
│       ├── AboutSection.tsx     # Authentic narrative, core pillars, verified Nepal location
│       ├── ContactSection.tsx   # Real inquiry form, status check verification tool
│       ├── ProjectEstimatorModal.tsx # Deterministic 3-question scope & brief helper
│       ├── LegalModals.tsx      # Privacy Policy & Terms of Service dialogs
│       └── Footer.tsx           # Brand wordmark, quick links, verified contact details
└── tsconfig.json
```

---

## 3. Local Development

### Prerequisites
- Node.js 20+
- npm 9+

### Commands
```bash
# 1. Install dependencies
npm install

# 2. Start full-stack development server
npm run dev
# The server will run on http://localhost:3000

# 3. Type checking
npm run lint

# 4. Production build
npm run build

# 5. Start production server
npm run start
```

---

## 4. Real Contact Form & Verification API

- **Endpoint:** `POST /api/contact`
- **Payload:**
  ```json
  {
    "name": "Full Name",
    "email": "user@example.com",
    "description": "Project requirements...",
    "serviceCategory": "Web Development",
    "budgetRange": "$1,000 – $3,000",
    "expectedTimeline": "Within 1 month",
    "website_honeypot": ""
  }
  ```
- **Validation:**
  - Name: $\ge 2$ characters, $\le 100$ characters.
  - Email: RFC-compliant email regex.
  - Description: $\ge 10$ characters, $\le 4,000$ characters.
  - Rate limiting: Max 5 submissions per 10 minutes per IP.
  - Honeypot: Automated bots filling `website_honeypot` are trapped and safely neutralized.
  - Inquiry Reference ID: Generated upon submission (e.g. `SKG-MVJ6F0Q8-HTEX`).
- **Status Verification Endpoint:** `GET /api/contact/verify/:id`
  - Validates the submission status of any existing inquiry reference ID.

---

## 5. Updating Content & Language Translations

All text is organized in `src/translations.ts`.
- To update English copy, edit keys under `translations.en`.
- To update Nepali copy, edit matching keys under `translations.ne`.
- To update services or projects, modify `serviceItemsData` and `projectItemsData` in `src/translations.ts`.

---

## 6. Accessibility & SEO Compliance

- **WCAG 2.2 AA:** Contrasts exceed 4.5:1 for body copy and 3:1 for large headers on `#071426`.
- **Keyboard Navigation:** Explicit visible focus rings (`focus-visible:ring-2 focus-visible:ring-cyan-400`).
- **Screen Reader Support:** Semantic HTML5 landmarks (`header`, `nav`, `main`, `section`, `footer`).
- **Search Optimization:** Pre-configured OpenGraph metadata, Twitter Cards, semantic heading hierarchy, and Schema.org `ProfessionalService` structured JSON-LD.
