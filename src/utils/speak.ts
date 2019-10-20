declare global {
  interface Window {
    speech: SpeechRecognition
  }
}

let currentTTS: string | boolean

export function speak(text) {
  const u = new SpeechSynthesisUtterance(text)
  u.lang = 'en-US'
  u.volume = 1 // 0 - 1
  u.pitch = 1 // 0 - 2
  u.rate = 1 // 0 - 10

  const sid = Math.random().toString(36)

  u.onerror = e => {
    console.error('TTS Error:', e)
  }

  u.onstart = e => {
    if (window.speech) window.speech.stop()
    currentTTS = sid
    console.info('🖥:', text)
  }

  u.onend = e => {
    if (currentTTS !== sid) return
    currentTTS = false

    window.speech.start()
  }

  speechSynthesis.speak(u)
  return u
}
