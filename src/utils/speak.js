/**
 * Text-to-Speech utility using Web Speech API
 * Works offline once voices are cached
 */
export const speak = (text, lang = "en") => {
  if (!("speechSynthesis" in window)) {
    console.warn("Speech synthesis not supported");
    return;
  }

  // Cancel any ongoing speech
  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(text);
  
  // Map language codes to speech synthesis language codes
  if (lang === "kr") {
    utterance.lang = "en-GB"; // Krio uses English voices
  } else {
    utterance.lang = "en-US";
  }

  utterance.rate = 0.9;
  utterance.pitch = 1;
  utterance.volume = 1;

  window.speechSynthesis.speak(utterance);
};

/**
 * Stop any ongoing speech
 */
export const stopSpeaking = () => {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
  }
};

