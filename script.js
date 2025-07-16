const group1 = document.getElementById("group1");
const group2 = document.getElementById("group2");
const group3 = document.getElementById("group3");
const generateBtn = document.getElementById("generateBtn");
const outputBox = document.getElementById("outputBox");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

function combine(groups) {
  if (groups.length === 0) return [];
  return groups.reduce((acc, curr) => {
    let res = [];
    acc.forEach(a => {
      curr.forEach(b => {
        res.push(`${a} ${b}`);
      });
    });
    return res;
  });
}

generateBtn.addEventListener("click", () => {
  const g1 = group1.value.split(",").map(x => x.trim()).filter(Boolean);
  const g2 = group2.value.split(",").map(x => x.trim()).filter(Boolean);
  const g3 = group3.value.split(",").map(x => x.trim()).filter(Boolean);

  let result = [];

  if (g1.length && g2.length && g3.length) {
    result = combine([g1, g2, g3]);
  } else if (g1.length && g2.length) {
    result = combine([g1, g2]);
  } else {
    alert("En az 2 kelime grubu girilmelidir.");
    return;
  }

  outputBox.textContent = result.join("\n");
  outputBox.style.display = "block";
  copyBtn.style.display = "inline-block";
  downloadBtn.style.display = "inline-block";
});

// Kopyalama
copyBtn.addEventListener("click", () => {
  navigator.clipboard.writeText(outputBox.textContent).then(() => {
    copyBtn.textContent = "Kopyalandı!";
    setTimeout(() => copyBtn.textContent = "Kopyala", 1500);
  });
});

// İndirme
downloadBtn.addEventListener("click", () => {
  const blob = new Blob([outputBox.textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "kombinasyonlar.txt";
  a.click();
  URL.revokeObjectURL(url);
});
