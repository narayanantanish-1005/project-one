document.addEventListener('DOMContentLoaded', () => {
  // Read Logged In User
  const sessionData = localStorage.getItem('onedream_user');
  let user = { name: 'Homeowner', projectName: 'The Emerald Villa' };
  if (sessionData) {
    try {
      const parsed = JSON.parse(sessionData);
      user.name = parsed.name || 'Homeowner';
      user.projectName = parsed.projectName || 'The Emerald Villa';
      const sidebarName = document.getElementById('sidebar-user-name');
      const sidebarInitials = document.getElementById('sidebar-avatar-initials');
      if (sidebarName) sidebarName.textContent = user.name;
      if (sidebarInitials) sidebarInitials.textContent = user.name.slice(0, 2).toUpperCase();
    } catch (e) {}
  }

  // ==========================================
  // MODULE 1: SUDAR AI CHATBOT LOGIC
  // ==========================================
  const chatWindow = document.getElementById('chat-window');
  const chatForm = document.getElementById('chat-form');
  const chatInput = document.getElementById('chat-input');
  const typingIndicator = document.getElementById('typing-indicator');
  const presetDailyBtn = document.getElementById('preset-daily');
  const presetWeeklyBtn = document.getElementById('preset-weekly');
  const presetMonthlyBtn = document.getElementById('preset-monthly');
  const exportChatBtn = document.getElementById('export-chat-btn');
  const clearChatBtn = document.getElementById('clear-chat-btn');

  // Global scope function for quick chips
  window.sendQuickPrompt = (promptText) => {
    chatInput.value = promptText;
    handleChatSubmit();
  };

  // Submit Handler
  chatForm.addEventListener('submit', (e) => {
    e.preventDefault();
    handleChatSubmit();
  });

  // Enter to Submit (Shift+Enter for newline)
  chatInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleChatSubmit();
    }
  });

  // Presets
  presetDailyBtn.addEventListener('click', () => sendQuickPrompt("Generate today's daily construction process report"));
  presetWeeklyBtn.addEventListener('click', () => sendQuickPrompt("Generate weekly site progress audit and delay breakdown"));
  presetMonthlyBtn.addEventListener('click', () => sendQuickPrompt("Generate monthly comprehensive structural & financial report"));

  function handleChatSubmit() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Add User Message
    appendMessage('user', text);
    chatInput.value = '';

    // Show Typing
    typingIndicator.classList.remove('hidden');
    scrollToBottom();

    // Simulate AI Processing Delay
    setTimeout(() => {
      typingIndicator.classList.add('hidden');
      const aiResponseHtml = generateSudarAIResponse(text);
      appendMessage('ai', aiResponseHtml);
      scrollToBottom();
    }, 1200);
  }

  function appendMessage(sender, htmlContent) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `chat-msg msg-${sender}`;

    const avatarDiv = document.createElement('div');
    avatarDiv.className = 'msg-avatar';
    avatarDiv.textContent = sender === 'ai' ? 'SA' : user.name.slice(0, 2).toUpperCase();

    const bubbleDiv = document.createElement('div');
    bubbleDiv.className = 'msg-bubble';
    bubbleDiv.innerHTML = htmlContent;

    msgDiv.appendChild(avatarDiv);
    msgDiv.appendChild(bubbleDiv);
    chatWindow.appendChild(msgDiv);
  }

  function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
  }

  // Response Generator Logic
  function generateSudarAIResponse(query) {
    const q = query.toLowerCase();

    // DAILY REPORT
    if (q.includes('daily') || q.includes('today')) {
      return `
        <p><strong>📅 DAILY CONSTRUCTION PROCESS REPORT</strong></p>
        <p><small>Project: ${user.projectName} • Date: ${new Date().toLocaleDateString()}</small></p>
        <hr style="border-color: rgba(255,255,255,0.1); margin: 8px 0;">
        <table class="report-table">
          <thead>
            <tr><th>Metric</th><th>Today's Log</th><th>Status</th></tr>
          </thead>
          <tbody>
            <tr><td>On-site Workers</td><td>18 Skilled + 12 Helpers</td><td><span class="badge-tag green">100% Present</span></td></tr>
            <tr><td>Concrete Pouring</td><td>42 M³ Grade M25 Slab</td><td><span class="badge-tag green">Curing active</span></td></tr>
            <tr><td>Weather & Temp</td><td>Clear 29°C (0 Rainfall)</td><td><span class="badge-tag green">Optimal</span></td></tr>
            <tr><td>Safety Index</td><td>0 Incident Alerts</td><td><span class="badge-tag green">Safe</span></td></tr>
          </tbody>
        </table>
        <p><strong>Key Daily Takeaways:</strong></p>
        <ul>
          <li>Ground Floor Column casting completed for Grid Line B3-B7.</li>
          <li>Curing sprinklers scheduled at 08:00 AM, 01:00 PM, and 05:30 PM.</li>
          <li>Next Batch Delivery: 150 bags UltraTech Cement arriving tomorrow 09:00 AM.</li>
        </ul>
      `;
    }

    // WEEKLY REPORT
    if (q.includes('weekly') || q.includes('week')) {
      return `
        <p><strong>📊 WEEKLY SITE AUDIT REPORT</strong></p>
        <p><small>Project: ${user.projectName} • Week 12 Audit</small></p>
        <hr style="border-color: rgba(255,255,255,0.1); margin: 8px 0;">
        <table class="report-table">
          <thead>
            <tr><th>Milestone Task</th><th>Planned %</th><th>Actual %</th><th>Variance</th></tr>
          </thead>
          <tbody>
            <tr><td>Foundation & Footing</td><td>100%</td><td>100%</td><td><span class="badge-tag green">On Time</span></td></tr>
            <tr><td>Ground Floor Masonry</td><td>85%</td><td>88%</td><td><span class="badge-tag green">+3% Ahead</span></td></tr>
            <tr><td>First Floor Slab Frame</td><td>40%</td><td>38%</td><td><span class="badge-tag yellow">-2% Minor Buffer</span></td></tr>
          </tbody>
        </table>
        <p><strong>Weekly Expenditure Audit:</strong> ₹3,42,000 spent this week (Rebar TMT steel + ReadyMix concrete).</p>
      `;
    }

    // MONTHLY REPORT
    if (q.includes('monthly') || q.includes('month')) {
      return `
        <p><strong>🏢 MONTHLY EXECUTIVE AUDIT REPORT</strong></p>
        <p><small>Site: ${user.projectName} • Monthly Summary</small></p>
        <hr style="border-color: rgba(255,255,255,0.1); margin: 8px 0;">
        <p><strong>Overall Milestone Progress:</strong> 48% Structural Completion</p>
        <table class="report-table">
          <thead>
            <tr><th>Audit Category</th><th>Quality Score</th><th>Compliance</th></tr>
          </thead>
          <tbody>
            <tr><td>Structural Integrity (Cube Test)</td><td>28.5 N/mm² (Target 25)</td><td><span class="badge-tag green">Passed</span></td></tr>
            <tr><td>Electrical Conduit Alignment</td><td>Grade A Architecture</td><td><span class="badge-tag green">Certified</span></td></tr>
            <tr><td>Budget vs Actual Variance</td><td>₹18.4L spent / ₹19.0L budget</td><td><span class="badge-tag green">Under Budget</span></td></tr>
          </tbody>
        </table>
        <p><strong>Sudar AI Recommendation:</strong> Proceed with electrical rough-ins before plastering to optimize time.</p>
      `;
    }

    // COST ANALYSIS INJECTION FROM ESTIMATOR
    if (q.includes('estimate') || q.includes('budget') || q.includes('sq ft') || q.includes('cost')) {
      return `
        <p><strong>🤖 SUDAR AI ESTIMATE ANALYSIS & FEASIBILITY REPORT</strong></p>
        <p>I have analyzed your construction cost parameters for <strong>${user.projectName}</strong>:</p>
        <table class="report-table">
          <thead><tr><th>Parameter</th><th>AI Value / Benchmark</th></tr></thead>
          <tbody>
            <tr><td>Current Estimate</td><td><strong style="color: var(--accent);">${document.getElementById('total-price-display')?.textContent || '₹47,53,000'}</strong></td></tr>
            <tr><td>Area Rate</td><td>${document.getElementById('rate-sqft-display')?.textContent || '₹1,940/sq.ft'}</td></tr>
            <tr><td>Structural Feasibility</td><td><span class="badge-tag green">100% Highly Viable</span></td></tr>
          </tbody>
        </table>
        <p><strong>AI Savings Suggestion:</strong> Purchasing cement and TMT steel in bulk volume for the slab phase will save approx 4.5% (approx ₹85,000) on material costs.</p>
      `;
    }

    // DEFAULT SMART AI RESPONSE
    return `
      <p>I have logged your request regarding <em>"${query}"</em>.</p>
      <p>According to site telemetry for <strong>${user.projectName}</strong>, structural curing is progressing at normal parameters. All quality benchmarks meet IS 456:2000 reinforced concrete standards.</p>
      <p>Would you like me to issue a formal <strong>Daily Log</strong> or <strong>Cost Breakdown Analysis</strong>?</p>
    `;
  }

  // Clear & Export Chat
  clearChatBtn.addEventListener('click', () => {
    chatWindow.innerHTML = `
      <div class="chat-msg msg-ai">
        <div class="msg-avatar">SA</div>
        <div class="msg-bubble">
          <p>Chat cleared. How can Sudar AI assist your site today?</p>
        </div>
      </div>
    `;
  });

  exportChatBtn.addEventListener('click', () => {
    alert('Sudar AI Chat Log exported as PDF summary report!');
  });


  // ==========================================
  // MODULE 2: CONSTRUCTION COST ESTIMATOR LOGIC
  // ==========================================
  const bhkInputs = document.querySelectorAll('input[name="bhk"]');
  const sqftInput = document.getElementById('sqft-input');
  const sqftSlider = document.getElementById('sqft-slider');
  const floorsSelect = document.getElementById('floors-select');
  const qualitySelect = document.getElementById('quality-select');
  const locationSelect = document.getElementById('location-select');
  const addons = document.querySelectorAll('.addon-checkbox input');

  const totalPriceDisplay = document.getElementById('total-price-display');
  const rateSqftDisplay = document.getElementById('rate-sqft-display');
  const calcBreakdownSub = document.getElementById('calc-breakdown-sub');

  const costCivil = document.getElementById('cost-civil');
  const costFinishing = document.getElementById('cost-finishing');
  const costPlumbing = document.getElementById('cost-plumbing');
  const costCarpentry = document.getElementById('cost-carpentry');
  const costPermits = document.getElementById('cost-permits');
  const costLabor = document.getElementById('cost-labor');

  const analyzeWithSudarBtn = document.getElementById('analyze-with-sudar-btn');
  const saveQuoteBtn = document.getElementById('save-quote-btn');

  // Sync Slider & Input Number
  sqftSlider.addEventListener('input', () => {
    sqftInput.value = sqftSlider.value;
    calculateConstructionCost();
  });

  sqftInput.addEventListener('input', () => {
    if (sqftInput.value > 15000) sqftInput.value = 15000;
    sqftSlider.value = sqftInput.value || 1000;
    calculateConstructionCost();
  });

  // Radio BHK Styling & Sync
  bhkInputs.forEach(radio => {
    radio.addEventListener('change', (e) => {
      document.querySelectorAll('.bhk-card').forEach(c => c.classList.remove('active'));
      radio.closest('.bhk-card').classList.add('active');
      calculateConstructionCost();
    });
  });

  // Event Listeners for Selects & Checkboxes
  floorsSelect.addEventListener('change', calculateConstructionCost);
  qualitySelect.addEventListener('change', calculateConstructionCost);
  locationSelect.addEventListener('change', calculateConstructionCost);
  addons.forEach(a => a.addEventListener('change', calculateConstructionCost));

  // Primary Calculation Function
  function calculateConstructionCost() {
    const area = parseFloat(sqftInput.value) || 1000;
    const qualityRate = parseFloat(qualitySelect.value) || 1940;
    const floorMultiplier = parseFloat(floorsSelect.value) || 1.8;
    const locationMultiplier = parseFloat(locationSelect.value) || 1.0;

    let selectedBHK = '3 BHK';
    bhkInputs.forEach(r => { if (r.checked) selectedBHK = r.value; });

    // Calculate Addons
    let addonsTotal = 0;
    addons.forEach(chk => {
      if (chk.checked) addonsTotal += parseFloat(chk.value);
    });

    // Core Formula: (Area * Base Rate * Floor Factor * Location Factor) + Addons
    const baseConstructionCost = area * qualityRate * (floorMultiplier / 1.8) * locationMultiplier;
    const grandTotal = Math.round((baseConstructionCost + addonsTotal) / 1000) * 1000; // Round to nearest 1,000
    const effectiveRatePerSqFt = Math.round(grandTotal / area);

    // Breakdown Allocation Percentages
    const civilVal = Math.round(grandTotal * 0.38);
    const finishingVal = Math.round(grandTotal * 0.22);
    const plumbingVal = Math.round(grandTotal * 0.15);
    const carpentryVal = Math.round(grandTotal * 0.12);
    const permitsVal = Math.round(grandTotal * 0.08);
    const laborVal = Math.round(grandTotal * 0.05);

    // Format Currency (₹ INR)
    totalPriceDisplay.textContent = formatINR(grandTotal);
    rateSqftDisplay.textContent = `~ ${formatINR(effectiveRatePerSqFt)} / sq.ft`;
    calcBreakdownSub.textContent = `${selectedBHK} • ${area.toLocaleString()} sq.ft • ${getQualityLabel(qualityRate)}`;

    costCivil.textContent = formatINR(civilVal);
    costFinishing.textContent = formatINR(finishingVal);
    costPlumbing.textContent = formatINR(plumbingVal);
    costCarpentry.textContent = formatINR(carpentryVal);
    costPermits.textContent = formatINR(permitsVal);
    costLabor.textContent = formatINR(laborVal);
  }

  function formatINR(amount) {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);
  }

  function getQualityLabel(rate) {
    if (rate <= 1600) return 'Basic Standard Tier';
    if (rate <= 2000) return 'Premium Quality Tier';
    return 'Ultra-Luxury Custom Tier';
  }

  // Connect Estimator to Sudar AI Chat
  analyzeWithSudarBtn.addEventListener('click', () => {
    const area = sqftInput.value;
    const price = totalPriceDisplay.textContent;
    const rate = rateSqftDisplay.textContent;

    // Scroll to Sudar AI Chat
    document.getElementById('sudar-chat-section').scrollIntoView({ behavior: 'smooth' });

    setTimeout(() => {
      sendQuickPrompt(`Analyze my current cost estimate of ${price} (${rate}) for a ${area} sq.ft site and give structural optimization advice`);
    }, 600);
  });

  // Save Quote to Profile
  saveQuoteBtn.addEventListener('click', () => {
    const quote = {
      price: totalPriceDisplay.textContent,
      rate: rateSqftDisplay.textContent,
      area: sqftInput.value,
      bhk: document.querySelector('input[name="bhk"]:checked')?.value || '3 BHK',
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };

    alert(`Cost Estimate (${quote.price}) successfully saved to your Profile dashboard!`);
  });

  // Initial Calculation Run on Load
  calculateConstructionCost();
});
