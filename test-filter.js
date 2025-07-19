const isEnglishAmericanContent = (item) => {
  const title = item.title.toLowerCase();
  const hasEnglishChars = /^[a-zA-Z0-9\s\-\:\.\'\"!?&,()]+$/.test(item.title);
  const hasNonEnglishChars = item.title.match(/[\u3040-\u309f\u30a0-\u30ff\u4e00-\u9faf\u0400-\u04ff\u0590-\u05ff\u0600-\u06ff\u1100-\u11ff\u3130-\u318f\uac00-\ud7af]/g);
  const nonEnglishPatterns = ['anime', 'manga', 'k-pop', 'bollywood', 'telugu', 'tamil', 'hindi', 'korean', 'japanese', 'chinese', 'thai', 'vietnamese', 'spanish', 'french', 'german', 'italian', 'portuguese', 'russian', 'arabic', 'vocaloid', 'j-pop', 'k-drama'];
  const hasNonEnglishKeywords = nonEnglishPatterns.some(pattern => title.includes(pattern));
  return hasEnglishChars && !hasNonEnglishChars && !hasNonEnglishKeywords;
};

const testItems = [
  { title: 'Dream Walking' },
  { title: 'J-POP: Vocaloid Goes Global' },
  { title: 'Montanha MÃ¡gica' },
  { title: 'Only You' },
  { title: 'Blake Pavey: Blake-A-Wish' }
];

testItems.forEach(item => {
  console.log(`${item.title}: ${isEnglishAmericanContent(item) ? 'PASS' : 'FILTERED'}`);
});
