'use strict';

const GUESSES = 6;
const WORD_LENGTH = 5;

const wordList = [
  'hello',
  'lilac',
  // 'raise',
  'donut',
  'knoll',
  // 'arise',
  // 'sight',
  // 'right',
  // 'tight',
  // 'might',
  // 'fight',
  'light',
  // 'night',
  // 'wrung',
  // 'panic',
  // 'manic',
  // 'patio',
  // 'piano',
  // 'darts',
  // 'horse',
  'bling',
  'fling',
  'flail',
  'spelt',
  'vivid',
  'lived',

  // non-words

  'helll',
  'labcd',
  'albcd',
  'llabc',
  'lllab',
  'llabl',
  'ablll',
  'llalb',
  'lllla',
  'allll',
  'lllll',
];

// const secret = wordList[Math.floor(Math.random() * wordList.length)]
// const secret = 'ablll'
const secret = 'lived';
console.log(secret);
localStorage.setItem('Hello', 'World');

const history = [];
let currentGuess = [];
let activeCell = 0;
let activeRow = 0;

const grid = document.getElementById('grid');
buildGrid();
window.addEventListener('keydown', handleKeyDown);

function handleKeyDown(e) {
  if (e.metaKey) return;
  if (activeRow === GUESSES) return;

  const input = e.key.toLowerCase();
  const row = grid.children[activeRow];
  if (input === 'backspace' && activeCell !== 0) {
    activeCell--;
    row.children[activeCell].textContent = '';
    currentGuess.pop();
  } else if (/^[a-z]$/.test(input) && activeCell < WORD_LENGTH) {
    row.children[activeCell].textContent = input;
    currentGuess.push(input);
    activeCell++;
  } else if (input === 'enter' && activeCell === WORD_LENGTH) {
    const guess = currentGuess.join('');
    if (guess === secret) {
      window.alert('You win!');
    } else if (wordList.includes(guess)) {
      drawWord(row);
      activeRow++;
      if (activeRow === GUESSES) {
        window.alert(`Sorry, the word is ${secret}`);
        return;
      }
      activeCell = 0;
      history.push(guess);
      currentGuess = [];
    } else window.alert('Not in word list');
  }
}

function buildGrid() {
  for (let i = 0; i < GUESSES; i++) {
    const row = document.createElement('div');
    row.className = 'row';
    for (let j = 0; j < WORD_LENGTH; j++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      row.append(cell);
    }
    grid.append(row);
  }
}

function drawWord(row) {
  for (let i = 0; i < WORD_LENGTH; i++) {
    const cell = row.children[i];
    const letter = currentGuess[i];

    cell.classList.add(getBgColor(letter, i));
  }
}

function getBgColor(letter, i) {
  if (letter === secret[i]) return 'correct';
  if (!secret.includes(letter)) return 'absent';

  // assuming no five-letter word has any letter more than twice
  // does not work for six+ letter words (or if a letter occurs 3x+)
  /*   
    if letter occurs twice in guess
        if both occurences are yellow
            highlight the first
        if one occurence is green
            highlight only that one
  */

  /* 
    if letter twice
        if the other is green
            return grey/absent
        else
            if this is the second occurence
                return grey/absent
            else
                return yellow/present
  */

  let color = 'present';
  let first = currentGuess.indexOf(letter);
  let second = currentGuess.lastIndexOf(letter);
  if (first !== second) {
    let other = i === first ? second : first;
    if (currentGuess[other] === secret[other] || i === second) color = 'absent';
  }

  return color;
}
