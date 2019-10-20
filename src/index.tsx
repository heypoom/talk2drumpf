import * as React from 'react'
import {useState, useEffect} from 'react'
import ReactDOM from 'react-dom'

import {
  playSound as play,
  preloadSoundClips
} from './utils/play'

import {soundFrom} from './utils/soundFrom'
import {drumpfSounds} from './sounds/drumpf'
import {useSpeechRecognition} from './hooks/useSpeechRecognition'

import "./main.scss"

declare global {
  interface Window {
    webkitSpeechRecognition: typeof SpeechRecognition
    run: (text: string) => {},
    play: typeof play,
  }
}

window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
window.play = play

let soundpack = drumpfSounds

preloadSoundClips(soundpack).then()

const random = items => items[Math.floor(Math.random() * items.length)]
const without = (haystack, needle) => haystack.filter(i => i !== needle)

function App() {
  const [chat, setChat] = useState('')
  const [reply, setReply] = useState('')
  const [result, isListening, listen, stop] = useSpeechRecognition()

  function doReply(_reply: string) {
    setReply(_reply.replace(/_/g, ' '))

    return play(_reply)
  }

  async function run(text: string) {
    setChat(text)

    const sounds = soundFrom(text, soundpack)
    if (sounds.length < 1) return doReply(random(soundpack))

    console.log(`Randomizing ${text} as ${sounds}`)

    const sound = random(sounds)
    await doReply(sound)

    if (sounds.length > 2)
      await doReply(random(without(sounds, sound)))
  }

  window.run = run

  useEffect(() => {
    if (isListening) {
      console.log('👂')
    }

    if (!isListening && result) {
      console.log('💬:', result)
      stop()

      run(result).then(() => listen())
    }
  }, [isListening, result])

  return (
    <div className="container trump-cover">
      <div className="bg-blur-backdrop"></div>

      <div className="text-backdrop" onClick={listen}>
        <div className="text-container">
          <div className="result">💬: {chat || '...'}</div>

          <div className="reply-sentence">🍔: {reply || '...'}</div>
        </div>
      </div>

      <div className="listening-indicator" onClick={listen}>
        {isListening ? ' 👂 ' : ' ⛔️ '}
      </div>

      <div className="random-sound-clip" onClick={() => run('...')}>
        🎲
      </div>

      <input
        type="text"
        className="chat-input"
        onChange={e => setChat(e.target.value)}
        value={chat}
        onKeyPress={e => e.key === 'Enter' && run(chat)}
      />
    </div>
  )
}

ReactDOM.render(<App />, document.querySelector('#app'))
