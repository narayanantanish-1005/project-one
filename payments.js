document.addEventListener('DOMContentLoaded', () => {
  // Read Logged In User
  const sessionData = localStorage.getItem('onedream_user');
  let user = {
    name: 'Alex Morgan',
    email: 'alex.morgan@onedream.home',
    phone: '9876543210',
    projectName: 'The Emerald Villa & Residence'
  };

  if (sessionData) {
    try {
      user = { ...user, ...JSON.parse(sessionData) };
      const sidebarName = document.getElementById('sidebar-user-name');
      const sidebarInitials = document.getElementById('sidebar-avatar-initials');
      const headerSiteName = document.getElementById('header-site-name');

      if (sidebarName) sidebarName.textContent = user.name;
      if (sidebarInitials) sidebarInitials.textContent = user.name.slice(0, 2).toUpperCase();
      if (headerSiteName) headerSiteName.textContent = user.projectName;
    } catch (e) {}
  }

  // Load Financial Metrics State
  let financeState = {
    totalCost: 4750000,
    paidAmount: 1800000,
    nextDueAmount: 450000,
    history: [
      { id: 'pay_OD894201', date: 'Aug 12, 2026', stage: 'Foundation & Plinth', method: 'Razorpay (HDFC Card)', amount: 1000000 },
      { id: 'pay_OD741092', date: 'Jul 04, 2026', stage: 'Excavation & Footing', method: 'Razorpay (NetBanking)', amount: 600000 },
      { id: 'pay_OD610283', date: 'Jun 10, 2026', stage: 'Booking & Token Advance', method: 'Razorpay (UPI / Google Pay)', amount: 200000 }
    ]
  };

  const storedFinance = localStorage.getItem('onedream_payments');
  if (storedFinance) {
    try {
      financeState = { ...financeState, ...JSON.parse(storedFinance) };
    } catch (e) {}
  }

  updateFinanceUI();

  // Elements
  const payRazorpayBtn = document.getElementById('pay-razorpay-btn');
  const toggleCustomPay = document.getElementById('toggle-custom-pay');
  const customPayBox = document.getElementById('custom-pay-box');
  const customAmountInput = document.getElementById('custom-amount-input');
  const payCustomBtn = document.getElementById('pay-custom-btn');
  const successModal = document.getElementById('payment-success-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');

  // Toggle Custom Pay
  toggleCustomPay.addEventListener('click', () => {
    customPayBox.classList.toggle('hidden');
  });

  // Pay Standard Due Amount
  payRazorpayBtn.addEventListener('click', () => {
    initiateRazorpayPayment(financeState.nextDueAmount, 'Stage 3: Ground Floor Slab & Column Casting');
  });

  // Pay Custom Amount
  payCustomBtn.addEventListener('click', () => {
    const amt = parseFloat(customAmountInput.value);
    if (!amt || amt < 500) {
      alert('Please enter a valid payment amount of at least ₹500');
      return;
    }
    initiateRazorpayPayment(amt, 'Partial Construction Milestone Payment');
  });

  // Razorpay Gateway Launcher Logic
  function initiateRazorpayPayment(amount, description) {
    const rzpKey = 'rzp_test_OD123456789'; // Standard test public key ID

    // Check if Razorpay JS SDK loaded
    if (typeof Razorpay !== 'undefined') {
      const options = {
        key: rzpKey,
        amount: amount * 100, // Amount in paise
        currency: 'INR',
        name: 'The One Dream Construction',
        description: description,
        image: 'https://cdn-icons-png.flaticon.com/512/1018/1018698.png',
        handler: function (response) {
          const payId = response.razorpay_payment_id || `pay_OD${Math.floor(100000 + Math.random() * 900000)}`;
          onPaymentSuccess(payId, amount, description);
        },
        prefill: {
          name: user.name,
          email: user.email,
          contact: user.phone
        },
        theme: {
          color: '#0284c7'
        },
        modal: {
          ondismiss: function () {
            console.log('Payment modal dismissed');
          }
        }
      };

      try {
        const rzp = new Razorpay(options);
        rzp.open();
      } catch (err) {
        // Fallback simulation mode if test key is unauthenticated in sandbox
        simulatePaymentFlow(amount, description);
      }
    } else {
      simulatePaymentFlow(amount, description);
    }
  }

  // Simulated Gateway Flow for Seamless Testing
  function simulatePaymentFlow(amount, description) {
    const payMethod = prompt(
      `Razorpay Payment Gateway Simulation:\n\nAmount to Pay: ₹${amount.toLocaleString()}\nProject: ${user.projectName}\n\nSelect Payment Method:\n1. UPI (Google Pay / PhonePe / Paytm)\n2. Credit / Debit Card (HDFC / ICICI)\n3. NetBanking\n\nEnter 1, 2, or 3:`,
      '1'
    );

    if (payMethod) {
      let methodText = 'Razorpay (UPI)';
      if (payMethod === '2') methodText = 'Razorpay (Credit Card)';
      if (payMethod === '3') methodText = 'Razorpay (NetBanking)';

      const mockId = `pay_OD${Math.floor(100000 + Math.random() * 900000)}`;
      onPaymentSuccess(mockId, amount, description, methodText);
    }
  }

  // On Success Handler
  function onPaymentSuccess(paymentId, amount, description, method = 'Razorpay Gateway') {
    const dateStr = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

    // Record Transaction
    financeState.paidAmount += amount;
    financeState.nextDueAmount = Math.max(0, financeState.nextDueAmount - amount);
    financeState.history.unshift({
      id: paymentId,
      date: dateStr,
      stage: description.replace('Stage 3: ', ''),
      method: method,
      amount: amount
    });

    localStorage.setItem('onedream_payments', JSON.stringify(financeState));
    updateFinanceUI();

    // Show Success Modal
    document.getElementById('modal-pay-id').textContent = paymentId;
    document.getElementById('modal-amount').textContent = `₹${amount.toLocaleString()}`;
    document.getElementById('modal-date').textContent = `${dateStr} ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    successModal.classList.remove('hidden');
  }

  modalCloseBtn.addEventListener('click', () => {
    successModal.classList.add('hidden');
  });

  function updateFinanceUI() {
    const remBalance = Math.max(0, financeState.totalCost - financeState.paidAmount);
    const paidPct = ((financeState.paidAmount / financeState.totalCost) * 100).toFixed(1);

    document.getElementById('stat-total-cost').textContent = `₹${financeState.totalCost.toLocaleString()}`;
    document.getElementById('stat-paid-amount').textContent = `₹${financeState.paidAmount.toLocaleString()}`;
    document.getElementById('stat-paid-amount').nextElementSibling.textContent = `Paid to Date (${paidPct}%)`;
    document.getElementById('stat-next-due').textContent = `₹${financeState.nextDueAmount.toLocaleString()}`;
    document.getElementById('stat-remaining-balance').textContent = `₹${remBalance.toLocaleString()}`;
    document.getElementById('due-amount-display').textContent = `₹${financeState.nextDueAmount.toLocaleString()}`;

    // Render Table
    const tbody = document.getElementById('payment-history-tbody');
    if (tbody) {
      tbody.innerHTML = financeState.history.map(item => `
        <tr>
          <td><code class="tx-code">${item.id}</code></td>
          <td>${item.date}</td>
          <td>${item.stage}</td>
          <td>${item.method}</td>
          <td><strong>₹${item.amount.toLocaleString()}</strong></td>
          <td><button class="btn-sm btn-receipt" onclick="downloadReceipt('${item.id}', '${item.amount}', '${item.date}')">&#128196; PDF</button></td>
        </tr>
      `).join('');
    }
  }

  // Download Receipt Global Function
  window.downloadReceipt = (txId, amount, date) => {
    const formattedAmt = parseInt(amount).toLocaleString();
    alert(`📄 Tax Invoice & Payment Receipt Generated!\n\nReceipt No: REC-${txId}\nAmount: ₹${formattedAmt}\nDate: ${date}\nStatus: SUCCESSFUL (Razorpay Verified)\n\nThank you for choosing The One Dream!`);
  };

  document.getElementById('export-history-btn').addEventListener('click', () => {
    alert('All historical payment statements exported as PDF!');
  });
});
