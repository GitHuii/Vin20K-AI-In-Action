// --- APPLICATION STATE & CONSTANTS ---
const CATEGORIES = {
    EATING: { id: 'EATING', name: 'Ăn uống', class: 'eat', color: 'var(--cat-eating)' },
    SHOPPING: { id: 'SHOPPING', name: 'Mua sắm', class: 'shop', color: 'var(--cat-shopping)' },
    STUDYING: { id: 'STUDYING', name: 'Học tập', class: 'study', color: 'var(--cat-studying)' },
    TRANSFER: { id: 'TRANSFER', name: 'Chuyển tiền', class: 'trans', color: 'var(--cat-transfer)' },
    OTHER: { id: 'OTHER', name: 'Khác', class: 'oth', color: 'var(--cat-other)' }
};

// Default transaction rules (Global Classifier)
const KEYWORDS = {
    EATING: ['bún', 'phở', 'cơm', 'trà sữa', 'cafe', 'highlands', 'ăn', 'uống', 'bánh', 'lẩu', 'nướng', 'food', 'nhậu', 'trưa', 'sáng', 'tối'],
    SHOPPING: ['áo', 'quần', 'giày', 'son', 'mỹ phẩm', 'mua', 'shop', 'shopee', 'tiki', 'lazada', 'quà', 'tặng'],
    STUDYING: ['sách', 'vở', 'bút', 'khóa học', 'học phí', 'udemy', 'coursera', 'học', 'python', 'toán', 'tiếng anh', 'lớp']
};

// Initial sample transactions (if localStorage is empty)
const DEFAULT_TRANSACTIONS = [
    {
        id: 'tx-init-1',
        recipient: 'Highlands Coffee Cầu Giấy',
        amount: 85000,
        message: 'Thanh toán hóa đơn Highlands',
        category: 'EATING',
        time: 'Hôm nay, 08:30',
        learned: false
    },
    {
        id: 'tx-init-2',
        recipient: 'Trần Thị Mai',
        amount: 150000,
        message: 'mua hộ tớ cái áo thun trắng',
        category: 'SHOPPING',
        time: 'Hôm qua, 18:45',
        learned: false
    },
    {
        id: 'tx-init-3',
        recipient: 'Lê Văn Hoàng',
        amount: 200000,
        message: 'tiền lẩu thái hôm thứ 7 chia đều',
        category: 'EATING',
        time: '09/07/2026, 12:15',
        learned: false
    }
];

let state = {
    transactions: [],
    rules: [],
    activeTab: 'home',
    activeDropdownTxId: null,
    pendingTransfer: null, // Stores P2P transfer details while waiting for low-confidence confirmation
    geminiApiKey: '' // Stores Gemini API Key for real LLM calls
};

// --- HELPER FUNCTIONS ---
function formatCurrency(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "đ";
}

function updateTime() {
    const now = new Date();
    const timeStr = now.toTimeString().substring(0, 5);
    document.getElementById('current-time').innerText = timeStr;
}

function addLog(type, text) {
    const terminal = document.getElementById('ai-logs-terminal');
    if (!terminal) return;
    const logLine = document.createElement('div');
    logLine.className = `log-line ${type}-log`;
    
    const now = new Date();
    const timeStamp = `[${now.toTimeString().substring(0, 8)}]`;
    logLine.innerText = `${timeStamp} ${text}`;
    
    terminal.appendChild(logLine);
    terminal.scrollTop = terminal.scrollHeight;
}

// --- CALL GEMINI API ---
async function callGeminiAPI(prompt, systemInstruction = "") {
    const key = state.geminiApiKey || localStorage.getItem('moni_gemini_key') || '';
    if (!key) {
        throw new Error("Không tìm thấy Gemini API Key.");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.1-flash-lite:generateContent?key=${key}`;
    
    const requestBody = {
        contents: [{
            parts: [{ text: prompt }]
        }]
    };
    
    if (systemInstruction) {
        requestBody.systemInstruction = {
            parts: [{ text: systemInstruction }]
        };
    }

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error?.message || "Lỗi gọi Gemini API.");
    }

    const data = await response.json();
    const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    return textResponse.trim();
}

function updateApiStatusUI() {
    const key = state.geminiApiKey || localStorage.getItem('moni_gemini_key') || '';
    const badge = document.getElementById('api-status-badge');
    if (!badge) return;

    if (key) {
        badge.style.color = '#10b981';
        badge.innerHTML = `<span class="dot pulse" style="background-color: #10b981; width: 8px; height: 8px; border-radius: 50%;"></span> Gemini API Thật (Đã kết nối)`;
    } else {
        badge.style.color = 'var(--text-muted)';
        badge.innerHTML = `<span class="dot" style="background-color: var(--text-muted); width: 8px; height: 8px; border-radius: 50%;"></span> AI Cục bộ (Regex Fallback)`;
    }
}

// --- CORE AI CLASSIFIER LOGIC ---
async function classifyTransaction(message, recipient) {
    addLog('system', `Bắt đầu phân tích: "${message}" gửi cho "${recipient}"...`);
    const cleanMsg = message.toLowerCase().trim();

    // STEP 1: Check Personalized Feedback Rules
    for (const rule of state.rules) {
        const recipientMatch = rule.recipient.toLowerCase().trim() === recipient.toLowerCase().trim();
        const keywordMatch = cleanMsg.includes(rule.keyword.toLowerCase().trim());
        
        if (recipientMatch && keywordMatch) {
            addLog('success', `⚡ Khớp quy tắc đã học! [${rule.recipient}] + ["${rule.keyword}"] -> Phân loại: ${CATEGORIES[rule.category].name}`);
            return {
                category: rule.category,
                confidence: 100,
                reason: `Khớp quy tắc cá nhân hóa được sửa bởi người dùng vào ngày học trước.`,
                learned: true
            };
        }
    }

    // STEP 2: Call Real Gemini API if Key is Available
    if (state.geminiApiKey) {
        try {
            addLog('system', `📡 Đang gửi yêu cầu phân loại đến Gemini API thật...`);
            
            const systemPrompt = `Bạn là API phân loại danh mục chi tiêu cho ví điện tử MoMo. Hãy phân tích tin nhắn chuyển khoản P2P và người nhận để trả về danh mục chi tiêu thích hợp.
Các danh mục có sẵn:
- EATING: Ăn uống (cơm, bún, phở, cafe, ăn trưa, trà sữa, lẩu, liên hoan...)
- SHOPPING: Mua sắm (quần áo, giày dép, điện thoại, mỹ phẩm, shopee, tiki...)
- STUDYING: Học tập (sách vở, khóa học, học phí, bút, lớp học...)
- TRANSFER: Chuyển tiền (chuyển tiền đơn thuần, trả nợ, gửi tiền cho bạn bè không rõ mục đích chi tiêu hoặc các câu mơ hồ như 'chuyển khoản', 'gửi bạn', 'đây nha')

Bạn PHẢI trả về kết quả ở định dạng JSON thô duy nhất, không dùng block code markdown. Ví dụ:
{"category": "EATING", "confidence": 95, "reason": "Có chứa từ khóa bánh mì và trà sữa biểu thị ăn uống."}`;

            const userPrompt = `Tin nhắn: "${message}"\nNgười nhận: "${recipient}"`;
            
            const responseText = await callGeminiAPI(userPrompt, systemPrompt);
            
            // Clean markdown block code if LLM returns it
            let cleanJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
            const result = JSON.parse(cleanJson);
            
            if (result.category && CATEGORIES[result.category]) {
                addLog('success', `🎯 Gemini API thật phản hồi: ${CATEGORIES[result.category].name} (Confidence: ${result.confidence}%). Lý do: ${result.reason}`);
                return {
                    category: result.category,
                    confidence: result.confidence,
                    reason: result.reason,
                    learned: false
                };
            }
        } catch (err) {
            addLog('error', `❌ Lỗi Gemini API: ${err.message}. Kích hoạt chế độ AI Cục bộ (Fallback).`);
        }
    }

    // STEP 3: Fallback to Global Rule-based Keyword Classifier
    let scores = { EATING: 0, SHOPPING: 0, STUDYING: 0 };
    
    // Đếm số từ khóa khớp cho từng danh mục
    for (const word of KEYWORDS.EATING) {
        if (cleanMsg.includes(word)) scores.EATING++;
    }
    for (const word of KEYWORDS.SHOPPING) {
        if (cleanMsg.includes(word)) scores.SHOPPING++;
    }
    for (const word of KEYWORDS.STUDYING) {
        if (cleanMsg.includes(word)) scores.STUDYING++;
    }

    // Phân tích kết quả đếm điểm
    const maxScore = Math.max(scores.EATING, scores.SHOPPING, scores.STUDYING);
    
    if (maxScore === 0) {
        addLog('warning', `⚠️ Không tìm thấy từ khóa đặc trưng. Phân loại mặc định: Chuyển tiền (Confidence: 40%).`);
        return {
            category: 'TRANSFER',
            confidence: 40,
            reason: `Không khớp từ khóa đặc trưng nào của Ăn uống, Mua sắm hay Học tập.`,
            learned: false
        };
    }

    // Tìm danh mục có điểm cao nhất
    let candidates = [];
    if (scores.EATING === maxScore) candidates.push('EATING');
    if (scores.SHOPPING === maxScore) candidates.push('SHOPPING');
    if (scores.STUDYING === maxScore) candidates.push('STUDYING');

    if (candidates.length > 1) {
        // Tranh chấp từ khóa
        addLog('warning', `⚠️ Xảy ra tranh chấp từ khóa giữa các danh mục: [${candidates.map(c => CATEGORIES[c].name).join(', ')}]. Confidence: 55%.`);
        return {
            category: 'TRANSFER', // fallback về transfer
            confidence: 55,
            reason: `Tranh chấp từ khóa giữa các danh mục chi tiêu.`,
            learned: false
        };
    }

    // Duy nhất một danh mục điểm cao nhất
    const winningCategory = candidates[0];
    let confidence = 90; // Default high confidence for single match
    
    // Giảm độ tự tin nếu lời nhắn quá ngắn
    if (cleanMsg.length < 8) {
        confidence = 65;
        addLog('warning', `⚠️ Tin nhắn quá ngắn. Hạ độ tự tin xuống 65% cho danh mục: ${CATEGORIES[winningCategory].name}`);
    } else {
        addLog('success', `🎯 Phân loại thành công: ${CATEGORIES[winningCategory].name} (Confidence: ${confidence}%).`);
    }

    return {
        category: winningCategory,
        confidence: confidence,
        reason: `Khớp từ khóa hệ thống của danh mục ${CATEGORIES[winningCategory].name}.`,
        learned: false
    };
}

// --- DATA PERSISTENCE (LOCAL STORAGE) ---
function loadData() {
    // Load API Key
    state.geminiApiKey = localStorage.getItem('moni_gemini_key') || '';

    // Load transactions
    const storedTx = localStorage.getItem('moni_transactions');
    if (storedTx) {
        state.transactions = JSON.parse(storedTx);
    } else {
        state.transactions = [...DEFAULT_TRANSACTIONS];
        saveTransactions();
    }

    // Load rules
    const storedRules = localStorage.getItem('moni_rules');
    if (storedRules) {
        state.rules = JSON.parse(storedRules);
    } else {
        state.rules = [];
    }
}

function saveTransactions() {
    localStorage.setItem('moni_transactions', JSON.stringify(state.transactions));
}

function saveRules() {
    localStorage.setItem('moni_rules', JSON.stringify(state.rules));
}

// --- UI RENDERING ---
function renderAll() {
    renderTransactions();
    renderChart();
    renderRulesTable();
    updateApiStatusUI();
}

function renderTransactions() {
    const listContainer = document.getElementById('transaction-list');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (state.transactions.length === 0) {
        listContainer.innerHTML = '<div class="empty-rules" style="padding:40px 0;">Chưa có giao dịch nào được ghi nhận.</div>';
        return;
    }

    state.transactions.forEach(tx => {
        const item = document.createElement('div');
        item.className = 'transaction-item';
        item.dataset.txId = tx.id;

        const catInfo = CATEGORIES[tx.category] || CATEGORIES.TRANSFER;
        
        item.innerHTML = `
            <div class="tx-icon-details">
                <div class="tx-avatar"><i class="fa-solid fa-receipt"></i></div>
                <div class="tx-details">
                    <span class="tx-name">${tx.recipient}</span>
                    <span class="tx-message" title="${tx.message}">${tx.message || 'Không có lời nhắn'}</span>
                    <div class="tx-badge-wrapper">
                        <span class="tx-category-badge ${catInfo.class}" onclick="showCategorySelector(event, '${tx.id}')">
                            ${catInfo.name} <i class="fa-solid fa-chevron-down" style="font-size:7px;"></i>
                        </span>
                        ${tx.learned ? `<span class="tx-learned-badge">AI đã học</span>` : ''}
                    </div>
                </div>
            </div>
            <div class="tx-amount-section">
                <span class="tx-amount">-${formatCurrency(tx.amount)}</span>
                <div class="tx-time">${tx.time}</div>
            </div>
        `;
        
        listContainer.appendChild(item);
    });
}

function renderChart() {
    const chart = document.querySelector('.donut-chart-mock');
    const legendContainer = document.getElementById('chart-legend');
    if (!chart || !legendContainer) return;

    // Calculate sums
    let sums = { EATING: 0, SHOPPING: 0, STUDYING: 0, TRANSFER: 0, OTHER: 0 };
    let total = 0;

    state.transactions.forEach(tx => {
        if (sums[tx.category] !== undefined) {
            sums[tx.category] += tx.amount;
        } else {
            sums.OTHER += tx.amount;
        }
        total += tx.amount;
    });

    const totalSpentEl = document.getElementById('chart-total-spent');
    if (totalSpentEl) totalSpentEl.innerText = formatCurrency(total);

    if (total === 0) {
        chart.style.background = '#e2e8f0';
        legendContainer.innerHTML = '<div style="font-size:11px;color:var(--text-phone-muted);">Chưa có chi tiêu</div>';
        return;
    }

    const pEat = (sums.EATING / total) * 100;
    const pShop = (sums.SHOPPING / total) * 100;
    const pStudy = (sums.STUDYING / total) * 100;
    const pTrans = (sums.TRANSFER / total) * 100;
    
    const degEat = pEat;
    const degShop = degEat + pShop;
    const degStudy = degShop + pStudy;
    
    chart.style.background = `conic-gradient(
        var(--cat-eating) 0% ${degEat}%,
        var(--cat-shopping) ${degEat}% ${degShop}%,
        var(--cat-studying) ${degShop}% ${degStudy}%,
        var(--cat-transfer) ${degStudy}% 100%
    )`;

    legendContainer.innerHTML = '';

    const categoriesList = [
        { key: 'EATING', val: sums.EATING, color: 'var(--cat-eating)' },
        { key: 'SHOPPING', val: sums.SHOPPING, color: 'var(--cat-shopping)' },
        { key: 'STUDYING', val: sums.STUDYING, color: 'var(--cat-studying)' },
        { key: 'TRANSFER', val: sums.TRANSFER, color: 'var(--cat-transfer)' }
    ];

    categoriesList.forEach(item => {
        if (item.val > 0) {
            const percent = Math.round((item.val / total) * 100);
            const legendItem = document.createElement('div');
            legendItem.className = 'legend-item';
            legendItem.innerHTML = `
                <span class="legend-info">
                    <span class="legend-color" style="background-color: ${item.color}"></span>
                    ${CATEGORIES[item.key].name} (${percent}%)
                </span>
                <span class="legend-value">${formatCurrency(item.val)}</span>
            `;
            legendContainer.appendChild(legendItem);
        }
    });
}

function renderRulesTable() {
    const listBody = document.getElementById('feedback-rules-list');
    if (!listBody) return;
    listBody.innerHTML = '';

    if (state.rules.length === 0) {
        listBody.innerHTML = `
            <tr>
                <td colspan="4" class="empty-rules">Chưa có quy tắc cá nhân hóa nào được học. Thử sửa nhãn giao dịch sai để tạo quy tắc mới!</td>
            </tr>
        `;
        return;
    }

    state.rules.forEach((rule, idx) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><strong>${rule.recipient}</strong></td>
            <td><code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;color:#f472b6;">${rule.keyword}</code></td>
            <td><span class="tx-category-badge ${CATEGORIES[rule.category].class}">${CATEGORIES[rule.category].name}</span></td>
            <td>
                <button class="delete-rule-btn" onclick="deleteRule(${idx})">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </td>
        `;
        listBody.appendChild(tr);
    });
}

// --- INTERACTIVE ACTIONS & LOGIC ---

// Change Tabs
function switchTab(tabId) {
    state.activeTab = tabId;
    
    document.querySelectorAll('.tab-item').forEach(btn => {
        btn.classList.remove('active');
    });
    const activeBtn = document.getElementById(`tab-${tabId}`);
    if (activeBtn) activeBtn.classList.add('active');

    document.querySelectorAll('.screen').forEach(scr => {
        scr.classList.remove('active');
    });
    const activeScr = document.getElementById(`screen-${tabId}`);
    if (activeScr) activeScr.classList.add('active');

    const titleSpan = document.getElementById('screen-title');
    if (titleSpan) {
        if (tabId === 'home') {
            titleSpan.innerText = 'Ví MoMo';
            document.getElementById('back-to-home').style.visibility = 'hidden';
        } else if (tabId === 'transfer') {
            titleSpan.innerText = 'Chuyển tiền P2P';
            document.getElementById('back-to-home').style.visibility = 'visible';
        } else if (tabId === 'chatbot') {
            titleSpan.innerText = 'Trợ lý Moni AI';
            document.getElementById('back-to-home').style.visibility = 'visible';
        }
    }
}

// Show/Hide category selector dropdown in transaction history
function showCategorySelector(event, txId) {
    event.stopPropagation();
    state.activeDropdownTxId = txId;
    
    const dropdown = document.getElementById('category-selector-dropdown');
    if (!dropdown) return;
    dropdown.innerHTML = '';

    Object.keys(CATEGORIES).forEach(key => {
        const cat = CATEGORIES[key];
        const item = document.createElement('div');
        item.className = 'dropdown-item';
        item.innerHTML = `<span class="dot-indicator" style="background-color: ${cat.color}"></span> ${cat.name}`;
        item.onclick = () => selectNewCategory(txId, key);
        dropdown.appendChild(item);
    });

    const badgeRect = event.target.getBoundingClientRect();
    const screenRect = document.getElementById('screen-content').getBoundingClientRect();
    
    dropdown.style.left = `${badgeRect.left - screenRect.left + 5}px`;
    dropdown.style.top = `${badgeRect.bottom - screenRect.top + document.getElementById('screen-content').scrollTop + 5}px`;
    dropdown.classList.remove('hidden');
}

// Perform Sửa nhãn (Feedback Loop / Correction Path)
function selectNewCategory(txId, newCategoryKey) {
    const tx = state.transactions.find(t => t.id === txId);
    if (!tx) return;

    const oldCategory = tx.category;
    tx.category = newCategoryKey;
    tx.learned = true; // Mark as learned
    saveTransactions();
    
    addLog('success', `✏️ Người dùng sửa nhãn: "${tx.recipient}" từ [${CATEGORIES[oldCategory].name}] -> [${CATEGORIES[newCategoryKey].name}].`);
    
    // EXTRACT KEYWORD & CREATE A PERSONALIZED RULE (Feedback Loop)
    let extractedKeyword = tx.message.trim();
    const garbageWords = ['tiền', 'gửi', 'chuyển', 'mua', 'hộ', 'cho', 'khoản'];
    let words = extractedKeyword.toLowerCase().split(' ');
    while (words.length > 0 && garbageWords.includes(words[0])) {
        words.shift();
    }
    
    if (words.length > 0) {
        extractedKeyword = words.slice(0, 3).join(' '); // Lấy tối đa 3 từ quan trọng nhất
    }
    
    if (extractedKeyword.length < 2) {
        extractedKeyword = tx.message;
    }

    const existingRuleIdx = state.rules.findIndex(r => 
        r.recipient.toLowerCase() === tx.recipient.toLowerCase() && 
        r.keyword.toLowerCase() === extractedKeyword.toLowerCase()
    );

    if (existingRuleIdx !== -1) {
        state.rules[existingRuleIdx].category = newCategoryKey;
    } else {
        state.rules.push({
            recipient: tx.recipient,
            keyword: extractedKeyword,
            category: newCategoryKey
        });
    }
    
    saveRules();
    addLog('success', `🧠 Feedback Loop đã học luật mới: [${tx.recipient}] + ["${extractedKeyword}"] -> ${CATEGORIES[newCategoryKey].name}`);
    
    renderAll();
    showToast(`Đã lưu nhãn mới và đồng bộ cơ sở dữ liệu học tập.`);
}

function deleteRule(index) {
    const rule = state.rules[index];
    addLog('warning', `🗑️ Xóa quy tắc đã học: [${rule.recipient}] + ["${rule.keyword}"]`);
    state.rules.splice(index, 1);
    saveRules();
    renderAll();
}

// Show Toast Notification on Phone Screen
function showToast(text, undoAction = null) {
    const toast = document.getElementById('toast-notification');
    if (!toast) return;
    toast.innerHTML = `
        <div class="toast-body">
            <span class="toast-msg-text">${text}</span>
            ${undoAction ? `<span class="undo-btn" id="btn-toast-undo">Undo</span>` : ''}
        </div>
    `;
    
    toast.classList.add('show');
    
    if (undoAction) {
        const undoBtn = document.getElementById('btn-toast-undo');
        if (undoBtn) {
            undoBtn.onclick = () => {
                undoAction();
                toast.classList.remove('show');
            };
        }
    }

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// Execution of transfer transaction
function executeTransfer(recipient, amount, message, category, learned = false) {
    const now = new Date();
    const timeStr = `Hôm nay, ${now.toTimeString().substring(0, 5)}`;
    
    const newTx = {
        id: 'tx-' + Date.now(),
        recipient: recipient,
        amount: parseFloat(amount),
        message: message,
        category: category,
        time: timeStr,
        learned: learned
    };

    state.transactions.unshift(newTx);
    saveTransactions();
    renderAll();

    // Reset Form P2P
    const msgInput = document.getElementById('transfer-message');
    if (msgInput) msgInput.value = '';
    
    switchTab('home');
    
    showToast(`Chuyển ${formatCurrency(amount)} cho ${recipient} thành công. Gán nhãn: ${CATEGORIES[category].name}`, () => {
        state.transactions.shift();
        saveTransactions();
        addLog('warning', `↩️ Người dùng hoàn tác (Undo) giao dịch vừa thực hiện.`);
        renderAll();
    });
}

// Handle Low-Confidence Confirmation Popup
function showLowConfidenceModal(recipient, amount, message) {
    state.pendingTransfer = { recipient, amount, message };
    
    document.getElementById('modal-rec-name').innerText = recipient;
    document.getElementById('modal-msg-text').innerText = `"${message}"`;
    
    const chipsContainer = document.getElementById('modal-chips');
    if (!chipsContainer) return;
    chipsContainer.innerHTML = '';

    Object.keys(CATEGORIES).forEach(key => {
        if (key === 'TRANSFER') return;
        const btn = document.createElement('button');
        btn.className = 'chip-btn';
        btn.innerText = CATEGORIES[key].name;
        btn.onclick = () => {
            addLog('success', `✔️ Người dùng tự gán nhãn: [${CATEGORIES[key].name}] thông qua hộp thoại.`);
            executeTransfer(recipient, amount, message, key, false);
            document.getElementById('low-confidence-modal').classList.remove('show');
        };
        chipsContainer.appendChild(btn);
    });

    document.getElementById('low-confidence-modal').classList.add('show');
}

// --- CHATBOT AI MONI LOGIC ---
async function sendChatMessage(text) {
    if (!text.trim()) return;

    const chatContainer = document.getElementById('chat-messages');
    if (!chatContainer) return;
    
    // 1. User Message
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.innerText = text;
    chatContainer.appendChild(userMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // Clear input
    document.getElementById('chat-input').value = '';

    addLog('system', `Chatbot AI đang xử lý câu hỏi: "${text}"...`);

    // 2. Bot Message (Call API if available, else Fallback)
    const botMsg = document.createElement('div');
    botMsg.className = 'chat-msg bot';
    botMsg.innerHTML = '<span class="pulse" style="display:inline-block;width:15px;height:10px;background:#94a3b8;border-radius:10px;"></span> Đang suy nghĩ...';
    chatContainer.appendChild(botMsg);
    chatContainer.scrollTop = chatContainer.scrollHeight;

    if (state.geminiApiKey) {
        try {
            const systemPrompt = `Bạn là trợ thủ tài chính thông minh tên là Moni AI được tích hợp trên ví MoMo.
Đây là dữ liệu chi tiêu thực tế của người dùng: ${JSON.stringify(state.transactions)}.
Hãy trả lời câu hỏi của người dùng bằng tiếng Việt thân thiện, tự nhiên, ngắn gọn (dưới 80 từ). Sử dụng thông tin chi tiêu thực tế để phân tích số liệu chính xác. Dùng emoji phù hợp. Định dạng chữ in đậm bằng dấu sao double **.`;
            
            const reply = await callGeminiAPI(text, systemPrompt);
            
            botMsg.innerHTML = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
            chatContainer.scrollTop = chatContainer.scrollHeight;
            addLog('success', `🤖 Gemini API thật đã phản hồi câu hỏi chatbot.`);
            return;
        } catch (err) {
            addLog('error', `❌ Lỗi Chatbot API: ${err.message}. Fallback về chatbot local.`);
        }
    }

    // Fallback local chatbot (Simulate delay)
    setTimeout(() => {
        const cleanText = text.toLowerCase().trim();
        let reply = "";

        let sums = { EATING: 0, SHOPPING: 0, STUDYING: 0, TRANSFER: 0 };
        state.transactions.forEach(t => {
            if (sums[t.category] !== undefined) sums[t.category] += t.amount;
        });

        if (cleanText.includes('ăn') || cleanText.includes('uống') || cleanText.includes('eating')) {
            reply = `Tháng này bạn đã chi tiêu tổng cộng **${formatCurrency(sums.EATING)}** cho danh mục **Ăn uống** 🍜. (Bao gồm cả các giao dịch chuyển tiền ăn chung đã phân loại chính xác).`;
        } else if (cleanText.includes('mua sắm') || cleanText.includes('shopping') || cleanText.includes('mua')) {
            reply = `Tổng chi tiêu **Mua sắm** 🛍️ tháng này của bạn là **${formatCurrency(sums.SHOPPING)}**.`;
        } else if (cleanText.includes('học') || cleanText.includes('study')) {
            reply = `Bạn đã chi **${formatCurrency(sums.STUDYING)}** cho **Học tập** 📚 để nâng cấp bản thân.`;
        } else {
            const total = Object.values(sums).reduce((a, b) => a + b, 0);
            reply = `Chào bạn! Tôi là Moni AI. Tổng chi tiêu tháng này của bạn là **${formatCurrency(total)}**.\n\nHãy hỏi tôi chi tiết về các danh mục (ví dụ: "tiền ăn uống", "tiền học hành") để xem phân tích số liệu!`;
        }

        botMsg.innerHTML = reply.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
        chatContainer.scrollTop = chatContainer.scrollHeight;
        addLog('success', `🤖 Phản hồi Chatbot được gửi đi.`);
    }, 800);
}

// --- INTERACTIVE TESTING PANEL LOADER ---
function loadTestCases() {
    const container = document.getElementById('test-case-list-panel');
    if (!container) return;
    container.innerHTML = '';

    fetch('test_cases.json')
        .then(res => res.json())
        .then(data => {
            data.forEach(tc => {
                const item = document.createElement('div');
                item.className = 'test-case-item';
                item.onclick = () => runTestCase(tc);

                let badgeText = tc.type;
                if (tc.type === 'happy') badgeText = 'Happy Path';
                if (tc.type === 'low-confidence') badgeText = 'Low-Conf';
                if (tc.type === 'failure-recovery') badgeText = 'Failure';
                if (tc.type === 'correction-verification') badgeText = 'Correction';

                item.innerHTML = `
                    <div class="tc-header">
                        <span class="tc-id">${tc.id}</span>
                        <span class="tc-type-badge ${tc.type}">${badgeText}</span>
                    </div>
                    <div class="tc-message-text">"${tc.message}"</div>
                    <div class="tc-details-text">${tc.description}</div>
                `;
                container.appendChild(item);
            });
        })
        .catch(err => {
            console.error('Error loading test cases:', err);
            container.innerHTML = '<div class="empty-rules">Không thể tải test cases. Hãy chạy từ server cục bộ.</div>';
        });
}

function runTestCase(tc) {
    document.getElementById('transfer-recipient').value = "Nguyễn Văn Nam";
    document.getElementById('transfer-amount').value = "50000";
    document.getElementById('transfer-message').value = tc.message;
    switchTab('transfer');
    addLog('system', `🧪 Đã tải Test Case [${tc.id}] vào form chuyển khoản. Vui lòng bấm "Xác nhận chuyển khoản".`);
}

// --- INITIALIZATION & EVENT BINDINGS ---
document.addEventListener('DOMContentLoaded', () => {
    updateTime();
    setInterval(updateTime, 60000);

    loadData();
    renderAll();
    loadTestCases();

    // Tab bindings
    document.getElementById('tab-home').onclick = () => switchTab('home');
    document.getElementById('tab-transfer').onclick = () => switchTab('transfer');
    document.getElementById('tab-chatbot').onclick = () => switchTab('chatbot');
    document.getElementById('btn-go-transfer').onclick = () => switchTab('transfer');
    document.getElementById('btn-go-chatbot').onclick = () => switchTab('chatbot');
    document.getElementById('back-to-home').onclick = () => switchTab('home');

    // Click anywhere to hide dropdown
    document.addEventListener('click', () => {
        const dropdown = document.getElementById('category-selector-dropdown');
        if (dropdown) dropdown.classList.add('hidden');
    });

    // Reset transaction data
    document.getElementById('btn-reset-data').onclick = () => {
        if(confirm("Bạn có muốn reset toàn bộ dữ liệu giao dịch về mặc định không?")) {
            localStorage.removeItem('moni_transactions');
            localStorage.removeItem('moni_rules');
            loadData();
            renderAll();
            addLog('warning', '⚠️ Đã reset cơ sở dữ liệu và các quy tắc học tập.');
        }
    };

    // Bind API Configuration
    const apiKeyInput = document.getElementById('gemini-api-key');
    if (apiKeyInput) {
        apiKeyInput.value = state.geminiApiKey || '';
        updateApiStatusUI();

        document.getElementById('btn-save-key').onclick = () => {
            const val = apiKeyInput.value.trim();
            if (!val) {
                alert("Vui lòng nhập API Key.");
                return;
            }
            state.geminiApiKey = val;
            localStorage.setItem('moni_gemini_key', val);
            updateApiStatusUI();
            addLog('success', `🔑 Đã lưu Gemini API Key mới và kết nối hệ thống AI thật.`);
            showToast("Đã lưu API Key và kết nối Gemini AI.");
        };

        document.getElementById('btn-clear-key').onclick = () => {
            state.geminiApiKey = '';
            localStorage.removeItem('moni_gemini_key');
            apiKeyInput.value = '';
            updateApiStatusUI();
            addLog('warning', `🗑️ Đã xóa Gemini API Key. Hệ thống quay về chế độ AI Cục bộ.`);
            showToast("Đã xóa API Key.");
        };
    }

    // Submit P2P Transfer Button
    document.getElementById('btn-submit-transfer').onclick = async () => {
        const recipient = document.getElementById('transfer-recipient').value;
        const amount = document.getElementById('transfer-amount').value;
        const message = document.getElementById('transfer-message').value;

        if (!recipient || !amount) {
            alert('Vui lòng điền đầy đủ Người nhận và Số tiền.');
            return;
        }

        // Run AI Classification (Async/Await for API call)
        const result = await classifyTransaction(message, recipient);

        if (result.confidence >= 70) {
            executeTransfer(recipient, amount, message, result.category, result.learned);
        } else {
            addLog('warning', `⚠️ Độ tin cậy thấp (${result.confidence}%). Đang mở hộp thoại xác nhận...`);
            showLowConfidenceModal(recipient, amount, message);
        }
    };

    // Close Low-Confidence Modal
    document.getElementById('modal-btn-cancel').onclick = () => {
        if (state.pendingTransfer) {
            const { recipient, amount, message } = state.pendingTransfer;
            addLog('warning', `❌ Người dùng bỏ qua hộp thoại. Gán nhãn mặc định: Chuyển tiền.`);
            executeTransfer(recipient, amount, message, 'TRANSFER', false);
        }
        document.getElementById('low-confidence-modal').classList.remove('show');
    };

    // Clear Terminal Logs
    document.getElementById('btn-clear-logs').onclick = () => {
        document.getElementById('ai-logs-terminal').innerHTML = '<div class="log-line system-log">[Terminal Log Cleared]</div>';
    };

    // Send Chat Button
    document.getElementById('btn-send-chat').onclick = () => {
        const input = document.getElementById('chat-input');
        sendChatMessage(input.value);
    };

    document.getElementById('chat-input').onkeypress = (e) => {
        if (e.key === 'Enter') {
            sendChatMessage(e.target.value);
        }
    };

    // Suggestion Chat Buttons
    document.querySelectorAll('.chat-suggest-btn').forEach(btn => {
        btn.onclick = () => {
            sendChatMessage(btn.innerText);
        };
    });
});
