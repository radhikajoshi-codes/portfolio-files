/**
 * CertiFlow — Bulk Certificate Generator
 * Complete Application Logic (GDG Project)
 * 
 * Features:
 * 1. Preset & Custom Template Management (HTML5 Canvas)
 * 2. Participant Import (CSV with PapaParse / XLSX with SheetJS)
 * 3. Real-time Live Preview with interactive Drag & Drop Text Positioning
 * 4. Typography, Color, and Coordinate controls
 * 5. High-Resolution Bulk Export (Individual PNGs, ZIP archive, & Combined PDF)
 */

document.addEventListener('DOMContentLoaded', () => {
  // =========================================================================
  // 1. Application State
  // =========================================================================
  const state = {
    templateImage: null,           // Current HTMLImageElement or Generated Canvas
    templateWidth: 1920,
    templateHeight: 1080,
    activePreset: 'gdg-blue',      // 'gdg-blue' | 'dark-gold' | 'minimal-clean' | 'custom'
    participants: [
      { Name: 'Aarav Sharma', Email: 'aarav@example.com', Role: 'Participant' },
      { Name: 'Diya Patel', Email: 'diya@example.com', Role: 'Speaker' },
      { Name: 'Rohan Verma', Email: 'rohan@example.com', Role: 'Organizer' },
      { Name: 'Ananya Iyer', Email: 'ananya@example.com', Role: 'Participant' },
      { Name: 'Vikram Singh', Email: 'vikram@example.com', Role: 'Volunteer' },
      { Name: 'Pooja Nair', Email: 'pooja@example.com', Role: 'Winner - 1st' },
      { Name: 'Karthik Rao', Email: 'karthik@example.com', Role: 'Winner - 2nd' },
      { Name: 'Sneha Mukherjee', Email: 'sneha@example.com', Role: 'Participant' }
    ],
    selectedColumn: 'Name',
    currentIndex: 0,
    showGuides: true,

    // Typography & Layout Configuration
    textConfig: {
      fontFamily: "'Outfit', sans-serif",
      fontSize: 64,
      isBold: true,
      isItalic: false,
      isUppercase: false,
      color: '#1a237e',
      align: 'center',             // 'left' | 'center' | 'right'
      posX: 50.0,                  // Percentage 0 - 100%
      posY: 53.0                   // Percentage 0 - 100%
    },

    // Drag & Drop State on Canvas
    drag: {
      isDragging: false,
      dragStartX: 0,
      dragStartY: 0,
      textInitialX: 0,
      textInitialY: 0,
      boundingBox: null
    }
  };

  // =========================================================================
  // 2. DOM Elements Selection
  // =========================================================================
  const canvas = document.getElementById('certCanvas');
  const ctx = canvas.getContext('2d');
  const canvasViewport = document.getElementById('canvasViewport');
  const canvasWrapper = document.getElementById('canvasWrapper');

  // Header Elements
  const loadSampleProjectBtn = document.getElementById('loadSampleProjectBtn');
  const systemStatusBadge = document.getElementById('systemStatusBadge');
  const badgeText = document.getElementById('badgeText');

  // Template Elements
  const templateInput = document.getElementById('templateInput');
  const templateDropzone = document.getElementById('templateDropzone');
  const presetButtons = document.querySelectorAll('.btn-preset');
  const templateDimensionsTag = document.getElementById('templateDimensionsTag');
  const resolutionTag = document.getElementById('resolutionTag');
  const resetTemplateBtn = document.getElementById('resetTemplateBtn');

  // Participant Data Elements
  const csvInput = document.getElementById('csvInput');
  const csvDropzone = document.getElementById('csvDropzone');
  const loadSampleCsvBtn = document.getElementById('loadSampleCsvBtn');
  const columnSelectorGroup = document.getElementById('columnSelectorGroup');
  const columnSelect = document.getElementById('columnSelect');
  const participantSummary = document.getElementById('participantSummary');
  const participantCount = document.getElementById('participantCount');
  const participantListBox = document.getElementById('participantListBox');
  const clearParticipantsBtn = document.getElementById('clearParticipantsBtn');

  // Canvas Toolbar & Nav
  const participantNav = document.getElementById('participantNav');
  const prevParticipantBtn = document.getElementById('prevParticipantBtn');
  const nextParticipantBtn = document.getElementById('nextParticipantBtn');
  const navParticipantText = document.getElementById('navParticipantText');
  const activePreviewName = document.getElementById('activePreviewName');
  const toggleGuidesBtn = document.getElementById('toggleGuidesBtn');
  const fitCanvasBtn = document.getElementById('fitCanvasBtn');
  const dragHint = document.getElementById('dragHint');

  // Typography & Positioning Controls
  const customNameInput = document.getElementById('customNameInput');
  const fontFamilySelect = document.getElementById('fontFamilySelect');
  const fontSizeRange = document.getElementById('fontSizeRange');
  const fontSizeVal = document.getElementById('fontSizeVal');
  const btnBold = document.getElementById('btnBold');
  const btnItalic = document.getElementById('btnItalic');
  const btnUppercase = document.getElementById('btnUppercase');
  const textColorInput = document.getElementById('textColorInput');
  const textColorHex = document.getElementById('textColorHex');
  const colorSwatches = document.querySelectorAll('.color-swatch');
  const posXRange = document.getElementById('posXRange');
  const posXVal = document.getElementById('posXVal');
  const posYRange = document.getElementById('posYRange');
  const posYVal = document.getElementById('posYVal');
  const coordTag = document.getElementById('coordTag');
  const centerHorizontalBtn = document.getElementById('centerHorizontalBtn');
  const centerVerticalBtn = document.getElementById('centerVerticalBtn');
  const alignButtons = [document.getElementById('alignLeft'), document.getElementById('alignCenter'), document.getElementById('alignRight')];

  // Export Buttons
  const downloadCurrentBtn = document.getElementById('downloadCurrentBtn');
  const downloadZipBtn = document.getElementById('downloadZipBtn');
  const downloadPdfBtn = document.getElementById('downloadPdfBtn');
  const exportHeading = document.getElementById('exportHeading');
  const exportSubtitle = document.getElementById('exportSubtitle');

  // Modal & Toast
  const progressModal = document.getElementById('progressModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalDesc = document.getElementById('modalDesc');
  const progressBarFill = document.getElementById('progressBarFill');
  const progressCount = document.getElementById('progressCount');
  const progressPercent = document.getElementById('progressPercent');
  const toastContainer = document.getElementById('toastContainer');

  // =========================================================================
  // 3. Toast Notification Helper
  // =========================================================================
  function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    const icon = type === 'success' ? '✅' : (type === 'error' ? '⚠️' : '⚡');
    toast.innerHTML = `<span>${icon}</span> <span>${message}</span>`;
    toastContainer.appendChild(toast);

    setTimeout(() => {
      toast.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(12px)';
      setTimeout(() => toast.remove(), 300);
    }, 3200);
  }

  // =========================================================================
  // 4. Built-in Procedural Certificate Template Generator
  // =========================================================================
  /**
   * Generates high-res certificate templates dynamically on an offscreen canvas.
   * This guarantees crisp vector quality at 1920x1080 without requiring external images.
   */
  function createPresetTemplate(presetName) {
    const offCanvas = document.createElement('canvas');
    offCanvas.width = 1920;
    offCanvas.height = 1080;
    const octx = offCanvas.getContext('2d');

    const W = 1920;
    const H = 1080;

    if (presetName === 'gdg-blue') {
      // -------------------------------------------------------------
      // Preset 1: GDG Modern Blue
      // -------------------------------------------------------------
      // Background gradient
      const bgGrad = octx.createLinearGradient(0, 0, W, H);
      bgGrad.addColorStop(0, '#f8fafc');
      bgGrad.addColorStop(1, '#eef2f6');
      octx.fillStyle = bgGrad;
      octx.fillRect(0, 0, W, H);

      // Outer border frame
      octx.lineWidth = 14;
      octx.strokeStyle = '#4285F4';
      octx.strokeRect(30, 30, W - 60, H - 60);

      // Inner thin gold/accent border
      octx.lineWidth = 2;
      octx.strokeStyle = '#cbd5e1';
      octx.strokeRect(48, 48, W - 96, H - 96);

      // Top-left GDG Tech Corner Geometry
      octx.fillStyle = '#4285F4';
      octx.beginPath();
      octx.moveTo(30, 30);
      octx.lineTo(240, 30);
      octx.lineTo(30, 240);
      octx.closePath();
      octx.fill();

      // GDG 4-color accent stripes at top right
      const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853'];
      colors.forEach((col, idx) => {
        octx.fillStyle = col;
        octx.beginPath();
        octx.moveTo(W - 180 + (idx * 26), 30);
        octx.lineTo(W - 150 + (idx * 26), 30);
        octx.lineTo(W - 30, 150 - (idx * 26));
        octx.lineTo(W - 30, 180 - (idx * 26));
        octx.closePath();
        octx.fill();
      });

      // Bottom-right GDG geometry
      octx.fillStyle = '#34A853';
      octx.beginPath();
      octx.moveTo(W - 30, H - 30);
      octx.lineTo(W - 200, H - 30);
      octx.lineTo(W - 30, H - 200);
      octx.closePath();
      octx.fill();

      // Certificate Header Text
      octx.textAlign = 'center';
      octx.fillStyle = '#0f172a';
      octx.font = '700 32px "Outfit", sans-serif';
      octx.fillText('GOOGLE DEVELOPER GROUPS ON CAMPUS', W / 2, 175);

      octx.fillStyle = '#4285F4';
      octx.font = '800 68px "Outfit", sans-serif';
      octx.letterSpacing = '2px';
      octx.fillText('CERTIFICATE OF APPRECIATION', W / 2, 260);

      // Decorative divider under title
      octx.fillStyle = '#EA4335';
      octx.fillRect(W / 2 - 120, 285, 240, 4);

      // Subtitle
      octx.fillStyle = '#475569';
      octx.font = '500 24px "Inter", sans-serif';
      octx.fillText('PROUDLY PRESENTED TO', W / 2, 400);

      // Underline placeholder for the participant's name
      octx.strokeStyle = '#94a3b8';
      octx.lineWidth = 2;
      octx.beginPath();
      octx.moveTo(W / 2 - 420, 630);
      octx.lineTo(W / 2 + 420, 630);
      octx.stroke();

      // Certificate Body / Citation
      octx.fillStyle = '#334155';
      octx.font = '400 22px "Inter", sans-serif';
      octx.fillText('For exceptional participation, leadership, and successful contribution', W / 2, 720);
      octx.fillText('towards the annual flagship technical hackathons and developer workshops.', W / 2, 755);

      // Signatures & Stamp area
      octx.strokeStyle = '#64748b';
      octx.lineWidth = 1.5;
      
      // Left Signature line
      octx.beginPath();
      octx.moveTo(340, 930);
      octx.lineTo(600, 930);
      octx.stroke();
      octx.font = '600 18px "Inter", sans-serif';
      octx.fillStyle = '#0f172a';
      octx.fillText('GDG Lead Organizer', 470, 960);
      octx.font = 'italic 26px "Great Vibes", cursive';
      octx.fillStyle = '#1e3a8a';
      octx.fillText('Alex Johnson', 470, 915);

      // Right Signature line
      octx.beginPath();
      octx.moveTo(W - 600, 930);
      octx.lineTo(W - 340, 930);
      octx.stroke();
      octx.font = '600 18px "Inter", sans-serif';
      octx.fillStyle = '#0f172a';
      octx.fillText('Faculty Coordinator', W - 470, 960);
      octx.font = 'italic 26px "Great Vibes", cursive';
      octx.fillStyle = '#1e3a8a';
      octx.fillText('Dr. Sophia Bennett', W - 470, 915);

      // Center Official Badge
      octx.beginPath();
      octx.arc(W / 2, 910, 48, 0, Math.PI * 2);
      octx.fillStyle = '#4285F4';
      octx.fill();
      octx.lineWidth = 4;
      octx.strokeStyle = '#ffffff';
      octx.stroke();

      octx.fillStyle = '#ffffff';
      octx.font = '800 15px "Outfit", sans-serif';
      octx.fillText('VERIFIED', W / 2, 910);
      octx.font = '600 11px "Outfit", sans-serif';
      octx.fillText('GDG 2026', W / 2, 925);

    } else if (presetName === 'dark-gold') {
      // -------------------------------------------------------------
      // Preset 2: Dark Gold Tech
      // -------------------------------------------------------------
      // Dark Slate Gradient
      const darkGrad = octx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W / 1.4);
      darkGrad.addColorStop(0, '#131b2e');
      darkGrad.addColorStop(1, '#090d16');
      octx.fillStyle = darkGrad;
      octx.fillRect(0, 0, W, H);

      // Double Gold Borders
      octx.strokeStyle = '#d97706';
      octx.lineWidth = 4;
      octx.strokeRect(40, 40, W - 80, H - 80);

      octx.strokeStyle = '#fbbf24';
      octx.lineWidth = 1;
      octx.strokeRect(55, 55, W - 110, H - 110);

      // Elegant Title
      octx.textAlign = 'center';
      octx.fillStyle = '#fbbf24';
      octx.font = '600 24px "Cinzel", serif';
      octx.fillText('GOOGLE DEVELOPER GROUPS • EXCELLENCE AWARD', W / 2, 180);

      octx.fillStyle = '#ffffff';
      octx.font = '800 64px "Cinzel", serif';
      octx.fillText('CERTIFICATE OF ACHIEVEMENT', W / 2, 270);

      octx.fillStyle = '#94a3b8';
      octx.font = '400 22px "Inter", sans-serif';
      octx.fillText('THIS ACKNOWLEDGES THAT', W / 2, 400);

      // Underline placeholder
      octx.strokeStyle = '#d97706';
      octx.lineWidth = 2;
      octx.beginPath();
      octx.moveTo(W / 2 - 420, 630);
      octx.lineTo(W / 2 + 420, 630);
      octx.stroke();

      octx.fillStyle = '#cbd5e1';
      octx.font = '400 22px "Inter", sans-serif';
      octx.fillText('has demonstrated outstanding technical competence, innovation, and active participation', W / 2, 720);
      octx.fillText('in the GDG Campus Tech Fest and Innovation Challenge 2026.', W / 2, 755);

      // Signatures
      octx.beginPath();
      octx.moveTo(340, 930);
      octx.lineTo(600, 930);
      octx.moveTo(W - 600, 930);
      octx.lineTo(W - 340, 930);
      octx.stroke();

      octx.fillStyle = '#fbbf24';
      octx.font = '600 18px "Cinzel", serif';
      octx.fillText('Program Director', 470, 960);
      octx.fillText('Lead Mentor', W - 470, 960);

    } else {
      // -------------------------------------------------------------
      // Preset 3: Clean Minimal
      // -------------------------------------------------------------
      octx.fillStyle = '#ffffff';
      octx.fillRect(0, 0, W, H);

      // Clean border
      octx.strokeStyle = '#0f172a';
      octx.lineWidth = 3;
      octx.strokeRect(60, 60, W - 120, H - 120);

      octx.textAlign = 'center';
      octx.fillStyle = '#0f172a';
      octx.font = '700 28px "Inter", sans-serif';
      octx.fillText('GDG STUDENT COMMUNITY', W / 2, 200);

      octx.font = '800 60px "Inter", sans-serif';
      octx.fillText('Certificate of Participation', W / 2, 280);

      octx.fillStyle = '#64748b';
      octx.font = '400 22px "Inter", sans-serif';
      octx.fillText('This is proudly presented to', W / 2, 410);

      octx.strokeStyle = '#e2e8f0';
      octx.lineWidth = 2;
      octx.beginPath();
      octx.moveTo(W / 2 - 380, 630);
      octx.lineTo(W / 2 + 380, 630);
      octx.stroke();

      octx.fillStyle = '#475569';
      octx.font = '400 22px "Inter", sans-serif';
      octx.fillText('in recognition of your valuable involvement in GDG College Sessions.', W / 2, 730);
    }

    return offCanvas;
  }

  // Initialize with GDG Modern Blue preset
  function loadPreset(presetName) {
    state.activePreset = presetName;
    const offCanvas = createPresetTemplate(presetName);
    state.templateImage = offCanvas;
    state.templateWidth = offCanvas.width;
    state.templateHeight = offCanvas.height;
    canvas.width = state.templateWidth;
    canvas.height = state.templateHeight;
    updateTemplateDimensionsUI();
    renderCertificate();

    // Update preset button active states
    presetButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.preset === presetName);
    });

    // Auto-adjust default text color according to template
    if (presetName === 'dark-gold') {
      state.textConfig.color = '#fbbf24';
    } else if (presetName === 'minimal-clean') {
      state.textConfig.color = '#0f172a';
    } else {
      state.textConfig.color = '#1a237e';
    }
    textColorInput.value = state.textConfig.color;
    textColorHex.value = state.textConfig.color;
  }

  function updateTemplateDimensionsUI() {
    templateDimensionsTag.textContent = `Template: ${state.templateWidth} × ${state.templateHeight}`;
    resolutionTag.textContent = `${state.templateWidth} × ${state.templateHeight} px`;
  }

  // =========================================================================
  // 5. Canvas Rendering Engine
  // =========================================================================
  /**
   * Main render function: Draws the template background and participant name.
   * Can render for a specific participant index or fallback to custom text.
   */
  function renderCertificate(overrideIndex = null, targetCtx = ctx, targetCanvas = canvas) {
    if (!state.templateImage) return;

    const W = targetCanvas.width;
    const H = targetCanvas.height;

    // 1. Draw Template Image Background
    targetCtx.clearRect(0, 0, W, H);
    targetCtx.drawImage(state.templateImage, 0, 0, W, H);

    // 2. Determine Participant Name to Render
    const idx = (overrideIndex !== null) ? overrideIndex : state.currentIndex;
    let nameToRender = '';

    if (state.participants.length > 0 && state.participants[idx]) {
      nameToRender = state.participants[idx][state.selectedColumn] || customNameInput.value || 'Participant Name';
    } else {
      nameToRender = customNameInput.value || 'Participant Name';
    }

    if (state.textConfig.isUppercase) {
      nameToRender = nameToRender.toUpperCase();
    }

    // Update preview name pill in footer
    if (targetCtx === ctx) {
      activePreviewName.textContent = nameToRender;
    }

    // 3. Setup Typography Styles
    const stylePrefix = `${state.textConfig.isItalic ? 'italic ' : ''}${state.textConfig.isBold ? 'bold ' : 'normal '}`;
    targetCtx.font = `${stylePrefix}${state.textConfig.fontSize}px ${state.textConfig.fontFamily}`;
    targetCtx.fillStyle = state.textConfig.color;
    targetCtx.textAlign = state.textConfig.align;
    targetCtx.textBaseline = 'middle';

    // 4. Calculate Absolute Coordinates from Percentage
    const posX = (state.textConfig.posX / 100) * W;
    const posY = (state.textConfig.posY / 100) * H;

    // 5. Measure text metrics for bounding box and drag detection
    const metrics = targetCtx.measureText(nameToRender);
    const textWidth = metrics.width;
    const textHeight = state.textConfig.fontSize; // Approx font line height

    let boxLeft = posX;
    if (state.textConfig.align === 'center') {
      boxLeft = posX - (textWidth / 2);
    } else if (state.textConfig.align === 'right') {
      boxLeft = posX - textWidth;
    }
    const boxTop = posY - (textHeight / 2);

    // Store bounding box for dragging on main canvas
    if (targetCtx === ctx) {
      state.drag.boundingBox = {
        left: boxLeft - 16,
        top: boxTop - 8,
        width: textWidth + 32,
        height: textHeight + 16,
        centerX: posX,
        centerY: posY
      };
    }

    // 6. Draw Alignment Guides if enabled (on preview canvas only)
    if (targetCtx === ctx && state.showGuides) {
      targetCtx.save();
      targetCtx.strokeStyle = 'rgba(66, 133, 244, 0.35)';
      targetCtx.lineWidth = 1;
      targetCtx.setLineDash([6, 6]);

      // Center crosshair guides
      targetCtx.beginPath();
      targetCtx.moveTo(W / 2, 0);
      targetCtx.lineTo(W / 2, H);
      targetCtx.moveTo(0, H / 2);
      targetCtx.lineTo(W, H / 2);
      targetCtx.stroke();

      // Drag bounding box outline around name
      targetCtx.strokeStyle = state.drag.isDragging ? '#4285F4' : 'rgba(66, 133, 244, 0.6)';
      targetCtx.lineWidth = state.drag.isDragging ? 2.5 : 1.5;
      targetCtx.setLineDash(state.drag.isDragging ? [] : [4, 4]);
      targetCtx.strokeRect(boxLeft - 14, boxTop - 6, textWidth + 28, textHeight + 12);

      // Drag Anchor dots on corners
      targetCtx.fillStyle = '#4285F4';
      const corners = [
        [boxLeft - 14, boxTop - 6],
        [boxLeft + textWidth + 14, boxTop - 6],
        [boxLeft - 14, boxTop + textHeight + 6],
        [boxLeft + textWidth + 14, boxTop + textHeight + 6]
      ];
      corners.forEach(([cx, cy]) => {
        targetCtx.beginPath();
        targetCtx.arc(cx, cy, 4, 0, Math.PI * 2);
        targetCtx.fill();
      });

      targetCtx.restore();
    }

    // 7. Render Name Text onto Canvas
    targetCtx.fillText(nameToRender, posX, posY);
  }

  // =========================================================================
  // 6. Drag-and-Drop Positioning on Canvas
  // =========================================================================
  /**
   * Helper to convert Mouse/Touch event coordinates to Canvas internal resolution coordinates
   */
  function getCanvasCoords(event) {
    const rect = canvas.getBoundingClientRect();
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);

    // Scaling ratio between actual internal canvas size and its CSS display size
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  }

  function isInsideBoundingBox(x, y) {
    const box = state.drag.boundingBox;
    if (!box) return false;
    return x >= box.left && x <= (box.left + box.width) &&
           y >= box.top && y <= (box.top + box.height);
  }

  // Canvas Mouse & Touch Drag Listeners
  function handleDragStart(e) {
    const coords = getCanvasCoords(e);
    if (isInsideBoundingBox(coords.x, coords.y)) {
      state.drag.isDragging = true;
      state.drag.dragStartX = coords.x;
      state.drag.dragStartY = coords.y;
      state.drag.textInitialX = state.textConfig.posX;
      state.drag.textInitialY = state.textConfig.posY;
      canvas.classList.add('dragging');
      if (dragHint) dragHint.style.opacity = '0';
      renderCertificate();
    }
  }

  function handleDragMove(e) {
    const coords = getCanvasCoords(e);

    // Update cursor icon on hover
    if (!state.drag.isDragging) {
      if (isInsideBoundingBox(coords.x, coords.y)) {
        canvas.style.cursor = 'grab';
      } else {
        canvas.style.cursor = 'crosshair';
      }
      return;
    }

    e.preventDefault(); // Prevent scrolling on mobile touch

    // Calculate delta movement as percentage of canvas dimensions
    const deltaX = coords.x - state.drag.dragStartX;
    const deltaY = coords.y - state.drag.dragStartY;

    const deltaPercentX = (deltaX / canvas.width) * 100;
    const deltaPercentY = (deltaY / canvas.height) * 100;

    let newX = Math.min(95, Math.max(5, state.drag.textInitialX + deltaPercentX));
    let newY = Math.min(92, Math.max(8, state.drag.textInitialY + deltaPercentY));

    // Magnetic snap to center (within 0.8% threshold)
    if (Math.abs(newX - 50.0) < 0.8) newX = 50.0;
    if (Math.abs(newY - 50.0) < 0.8) newY = 50.0;

    state.textConfig.posX = parseFloat(newX.toFixed(1));
    state.textConfig.posY = parseFloat(newY.toFixed(1));

    // Synchronize Coordinate UI
    updateCoordinateInputs();
    renderCertificate();
  }

  function handleDragEnd() {
    if (state.drag.isDragging) {
      state.drag.isDragging = false;
      canvas.classList.remove('dragging');
      canvas.style.cursor = 'crosshair';
      renderCertificate();
    }
  }

  canvas.addEventListener('mousedown', handleDragStart);
  window.addEventListener('mousemove', handleDragMove);
  window.addEventListener('mouseup', handleDragEnd);

  canvas.addEventListener('touchstart', handleDragStart, { passive: false });
  window.addEventListener('touchmove', handleDragMove, { passive: false });
  window.addEventListener('touchend', handleDragEnd);

  // Update coordinate inputs
  function updateCoordinateInputs() {
    posXRange.value = state.textConfig.posX;
    posXVal.textContent = `${state.textConfig.posX}%`;
    posYRange.value = state.textConfig.posY;
    posYVal.textContent = `${state.textConfig.posY}%`;
    coordTag.textContent = `X: ${state.textConfig.posX}% • Y: ${state.textConfig.posY}%`;
  }

  // =========================================================================
  // 7. Custom Template Upload & Dropzone
  // =========================================================================
  function handleCustomTemplateFile(file) {
    if (!file || !file.type.startsWith('image/')) {
      showToast('Please upload a valid image file (PNG, JPG, WEBP)', 'error');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        state.templateImage = img;
        state.activePreset = 'custom';
        state.templateWidth = img.naturalWidth || 1920;
        state.templateHeight = img.naturalHeight || 1080;
        canvas.width = state.templateWidth;
        canvas.height = state.templateHeight;
        updateTemplateDimensionsUI();

        // Clear active state on preset buttons
        presetButtons.forEach(btn => btn.classList.remove('active'));

        renderCertificate();
        showToast(`Template loaded: ${state.templateWidth} × ${state.templateHeight} px`, 'success');
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }

  templateInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleCustomTemplateFile(e.target.files[0]);
    }
  });

  // Template Drag & Drop
  templateDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    templateDropzone.classList.add('dragover');
  });
  templateDropzone.addEventListener('dragleave', () => {
    templateDropzone.classList.remove('dragover');
  });
  templateDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    templateDropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleCustomTemplateFile(e.dataTransfer.files[0]);
    }
  });

  // Preset Buttons
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      loadPreset(btn.dataset.preset);
      showToast(`Applied preset: ${btn.textContent}`, 'info');
    });
  });

  resetTemplateBtn.addEventListener('click', () => {
    loadPreset('gdg-blue');
    showToast('Reset to default GDG template', 'info');
  });

  // =========================================================================
  // 8. Participant Data Import (CSV with PapaParse / XLSX with SheetJS)
  // =========================================================================
  function populateParticipantList(data) {
    if (!data || data.length === 0) {
      showToast('No participant rows found in file', 'error');
      return;
    }

    state.participants = data;
    state.currentIndex = 0;

    // Detect available columns
    const firstRow = data[0];
    const columns = Object.keys(firstRow);

    // Auto-detect best column for "Name"
    let candidate = columns.find(col => /name|participant|student|attendee/i.test(col)) || columns[0];
    state.selectedColumn = candidate;

    // Populate Column Select Dropdown
    columnSelect.innerHTML = '';
    columns.forEach(col => {
      const opt = document.createElement('option');
      opt.value = col;
      opt.textContent = col;
      if (col === candidate) opt.selected = true;
      columnSelect.appendChild(opt);
    });
    columnSelectorGroup.style.display = 'block';

    // Update Participant Summary Box
    updateParticipantUI();
    renderCertificate();
    showToast(`Successfully imported ${data.length} participants!`, 'success');
  }

  function updateParticipantUI() {
    participantCount.textContent = `${state.participants.length} Participants`;
    participantSummary.style.display = state.participants.length > 0 ? 'block' : 'none';
    participantNav.style.display = state.participants.length > 1 ? 'flex' : 'none';

    // Render mini list
    participantListBox.innerHTML = '';
    state.participants.forEach((p, idx) => {
      const item = document.createElement('div');
      item.className = `participant-item ${idx === state.currentIndex ? 'active' : ''}`;
      const name = p[state.selectedColumn] || 'Unnamed';
      item.innerHTML = `<span>#${idx + 1} ${name}</span> <span style="font-size:0.7rem; opacity:0.6;">${p.Role || ''}</span>`;
      item.addEventListener('click', () => {
        state.currentIndex = idx;
        updateParticipantUI();
        renderCertificate();
      });
      participantListBox.appendChild(item);
    });

    // Update Nav bar counter
    navParticipantText.textContent = `${state.currentIndex + 1} of ${state.participants.length}`;
    exportHeading.textContent = `Ready: ${state.participants.length} Certificates`;
    exportSubtitle.textContent = `All systems loaded. Choose Single PNG, Bulk ZIP, or Combined PDF.`;
  }

  // Handle CSV/XLSX Files
  function handleParticipantFile(file) {
    if (!file) return;

    const fileName = file.name.toLowerCase();

    if (fileName.endsWith('.csv')) {
      // Parse CSV using PapaParse
      if (window.Papa) {
        window.Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            if (results.data && results.data.length > 0) {
              populateParticipantList(results.data);
            } else {
              showToast('CSV file is empty or invalid', 'error');
            }
          },
          error: (err) => showToast(`CSV Parse Error: ${err.message}`, 'error')
        });
      } else {
        // Vanilla CSV fallback
        const reader = new FileReader();
        reader.onload = (e) => {
          const lines = e.target.result.split(/\r?\n/).filter(line => line.trim() !== '');
          const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
          const data = lines.slice(1).map(line => {
            const values = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''));
            const obj = {};
            headers.forEach((h, i) => obj[h] = values[i] || '');
            return obj;
          });
          populateParticipantList(data);
        };
        reader.readAsText(file);
      }
    } else if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
      // Parse Excel using SheetJS
      if (window.XLSX) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result);
          const workbook = window.XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const sheet = workbook.Sheets[firstSheetName];
          const json = window.XLSX.utils.sheet_to_json(sheet);
          if (json && json.length > 0) {
            populateParticipantList(json);
          } else {
            showToast('Excel sheet has no rows', 'error');
          }
        };
        reader.readAsArrayBuffer(file);
      } else {
        showToast('SheetJS library missing for Excel parsing', 'error');
      }
    } else {
      showToast('Unsupported format. Please upload CSV or XLSX', 'error');
    }
  }

  csvInput.addEventListener('change', (e) => {
    if (e.target.files && e.target.files[0]) {
      handleParticipantFile(e.target.files[0]);
    }
  });

  csvDropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    csvDropzone.classList.add('dragover');
  });
  csvDropzone.addEventListener('dragleave', () => {
    csvDropzone.classList.remove('dragover');
  });
  csvDropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    csvDropzone.classList.remove('dragover');
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleParticipantFile(e.dataTransfer.files[0]);
    }
  });

  columnSelect.addEventListener('change', (e) => {
    state.selectedColumn = e.target.value;
    updateParticipantUI();
    renderCertificate();
    showToast(`Switched Name Column to: "${state.selectedColumn}"`, 'info');
  });

  loadSampleCsvBtn.addEventListener('click', () => {
    populateParticipantList([
      { Name: 'Aarav Sharma', Email: 'aarav@example.com', Event: 'GDG DevFest 2026', Role: 'Participant' },
      { Name: 'Diya Patel', Email: 'diya@example.com', Event: 'GDG DevFest 2026', Role: 'Speaker' },
      { Name: 'Rohan Verma', Email: 'rohan@example.com', Event: 'GDG DevFest 2026', Role: 'Organizer' },
      { Name: 'Ananya Iyer', Email: 'ananya@example.com', Event: 'GDG DevFest 2026', Role: 'Participant' },
      { Name: 'Vikram Singh', Email: 'vikram@example.com', Event: 'GDG DevFest 2026', Role: 'Volunteer' },
      { Name: 'Pooja Nair', Email: 'pooja@example.com', Event: 'GDG DevFest 2026', Role: 'Winner - 1st Place' },
      { Name: 'Karthik Rao', Email: 'karthik@example.com', Event: 'GDG DevFest 2026', Role: 'Winner - 2nd Place' },
      { Name: 'Sneha Mukherjee', Email: 'sneha@example.com', Event: 'GDG DevFest 2026', Role: 'Participant' }
    ]);
  });

  clearParticipantsBtn.addEventListener('click', () => {
    state.participants = [];
    state.currentIndex = 0;
    participantSummary.style.display = 'none';
    participantNav.style.display = 'none';
    columnSelectorGroup.style.display = 'none';
    exportHeading.textContent = 'Single Certificate Mode';
    exportSubtitle.textContent = 'Customize and download your certificate.';
    renderCertificate();
    showToast('Cleared participants list', 'info');
  });

  // Participant Navigator
  prevParticipantBtn.addEventListener('click', () => {
    if (state.participants.length === 0) return;
    state.currentIndex = (state.currentIndex - 1 + state.participants.length) % state.participants.length;
    updateParticipantUI();
    renderCertificate();
  });

  nextParticipantBtn.addEventListener('click', () => {
    if (state.participants.length === 0) return;
    state.currentIndex = (state.currentIndex + 1) % state.participants.length;
    updateParticipantUI();
    renderCertificate();
  });

  // =========================================================================
  // 9. Typography & Position Control Event Listeners
  // =========================================================================
  customNameInput.addEventListener('input', () => {
    renderCertificate();
  });

  fontFamilySelect.addEventListener('change', (e) => {
    state.textConfig.fontFamily = e.target.value;
    renderCertificate();
  });

  fontSizeRange.addEventListener('input', (e) => {
    state.textConfig.fontSize = parseInt(e.target.value, 10);
    fontSizeVal.textContent = `${state.textConfig.fontSize} px`;
    renderCertificate();
  });

  btnBold.addEventListener('click', () => {
    state.textConfig.isBold = !state.textConfig.isBold;
    btnBold.classList.toggle('active', state.textConfig.isBold);
    renderCertificate();
  });

  btnItalic.addEventListener('click', () => {
    state.textConfig.isItalic = !state.textConfig.isItalic;
    btnItalic.classList.toggle('active', state.textConfig.isItalic);
    renderCertificate();
  });

  btnUppercase.addEventListener('click', () => {
    state.textConfig.isUppercase = !state.textConfig.isUppercase;
    btnUppercase.classList.toggle('active', state.textConfig.isUppercase);
    renderCertificate();
  });

  // Color Pickers
  function updateTextColor(color) {
    state.textConfig.color = color;
    textColorInput.value = color;
    textColorHex.value = color;
    renderCertificate();
  }

  textColorInput.addEventListener('input', (e) => updateTextColor(e.target.value));
  textColorHex.addEventListener('change', (e) => {
    let col = e.target.value.trim();
    if (!col.startsWith('#')) col = '#' + col;
    if (/^#[0-9A-Fa-f]{6}$/.test(col)) {
      updateTextColor(col);
    }
  });

  colorSwatches.forEach(swatch => {
    swatch.addEventListener('click', () => updateTextColor(swatch.dataset.color));
  });

  // Coordinate Sliders
  posXRange.addEventListener('input', (e) => {
    state.textConfig.posX = parseFloat(e.target.value);
    updateCoordinateInputs();
    renderCertificate();
  });

  posYRange.addEventListener('input', (e) => {
    state.textConfig.posY = parseFloat(e.target.value);
    updateCoordinateInputs();
    renderCertificate();
  });

  centerHorizontalBtn.addEventListener('click', () => {
    state.textConfig.posX = 50.0;
    updateCoordinateInputs();
    renderCertificate();
    showToast('Centered horizontally (X: 50%)', 'info');
  });

  centerVerticalBtn.addEventListener('click', () => {
    state.textConfig.posY = 53.0;
    updateCoordinateInputs();
    renderCertificate();
    showToast('Aligned to certificate name line (Y: 53%)', 'info');
  });

  // Alignment Buttons
  alignButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      alignButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      state.textConfig.align = btn.dataset.align;
      renderCertificate();
    });
  });

  // Toolbar toggles
  toggleGuidesBtn.addEventListener('click', () => {
    state.showGuides = !state.showGuides;
    toggleGuidesBtn.classList.toggle('active', state.showGuides);
    renderCertificate();
  });

  fitCanvasBtn.addEventListener('click', () => {
    canvas.scrollIntoView({ behavior: 'smooth', block: 'center' });
    showToast('Canvas centered in viewport', 'info');
  });

  // Quick Sample Project Loader
  loadSampleProjectBtn.addEventListener('click', () => {
    loadPreset('gdg-blue');
    loadSampleCsvBtn.click();
    showToast('Sample GDG Project & Participants Loaded!', 'success');
  });

  // =========================================================================
  // 10. Bulk Export Engine (Single PNG, Bulk ZIP, and Combined PDF)
  // =========================================================================

  /**
   * Helper: Sanitizes a string for safe filenames
   */
  function sanitizeFilename(name) {
    return (name || 'certificate').trim().replace(/[^a-zA-Z0-9_\-]/g, '_');
  }

  // 1. Download Current Preview as PNG
  downloadCurrentBtn.addEventListener('click', () => {
    if (!state.templateImage) {
      showToast('No certificate template available to export', 'error');
      return;
    }

    // Render cleanly on offscreen canvas to avoid guide flicker on preview
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = state.templateWidth;
    exportCanvas.height = state.templateHeight;
    const exportCtx = exportCanvas.getContext('2d');

    renderCertificate(state.currentIndex, exportCtx, exportCanvas);

    const name = state.participants.length > 0 
      ? (state.participants[state.currentIndex][state.selectedColumn] || 'Participant')
      : (customNameInput.value || 'Certificate');

    const filename = `${sanitizeFilename(name)}_Certificate.png`;
    const link = document.createElement('a');
    link.download = filename;
    link.href = exportCanvas.toDataURL('image/png', 1.0);
    link.click();

    showToast(`Downloaded: ${filename}`, 'success');
  });

  // 2. Download All as ZIP Archive
  downloadZipBtn.addEventListener('click', async () => {
    if (!window.JSZip) {
      showToast('JSZip library not loaded. Please verify connection.', 'error');
      return;
    }

    const list = state.participants.length > 0 ? state.participants : [{ [state.selectedColumn]: customNameInput.value || 'Participant' }];

    // Show Progress Modal
    progressModal.style.display = 'flex';
    modalTitle.textContent = 'Generating Image Archive (ZIP)...';
    modalDesc.textContent = `Processing ${list.length} certificates in full high-resolution...`;
    progressBarFill.style.width = '0%';
    progressPercent.textContent = '0%';
    progressCount.textContent = `0 / ${list.length}`;

    // Create offscreen high-res render canvas to guarantee maximum quality without altering UI
    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = state.templateWidth;
    exportCanvas.height = state.templateHeight;
    const exportCtx = exportCanvas.getContext('2d');

    const zip = new window.JSZip();
    const folder = zip.folder('GDG_Certificates');

    for (let i = 0; i < list.length; i++) {
      // Render certificate on offscreen canvas
      renderCertificate(i, exportCtx, exportCanvas);

      // Convert canvas to base64 Data URL (strip header for JSZip)
      const dataUrl = exportCanvas.toDataURL('image/png', 1.0);
      const base64Data = dataUrl.replace(/^data:image\/png;base64,/, '');

      const pName = list[i][state.selectedColumn] || `Participant_${i + 1}`;
      const filename = `${sanitizeFilename(pName)}_Certificate.png`;
      folder.file(filename, base64Data, { base64: true });

      // Update progress UI
      const percent = Math.round(((i + 1) / list.length) * 100);
      progressBarFill.style.width = `${percent}%`;
      progressPercent.textContent = `${percent}%`;
      progressCount.textContent = `${i + 1} / ${list.length} Completed`;

      // Allow UI to breathe
      await new Promise(r => setTimeout(r, 10));
    }

    modalDesc.textContent = 'Compressing into ZIP archive...';
    const content = await zip.generateAsync({ type: 'blob' });

    // Download ZIP
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.download = `GDG_Certificates_Batch_${Date.now()}.zip`;
    link.href = url;
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    progressModal.style.display = 'none';
    showToast(`Successfully exported ${list.length} certificates in ZIP!`, 'success');
  });

  // 3. Download All as Combined PDF
  downloadPdfBtn.addEventListener('click', async () => {
    const jsPdfConstructor = (window.jspdf && window.jspdf.jsPDF) || window.jsPDF;
    if (!jsPdfConstructor) {
      showToast('jsPDF library not loaded. Please verify connection.', 'error');
      return;
    }

    const list = state.participants.length > 0 ? state.participants : [{ [state.selectedColumn]: customNameInput.value || 'Participant' }];

    // Show Progress Modal
    progressModal.style.display = 'flex';
    modalTitle.textContent = 'Generating Merged PDF...';
    modalDesc.textContent = `Assembling ${list.length} pages into a high-quality printable document...`;
    progressBarFill.style.width = '0%';
    progressPercent.textContent = '0%';
    progressCount.textContent = `0 / ${list.length}`;

    // Determine Orientation
    const isLandscape = state.templateWidth >= state.templateHeight;
    const orientation = isLandscape ? 'landscape' : 'portrait';

    // Initialize jsPDF with certificate dimensions
    const pdf = new jsPdfConstructor({
      orientation: orientation,
      unit: 'px',
      format: [state.templateWidth, state.templateHeight],
      hotfixes: ['px_scaling']
    });

    const exportCanvas = document.createElement('canvas');
    exportCanvas.width = state.templateWidth;
    exportCanvas.height = state.templateHeight;
    const exportCtx = exportCanvas.getContext('2d');

    for (let i = 0; i < list.length; i++) {
      if (i > 0) {
        pdf.addPage([state.templateWidth, state.templateHeight], orientation);
      }

      // Render certificate on offscreen canvas
      renderCertificate(i, exportCtx, exportCanvas);

      // Convert to JPEG for optimal PDF size and speed
      const imgData = exportCanvas.toDataURL('image/jpeg', 0.95);
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);

      // Update progress
      const percent = Math.round(((i + 1) / list.length) * 100);
      progressBarFill.style.width = `${percent}%`;
      progressPercent.textContent = `${percent}%`;
      progressCount.textContent = `${i + 1} / ${list.length} Pages Assembled`;

      await new Promise(r => setTimeout(r, 10));
    }

    modalDesc.textContent = 'Saving PDF document...';
    pdf.save(`GDG_Certificates_Batch_${Date.now()}.pdf`);

    progressModal.style.display = 'none';
    showToast(`Combined PDF with ${list.length} certificates downloaded!`, 'success');
  });

  // =========================================================================
  // 11. Initial Application Boot
  // =========================================================================
  loadPreset('gdg-blue');
  updateCoordinateInputs();
  populateParticipantList(state.participants);

  badgeText.textContent = 'Fully Operational';
  console.log('⚡ CertiFlow: Full Application Initialized & Verified.');
  showToast('CertiFlow Studio Ready! Click "Load Sample Demo" for a test drive.', 'info');
});
