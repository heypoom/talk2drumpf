let currentSound: string | boolean

const audioCaches: Record<string, HTMLAudioElement> = {}

export function playSound(url: string) {
  if (!url.endsWith('.mp3')) url += '.mp3'

  if (currentSound) return

  const audio = audioCaches[url] || new Audio(url)
  console.log(
    'Audio for',
    url,
    'is',
    audio,
    '| Preloaded:',
    audioCaches[url] ? 'Yes' : 'No',
  )

  return new Promise(resolve => {
    audio.play()

    audio.onplay = () => {
      console.log('Playing:', url)

      currentSound = true
    }

    audio.onended = () => {
      console.log('Playback Ended:', url)
      currentSound = false

      resolve()
    }
  })
}

function preloadAudio(url: string) {
  if (!url.endsWith('.mp3')) url += '.mp3'

  return new Promise(resolve => {
    const audio = new Audio()
    audio.autoplay = false

    audio.addEventListener(
      'canplaythrough',
      () => {
        audioCaches[url] = audio
        resolve()
      },
      false,
    )

    audio.preload = 'true'
    audio.src = url
  })
}

export async function preloadSoundClips(clips) {
  const startAt = Date.now()
  console.log('Preloading audio...')

  const tasks = clips.map(preloadAudio)

  await Promise.all(tasks)

  const opTime = Date.now() - startAt
  console.log(`Preloaded ${clips.length} sound clips in ${opTime} ms.`)
}
