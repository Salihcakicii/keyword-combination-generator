const languageSelect = document.getElementById("languageSelect");
const keywordsInput = document.getElementById("keywordsInput");
const maxComboLengthInput = document.getElementById("maxComboLength");
const blacklistInput = document.getElementById("blacklistInput");
const generateBtn = document.getElementById("generateBtn");
const resultOutput = document.getElementById("resultOutput");
const resultCount = document.getElementById("resultCount");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");
const saveBtn = document.getElementById("saveBtn");
const loadBtn = document.getElementById("loadBtn");

// Dil metinleri
const texts = {
  tr: {
    placeholderKeywords: "örnek: araba, motor, bisiklet",
    placeholderBlacklist: "örnek: kötü, yasaklı",
    generateBtn: "Kombinasyonları Üret",
    copied: "Kopyalandı!",
    copyFail: "Kopyalama başarısız!",
    downloadName: "keyword_combinations.csv",
    saveSuccess: "Veriler kaydedildi.",
    loadSuccess: "Veriler yüklendi.",
    noKeywords: "Lütfen anahtar kelime girin.",
    maxComboError: "Max kombinasyon uzunluğu 1 ile 5 arasında olmalı.",
  },
  en: {
    placeholderKeywords: "e.g., car, motor, bicycle",
    placeholderBlacklist: "e.g., bad, forbidden",
    generateBtn: "Generate Combinations",
    copied: "Copied!",
    copyFail: "Copy failed!",
    downloadName: "keyword_combinations.csv",
    saveSuccess: "Data saved.",
    loadSuccess: "Data loaded.",
    noKeywords: "Please enter keywords.",
    maxComboError: "Max combination length must be between 1 and 5.",
  },
};

function updateLanguage() {
  const lang = languageSelect.value;
  keywordsInput.placeholder = texts[lang].placeholderKeywords;
  blacklistInput.placeholder = texts[lang].placeholderBlacklist;
  generateBtn.textContent = texts[lang].generateBtn;
}
languageSelect.addEventListener("change", updateLanguage);
updateLanguage();

// Yardımcı: virgül, yeni satır, noktalama ile ayırma ve temizleme
function splitAndClean(text) {
  return text
    .toLowerCase()
    .split(/[\n,.;:-]+/)
    .map(s => s.trim())
    .filter(s => s.length > 0);
}

// Kombinasyon üretici - permütasyon (sıralama önemli)
function permute(arr, length) {
  if (length === 1) return arr.map(v => [v]);
  let combos = [];
  arr.forEach((current, index) => {
    let remaining = [...arr];
    remaining.splice(index, 1);
    let smallerCombos = permute(remaining, length - 1);
    smallerCombos.forEach(smallerCombo => {
      combos.push([current, ...smallerCombo]);
    });
  });
  return combos;
}

// Ana fonksiyon - kombinasyonları üret
function generateCombinations(words, maxLength, blacklist) {
  let results = [];
  const blacklistSet = new Set(blacklist);

  for (let len = 1; len <= maxLength; len++) {
    let combos = permute(words, len);
    combos.forEach(combo => {
      // Aynı kelime tekrarını engelle
      let uniqueWords = new Set(combo);
      if (uniqueWords.size !== combo.length) return;

      // Blacklist filtresi
      if (combo.some(word => blacklistSet.has(word))) return;

      results.push(combo.join(" "));
    });
  }

  return results;
}

// Event: üretme butonu
generateBtn.addEventListener("click", () => {
  const lang = languageSelect.value;
  let keywords = splitAndClean(keywordsInput.value);
  let blacklist = splitAndClean(blacklistInput.value);
  let maxLength = parseInt(maxComboLengthInput.value);

  if (!keywords.length) {
    alert(texts[lang].noKeywords);
    return;
  }
  if (isNaN(maxLength) || maxLength < 1 || maxLength > 5) {
    alert(texts[lang].maxComboError);
    return;
  }

  generateBtn.disabled = true;
  generateBtn.textContent = lang === "tr" ? "Üretiliyor..." : "Generating...";

  setTimeout(() => {
    let combos = generateCombinations(keywords, maxLength, blacklist);

    resultCount.textContent = combos.length;
    resultOutput.value = combos.join("\n");

    generateBtn.disabled = false;
    generateBtn.textContent = texts[lang].generateBtn;
  }, 50);
});

// Kopyala butonu
copyBtn.addEventListener("click", () => {
  const lang = languageSelect.value;
  navigator.clipboard.writeText(resultOutput.value).then(() => {
    alert(texts[lang].copied);
  }).catch(() => {
    alert(texts[lang].copyFail);
  });
});

// CSV indir
downloadBtn.addEventListener("click", () => {
  const lang = languageSelect.value;
  const lines = resultOutput.value.split("\n");
  const csvContent = lines.map(line => `"${line.replace(/"/g, '""')}"`).join("\n");

  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = texts[lang].downloadName;
  a.click();

  URL.revokeObjectURL(url);
});

// Kaydet
saveBtn.addEventListener("click", () => {
  const data = {
    language: languageSelect.value,
    keywords: keywordsInput.value,
    maxComboLength: maxComboLengthInput.value,
    blacklist: blacklistInput.value,
    result: resultOutput.value,
  };
  localStorage.setItem("keywordComboData", JSON.stringify(data));
  alert(texts[languageSelect.value].saveSuccess);
});

// Yükle
loadBtn.addEventListener("click", () => {
  const data = JSON.parse(localStorage.getItem("keywordComboData"));
  if (!data) return;

  languageSelect.value = data.language || "tr";
  keywordsInput.value = data.keywords || "";
  maxComboLengthInput.value = data.maxComboLength || "2";
  blacklistInput.value = data.blacklist || "";
  resultOutput.value = data.result || "";

  updateLanguage();
  resultCount.textContent = resultOutput.value ? resultOutput.value.split("\n").length : 0;
  alert(texts[languageSelect.value].loadSuccess);
});
