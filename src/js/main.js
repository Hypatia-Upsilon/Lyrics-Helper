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
        tip_sync_tags: "将原词行的首尾 <> 时间戳复制到同时间的翻译（注音）行。",
        tools_remove_lines: "移除同时间轴行 (自动检测)",
        opt_rm_keep1: "仅保留 第 1 行 (移除所有附行)",
        opt_rm_n: "移除 第 {n} 行",
        opt_rm_none: "未检测到重复行",
        btn_remove: "移除",
        clean_opt_trans: "清理标签：翻译/附行",
        clean_opt_orig: "清理标签：原词/首行",
        clean_opt_all: "清理标签：所有行",
        btn_execute_clean: "移除 <...> 标签",
        btn_copy: "复制结果",
        output_label: "处理结果",
        msg_empty: "内容为空",
        msg_input_req: "请输入歌词内容",
        msg_offset: "已偏移",
        msg_cleaned: "已清理标签",
        msg_lines_removed: "已移除多余行",
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
        input_placeholder: "Paste LRC/ELRC content here...\nSupports[01:30.00] or <01:30.500>",
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
        tip_sync_tags: "Copy start/end <> tags from original line to duplicate-time translation lines.",
        tools_remove_lines: "Remove Duplicate Lines (Auto Detect)",
        opt_rm_keep1: "Keep ONLY 1st line",
        opt_rm_n: "Remove {n} line",
        opt_rm_none: "No duplicate lines detected",
        btn_remove: "Remove",
        clean_opt_trans: "Clean Tag: Translation",
        clean_opt_orig: "Clean Tag: Original",
        clean_opt_all: "Clean Tag: All Lines",
        btn_execute_clean: "Remove <...> Tags",
        btn_copy: "Copy Result",
        output_label: "Result",
        msg_empty: "No content",
        msg_input_req: "Please input lyrics",
        msg_offset: "Offset applied",
        msg_cleaned: "Tags removed",
        msg_lines_removed: "Duplicate lines removed",
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
        tip_scope_all: "Mode : Ajuster TOUT[ ] & < >",
        tip_scope_word: "Mode : Ajuster SEULEMENT < > (garder début de ligne)",
        precise_title: "Décalage Précis (ms)",
        btn_apply: "Appliquer",
        quick_title: "Réglage Rapide",
        btn_update: "Déf.",
        tools_title: "Outils Avancés",
        btn_sync_tags: "Synchro Tags Trad.",
        tip_sync_tags: "Copie les tags début/fin <> vers la ligne de traduction.",
        tools_remove_lines: "Supprimer Lignes Dupliquées",
        opt_rm_keep1: "Garder SEULEMENT 1ère",
        opt_rm_n: "Supprimer la {n} ligne",
        opt_rm_none: "Aucune ligne dupliquée",
        btn_remove: "Supprimer",
        clean_opt_trans: "Cible : Traduction",
        clean_opt_orig: "Cible : Original",
        clean_opt_all: "Cible : Tout",
        btn_execute_clean: "Supprimer Tags <...>",
        btn_copy: "Copier le résultat",
        output_label: "Résultat",
        msg_empty: "Contenu vide",
        msg_input_req: "Veuillez entrer des paroles",
        msg_offset: "Décalage appliqué",
        msg_cleaned: "Tags supprimés",
        msg_lines_removed: "Lignes supprimées",
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
let historyStack =[];
let accumulatedOffset = 0; 

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
    updateRemoveLineOptions(); // 初始化时自动扫描一次
});

function attachEventListeners() {
    document.getElementById('undoBtn').addEventListener('click', undo);
    document.getElementById('clearBtn').addEventListener('click', clearInput);
    document.getElementById('onlyWordTagsSwitch').addEventListener('change', toggleModeTip);
    document.getElementById('applyOffsetBtn').addEventListener('click', applyPreciseOffset);
    document.getElementById('updateBtnsBtn').addEventListener('click', renderQuickButtons);
    
    // Advanced Tools
    document.getElementById('syncTransTagsBtn').addEventListener('click', syncTranslationTags);
    document.getElementById('executeRemoveLineBtn').addEventListener('click', executeRemoveDuplicateLines);
    document.getElementById('executeCleanBtn').addEventListener('click', executeRemoveTags);
    document.getElementById('copyResultBtn').addEventListener('click', copyOutput);
    
    // 监听输入，实时重置偏移量并动态更新重复行选项
    document.getElementById('inputText').addEventListener('input', function() {
        if (accumulatedOffset !== 0) {
            accumulatedOffset = 0;
            updateOffsetUI();
        }
        updateRemoveLineOptions();
    });
    
    document.getElementById('inputText').addEventListener('change', saveState);
}

// --- Undo System ---
function saveState() {
    const currentVal = document.getElementById('inputText').value;
    if (historyStack.length > 0 && historyStack[historyStack.length - 1].text === currentVal) return;
    
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
    
    setInputValue(prevState.text);
    
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

// --- 辅助：统一修改文本框值的函数，自动触发UI刷新 ---
function setInputValue(newText) {
    document.getElementById('inputText').value = newText;
    document.getElementById('outputText').value = newText;
    updateRemoveLineOptions(); // 文本改变后重新扫描同时间轴行数
}

// --- UI Helper: Update Multiple Offset Badges ---
function updateOffsetUI() {
    const badges = document.querySelectorAll('.offset-badge');
    
    badges.forEach(badge => {
        if (accumulatedOffset === 0) {
            badge.textContent = "0ms";
            badge.className = "offset-badge badge badge-neutral";
        } else if (accumulatedOffset > 0) {
            badge.textContent = `+${accumulatedOffset}ms`;
            badge.className = "offset-badge badge badge-positive";
        } else {
            badge.textContent = `${accumulatedOffset}ms`;
            badge.className = "offset-badge badge badge-negative";
        }
    });
}

// --- Core Logic: 动态生成“移除同时间轴行”选项 ---
function formatOrdinal(n, lang) {
    if (lang === 'zh-CN') return n.toString(); 
    if (lang === 'fr') return n === 1 ? '1ère' : `${n}ème`;
    // English rules
    let j = n % 10, k = n % 100;
    if (j == 1 && k != 11) return n + "st";
    if (j == 2 && k != 12) return n + "nd";
    if (j == 3 && k != 13) return n + "rd";
    return n + "th";
}

function updateRemoveLineOptions() {
    const text = document.getElementById('inputText').value;
    const lines = text.split('\n');
    let maxGroupSize = 0;
    let currentGroupSize = 0;
    let lastTimestamp = null;

    // 扫描找出最大重复次数
    for (let line of lines) {
        const match = line.match(lineStartRegex);
        if (match) {
            const ts = match[1];
            if (ts === lastTimestamp) {
                currentGroupSize++;
                if (currentGroupSize > maxGroupSize) maxGroupSize = currentGroupSize;
            } else {
                lastTimestamp = ts;
                currentGroupSize = 1;
                if (maxGroupSize === 0) maxGroupSize = 1; 
            }
        }
    }

    const select = document.getElementById('removeLineSelect');
    const btn = document.getElementById('executeRemoveLineBtn');
    
    // 保存当前选中的值，以便刷新后恢复
    const previousSelection = select.value;
    select.innerHTML = '';

    // 如果没有重复行
    if (maxGroupSize < 2) {
        const opt = document.createElement('option');
        opt.value = 'none';
        opt.textContent = t('opt_rm_none');
        select.appendChild(opt);
        select.disabled = true;
        btn.disabled = true;
        return;
    }

    select.disabled = false;
    btn.disabled = false;

    // 添加 "仅保留第一行" 选项
    const optKeep = document.createElement('option');
    optKeep.value = 'keep1';
    optKeep.textContent = t('opt_rm_keep1');
    select.appendChild(optKeep);

    // 动态添加第2行到第n行
    const textTemplate = t('opt_rm_n');
    for (let i = 2; i <= maxGroupSize; i++) {
        const opt = document.createElement('option');
        opt.value = i.toString();
        const ordinalStr = formatOrdinal(i, currentLang);
        opt.textContent = textTemplate.replace('{n}', ordinalStr);
        select.appendChild(opt);
    }
    
    // 如果之前的选项还在新生成的列表里，就恢复选中
    if (Array.from(select.options).some(opt => opt.value === previousSelection)) {
        select.value = previousSelection;
    }
}

// --- Core Logic: Remove Duplicate Lines ---
function executeRemoveDuplicateLines() {
    const text = document.getElementById('inputText').value;
    if (!text.trim()) { showToast(t('msg_empty')); return; }

    saveState();

    const targetOption = document.getElementById('removeLineSelect').value;
    if (targetOption === 'none') return;

    const lines = text.split('\n');
    let lastTimestamp = null;
    let groupIndex = 0;
    
    const processedLines =[];

    for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const match = line.match(lineStartRegex);

        if (!match) {
            // 保留没有时间戳的行（如元数据、空行）
            processedLines.push(line);
            continue;
        }

        const currentTimestamp = match[1];

        if (currentTimestamp === lastTimestamp) {
            groupIndex++;
        } else {
            lastTimestamp = currentTimestamp;
            groupIndex = 1;
        }

        let shouldRemove = false;
        
        if (targetOption === 'keep1') {
            if (groupIndex > 1) shouldRemove = true;
        } else {
            const targetIndex = parseInt(targetOption);
            if (groupIndex === targetIndex) {
                shouldRemove = true;
            }
        }

        if (!shouldRemove) {
            processedLines.push(line);
        }
    }

    setInputValue(processedLines.join('\n'));
    showToast(t('msg_lines_removed'));
}

// --- Core Logic: Sync Translation Tags ---
function syncTranslationTags() {
    const text = document.getElementById('inputText').value;
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
            if (currentFirstTag && currentLastTag) {
                const cleanContent = content.trim();
                if (cleanContent.startsWith(currentFirstTag) && cleanContent.endsWith(currentLastTag)) {
                    return line;
                }
                return `${fullTimestampTag}${currentFirstTag}${content}${currentLastTag}`;
            }
            return line;
        }
    });

    setInputValue(processedLines.join('\n'));
    showToast(t('msg_tags_synced'));
}

// --- Core Logic: Cleaning ---
function executeRemoveTags() {
    const text = document.getElementById('inputText').value;
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

    setInputValue(processedLines.join('\n'));
    showToast(t('msg_cleaned'));
}

// --- Core Logic: Time Offset ---
function processLyrics(offsetMs) {
    const text = document.getElementById('inputText').value;
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

    setInputValue(newText);
    
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
    values =[...new Set(values)].sort((a, b) => a - b);
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
    setInputValue('');
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
    updateRemoveLineOptions(); // 语言改变时刷新选项文本
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