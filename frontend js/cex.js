// Construction Expert & Analysis Reports Script (cex.js)

document.addEventListener("DOMContentLoaded", () => {
  // Elements Selection
  const chatForm = document.getElementById("chat-form");
  const chatInput = document.getElementById("chat-input-text");
  const chatMessages = document.getElementById("chat-messages");
  const attachBtn = document.getElementById("attach-btn");
  const fileInput = document.getElementById("chat-file-input");
  const attPreview = document.getElementById("attachment-preview");
  const previewFilename = document.getElementById("preview-filename");
  const removeAttBtn = document.getElementById("remove-att-btn");
  const micBtn = document.getElementById("mic-btn");
  const quickPromptsContainer = document.getElementById("quick-prompts");

  const callEngineerBtn = document.getElementById("call-engineer-btn");
  const requestInspectionBtn = document.getElementById("request-inspection-btn");

  // Report Tab Elements
  const tabWeekly = document.getElementById("tab-weekly");
  const tabMonthly = document.getElementById("tab-monthly");
  const tabCustom = document.getElementById("tab-custom");
  const downloadPdfBtn = document.getElementById("download-pdf-btn");
  const printReportBtn = document.getElementById("print-report-btn");
  const pdfModal = document.getElementById("pdf-modal");
  const modalCloseBtn = document.getElementById("modal-close-btn");

  // Dynamic Report Content Elements
  const periodTag = document.getElementById("period-tag");
  const periodDate = document.getElementById("period-date");
  const valProgress = document.getElementById("val-progress");
  const badgeProgress = document.getElementById("badge-progress");
  const fillProgress = document.getElementById("fill-progress");
  const subProgress = document.getElementById("sub-progress");

  const valQuality = document.getElementById("val-quality");
  const badgeQuality = document.getElementById("badge-quality");
  const fillQuality = document.getElementById("fill-quality");
  const subQuality = document.getElementById("sub-quality");

  const valBudget = document.getElementById("val-budget");
  const badgeBudget = document.getElementById("badge-budget");
  const fillBudget = document.getElementById("fill-budget");
  const subBudget = document.getElementById("sub-budget");

  const valLabor = document.getElementById("val-labor");
  const badgeLabor = document.getElementById("badge-labor");
  const fillLabor = document.getElementById("fill-labor");
  const subLabor = document.getElementById("sub-labor");

  const taskBoxTag = document.getElementById("task-box-tag");
  const milestonesList = document.getElementById("milestones-list");
  const materialsList = document.getElementById("materials-list");
  const insightTitle = document.getElementById("insight-title");
  const insightMeta = document.getElementById("insight-meta");
  const insightBody = document.getElementById("insight-body");

  let attachedFile = null;

  // Initial render of default Weekly Report data
  renderReportData("weekly");

  // --- CHATBOT LOGIC ---

  // Handle Attachment Upload
  attachBtn.addEventListener("click", () => fileInput.click());

  fileInput.addEventListener("change", (e) => {
    if (e.target.files && e.target.files[0]) {
      attachedFile = e.target.files[0];
      previewFilename.textContent = `Attached: ${attachedFile.name}`;
      attPreview.style.display = "flex";
    }
  });

  removeAttBtn.addEventListener("click", () => {
    attachedFile = null;
    fileInput.value = "";
    attPreview.style.display = "none";
  });

  // Handle Voice Dictation Simulation
  micBtn.addEventListener("click", () => {
    micBtn.style.color = "#ff7675";
    chatInput.placeholder = "Listening... Speak your construction question...";
    setTimeout(() => {
      chatInput.value = "What is the concrete strength requirement for 1st floor slab casting?";
      chatInput.placeholder = "Ask your Engineer or Site AI expert...";
      micBtn.style.color = "";
    }, 2500);
  });

  // Quick Prompt Chips
  quickPromptsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("prompt-chip")) {
      const promptText = e.target.getAttribute("data-prompt");
      chatInput.value = promptText;
      sendMessage(promptText);
    }
  });

  // Chat Form Submit
  chatForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = chatInput.value.trim();
    if (!text && !attachedFile) return;
    sendMessage(text);
  });

  function sendMessage(userText) {
    const timeStr = getCurrentTime();

    // Render User Message
    const userMsgHTML = `
      <div class="chat-message message-user">
        <div class="msg-body">
          <div class="msg-sender">
            <strong>You</strong>
            <span class="msg-time">${timeStr}</span>
          </div>
          <div class="msg-content">
            <p>${escapeHTML(userText)}</p>
            ${attachedFile ? `<div class="msg-attachment-card"><div class="att-icon">📎</div><div class="att-details"><span class="att-title">${escapeHTML(attachedFile.name)}</span><span class="att-sub">User Uploaded Document</span></div></div>` : ''}
          </div>
        </div>
      </div>
    `;

    chatMessages.insertAdjacentHTML("beforeend", userMsgHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    // Reset Form Input
    chatInput.value = "";
    if (attachedFile) {
      removeAttBtn.click();
    }

    // Show AI/Engineer Typing Indicator
    showTypingIndicator();

    // Generate Dynamic Response
    setTimeout(() => {
      removeTypingIndicator();
      const replyObj = generateAiResponse(userText);
      renderAiResponse(replyObj);
    }, 1200);
  }

  function showTypingIndicator() {
    const typingHTML = `
      <div class="chat-message message-ai" id="typing-indicator">
        <div class="msg-avatar ai-avatar">AI</div>
        <div class="msg-body">
          <div class="msg-sender">
            <strong>Site AI 2.0 & Er. Rajesh</strong>
            <span class="ai-badge">Analyzing Site Data...</span>
          </div>
          <div class="msg-content">
            <p style="color: var(--silver); font-style: italic;">Evaluating IS Code standards, structural calculations, and jobsite logs...</p>
          </div>
        </div>
      </div>
    `;
    chatMessages.insertAdjacentHTML("beforeend", typingHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function removeTypingIndicator() {
    const indicator = document.getElementById("typing-indicator");
    if (indicator) indicator.remove();
  }

  function renderAiResponse(replyObj) {
    const timeStr = getCurrentTime();
    const isEngineer = replyObj.isEngineer;

    const replyHTML = `
      <div class="chat-message ${isEngineer ? 'message-engineer' : 'message-ai'}">
        <div class="msg-avatar ${isEngineer ? '' : 'ai-avatar'}">${isEngineer ? 'RS' : 'AI'}</div>
        <div class="msg-body">
          <div class="msg-sender">
            <strong>${isEngineer ? 'Er. Rajesh Sharma (Lead Engineer)' : 'Site AI 2.0 Co-Pilot'}</strong>
            <span class="msg-time">${timeStr}</span>
            ${!isEngineer ? '<span class="ai-badge">Instant AI Analysis</span>' : ''}
          </div>
          <div class="msg-content">
            ${replyObj.bodyHTML}
          </div>
        </div>
      </div>
    `;

    chatMessages.insertAdjacentHTML("beforeend", replyHTML);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  function generateAiResponse(query) {
    const q = query.toLowerCase();

    if (q.includes("slump") || q.includes("concrete test") || q.includes("strength")) {
      return {
        isEngineer: true,
        bodyHTML: `
          <p>For your 1st Floor Slab casting, we used <strong>M25 Concrete Grade</strong> (1:1:2 nominal mix ratio). Here are the lab inspection details:</p>
          <ul>
            <li><strong>Slump Test Result:</strong> 105 mm (Target: 100-120 mm for pumped concrete - <em>PASSED</em>).</li>
            <li><strong>7-Day Cube Compressive Strength:</strong> 19.4 N/mm² (Minimum requirement: 16.75 N/mm² - <em>PASSED (+15.8%)</em>).</li>
            <li><strong>28-Day Projected Strength:</strong> ~27.2 N/mm².</li>
          </ul>
          <p>All test cubes were cured under standard water bath conditions according to IS 516 standards.</p>
        `
      };
    } else if (q.includes("curing") || q.includes("schedule")) {
      return {
        isEngineer: false,
        bodyHTML: `
          <p><strong>Slab & Beam Curing Status Report:</strong></p>
          <ul>
            <li><strong>Curing Method:</strong> Ponding method on flat slab surface + wet hessian gunny bags wrapped on columns.</li>
            <li><strong>Current Day:</strong> Day 9 of 14 mandatory curing days.</li>
            <li><strong>Target Completion Date:</strong> September 5, 2026.</li>
          </ul>
          <p class="ai-footnote">💡 <em>Tip: Maintaining continuous moist curing for 14 days prevents shrinkage cracks and ensures full design compressive strength.</em></p>
        `
      };
    } else if (q.includes("budget") || q.includes("cost") || q.includes("spent")) {
      return {
        isEngineer: false,
        bodyHTML: `
          <p><strong>Weekly Budget vs Actual Expenditure Breakdown (Week 12):</strong></p>
          <ul>
            <li><strong>Cement & Aggregates:</strong> ₹ 4,20,000 (Allocated: ₹ 4,50,000)</li>
            <li><strong>TMT Steel Reinforcement:</strong> ₹ 6,80,000 (Allocated: ₹ 7,20,000)</li>
            <li><strong>Labor & Machinery Hiring:</strong> ₹ 4,10,000 (Allocated: ₹ 4,80,000)</li>
            <li><strong>Plumbing & Electrical Sleeves:</strong> ₹ 3,35,000 (Allocated: ₹ 5,50,000)</li>
          </ul>
          <p><strong>Total Stage Expenditure:</strong> ₹ 18,45,000 out of ₹ 22,00,000 allocated. You have a favorable savings variance of <strong>₹ 3,55,000</strong>!</p>
        `
      };
    } else if (q.includes("steel") || q.includes("rebar") || q.includes("tata") || q.includes("fe550")) {
      return {
        isEngineer: true,
        bodyHTML: `
          <p>Yes, absolutely! We strictly use <strong>Tata Tiscon Fe550D High-Ductility TMT bars</strong> as specified in the structural engineer blueprints:</p>
          <ul>
            <li><strong>Main Column Reinforcement:</strong> 20mm & 16mm Fe550D bars with 8mm stirrups spaced @ 150mm c/c.</li>
            <li><strong>Slab Top & Bottom Mesh:</strong> 10mm main bars @ 125mm c/c & 8mm distribution bars @ 150mm c/c.</li>
            <li><strong>Cover Block Audit:</strong> 40mm cover provided for columns, 20mm cover for slab soffit.</li>
          </ul>
          <p>All rebar shipments come with mill test certificates confirming ultimate tensile strength > 585 N/mm².</p>
        `
      };
    } else if (q.includes("weather") || q.includes("rain") || q.includes("monsoon")) {
      return {
        isEngineer: false,
        bodyHTML: `
          <p><strong>Weather Risk & Site Protection Protocol:</strong></p>
          <ul>
            <li><strong>Thursday Rain Forecast:</strong> Moderate rainfall expected. Tarpaulin covers are stationed on site to protect sand bags and open mortar mixes.</li>
            <li><strong>Waterproofing:</strong> Terrace primer application will take place Friday morning once surfaces dry out completely.</li>
          </ul>
        `
      };
    } else {
      return {
        isEngineer: true,
        bodyHTML: `
          <p>Thank you for your inquiry regarding <strong>"${escapeHTML(query)}"</strong>.</p>
          <p>I have logged this in your project register (Site #104). Our structural engineering co-pilot has double-checked the structural drawings and site parameters. Everything is proceeding smoothly in accordance with IS 456:2000 codes.</p>
          <p>Feel free to ask about curing timetables, material test certificates, or upcoming stage payments!</p>
        `
      };
    }
  }

  // Header Call & Inspection Buttons
  callEngineerBtn.addEventListener("click", () => {
    alert("📞 Initiating encrypted line to Er. Rajesh Sharma...\nStatus: Engineer is available on site. Connecting audio/video call...");
  });

  requestInspectionBtn.addEventListener("click", () => {
    alert("📋 Site Inspection Request Logged!\nEr. Rajesh Sharma will perform a targeted joint structural check on your site tomorrow at 11:00 AM.");
  });

  // --- REPORT TAB SWITCHING & DATA RENDER ---

  const tabs = [tabWeekly, tabMonthly, tabCustom];

  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");

      const period = tab.getAttribute("data-period");
      renderReportData(period);
    });
  });

  function renderReportData(period) {
    if (period === "weekly") {
      periodTag.textContent = "WEEK 12 REPORT";
      periodDate.textContent = "Aug 25, 2026 – Aug 31, 2026";

      valProgress.textContent = "42.5%";
      badgeProgress.textContent = "+4.2% ahead of target";
      fillProgress.style.width = "42.5%";
      subProgress.textContent = "Target for Week 12: 38.3% | Ahead by 3 Days";

      valQuality.textContent = "98.8%";
      badgeQuality.textContent = "Grade A+ (IS 456)";
      fillQuality.style.width = "98.8%";
      subQuality.textContent = "14 Checkpoints Verified • Zero Safety Incidents";

      valBudget.textContent = "₹ 18.45 L";
      badgeBudget.textContent = "Allocated: ₹ 22.00 L";
      fillBudget.style.width = "83.8%";
      subBudget.textContent = "83.8% of Stage 2 budget spent | Savings: ₹ 3.55 L";

      valLabor.textContent = "18 Workers";
      badgeLabor.textContent = "100% Attendance";
      fillLabor.style.width = "100%";
      subLabor.textContent = "12 Masons, 6 Helpers, 2 Supervisors, 1 QC Eng.";

      taskBoxTag.textContent = "Current Stage: Structure & Masonry";

      milestonesList.innerHTML = `
        <div class="milestone-item">
          <div class="m-row">
            <span class="m-title">1st Floor Slab RCC Casting & Curing</span>
            <span class="m-pct">100% (Day 9/14 Curing)</span>
          </div>
          <div class="progress-bar-shell"><div class="progress-bar-fill gold" style="width: 100%;"></div></div>
          <p class="m-desc">M25 Grade concrete used. 7-day compressive strength: 19.4 N/mm².</p>
        </div>

        <div class="milestone-item">
          <div class="m-row">
            <span class="m-title">Ground Floor Red Brick Masonry</span>
            <span class="m-pct">45% Completed</span>
          </div>
          <div class="progress-bar-shell"><div class="progress-bar-fill" style="width: 45%;"></div></div>
          <p class="m-desc">First-class burnt clay bricks with 1:6 cement mortar matrix.</p>
        </div>

        <div class="milestone-item">
          <div class="m-row">
            <span class="m-title">Conduit Electrical & Plumbing Piping</span>
            <span class="m-pct">30% Completed</span>
          </div>
          <div class="progress-bar-shell"><div class="progress-bar-fill green" style="width: 30%;"></div></div>
          <p class="m-desc">Heavy-duty Finolex PVC electrical conduits embedded in slab soffit.</p>
        </div>
      `;

      materialsList.innerHTML = `
        <div class="material-item">
          <div class="m-row">
            <span class="m-title">Ultratech Cement (PPC Grade)</span>
            <span class="mat-stock">420 / 500 Bags</span>
          </div>
          <p class="m-desc">Fresh batch batching (Manufacturing date < 14 days old).</p>
        </div>

        <div class="material-item">
          <div class="m-row">
            <span class="m-title">Tata Tiscon Fe550D TMT Steel</span>
            <span class="mat-stock low">0.7 Tons Remaining (Re-order suggested)</span>
          </div>
          <p class="m-desc">16mm & 12mm rebar stock needs replenishment for 2nd floor columns.</p>
        </div>

        <div class="material-item">
          <div class="m-row">
            <span class="m-title">M-Sand & 20mm Aggregates</span>
            <span class="mat-stock">1,200 cu.ft Stock</span>
          </div>
          <p class="m-desc">Washed manufactured sand free from silt & organic impurities.</p>
        </div>
      `;

      insightTitle.textContent = "Lead Structural Engineer & AI Co-Pilot Findings (Weekly)";
      insightMeta.textContent = "Automated analysis generated on Aug 31, 2026";
      insightBody.innerHTML = `
        <div class="insight-item insight-positive">
          <span class="bullet-icon">✓</span>
          <div>
            <strong>Compressive Strength Exceeded:</strong>
            <p>7-Day M25 concrete cube test reached 19.4 N/mm² (Target: 16.75 N/mm²). Concrete mixing ratio and compaction were executed to perfection.</p>
          </div>
        </div>
        <div class="insight-item insight-warning">
          <span class="bullet-icon">⚠️</span>
          <div>
            <strong>Curing & Weather Vigilance:</strong>
            <p>Ensure continuous ponding/gunny bag moistening for 1st Floor slab until Day 14 (Sept 5). Prepare rain covers for mortar mixing area prior to Thursday rain forecast.</p>
          </div>
        </div>
        <div class="insight-item insight-info">
          <span class="bullet-icon">💡</span>
          <div>
            <strong>Procurement Recommendation:</strong>
            <p>Steel TMT stock is at 0.7 Tons remaining. Procure 4.5 Tons of Tata Tiscon Fe550D before scheduled distributor price hike next Monday.</p>
          </div>
        </div>
      `;

    } else if (period === "monthly") {
      periodTag.textContent = "AUGUST 2026 CUMULATIVE REPORT";
      periodDate.textContent = "Aug 1, 2026 – Aug 31, 2026";

      valProgress.textContent = "42.5%";
      badgeProgress.textContent = "+8.5% Monthly Increase";
      fillProgress.style.width = "42.5%";
      subProgress.textContent = "Monthly Target Accomplished: Foundation to 1st Floor Slab";

      valQuality.textContent = "99.2%";
      badgeQuality.textContent = "Zero NCR Defects";
      fillQuality.style.width = "99.2%";
      subQuality.textContent = "Full Month QC Audit Passed by Certified Structural Engineers";

      valBudget.textContent = "₹ 48.20 L";
      badgeBudget.textContent = "Monthly Cap: ₹ 55.00 L";
      fillBudget.style.width = "87.6%";
      subBudget.textContent = "87.6% of Monthly Budget Utilized | Balance: ₹ 6.80 L";

      valLabor.textContent = "480 Man-Days";
      badgeLabor.textContent = "Optimal Productivity";
      fillLabor.style.width = "95%";
      subLabor.textContent = "Average 16-18 workers daily on site with zero safety incidents";

      taskBoxTag.textContent = "Monthly Milestone Summary";

      milestonesList.innerHTML = `
        <div class="milestone-item">
          <div class="m-row">
            <span class="m-title">Earthwork Excavation & Plinth Beam Casting</span>
            <span class="m-pct">100% Completed</span>
          </div>
          <div class="progress-bar-shell"><div class="progress-bar-fill green" style="width: 100%;"></div></div>
          <p class="m-desc">Completed on Aug 8. Anti-termite soil treatment applied (IS 6313).</p>
        </div>

        <div class="milestone-item">
          <div class="m-row">
            <span class="m-title">Ground Floor RCC Columns (12 Columns)</span>
            <span class="m-pct">100% Completed</span>
          </div>
          <div class="progress-bar-shell"><div class="progress-bar-fill green" style="width: 100%;"></div></div>
          <p class="m-desc">Cast in M25 concrete with cover blocks and vibrator compaction.</p>
        </div>

        <div class="milestone-item">
          <div class="m-row">
            <span class="m-title">1st Floor Centering, Shuttering & Slab Casting</span>
            <span class="m-pct">100% Completed</span>
          </div>
          <div class="progress-bar-shell"><div class="progress-bar-fill gold" style="width: 100%;"></div></div>
          <p class="m-desc">Slab thickness 125mm with double-mesh Fe550 rebar binding.</p>
        </div>
      `;

      materialsList.innerHTML = `
        <div class="material-item">
          <div class="m-row">
            <span class="m-title">Monthly Cement Consumed</span>
            <span class="mat-stock">1,850 Bags</span>
          </div>
          <p class="m-desc">Procured directly from Ultratech factory distributor at ₹ 370/bag.</p>
        </div>

        <div class="material-item">
          <div class="m-row">
            <span class="m-title">Monthly TMT Steel Consumed</span>
            <span class="mat-stock">18.2 Tons</span>
          </div>
          <p class="m-desc">Tata Tiscon Fe550D rebar used for all structural RCC framework.</p>
        </div>

        <div class="material-item">
          <div class="m-row">
            <span class="m-title">Aggregate & Sand Consumed</span>
            <span class="mat-stock">8,400 cu.ft</span>
          </div>
          <p class="m-desc">Full compliance with sieve analysis and grain size distribution test.</p>
        </div>
      `;

      insightTitle.textContent = "Monthly Executive Engineering Summary (August 2026)";
      insightMeta.textContent = "Compiled by Lead Engineer Er. Rajesh Sharma";
      insightBody.innerHTML = `
        <div class="insight-item insight-positive">
          <span class="bullet-icon">✓</span>
          <div>
            <strong>12.3% Cost Optimization Achieved:</strong>
            <p>Direct bulk purchasing of cement and TMT steel saved ₹ 6,80,000 against monthly projected market cost.</p>
          </div>
        </div>
        <div class="insight-item insight-positive">
          <span class="bullet-icon">✓</span>
          <div>
            <strong>Schedule Fast-Tracked:</strong>
            <p>1st Floor Slab casting completed 3 days ahead of the master construction schedule.</p>
          </div>
        </div>
        <div class="insight-item insight-info">
          <span class="bullet-icon">💡</span>
          <div>
            <strong>September Plan Focus:</strong>
            <p>Complete Ground Floor Brick Masonry, start 1st Floor Column Shuttering, and finalize concealed electrical conduits.</p>
          </div>
        </div>
      `;

    } else if (period === "custom") {
      periodTag.textContent = "IS 456 & NBC 2016 STRUCTURAL AUDIT";
      periodDate.textContent = "Certified Inspection Log #AUD-2026-104";

      valProgress.textContent = "100%";
      badgeProgress.textContent = "Audit Certified";
      fillProgress.style.width = "100%";
      subProgress.textContent = "All Structural Safety Checks Fully Compliant";

      valQuality.textContent = "99.6%";
      badgeQuality.textContent = "Grade A+ Audit";
      fillQuality.style.width = "99.6%";
      subQuality.textContent = "Verified by Structural Engineer License #SE-88492";

      valBudget.textContent = "Verified";
      badgeBudget.textContent = "Stage 2 Passed";
      fillBudget.style.width = "100%";
      subBudget.textContent = "Bank Disbursal Stage 2 Approval Certificate Issued";

      valLabor.textContent = "Certified";
      badgeLabor.textContent = "Zero Defect Site";
      fillLabor.style.width = "100%";
      subLabor.textContent = "Safety gear, helmet & harness compliance 100%";

      taskBoxTag.textContent = "Structural Safety Checkpoints";

      milestonesList.innerHTML = `
        <div class="milestone-item">
          <div class="m-row">
            <span class="m-title">Soil Bearing Capacity & Footing Depth</span>
            <span class="m-pct">Verified (220 kN/m²)</span>
          </div>
          <div class="progress-bar-shell"><div class="progress-bar-fill green" style="width: 100%;"></div></div>
          <p class="m-desc">Isolated footings anchored into hard strata at 6.5 ft depth.</p>
        </div>

        <div class="milestone-item">
          <div class="m-row">
            <span class="m-title">Column Rebar Lapping & Cover Blocks</span>
            <span class="m-pct">Verified (IS 456)</span>
          </div>
          <div class="progress-bar-shell"><div class="progress-bar-fill green" style="width: 100%;"></div></div>
          <p class="m-desc">50D lap length provided with staggered lapping zones.</p>
        </div>

        <div class="milestone-item">
          <div class="m-row">
            <span class="m-title">Concrete Compressive Strength Certification</span>
            <span class="m-pct">Passed (19.4 N/mm²)</span>
          </div>
          <div class="progress-bar-shell"><div class="progress-bar-fill green" style="width: 100%;"></div></div>
          <p class="m-desc">Cube test certificates archived for home loan bank inspection.</p>
        </div>
      `;

      materialsList.innerHTML = `
        <div class="material-item">
          <div class="m-row">
            <span class="m-title">IS 456 Concrete Design Mix</span>
            <span class="mat-stock">M25 Grade</span>
          </div>
          <p class="m-desc">Water-cement ratio maintained at 0.45 for maximum durability.</p>
        </div>

        <div class="material-item">
          <div class="m-row">
            <span class="m-title">Steel Tensile Yield Test</span>
            <span class="mat-stock">Fe550D Grade</span>
          </div>
          <p class="m-desc">Elongation test passed (>16% ductility for seismic zone III).</p>
        </div>
      `;

      insightTitle.textContent = "Official Structural Safety & Compliance Certification";
      insightMeta.textContent = "Issued by Lead Structural Engineer Er. Rajesh Sharma";
      insightBody.innerHTML = `
        <div class="insight-item insight-positive">
          <span class="bullet-icon">🛡️</span>
          <div>
            <strong>Earthquake Resistant Design Compliance:</strong>
            <p>Ductile detailing of RCC frame conforms strictly to IS 13920:2016 for Seismic Zone III stability.</p>
          </div>
        </div>
        <div class="insight-item insight-positive">
          <span class="bullet-icon">📜</span>
          <div>
            <strong>Bank Loan Tranche Release Recommendation:</strong>
            <p>This site inspection report serves as valid structural progress proof for Home Loan Tranche 2 disbursal.</p>
          </div>
        </div>
      `;
    }
  }

  // --- PDF PRINT MODAL HANDLERS ---
  downloadPdfBtn.addEventListener("click", () => {
    pdfModal.style.display = "flex";
  });

  printReportBtn.addEventListener("click", () => {
    window.print();
  });

  modalCloseBtn.addEventListener("click", () => {
    pdfModal.style.display = "none";
  });

  pdfModal.addEventListener("click", (e) => {
    if (e.target === pdfModal) {
      pdfModal.style.display = "none";
    }
  });

  // Helper Functions
  function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return `${hours}:${minutes} ${ampm}`;
  }

  function escapeHTML(str) {
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
});
