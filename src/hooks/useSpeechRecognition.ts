import {useState} from 'react'

interface Status {
  audio: boolean
  sound: boolean
  speech: boolean
}

type HookResult = [string, boolean, Function, Function, Status, SpeechRecognition]

export function useSpeechRecognition(): HookResult {
  const [result, setResult] = useState<string>('')
  const [isListening, setListening] = useState(false)
  const [status, _setStatus] = useState<Status>({audio: false, sound: false, speech: false})

  function setStatus(newStatus) {
    _setStatus({...status, ...newStatus})
    console.log(newStatus)
  }

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

  speech.onaudiostart = () => setStatus({audio: true})
  speech.onaudioend = () => setStatus({audio: false})

  speech.onsoundstart = () => setStatus({sound: true})
  speech.onsoundend = () => setStatus({sound: false})

  speech.onspeechstart = () => setStatus({speech: true})
  speech.onspeechend = () => setStatus({speech: false})

  speech.onerror = (e) => console.log('Audio Error', e)
  speech.onnomatch = () => console.log('No Match...')

  speech.onstart = () => {
    setListening(true)

    console.log('Recognition Start')
  }

  speech.onend = () => {
    setListening(false)

    console.log('Recognition End')

    // setTimeout(listen, 2000)
  }

  speech.onresult = e => {
    const text = e.results[0][0].transcript

    setListening(false)
    setResult(text)

    console.log('Transcription Result:', text)
  }

  return [result, isListening, listen, stop, status, speech]
}
