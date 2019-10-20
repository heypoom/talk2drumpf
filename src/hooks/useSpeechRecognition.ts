import {useState} from 'react'

type HookResult = [string, boolean, Function, Function, SpeechRecognition]

export function useSpeechRecognition(): HookResult {
  const [result, setResult] = useState<string>('')
  const [isListening, setListening] = useState(false)

  const speech = new SpeechRecognition()
  window.speech = speech

  function listen() {
    setListening(true)
    setResult('')

    try {
      speech.start()
    } catch (e) {}
  }

  function stop() {
    setListening(false)

    try {
      speech.stop()
    } catch (e) {}
  }

  speech.onstart = () => {
    setListening(true)
  }

  speech.onend = () => {
    setListening(false)
  }

  speech.onresult = e => {
    const text = e.results[0][0].transcript

    setListening(false)
    setResult(text)
  }

  return [result, isListening, listen, stop, speech]
}
