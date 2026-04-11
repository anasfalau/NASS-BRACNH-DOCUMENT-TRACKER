# NASS Branch Document Workflow Tracker — Technical Manual

**Version:** 1.0  
**Date:** April 2026  
**Classification:** RESTRICTED — For Authorised Personnel Only

---

## Table of Contents

1. [System Overview](#1-system-overview)
2. [Architecture](#2-architecture)
3. [File Structure](#3-file-structure)
4. [Frontend — index.html](#4-frontend--indexhtml)
5. [Application Logic — app.js](#5-application-logic--appjs)
6. [Backend Integration — supabase-init.js](#6-backend-integration--supabase-initjs)
7. [Data Model](#7-data-model)
8. [Authentication Flow](#8-authentication-flow)
9. [Data Persistence Strategy](#9-data-persistence-strategy)
10. [Real-Time Sync (Broadcast)](#10-real-time-sync-broadcast)
11. [Function Reference](#11-function-reference)
12. [Configuration Reference](#12-configuration-reference)
13. [Deployment](#13-deployment)
14. [Security Considerations](#14-security-considerations)
15. [Known Limitations](#15-known-limitations)

---

## 1. System Overview

The NASS Branch Document Workflow Tracker is a single-page web application (SPA) built for the Naval Safety and Standards Branch at Naval Headquarters. It provides a centralised register for tracking documents, correspondence, and action items through their workflow lifecycle.

**Technology Stack**

| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML5 / CSS3 / JavaScript (ES6) |
| Backend / Auth | Supabase (PostgreSQL + Auth + Realtime) |
| Hosting | Any static file server (e.g. `npx serve`) |
| External SDK | `@supabase/supabase-js` v2 (CDN) |

---

## 2. Architecture

```
Browser
│
├── index.html          ← Shell, login modal, table layout, all modals
├── style.css           ← All visual styles
├── supabase-init.js    ← Authentication, Supabase sync, broadcast channel
└── app.js              ← All application logic, data, CRUD, rendering
        │
        └── Supabase Cloud
              ├── Auth  (email/password)
              └── Database table: nass_settings (key/value store)
```

**Boot sequence:**
1. Browser loads `index.html` → shows loading overlay
2. `supabase-init.js` executes → checks for an existing session
3. If no session → show login modal
4. If session exists → `pullData()` fetches all data from Supabase into `localStorage`
5. `app.js` is dynamically loaded via `loadScript()`
6. `app.js` calls `loadData()` → populates in-memory arrays from `localStorage`
7. Table renders; broadcast channel subscribes for live updates

---

## 3. File Structure

```
NASS BRANCH DOCUMENT TRACKER/
├── index.html           Main application shell
├── app.js               Application logic and data
├── supabase-init.js     Supabase auth & sync layer
├── style.css            Stylesheet
├── logo.png             Application logo
├── NN-logo.png          Nigerian Navy logo
└── NN-logo-transparent.png
```

---

## 4. Frontend — index.html

### Key DOM Sections

| Element ID | Purpose |
|---|---|
| `nass-loading` | Full-screen loading overlay shown on boot |
| `nass-login` | Login modal (email + password form) |
| `nass-login-form` | Login form; submit handled by `supabase-init.js` |
| `nass-login-err` | Inline error message area in login modal |
| `nass-user-wrap` | Topbar user info panel (hidden until authenticated) |
| `nass-user-email` | Displays logged-in user's email address |
| `tbody` | `<tbody>` target for `renderTable()` |
| `rc` | Record count display (e.g. "27 / 27 records") |
| `fc` | Filter count label shown during search |
| `stats` | Statistics bar (Total, Active, Completed, Overdue, On Hold) |
| `srch` | Global text search input |
| `f-status` | Status filter dropdown |
| `f-officer` | Action Officer filter dropdown |
| `f-delay` | Delay flag filter dropdown |
| `mbg` | Add/Edit modal backdrop; gains class `open` when visible |
| `mtitle` | Modal title ("Add New Record" / "Edit Record") |
| `m-idx` | Hidden input holding the index of the record being edited |
| `detail-mbg` | Detail view modal backdrop |
| `view-tracker` | Main tracker view container |
| `view-admin` | Admin panel view container |
| `tb-tracker` | Topbar "Tracker" tab button |
| `tb-admin` | Topbar "Admin" tab button |

### Modal Form Fields

| Field ID | Column | Type |
|---|---|---|
| `m-serial` | Serial No. | Hidden input (auto-generated) |
| `m-ref` | File Ref No. | Text with `<datalist>` autocomplete |
| `m-subject` | Subject / Description | Textarea |
| `m-loc` | Current Location | Select |
| `m-off` | Action Officer | Select |
| `m-act` | Last Action | Select |
| `m-drcv` | Date Received | Date |
| `m-dmov` | Date Moved | Date |
| `m-sla` | SLA (Days) | Text |
| `m-due` | Due Date | Date |
| `m-stat` | Status | Select |
| `m-flag` | Delay Flag | Select |
| `m-rem` | Remarks | Text |
| `m-save-btn` | Save button | Shown in edit mode |
| `m-edit-btn` | Edit button | Shown in view mode (currently unused) |

---

## 5. Application Logic — app.js

### Global State

```javascript
var officers   = [...];   // Action officer names
var statuses   = [...];   // Document status values
var locations  = [...];   // Physical/workflow locations
var actions    = [...];   // Last-action types
var fileIndex  = [...];   // Pre-loaded file reference numbers
var rows       = [...];   // Master record array (array of arrays)
var sortCol    = -1;      // Currently sorted column index (-1 = none)
var sortAsc    = true;    // Sort direction
```

### Record Structure

Each record is stored as a 13-element array:

| Index | Field | Description |
|---|---|---|
| 0 | Serial No. | Always `''` in storage; displayed as `(vi+1)+'.'` |
| 1 | File Ref No. | NHQ file reference string |
| 2 | Subject | Document title / description |
| 3 | Current Location | Where the document physically is |
| 4 | Action Officer | Officer responsible |
| 5 | Last Action | Most recent action taken |
| 6 | Date Received | ISO date string `YYYY-MM-DD` |
| 7 | Date Moved | ISO date string `YYYY-MM-DD` |
| 8 | SLA (Days) | Service Level Agreement in days |
| 9 | Due Date | ISO date string `YYYY-MM-DD` |
| 10 | Status | `Active` / `Completed` / `On Hold` / `Cancelled` / `Filed` |
| 11 | Delay Flag | `ON TIME` / `OVERDUE` |
| 12 | Remarks | Free-text notes |

> **Note:** Index 0 is never stored with a real value. Serial numbers are computed at render time from `vi` (visual index) so they always reflect the current filtered/sorted view sequentially from 1.

---

## 6. Backend Integration — supabase-init.js

### Supabase Configuration

```javascript
const SUPABASE_URL      = 'https://<project-ref>.supabase.co';
const SUPABASE_ANON_KEY = '<anon-key>';
```

### Database Table: `nass_settings`

| Column | Type | Description |
|---|---|---|
| `key` | `text` PRIMARY KEY | Storage key (e.g. `nassRows`) |
| `value` | `jsonb` | Serialised array value |

**Rows stored:**

| Key | Content |
|---|---|
| `nassRows` | All document records |
| `nassOfficers` | Officer name list |
| `nassStatuses` | Status options list |
| `nassLocations` | Location options list |
| `nassActions` | Last-action options list |
| `nassFileIndex` | File reference autocomplete list |

### Key Functions

| Function | Description |
|---|---|
| `pullData(sb)` | Fetches all 6 keys from `nass_settings` into `localStorage` |
| `pushData(sb)` | Reads all 6 keys from `localStorage`, upserts to `nass_settings` |
| `loadScript(src)` | Dynamically injects a `<script>` tag; returns a Promise |
| `bindLoginForm(sb)` | Attaches submit handler to the login form |
| `nassLogout()` | Signs out via Supabase Auth and reloads the page |
| `show(id)` / `hide(id)` | Utility: set `display:flex` or `display:none` |

---

## 7. Data Model

### Persistence Flow

```
User Action (Add/Edit/Delete)
        │
        ▼
  saveData()  ──► localStorage (synchronous, instant)
        │
        ▼ (wrapped by supabase-init.js)
  pushData(sb) ──► Supabase nass_settings (async)
        │
        ▼
  nassChannel.send('data-changed') ──► All other connected clients
        │
        ▼ (on each receiving client)
  pullData() ► loadData() ► refresh()
```

### Local Storage Keys

All data is cached in the browser's `localStorage` under these keys:

```
nassRows         nassOfficers     nassStatuses
nassLocations    nassActions      nassFileIndex
```

---

## 8. Authentication Flow

```
Page Load
   │
   ├── supabase.auth.getSession()
   │        │
   │    No session ──► hide loading, show login modal
   │        │
   │    Session exists
   │        │
   │        ▼
   │    pullData()  ← fetch latest data from Supabase
   │        │
   │        ▼
   │    loadScript('app.js')  ← dynamically load app
   │        │
   │        ▼
   │    Subscribe to broadcast channel
   │        │
   │        ▼
   │    Show topbar email, hide loading overlay
   │
Login form submit
   │
   ├── sb.auth.signInWithPassword({ email, password })
   │        │
   │    Error ──► display error message
   │        │
   │    Success ──► window.location.reload()
```

---

## 9. Data Persistence Strategy

The app uses a **two-layer persistence model**:

1. **localStorage** (primary, synchronous) — All reads and writes during a session operate against `localStorage`. This ensures the UI is always fast and never blocked by network latency.

2. **Supabase PostgreSQL** (secondary, asynchronous) — On every `saveData()` call, `pushData()` upserts the latest state to Supabase in the background. On page load, `pullData()` hydrates `localStorage` with the latest server state.

This means the app functions offline (reads/writes work) but changes will not sync to other users until connectivity is restored and a save is triggered.

---

## 10. Real-Time Sync (Broadcast)

Real-time updates use **Supabase Realtime Broadcast** — available on the free tier (does not require database replication).

```javascript
// Channel setup
const nassChannel = sb.channel('nass-broadcast', {
  config: { broadcast: { self: false } }  // sender does NOT receive own echo
});

// Listener (all clients)
nassChannel.on('broadcast', { event: 'data-changed' }, async () => {
  await pullData(sb);
  loadData();
  // Re-render only if no modal is open
  if (!anyModalOpen) refresh();
});

// Sender (triggered after every save)
nassChannel.send({ type: 'broadcast', event: 'data-changed', payload: {} });
```

**Behaviour:**
- Sender's own UI already shows the new state — they are excluded from the echo (`self: false`)
- Recipients pull fresh data from Supabase, update memory, and re-render
- If a recipient has a modal open (editing or viewing), the table refresh is deferred until the modal is closed

---

## 11. Function Reference

### Rendering

| Function | Signature | Description |
|---|---|---|
| `renderTable` | `(data)` | Clears `<tbody>` and rebuilds all rows from a data array |
| `buildRow` | `(r, vi, ri)` | Builds a single `<tr>` for record `r`; `vi`=visual index, `ri`=master index |
| `renderStats` | `()` | Updates the statistics bar totals |
| `renderAdmin` | `()` | Builds the admin panel tag lists |

### Filtering & Sorting

| Function | Signature | Description |
|---|---|---|
| `getFiltered` | `()` | Returns filtered + sorted subset of `rows` |
| `applyFilter` | `()` | Calls `renderTable(getFiltered())` |
| `refresh` | `()` | Calls `renderStats()`, `populateOfficerFilter()`, `applyFilter()` |
| `clearFilter` | `()` | Resets all filter inputs and re-renders |
| `doSort` | `(col)` | Sorts by column index; toggles asc/desc on repeat click |
| `populateOfficerFilter` | `()` | Rebuilds the officer filter `<select>` from current `officers` array |

### Modal Management

| Function | Signature | Description |
|---|---|---|
| `openModal` | `(editIdx)` | Opens modal; `null` = add mode, integer = edit mode |
| `closeModal` | `()` | Removes `open` class from `#mbg` |
| `setModalMode` | `(mode)` | `'edit'` enables fields; `'view'` disables them |
| `enableModalEdit` | `()` | Alias: calls `setModalMode('edit')` |
| `fillModalLists` | `()` | Populates all `<select>` elements in the modal |
| `saveModal` | `()` | Reads modal fields, updates or pushes to `rows`, calls `saveData()` |

### Detail View

| Function | Signature | Description |
|---|---|---|
| `openDetail` | `(idx)` | Opens read-only detail panel for record at master index `idx` |

### Data

| Function | Signature | Description |
|---|---|---|
| `saveData` | `()` | Serialises all arrays to `localStorage` |
| `loadData` | `()` | Deserialises all arrays from `localStorage` into memory |
| `exportCSV` | `()` | Generates and triggers download of all records as UTF-8 CSV |

### Admin Panel

| Function | Signature | Description |
|---|---|---|
| `showView` | `(v)` | Switches between `'tracker'` and `'admin'` views |
| `showAI` / `hideAI` | `(w)` | Show/hide the add-item input for a list (where `w` is the list name) |
| `saveAI` | `(w)` | Appends a new item to the named list and saves |

### Utilities

| Function | Signature | Description |
|---|---|---|
| `sc` | `(s)` | Returns CSS class name for a status string |
| `fmtDate` | `(v)` | Converts `YYYY-MM-DD` to `DD/MM/YYYY` for display |
| `mkSel` | `(list, val, cb)` | Creates a `<select>` element from an array |
| `mkInp` | `(val, type, cb)` | Creates an `<input>` element |
| `td` | `()` | (inner, in `buildRow`) Creates and appends a `<td>` to the current row |

---

## 12. Configuration Reference

To reconfigure for a different Supabase project, update these two constants at the top of `supabase-init.js`:

```javascript
const SUPABASE_URL      = 'https://<your-project-ref>.supabase.co';
const SUPABASE_ANON_KEY = '<your-anon-key>';
```

To add or remove managed dropdown lists, edit the corresponding arrays at the top of `app.js`:

```javascript
var officers  = [...];
var statuses  = [...];
var locations = [...];
var actions   = [...];
var fileIndex = [...];
```

---

## 13. Deployment

### Prerequisites

- Node.js (for `npx serve`)
- A Supabase project with:
  - Email/password auth enabled
  - A `nass_settings` table with columns: `key text PRIMARY KEY`, `value jsonb`
  - At least one authorised user account created in Supabase Auth

### Local Development

```bash
cd "NASS BRANCH DOCUMENT TRACKER"
npx serve .
```

The server will print the local URL (e.g. `http://localhost:54492`).

### Supabase Table Setup (SQL)

```sql
CREATE TABLE nass_settings (
  key   text PRIMARY KEY,
  value jsonb NOT NULL
);

-- Allow authenticated users full access
ALTER TABLE nass_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read"
  ON nass_settings FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can upsert"
  ON nass_settings FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Authenticated users can update"
  ON nass_settings FOR UPDATE
  USING (auth.role() = 'authenticated');
```

---

## 14. Security Considerations

| Risk | Mitigation |
|---|---|
| Unauthorised access | Supabase email/password authentication required; session checked on every page load |
| Data exposure | Supabase Row Level Security (RLS) restricts table access to authenticated users only |
| XSS | All user-supplied values written via `.textContent` (not `.innerHTML`); no raw HTML insertion from data |
| Anon key exposure | The `anon` key is public by design in Supabase; RLS policies are the security boundary |
| Session persistence | Supabase stores the JWT in `localStorage`; cleared on `nassLogout()` |

---

## 15. Known Limitations

| # | Limitation | Status |
|---|---|---|
| 1 | Single JSON blob per key — all records stored as one Supabase row | **Resolved** — each document is now a dedicated row in `nass_records` |
| 2 | Last-write-wins conflict at blob level | **Resolved** — per-record upsert by UUID; concurrent edits to different records no longer overwrite each other |
| 3 | Stale data after returning to tab | **Resolved** — `visibilitychange` event triggers a pull + refresh when the browser tab regains focus |
| 4 | No audit trail | **Resolved** — `updated_by` (email) and `updated_at` (timestamp) are written on every save and displayed in the record detail view |
| 5 | Broadcast requires connectivity | **Remaining** — real-time notifications only reach clients with an active websocket connection; an offline client will sync on next tab focus or page reload |
| 6 | No role-based access control | **Remaining** — all authenticated users share the same dataset; admin vs. read-only roles are not enforced at the application level |
| 7 | No full edit history | **Remaining** — only the most recent save is recorded; previous field values are not retained |
