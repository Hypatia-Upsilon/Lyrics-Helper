/* --- I18n Configuration --- */
const translations = {
    'zh-CN': {
        app_title: "LRC 时间轴助手",
        input_label: "原始/当前歌词",
        btn_clear: "清空",
        input_placeholder: "请粘贴 LRC/ELRC 内容...\n例如：[01:30.00] 歌词 <01:30.500>",
        scope_title: "调节范围",
        scope_switch_label: "仅调节 <...> (字间)",
        tip_scope_all: "当前：调节所有时间 [ ] 和 < >",
        tip_scope_word: "当前：仅调节字间时间 < > (行首保持不变)",
        precise_title: "精确偏移 (ms)",
        btn_apply: "应用偏移",
        quick_title: "快捷微调",
        btn_update: "设定",
        tools_title: "高级工具",
        btn_sync_tags: "同步首尾时间戳到翻译行",
        tip_sync_tags: "将原词行的首尾 <> 时间戳复制到翻译行（注音）行。",
        clean_opt_trans: "目标：注音/翻译行 (重复时间)",
        clean_opt_orig: "目标：原词行 (首次时间)",
        clean_opt_all: "目标：所有行",
        btn_execute_clean: "移除 <...> 标签",
        btn_copy: "复制结果",
        output_label: "处理结果",
        msg_empty: "内容为空",
        msg_input_req: "请输入歌词内容",
        msg_offset: "已偏移",
        msg_cleaned: "已清理",
        msg_tags_synced: "已同步首尾时间戳",
        msg_copied: "已复制到剪贴板",
        msg_copy_fail: "复制失败，请手动复制",
        msg_cleared: "已清空",
        msg_invalid_num: "请输入有效数值",
        msg_undo: "已撤销"
    },
    'en': {
        app_title: "LRC Timestamp Helper",
        input_label: "Original/Current",
        btn_clear: "Clear",
        input_placeholder: "Paste LRC/ELRC content here...\nSupports [01:30.00] or <01:30.500>",
        scope_title: "Time Scope",
        scope_switch_label: "Only adjust <...> (Word tags)",
        tip_scope_all: "Mode: Adjust ALL timestamps [ ] & < >",
        tip_scope_word: "Mode: Adjust ONLY word tags < > (Keep line start)",
        precise_title: "Precise Offset (ms)",
        btn_apply: "Apply Offset",
        quick_title: "Quick Adjust",
        btn_update: "Set",
        tools_title: "Advanced Tools",
        btn_sync_tags: "Sync Tags to Translation",
        tip_sync_tags: "Copy start/end <> tags from original line to translation line.",
        clean_opt_trans: "Target: Translation (Duplicate Time)",
        clean_opt_orig: "Target: Original (First Time)",
        clean_opt_all: "Target: All Lines",
        btn_execute_clean: "Remove <...> Tags",
        btn_copy: "Copy Result",
        output_label: "Result",
        msg_empty: "No content",
        msg_input_req: "Please input lyrics",
        msg_offset: "Offset applied",
        msg_cleaned: "Tags removed",
        msg_tags_synced: "Tags synced to translation",
        msg_copied: "Copied to clipboard",
        msg_copy_fail: "Copy failed, please copy manually",
        msg_cleared: "Cleared",
        msg_invalid_num: "Invalid number",
        msg_undo: "Undone"
    },
    'fr': {
        app_title: "Assistant Temporel LRC",
        input_label: "Paroles",
        btn_clear: "Effacer",
        input_placeholder: "Collez le contenu LRC/ELRC ici...",
        scope_title: "Portée Temporelle",
        scope_switch_label: "Ajuster seulement <...> (tags mots)",
        tip_scope_all: "Mode : Ajuster TOUT [ ] & < >",
        tip_scope_word: "Mode : Ajuster SEULEMENT < > (garder début de ligne)",
        precise_title: "Décalage Précis (ms)",
        btn_apply: "Appliquer",
        quick_title: "Réglage Rapide",
        btn_update: "Déf.",
        tools_title: "Outils Avancés",
        btn_sync_tags: "Synchro Tags Trad.",
        tip_sync_tags: "Copie les tags début/fin <> vers la ligne de traduction.",
        clean_opt_trans: "Cible : Traduction (Temps dupliqué)",
        clean_opt_orig: "Cible : Original (Premier temps)",
        clean_opt_all: "Cible : Tout",
        btn_execute_clean: "Supprimer Tags <...>",
        btn_copy: "Copier le résultat",
        output_label: "Résultat",
        msg_empty: "Contenu vide",
        msg_input_req: "Veuillez entrer des paroles",
        msg_offset: "Décalage appliqué",
        msg_cleaned: "Tags supprimés",
        msg_tags_synced: "Tags synchronisés",
        msg_copied: "Copié",
        msg_copy_fail: "Échec de la copie",
        msg_cleared: "Effacé",
        msg_invalid_num: "Nombre invalide",
        msg_undo: "Annulé"
    }
};

let currentLang = 'zh-CN';
const MAX_HISTORY = 20;
let historyStack = [];
let accumulatedOffset = 0; // 累计偏移量

// --- Regex Definitions ---
const timeRegex = /([\[<])(\d{1,2}):(\d{1,2})(\.\d{1,3})([\]>])/g;
const wordTagRegex = /<\d{1,2}:\d{1,2}(\.\d{1,3})?>/g;
const lineStartRegex = /^\[(\d{1,2}:\d{1,2}(\.\d{1,3})?)\]/;
const exactTagRegex = /<\d{1,2}:\d{1,2}(\.\d{1,3})?>/g;

// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    initLanguage();
    renderQuickButtons();
    attachEventListeners();
    updateOffsetUI();
});

function attachEventListeners() {
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('clearBtn').addEventListener('click', clearInput);
    document.getElementById('onlyWordTagsSwitch').addEventListener('change', toggleModeTip);
    document.getElementById('applyOffsetBtn').addEventListener('click', applyPreciseOffset);
    document.getElementById('updateBtnsBtn').addEventListener('click', renderQuickButtons);
    
    // New Features
    document.getElementById('syncTransTagsBtn').addEventListener('click', syncTranslationTags);
    document.getElementById('executeCleanBtn').addEventListener('click', executeRemoveTags);
    document.getElementById('copyResultBtn').addEventListener('click', copyOutput);
    
    // 手动修改输入框时，重置偏移量计数
    document.getElementById('inputText').addEventListener('input', function() {
        if (accumulatedOffset !== 0) {
            accumulatedOffset = 0;
            updateOffsetUI();
        }
    });
    
    // 焦点离开或变更时保存状态
    document.getElementById('inputText').addEventListener('change', saveState);
}

// --- Undo System ---
function saveState() {
    const currentVal = document.getElementById('inputText').value;
    
    // 避免重复保存相同内容
    if (historyStack.length > 0 && historyStack[historyStack.length - 1].text === currentVal) return;
    
    // 保存文本和当时的偏移量
    historyStack.push({
        text: currentVal,
        offset: accumulatedOffset
    });
    
    if (historyStack.length > MAX_HISTORY) historyStack.shift();
    updateUndoBtn();
}

function undo() {
    if (historyStack.length === 0) return;
    const prevState = historyStack.pop();
    
    document.getElementById('inputText').value = prevState.text;
    document.getElementById('outputText').value = prevState.text;
    
    // 恢复偏移量
    accumulatedOffset = prevState.offset;
    updateOffsetUI();
    
    updateUndoBtn();
    showToast(t('msg_undo'));
}

function updateUndoBtn() {
    const btn = document.getElementById('undoBtn');
    if (historyStack.length > 0) btn.classList.remove('disabled');
    else btn.classList.add('disabled');
}

// --- UI Helper: Update Offset Badge ---
function updateOffsetUI() {
    const badge = document.getElementById('offsetBadge');
    
    if (accumulatedOffset === 0) {
        badge.textContent = "0ms";
        badge.className = "badge badge-neutral";
    } else if (accumulatedOffset > 0) {
        badge.textContent = `+${accumulatedOffset}ms`;
        badge.className = "badge badge-positive";
    } else {
        badge.textContent = `${accumulatedOffset}ms`;
        badge.className = "badge badge-negative";
    }
}

// --- Core Logic: Sync Translation Tags ---
function syncTranslationTags() {
    const input = document.getElementById('inputText');
    const text = input.value;
    if (!text.trim()) { showToast(t('msg_empty')); return; }

    saveState();

    const lines = text.split('\n');
    let lastTimestamp = null;
    let currentFirstTag = null;
    let currentLastTag = null;

    const processedLines = lines.map(line => {
        const match = line.match(lineStartRegex);
        if (!match) {
            lastTimestamp = null;
            return line;
        }

        const currentTimestamp = match[1];
        const fullTimestampTag = match[0]; 
        const content = line.substring(fullTimestampTag.length);

        if (currentTimestamp !== lastTimestamp) {
            // 原词行 (新时间戳)
            lastTimestamp = currentTimestamp;
            const tags = content.match(exactTagRegex);
            if (tags && tags.length > 0) {
                currentFirstTag = tags[0];
                currentLastTag = tags[tags.length - 1];
            } else {
                currentFirstTag = null;
                currentLastTag = null;
            }
            return line;
        } else {
            // 翻译行 (重复时间戳)
            if (currentFirstTag && currentLastTag) {
                const cleanContent = content.trim();
                // 避免重复添加
                if (cleanContent.startsWith(currentFirstTag) && cleanContent.endsWith(currentLastTag)) {
                    return line;
                }
                return `${fullTimestampTag}${currentFirstTag}${content}${currentLastTag}`;
            }
            return line;
        }
    });

    const newText = processedLines.join('\n');
    input.value = newText;
    document.getElementById('outputText').value = newText;
    showToast(t('msg_tags_synced'));
}

// --- Core Logic: Cleaning ---
function executeRemoveTags() {
    const input = document.getElementById('inputText');
    let text = input.value;
    if (!text.trim()) { showToast(t('msg_empty')); return; }

    saveState();

    const target = document.getElementById('cleanTargetSelect').value;
    const lines = text.split('\n');
    let lastTimestamp = "";
    
    const processedLines = lines.map(line => {
        const match = line.match(lineStartRegex);
        const currentTimestamp = match ? match[1] : null;
        
        let isFirstLine = true; 

        if (currentTimestamp) {
            if (currentTimestamp === lastTimestamp) {
                isFirstLine = false;
            } else {
                isFirstLine = true;
                lastTimestamp = currentTimestamp;
            }
        }

        let shouldClean = false;
        if (target === 'all') shouldClean = true;
        else if (target === 'original' && isFirstLine) shouldClean = true;
        else if (target === 'translation' && !isFirstLine && currentTimestamp) shouldClean = true;

        return shouldClean ? line.replace(wordTagRegex, '') : line;
    });

    const newText = processedLines.join('\n');
    input.value = newText;
    document.getElementById('outputText').value = newText;
    showToast(t('msg_cleaned'));
}

// --- Core Logic: Time Offset ---
function processLyrics(offsetMs) {
    const input = document.getElementById('inputText');
    const text = input.value;
    const onlyAdjustWordTags = document.getElementById('onlyWordTagsSwitch').checked;

    if (!text.trim()) { showToast(t('msg_input_req')); return; }

    saveState();

    let sourceText = text;
    const newText = sourceText.replace(timeRegex, (match, leftBr, min, sec, msPart, rightBr) => {
        if (onlyAdjustWordTags && leftBr === '[') {
            return match;
        }

        const minutes = parseInt(min, 10);
        const seconds = parseInt(sec, 10);
        
        let msStr = msPart.substring(1); 
        let msVal = 0;
        if (msStr.length === 2) msVal = parseInt(msStr) * 10;
        else if (msStr.length === 3) msVal = parseInt(msStr);
        else if (msStr.length === 1) msVal = parseInt(msStr) * 100;

        let currentTotalMs = minutes * 60 * 1000 + seconds * 1000 + msVal;
        let newTotalMs = currentTotalMs + offsetMs;
        if (newTotalMs < 0) newTotalMs = 0;

        const newMin = Math.floor(newTotalMs / 60000);
        const remainMs = newTotalMs % 60000;
        const newSec = Math.floor(remainMs / 1000);
        const newMs = remainMs % 1000;

        const sMin = newMin.toString().padStart(2, '0');
        const sSec = newSec.toString().padStart(2, '0');
        const sMsFull = newMs.toString().padStart(3, '0'); 
        
        let newMsPart = "";
        if (msStr.length === 3) {
            newMsPart = "." + sMsFull;
        } else {
            newMsPart = "." + sMsFull.substring(0, 2);
        }

        return `${leftBr}${sMin}:${sSec}${newMsPart}${rightBr}`;
    });

    input.value = newText; 
    document.getElementById('outputText').value = newText;
    
    // 更新累积偏移量
    accumulatedOffset += offsetMs;
    updateOffsetUI();
    
    const sign = offsetMs > 0 ? '+' : '';
    showToast(`${t('msg_offset')} ${sign}${offsetMs}ms`);
}

function applyPreciseOffset() {
    const val = parseInt(document.getElementById('preciseOffset').value);
    if (isNaN(val) || val === 0) { showToast(t('msg_invalid_num')); return; }
    processLyrics(val);
}

// --- UI & Helpers ---
function renderQuickButtons() {
    const container = document.getElementById('quickButtons');
    const configInput = document.getElementById('customBtnConfig').value;
    let values = configInput.split(/[,，]/).map(v => parseInt(v.trim())).filter(v => !isNaN(v) && v > 0);
    values = [...new Set(values)].sort((a, b) => a - b);
    container.innerHTML = '';
    
    if (values.length === 0) return;

    values.forEach(val => {
        const btnPrev = document.createElement('button');
        btnPrev.className = 'btn btn-tonal';
        btnPrev.textContent = `-${val}`;
        btnPrev.onclick = () => processLyrics(-val); 
        
        const btnNext = document.createElement('button');
        btnNext.className = 'btn btn-tonal';
        btnNext.textContent = `+${val}`;
        btnNext.onclick = () => processLyrics(val);
        
        container.appendChild(btnPrev);
        container.appendChild(btnNext);
    });
}

function toggleModeTip() {
    const isOnlyWord = document.getElementById('onlyWordTagsSwitch').checked;
    const tip = document.getElementById('modeTip');
    tip.textContent = isOnlyWord ? t('tip_scope_word') : t('tip_scope_all');
}

async function copyOutput() {
    const output = document.getElementById('outputText');
    if (!output.value) { showToast(t('msg_empty')); return; }
    
    if (navigator.clipboard && window.isSecureContext) {
        try {
            await navigator.clipboard.writeText(output.value);
            showToast(t('msg_copied'));
            return;
        } catch (err) { console.warn(err); }
    }

    try {
        output.select();
        document.execCommand('copy');
        output.blur(); 
        showToast(t('msg_copied'));
    } catch (err) {
        showToast(t('msg_copy_fail'));
    }
}

function clearInput() {
    saveState();
    document.getElementById('inputText').value = '';
    document.getElementById('outputText').value = '';
    accumulatedOffset = 0;
    updateOffsetUI();
    showToast(t('msg_cleared'));
}

function showToast(message) {
    const snackbar = document.getElementById("snackbar");
    snackbar.textContent = message;
    snackbar.className = "show";
    setTimeout(function(){ snackbar.className = snackbar.className.replace("show", ""); }, 2500);
}

// --- Language System ---
function initLanguage() {
    const savedLang = localStorage.getItem('lrc_helper_lang');
    const browserLang = navigator.language || navigator.userLanguage; 
    let detectedLang = 'zh-CN';
    if (browserLang.startsWith('en')) detectedLang = 'en';
    else if (browserLang.startsWith('fr')) detectedLang = 'fr';
    
    currentLang = savedLang || detectedLang;
    if (!translations[currentLang]) currentLang = 'zh-CN';

    document.getElementById('langSelector').value = currentLang;
    updateInterfaceText();
    toggleModeTip();
    
    document.getElementById('langSelector').addEventListener('change', function(e) {
        changeLanguage(e.target.value);
    });
}

function changeLanguage(langCode) {
    currentLang = langCode;
    localStorage.setItem('lrc_helper_lang', langCode);
    updateInterfaceText();
    toggleModeTip();
    renderQuickButtons();
}

function t(key) {
    return translations[currentLang][key] || key;
}

function updateInterfaceText() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[currentLang][key]) {
            el.textContent = translations[currentLang][key];
        }
    });
    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (translations[currentLang][key]) {
            el.placeholder = translations[currentLang][key];
        }
    });
}