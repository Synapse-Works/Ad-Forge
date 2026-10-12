# Multi-Format AI Banner Ad Studio

An end-to-end advertising creative studio that transforms product descriptions and URLs into production-ready banner ads across all Google Display, Social Media, and E-commerce standard formats, with dual-mode composition (editable HTML/Canvas layers and pure photorealistic AI studio renders), full aspect ratio control, and 1K/2K/4K resolution selection.

### User Review & Critical Decisions

> [!IMPORTANT]
> The following decisions were confirmed during initial requirements gathering and have shaped this design:

- **Confirmed Aesthetic Versatility**: The app will include dedicated design style presets spanning all four verified directions: *Clean Modern Commerce*, *Bold High-Impact*, *Minimalist Luxury*, and *Direct-Response Conversion*.
- **Confirmed Standard Presets Coverage**: Supports full dimension catalogs across Google Display Network (Leaderboard 728×90, Medium Rectangle 300×250, Large Rectangle 336×280, Wide Skyscraper 160×600, Half Page 300×600, Billboard 970×250, Mobile Leaderboard 320×50), Social Media Ads (Instagram/Facebook Square 1080×1080, Story/Reels 1080×1920, Landscape Feed 1200×628, Portrait 1080×1350), and E-commerce Banners (Shopify Hero 1920×800, Amazon Headline 3000×600).
- **Confirmed Dual-Mode Composition**: Provides a unified workspace with two complementary creative modes:
  1. *Interactive Editable Layer Mode*: Real-time WYSIWYG canvas with editable headline, subheadline, call-to-action button, brand badge, and custom logo over AI-generated product visuals, exportable directly to PNG/JPG at full resolution.
  2. *Studio AI Render Mode*: Direct generation of high-fidelity visual artwork tailored to exact aspect ratios (1:1, 2:3, 3:2, 3:4, 4:3, 9:16, 16:9, 21:9) and resolutions (1K, 2K, 4K) using `gemini-3-pro-image-preview` and `gemini-nano-banana-2.1`.

---

### 1. Overview & Core Concept

- **What It Does**: Users provide a product description, target URL, and optional brand logo or product photo. The backend AI analyzes the product selling points and target audience to formulate tailored ad copy (headlines, hooks, CTAs) and visual art direction. Users can review, fine-tune, batch-generate banner ads in all standard dimensions, customize typography and layers, adjust image resolution (1K, 2K, 4K) and aspect ratios, and download individual banners or a full campaign bundle.
- **Target Audience / Persona**: Performance marketers, e-commerce store operators, digital marketing agencies, growth hackers, and small business owners who need high-converting, multi-size banner ad suites in minutes without hiring graphic designers.
- **Key Value**: Drastically cuts creative turnaround from days to seconds while eliminating sizing friction, ensuring pixel-perfect responsive typography and high-converting marketing layouts across every standard ad exchange.

---

### 2. User Experience & Visual Design

- **Key User Flows**:
  1. **Brief & Product Ingestion**: User enters a product URL and description, selects brand style aesthetic (*Clean Modern*, *Bold High-Impact*, *Minimalist Luxury*, *Direct-Response*), brand colors, and target CTA (*Shop Now*, *Learn More*, *Claim Discount*, etc.).
  2. **AI Strategy & Copy Generation**: `gemini-3.8-flash` extracts product highlights, generates 3 headline angle variants (e.g., Value-Driven, Urgency, Curiosity), compelling subtext, discount callouts, and tailored image generation prompts for different aspect ratios.
  3. **Multi-Size Grid View**: The user sees all standard banner ad sizes rendered simultaneously in an intuitive multi-size gallery, with visual size tags (e.g. 300×250, 728×90, 1080×1920). Filter tabs allow narrowing by channel (*All*, *Google Display*, *Social Media*, *E-commerce*).
  4. **Creative Inspector & WYSIWYG Editor**: Clicking any banner opens the focused canvas studio where the user can:
     - Switch between *Layered Mode* (edit headline text, font, size, CTA color, logo position, background scrim) and *Studio AI Render Mode*.
     - Trigger AI image generation with aspect ratio overrides (`1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `9:16`, `16:9`, `21:9`) and resolution selector (`1K`, `2K`, `4K`) using `gemini-3-pro-image-preview` and `gemini-nano-banana-2.1`.
     - Regenerate background or replace with user-uploaded asset.
  5. **Export & Batch Download**: Instant single-click PNG/JPG download for any individual size (rendered on an off-screen high-DPI HTML5 Canvas) or batch export.

- **Visual Identity & Theme**:
  - *Aesthetic Direction*: Professional creative studio interface. Clean slate workspace with deep charcoal and neutral structure, crisp high-contrast controls, and focused media canvases.
  - *Color Palette*: Slate dark foundation (`#090D16` / `#0F172A`), structural borders (`#1E293B` / `#334155`), clean typography (`#F8FAFC` and `#94A3B8`), with an electric indigo/violet brand accent (`#6366F1`) reserved for primary action triggers.
  - *Typography*: `Plus Jakarta Sans` for clean structural UI navigation and badges, paired with modular banner typography choices (*Outfit*, *Manrope*, *Cinzel*, *Archivo*, *Playfair Display*) for banner customization.
  - *Spatial Layout*: 3-zone layout with left Brief & Strategy configuration dock (380px), top toolbar with format filter tabs and global actions, and central dynamic multi-size banner staging area.

- **Interactive Feedback & Motion**:
  - Live real-time preview updates as user types or adjusts colors.
  - Smooth loading spinners and generation status stages for multi-modal calls.
  - Hover zoom and quick-action overlay buttons (Download, Edit, Duplicate, Fullscreen).

---

### 3. Key Product Decisions & Trade-Offs

- **Decision 1: Dual Composition Engine (HTML5 Canvas + Gemini Studio Render)**
  - *Chosen Approach*: The layered mode renders an HTML/SVG ad structure over an AI-generated product visual and exports pixel-perfect raster graphics via an HTML5 canvas drawing engine; the studio render mode generates complete AI compositions.
  - *Why*: Gives users complete control over legible copy, font choices, and brand colors without AI hallucinating misspelled text, while still providing pure AI generative power when desired.
  - *Alternatives Considered*: Pure AI image generation only (causes garbled text on small banner sizes like 320×50 or 728×90).
- **Decision 2: Server-Side Gemini API Proxy with Express**
  - *Chosen Approach*: Server-side endpoints (`/api/analyze-product`, `/api/generate-banner-image`) utilizing `@google/genai` SDK with `GEMINI_API_KEY` kept securely on the server.
  - *Why*: Complies with security policies preventing client-side key leakage while enabling advanced parameter controls (`imageConfig.aspectRatio`, `imageConfig.imageSize`).
- **Decision 3: Smart Aspect Ratio Mapping for Standard Sizes**
  - *Chosen Approach*: Map standard ad dimensions to the closest optimal AI aspect ratio (e.g. 728×90 & 970×250 to 21:9 or 8:1; 160×600 & 300×600 to 9:16 or 1:4; 300×250 to 1:1; 1200×628 to 16:9), with user override controls.
  - *Why*: Ensures background assets are never squished or awkwardly cropped.

---

### 4. Technical Architecture & Data Strategy *(Technical Reference)*

```
┌────────────────────────────────────────────────────────────────────────┐
│                          User Browser (React)                          │
├────────────────────────────────┬───────────────────────────────────────┤
│    Product Brief & URL Form    │       Banner Presets & Gallery        │
│  - Description & URL parsing   │  - Google Display (300x250, 728x90...)│
│  - Style Preset Picker         │  - Social (1080x1080, 1080x1920...)   │
│  - Brand Color & CTA picker    │  - E-commerce (1920x800, 3000x600...) │
├────────────────────────────────┴───────────────────────────────────────┤
│                    WYSIWYG Inspector & Canvas Studio                   │
│  - Layered Ad Builder: Headline, Subhead, CTA Button, Badge, Logo      │
│  - Resolution (1K/2K/4K) & Aspect Ratio (1:1, 16:9, 9:16, etc.)        │
│  - Real-time High-DPI Canvas Exporter (PNG / JPEG)                     │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / JSON
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                         Express Server (Node.js)                       │
├────────────────────────────────────────────────────────────────────────┤
│  POST /api/analyze-product                                             │
│  - Model: gemini-3.8-flash                                             │
│  - Structured JSON: headlines, taglines, CTAs, ad visual prompts       │
├────────────────────────────────────────────────────────────────────────┤
│  POST /api/generate-banner-image                                       │
│  - Models: gemini-3-pro-image-preview & gemini-nano-banana-2.1         │
│  - Params: prompt, aspectRatio, imageSize ("1K", "2K", "4K")           │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ @google/genai SDK
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        Google Gemini Foundation                        │
└────────────────────────────────────────────────────────────────────────┘
```

- **Data Model & State**:
  - `ProductBrief`: URL, title, description, category, brand name, primary color, secondary color, logo URL.
  - `AdCampaign`: Campaign ID, style preset, headline variants, subhead, CTA text, discount badge.
  - `BannerPreset`: Key dimensions (width, height), standard name (e.g. `Leaderboard`, `Medium Rectangle`, `Instagram Story`), category (`google_display` | `social` | `ecommerce`), recommended aspect ratio.
  - `BannerItem`: Preset ID, custom text overrides, background image URL/base64, aspect ratio, image size (`1K` | `2K` | `4K`), layout configuration.
- **Interactive Component & State Mapping**:
  - `BriefForm`: Handles user input, quick sample presets (e.g., Tech Gadget, Luxury Watch, Sustainable Skincare, Running Shoes) for 1-click testing.
  - `PresetSelector`: Multi-select standard banner sizes and filter by network category.
  - `BannerCanvas`: Renders live DOM banner with exact aspect ratio scaling, text bounds, contrast scrim, and SVG badges.
  - `ImageConfigModal`: Controls model selection (`gemini-3-pro-image-preview` / `gemini-nano-banana-2.1`), aspect ratio (`1:1`, `2:3`, `3:2`, `3:4`, `4:3`, `9:16`, `16:9`, `21:9`), and resolution (`1K`, `2K`, `4K`).
  - `ExportEngine`: Converts DOM canvas element to full-resolution offscreen HTML5 `<canvas>` and triggers direct downloads.
