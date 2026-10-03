# CertiFlow — Bulk Certificate Generator (GDG Selection Task)

A production-grade, client-side web application built for **Google Developer Groups (GDG)** events, hackathons, and workshops to design, preview, and generate certificates in bulk.

Built with **HTML5 Canvas**, **Vanilla CSS3**, and **Vanilla JavaScript** — completely self-contained with offline-ready vendor libraries.

---
## Live Demo
[ Open CertiFlow Live ]
(https://portfolio-files-beta.vercel.app/)

## 🌟 Key Features

1. **🎨 Certificate Templates**:
   - **Upload Custom Templates**: Drag & drop or pick any PNG, JPG, or WEBP background up to 4K resolution.
   - **3 Built-in Procedural Presets**:
     - *GDG Modern Blue* (Official GDG colors, geometric accents, verified badge & signatures)
     - *Dark Gold Tech* (Regal deep slate with gold border and formal typography)
     - *Clean Minimal* (Modern monochrome border with clean spacing)

2. **📊 Participant Data Import**:
   - Import **CSV** or **Excel (.xlsx, .xls)** files.
   - Automatic column detection (detects `Name`, `Full Name`, `Participant`, etc., with an interactive dropdown selector).
   - Live participant counter, mini list viewer, and navigation stepper (`< Prev`, `Next >`).
   - Includes **"📥 Load Sample Data"** and **"✨ Load Sample Demo"** for instant 1-click test drives.

3. **🖱️ Interactive Drag-and-Drop Positioning**:
   - Click and drag the participant name directly across the certificate canvas!
   - Bounding box with anchor points and magnetic snap to center alignment.
   - Live synchronization with numerical X% and Y% coordinate sliders.

4. **✏️ Typography & Style Studio**:
   - Google Fonts: **Outfit** (GDG modern), **Inter**, **Great Vibes** (cursive calligraphy), **Playfair Display**, **Cinzel** (regal serif), and **Montserrat**.
   - Font Size slider (20px to 140px).
   - Font weight (Bold/Regular), Italic, and UPPERCASE toggles.
   - Color picker with hex input and preset GDG swatches.
   - Text alignment (Left, Center, Right) and 1-click Center X / Center Y buttons.

5. **⚡ High-Resolution Bulk Export Engine**:
   - **🖼️ Download Current (PNG)**: Instant download of the currently previewed certificate at original resolution.
   - **📦 Download All (ZIP)**: Generates all certificates in memory and packages them into a zipped archive with sanitized filenames.
   - **📑 Download Combined PDF**: Merges all generated certificates into a single, high-quality printable PDF document matching the template's aspect ratio.
   - Real-time progress modal with percentage and page completion stats.

---

## 📁 Project Structure

```
bulk certificate generator/
├── index.html                  # Semantic structure, workspace layout & dialogs
├── style.css                   # GDG design system, responsive grid & animations
├── script.js                   # Canvas rendering, drag-drop, file parsers & export engine
├── sample_participants.csv     # Sample CSV dataset for testing
├── README.md                   # Project documentation
└── libs/                       # Offline vendor libraries (no internet required)
    ├── papaparse.min.js        # CSV parser
    ├── xlsx.full.min.js        # Excel (.xlsx) parser
    ├── jszip.min.js            # ZIP archive generator
    └── jspdf.umd.min.js        # PDF document builder
```

---

## 🚀 How to Run

1. Open File Explorer to:
   `c:\Users\shrey\OneDrive\Desktop\bulk certificate generator`
2. **Double-click `index.html`** to open it in Chrome, Edge, Brave, or Firefox.
3. Or launch via PowerShell:
   ```powershell
   Start-Process "index.html"
   ```
4. Click **"✨ Load Sample Demo"** at the top right to immediately experience the full app with preset templates and 8 sample participants!
