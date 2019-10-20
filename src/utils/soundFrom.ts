export function soundFrom(text: string, sounds: string[]) {
  const words = text.split(' ')
  const list = []

  // Use exact match
  // words.forEach(word => {
  //   if (word.length < 3) return

  //   sounds.forEach(s => {
  //     const _words = s.split('_')

  //     if (_words.includes(word)) list.push(s)
  //   })
  // })

  console.log('🎲 Possible Replies:', list)

  // Use fuzzy match when exact is not enough
  // if (list.length < 3) {
  words.forEach(word => {
    if (word.length < 3) return

    sounds.filter(s => s.includes(word)).forEach(s => list.push(s))
  })
  // }

  return Array.from(new Set(list))
}
