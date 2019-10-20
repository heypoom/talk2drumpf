export function soundFrom(text: string, sounds: string[]) {
  const words = text.split(' ')
  const list = []

  words.forEach(word => {
    if (word.length < 3) return

    sounds.forEach(s => {
      const _words = s.split('_')

      if (_words.includes(word)) list.push(s)
    })
  })

  console.log('List:', list)

  return Array.from(new Set(list))
}
