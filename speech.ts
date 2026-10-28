// Voice Speech Synthesis utility for Marathi, Hindi, and English
export function speakText(text: string, language: 'mr' | 'hi' | 'en', onEnd?: () => void) {
  if (!('speechSynthesis' in window)) {
    console.warn('Speech synthesis not supported in this browser.');
    return null;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  // Clean markdown symbols like asterisks, emojis, hashtags
  const clean = text
    .replace(/[#*_`~>⚠️💡🌾🌱🧅🌿🧪🔍]/g, '')
    .replace(/\[.*?\]/g, '')
    .trim();

  const utterance = new SpeechSynthesisUtterance(clean);
  
  // Set language tags
  if (language === 'mr') {
    utterance.lang = 'mr-IN';
  } else if (language === 'hi') {
    utterance.lang = 'hi-IN';
  } else {
    utterance.lang = 'en-IN';
  }

  utterance.rate = 0.95; // Slightly slower, clear pace for farmers
  utterance.pitch = 1.0;

  if (onEnd) {
    utterance.onend = onEnd;
    utterance.onerror = onEnd;
  }

  window.speechSynthesis.speak(utterance);
  return utterance;
}

export function stopSpeaking() {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
  }
}
