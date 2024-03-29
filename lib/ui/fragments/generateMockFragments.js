import { TEMPORARY_PATH_LABEL } from '../fragmentPaths/constants'

const randomWords = [
  'I',
  'hello',
  'world',
  'research',
  'boost',
  'brethren',
  'favorite',
  'body',
  'song',
  'singing',
  'blasting',
  `wouldn't`,
  `won't`,
  'occuring',
  'mine',
  'fields',
  'helmet',
  'porous',
  'them',
  '-',
  'schmitetz',
  'smells',
  'occurrence',
  'dream',
]

const getRandomSentence = (maxLen = 40) =>
  new Array(
    parseInt(maxLen / 10) + parseInt(Math.random() * (maxLen / 2)),
  )
    .fill(0)
    .map(
      () => randomWords[parseInt(Math.random() * randomWords.length)],
    )
    .join(' ')

const getRandomNotes = () =>
  new Array(parseInt(Math.random() * 3)).fill(0).map((_e, idx) => ({
    createdAt: Date.now(),
    id: idx + 1,
    text: `${getRandomSentence()}.`,
    updatedAt: Date.now(),
  }))

const emails = ['pzemina@gmail.com', 'spontain@gmail.com']

export const generateMockFragments = (num = 10) =>
  new Array(num).fill(0).map((_e, idx) => ({
    createdAt: Date.now() - idx * parseInt(20000 * Math.random()),
    id: idx + 1,
    updatedAt: Date.now() - idx,
    notes: getRandomNotes(),
    owner: emails[parseInt(Math.random() * emails.length)],
    path: [TEMPORARY_PATH_LABEL],
    text:
      `Mock fragment #${idx + 1}, with additional text of length, ` +
      `${getRandomSentence()}.`,
  }))
