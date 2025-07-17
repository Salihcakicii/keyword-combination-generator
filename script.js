function generateCombinations() {
  const input = document.getElementById('keywordsInput').value.trim();
  const output = document.getElementById('output');

  if (!input) {
    output.value = 'Lütfen anahtar kelimeleri girin.';
    return;
  }

  const keywords = input.split('\n').map(k => k.trim()).filter(k => k !== '');

  let combinations = [];

  for (let i = 0; i < keywords.length; i++) {
    for (let j = i + 1; j < keywords.length; j++) {
      combinations.push(`${keywords[i]} ${keywords[j]}`);
      combinations.push(`${keywords[j]} ${keywords[i]}`);
    }
  }

  output.value = combinations.length ? combinations.join('\n') : 'Kombinasyon bulunamadı.';
}

function copyOutput() {
  const output = document.getElementById('output');
  output.select();
  output.setSelectionRange(0, 99999); // Mobil için
  document.execCommand('copy');
  alert('Kombinasyonlar kopyalandı!');
}
