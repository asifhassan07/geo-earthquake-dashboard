# Geo Earthquake Dashboard

A single-page, interactive dashboard that visualizes recent global earthquakes from the USGS feed.

Built with **React + TypeScript + Vite**, using **Recharts** for visualization, **Zustand** for global selection state, and a mix of utility classes + inline styles for layout. This project was implemented as part of a frontend technical assessment.

---

## 📌 Overview

The app:

- Fetches the official **USGS all-month earthquake CSV** (last 30 days).
- Parses the CSV into a strongly typed `Earthquake` model.
- Displays the data in a **two-panel layout**:
  - **Left:** Interactive scatter plot.
  - **Right:** Scrollable data table.
- Keeps the chart and table **tightly synchronized**:
  - Clicking in one panel updates the other.
  - Selection is shared via global state (Zustand).

---

## ✅ Core Requirements Mapping

**Requirement → Implementation**

- **Single-page web app with geographic statistical data**  
  → `src/App.tsx` + `src/utils/parseEarthquakeCsv.ts` fetch and parse the USGS earthquakes CSV.

- **Responsive two-panel layout (chart + table)**  
  → `src/layout/MainLayout.tsx` + styles in `App.tsx` implement a side-by-side layout optimized for desktop, with stacked behavior on smaller widths.

- **Chart panel using Recharts (scatter plot, one point per row)**  
  → `src/components/charts/ChartPanel.tsx` uses `ScatterChart` and `Scatter` from Recharts.

- **Controls to select numeric variables on X/Y axis**  
  → Dropdowns in `ChartPanel` let users choose between `longitude`, `latitude`, `mag`, and `depth`.

- **Data panel showing headers + all data in scrollable table**  
  → `src/components/table/DataTable.tsx` renders a header row plus up to 200 visible rows with scroll.

- **Data loading with parsing & loading indicator**  
  → `fetchEarthquakeData()` in `parseEarthquakeCsv.ts` fetches and parses the CSV, while `App.tsx` shows a loading screen and error state.

- **Row selection in table and highlighting in chart**  
  → Clicking a row in `DataTable` sets a global `selectedId`; `ChartPanel` highlights that point.

- **Reverse interaction: select point in chart → highlight row**  
  → Clicking a Recharts point updates `selectedId` and scrolls/focuses the matching row in `DataTable`.

- **Demonstrate props, React Context, and external state library**  
  - **Props:** `App.tsx` passes `filteredData` into `ChartPanel`, `DataTable`, and `DetailsDrawer`.  
  - **React Context (optional layer):** `SelectionContext` shows how Context could share selection across tree levels.  
  - **Zustand:** `src/store/useSelectionStore.ts` holds `selectedId` and `hoverId` for chart ↔ table ↔ details synchronization.

---

## ✨ Additional Features & Reasoning

Beyond the baseline requirements, the app includes several extras to make it feel like a real analytics dashboard:

### 1. Summary Stat Cards

**Where:** top of the page in `App.tsx` / `MainLayout.tsx`  

**What:**

- **Total records loaded**
- **Strong quakes (mag ≥ 4.5)**
- **Max magnitude in dataset**

**Why:**  
These give an at-a-glance sense of “how busy” the dataset is and highlight extreme events without needing to scan the entire table.

---

### 2. Search by Place

**Where:** controlled input in the filters section (`App.tsx`).  
**What:** Free-text search over the `place` field (e.g. “Alaska”, “Japan”, “California”).  
**Why:**  
Real users often think in terms of locations, not IDs. Search makes it quicker to answer questions like “show me all quakes near Japan”.

---

### 3. Minimum Magnitude Filter

**Where:** numeric input in the filters section.  
**What:** Filters out events below a user-chosen magnitude (e.g. show only mag ≥ 4.0).  
**Why:**  
Small earthquakes are very frequent; this filter lets users focus on more impactful events and reduces clutter in both chart and table.

---

### 4. Minimum Depth Filter (Slider)

**Where:** range slider in the filters section.  
**What:** Filters events by depth (0–700 km).  
**Why:**  
Depth is a key geophysical characteristic. A slider is a natural way to explore shallow vs deep quakes and see how they cluster geographically.

---

### 5. Magnitude Color Scale (Shared Between Chart & Table)

**Where:** implemented in `ChartPanel.tsx` & `DataTable.tsx`.  
**Buckets:**

- `< 2.0` → blue  
- `2.0 – 3.9` → green  
- `4.0 – 5.9` → yellow  
- `≥ 6.0` → red

**Why:**  

- Colors encode severity at a glance, making patterns easier to spot.
- Using the **same scale** in both chart and table reinforces visual consistency and reduces cognitive load.

---

### 6. Details Drawer

**Where:** `src/components/details/DetailsDrawer.tsx`.  
**What:**

- Slides in / appears when an earthquake is selected.
- Shows ID, place, magnitude, depth, time, and coordinates.
- Includes a “Clear selection” action.

**Why:**  
The drawer provides a focused view of one earthquake without cluttering the main layout. It also proves that selection state can drive multiple dependent components.

---

### 7. Bi-Directional Hover & Click Sync

**Where:** `ChartPanel.tsx` and `DataTable.tsx`, via `useSelectionStore`.  

**Behaviors:**

- Hover a **chart point** → highlight the corresponding table row.
- Hover a **table row** → highlight that row and subtly reflect hover state.
- Click either → lock selection and open the details drawer.

**Why:**  
This interaction pattern is common in analytics tools (e.g., BI dashboards). It shows attention to UX and demonstrates coordination of state across siblings.

---

### 8. Filtered Count Labels

Above the table, the app displays something like:

> “Showing 200 of 6,928 records”

**Why:**  
This makes the effect of search and filters transparent, helping users understand that they’re looking at a subset, not the entire raw dataset.

---

## 🧱 Tech Stack & External Dependencies

### Runtime Dependencies

| Package            | Purpose                                                                 |
|--------------------|-------------------------------------------------------------------------|
| `react`            | UI library for building component-based interfaces.                    |
| `react-dom`        | DOM renderer for React components.                                     |
| `typescript`       | Static typing for safer refactoring and clearer contracts.             |
| `recharts`         | Charting library used for the scatter plot and responsive container.   |
| `papaparse`        | CSV parsing from the USGS feed into structured JavaScript objects.     |
| `zustand`          | Lightweight global state store for selection & hover state.           |

> Note: You can optionally mention CSS/Tailwind tooling here if you like:  
> - `tailwindcss`, `@tailwindcss/postcss`, `autoprefixer`, `postcss` – used by Vite’s CSS pipeline for utility classes and autoprefixing.

### Dev / Build Tooling

| Package      | Purpose                                                                   |
|-------------|---------------------------------------------------------------------------|
| `vite`      | Dev server + bundler for fast HMR and production builds.                  |
| `eslint`    | Linting for consistent, modern JavaScript/TypeScript style.               |
| `@types/*`  | Type definitions for libraries used with TypeScript.                      |

---

## 🧠 State Management Patterns

This project intentionally demonstrates three ways of sharing state:

1. **Props Pattern**
   - `App.tsx` owns the main `data` and `filteredData`.
   - These are passed down as props to `ChartPanel`, `DataTable`, and `DetailsDrawer`.
   - Simple and explicit, great for most local UI state.

2. **React Context**
   - A `SelectionContext` (if enabled) illustrates how Context could pass the selected earthquake down the tree without manual prop threading.
   - This is useful when many nested components need the same slice of state.

3. **Zustand (External Store)**
   - `src/store/useSelectionStore.ts` holds:
     - `selectedId`
     - `hoverId`
     - `setSelectedId`
     - `setHoverId`
   - `ChartPanel`, `DataTable`, and `DetailsDrawer` all subscribe to this store.
   - This decouples siblings and scales better as the app grows.

---

## 🏗️ Project Structure (High Level)

```txt
src/
  components/
    charts/
      ChartPanel.tsx
    table/
      DataTable.tsx
    details/
      DetailsDrawer.tsx
    layout/
      MainLayout.tsx
  context/
    SelectionContext.tsx         # Optional React Context example
  store/
    useSelectionStore.ts         # Zustand store for selection/hover
  types/
    earthquake.ts                # Earthquake TypeScript interface
  utils/
    parseEarthquakeCsv.ts        # Fetch + parse USGS CSV
  App.tsx
  main.tsx
