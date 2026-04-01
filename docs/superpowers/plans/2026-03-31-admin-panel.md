# Corey Website Admin Panel Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a SQLite backend and admin panel so Corey can edit all website content from the browser.

**Architecture:** SQLite DB stores all site content (hero, about, stats, highlights, gallery, contacts). JWT auth protects admin routes via Next.js 16 proxy.ts. Admin panel at /admin with section editors. Public pages fetch from DB instead of hardcoded data.

**Tech Stack:** better-sqlite3, bcryptjs, jose (JWT), Next.js 16 App Router, Tailwind v4

---

### Task 1: Install Dependencies & Create Database Layer

**Files:**
- Modify: `package.json` (add better-sqlite3, bcryptjs, jose, types)
- Create: `src/lib/db.ts`
- Create: `src/lib/auth.ts`
- Create: `data/.gitkeep`

- [ ] **Step 1: Install dependencies**

```bash
cd D:/projs/corey-website
npm install better-sqlite3 bcryptjs jose
npm install -D @types/better-sqlite3 @types/bcryptjs
```

- [ ] **Step 2: Create `src/lib/auth.ts`**

```typescript
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'corey-site-secret-change-in-production'
);

const COOKIE_NAME = 'corey-auth';

export async function signJWT(payload: { userId: number; email: string }) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
}

export async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: number; email: string };
  } catch {
    return null;
  }
}

export function hashPassword(password: string) {
  return bcrypt.hashSync(password, 10);
}

export function comparePassword(password: string, hash: string) {
  return bcrypt.compareSync(password, hash);
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAME)?.value;
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
    path: '/',
  });
}

export async function clearAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
}

export async function getAuthUser() {
  const token = await getAuthToken();
  if (!token) return null;
  return verifyJWT(token);
}

export async function requireAuth(request?: NextRequest) {
  if (request) {
    const token = request.cookies.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyJWT(token);
  }
  return getAuthUser();
}
```

- [ ] **Step 3: Create `src/lib/db.ts`**

Database with tables: site_content (key-value for hero/about/stats), highlights, gallery, contacts, users. Seed with current hardcoded content from existing components.

Tables:
- `site_content`: id, section (hero/about/stats), key, value — stores all text content
- `highlights`: id, title, subtitle, duration, views, videoUrl, featured, order
- `gallery`: id, title, category, imageUrl, width (1 or 2 for grid), height (1 or 2), order
- `contacts`: id, firstName, lastName, email, enquiryType, message, createdAt
- `users`: id, email, passwordHash, createdAt

Seed data: extract all hardcoded strings from HeroSection.tsx, AboutSection.tsx, StatsBanner.tsx, HighlightsSection.tsx, GallerySection.tsx into the DB.

- [ ] **Step 4: Create `data/.gitkeep` and add `data/*.db` to `.gitignore`**

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat: add database layer and auth for admin panel"
```

---

### Task 2: Create Proxy (Auth Middleware) & API Routes

**Files:**
- Create: `src/proxy.ts`
- Create: `src/app/api/auth/login/route.ts`
- Create: `src/app/api/content/route.ts`
- Create: `src/app/api/highlights/route.ts`
- Create: `src/app/api/highlights/[id]/route.ts`
- Create: `src/app/api/gallery/route.ts`
- Create: `src/app/api/gallery/[id]/route.ts`
- Create: `src/app/api/contacts/route.ts`

- [ ] **Step 1: Create `src/proxy.ts`**

Protect /admin/* (except /admin/login) and /api/* (except /api/auth and /api/contacts POST).

- [ ] **Step 2: Create auth API route** — POST login, DELETE logout

- [ ] **Step 3: Create content API route** — GET all content, PUT update content (by section+key)

- [ ] **Step 4: Create highlights API routes** — GET all, POST new, PATCH update, DELETE remove

- [ ] **Step 5: Create gallery API routes** — GET all, POST new, PATCH update, DELETE remove

- [ ] **Step 6: Create contacts API route** — POST (public), GET (admin only)

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat: add API routes and auth proxy"
```

---

### Task 3: Create Admin Panel Pages

**Files:**
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/page.tsx` (dashboard)
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/content/page.tsx` (edit hero/about/stats)
- Create: `src/app/admin/highlights/page.tsx`
- Create: `src/app/admin/gallery/page.tsx`
- Create: `src/app/admin/contacts/page.tsx`
- Create: `src/components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Create AdminSidebar component**

Dark theme matching the racing aesthetic. Red accent for active links. Links: Dashboard, Site Content, Highlights, Gallery, Messages, View Site, Logout.

- [ ] **Step 2: Create admin layout.tsx**

Wraps admin pages (except login) with sidebar + main content area.

- [ ] **Step 3: Create login page**

Styled with racing theme — dark bg, red accents, email/password form.

- [ ] **Step 4: Create dashboard page**

Overview stats: total highlights, gallery items, unread messages. Quick links to each section.

- [ ] **Step 5: Create site content editor**

Editable fields for:
- Hero: title, subtitle, tagline, CTA text/links
- About: bio paragraphs, feature cards (title + description), tags
- Stats: each stat label + value

- [ ] **Step 6: Create highlights editor**

Table of highlight videos. Add/edit/delete. Fields: title, subtitle, duration, views, videoUrl, featured toggle, order.

- [ ] **Step 7: Create gallery editor**

Grid of gallery items. Add/edit/delete. Fields: title, category, imageUrl, grid size (width/height), order.

- [ ] **Step 8: Create contacts/messages viewer**

Table of contact form submissions. View message details.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: add admin panel with section editors"
```

---

### Task 4: Refactor Public Pages to Use Database

**Files:**
- Modify: `src/app/page.tsx`
- Modify: `src/components/HeroSection.tsx`
- Modify: `src/components/AboutSection.tsx`
- Modify: `src/components/StatsBanner.tsx`
- Modify: `src/components/HighlightsSection.tsx`
- Modify: `src/components/GallerySection.tsx`
- Modify: `src/components/ContactSection.tsx`
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Update page.tsx to fetch data from DB**

Import db functions, pass data as props to each section component.

- [ ] **Step 2: Update HeroSection to accept props instead of hardcoded data**

Props: title, subtitle, tagline, ctaText, ctaHref, secondaryCtaText, secondaryCtaHref, stats array.

- [ ] **Step 3: Update AboutSection to accept props**

Props: bio paragraphs, features array, tags array.

- [ ] **Step 4: Update StatsBanner to accept props**

Props: stats array (label, value, suffix).

- [ ] **Step 5: Update HighlightsSection to accept props**

Props: highlights array from DB.

- [ ] **Step 6: Update GallerySection to accept props**

Props: gallery items array from DB.

- [ ] **Step 7: Update ContactSection to submit to API**

Change form onSubmit to POST to /api/contacts instead of alert().

- [ ] **Step 8: Fix Footer copyright year**

Change `const currentYear = 2025` to `const currentYear = new Date().getFullYear()`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "feat: refactor public pages to use database content"
```

---

### Task 5: Polish & Build Verification

- [ ] **Step 1: Run `next build` and fix any errors**
- [ ] **Step 2: Verify all public pages render correctly**
- [ ] **Step 3: Verify admin login/logout flow**
- [ ] **Step 4: Verify content editing works end-to-end**
- [ ] **Step 5: Final commit**

```bash
git add -A
git commit -m "fix: polish and build verification"
```
