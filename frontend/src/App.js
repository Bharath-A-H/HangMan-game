import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const App = () => {
  const [word, setWord] = useState('');
  const [hint, setHint] = useState('');
  const [guesses, setGuesses] = useState([]);
  const [wrongGuesses, setWrongGuesses] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [hasWon, setHasWon] = useState(false);
  const [gamesPlayed, setGamesPlayed] = useState(0);
  const [correctGuesses, setCorrectGuesses] = useState(0);
  const [showNewGameButton, setShowNewGameButton] = useState(false);

  useEffect(() => {
    fetchWord();
  }, []);

  useEffect(() => {
    if (gameOver) {
      if (gamesPlayed + 1 === 4) {
        setShowNewGameButton(true);
      } else {
        setTimeout(fetchWord, 3000);
      }
    }
  }, [gameOver]);

  const fetchWord = async () => {
    const response = await axios.get('http://localhost:5000/word');
    setWord(response.data.word);
    setHint(response.data.hint);
    setGuesses([]);
    setWrongGuesses(0);
    setGameOver(false);
    setHasWon(false);
  };

  const handleGuess = (letter) => {
    if (guesses.includes(letter) || gameOver) return;

    setGuesses([...guesses, letter]);

    if (!word.includes(letter)) {
      const newWrongGuesses = wrongGuesses + 1;
      setWrongGuesses(newWrongGuesses);
      if (newWrongGuesses === 6) {
        setGameOver(true);
        setGamesPlayed(gamesPlayed + 1);
      }
    } else {
      if (word.split('').every((char) => guesses.includes(char) || char === letter)) {
        setHasWon(true);
        setGameOver(true);
        setCorrectGuesses(correctGuesses + 1);
        setGamesPlayed(gamesPlayed + 1);
      }
    }
  };

  const resetGame = () => {
    setGamesPlayed(0);
    setCorrectGuesses(0);
    setShowNewGameButton(false);
    fetchWord();
  };

  const renderWord = () => {
    return word.split('').map((char, index) => (
      <span key={index} className="letter">
        {guesses.includes(char) ? char : ''}
      </span>
    ));
  };

  const renderAlphabet = () => {
    const alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    return alphabet.map((letter) => (
      <button
        key={letter}
        onClick={() => handleGuess(letter)}
        className="alphabet-button"
        disabled={guesses.includes(letter) || gameOver}
      >
        {letter}
      </button>
    ));
  };

  return (
    <div className="App">
      <h1>Hangman Game</h1>
      <div className="word">{renderWord()}</div>
      <div className="hint"><strong>Hint:</strong> {hint}</div>
      <div className="alphabet">{renderAlphabet()}</div>
      <div className="status">
        {gameOver && (
          <div>
            <p>{hasWon ? 'You won!' : `You lost! The word was: ${word}`}</p>
            {!showNewGameButton && (
              <p>Loading next word...</p>
            )}
          </div>
        )}
      </div>
      <div className="hangman">
        <img src={`hangman${wrongGuesses}.png`} alt={`Hangman stage ${wrongGuesses}`} />
      </div>
      {showNewGameButton && (
        <div className="new-game">
          <h3>You have played 3 games. Correct guesses: {correctGuesses}</h3>
          <button className="play-again-button" onClick={resetGame}>New Game</button>
        </div>
      )}
    </div>
  );
};

export default App;
