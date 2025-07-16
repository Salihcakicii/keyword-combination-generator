function generateCombinations() {
  const g1 = document.getElementById("group1").value.split(",").map(w => w.trim()).filter(Boolean);
  const g2 = document.getElementById("group2").value.split(",").map(w => w.trim()).filter(Boolean);
  const g3raw = document.getElementById("group3").value;
  const g3 = g3raw ? g3raw.split(",").map(w => w.trim()).filter(Boolean) : [""];

  let result = [];

  g1.forEach(a => {
    g2.forEach(b => {
      g3.forEach(c => {
        result.push(`${a} ${b} ${c}`.trim());
      });
    });
  });

  document.getElementById("result").value = result.join("\n");
}
