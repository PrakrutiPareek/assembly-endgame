import { useState } from "react";
import { languages } from "./languages";
import clsx from "clsx";
import { getFarewellText } from "./utils";
import { getRandomWord } from "./utils";
import Confetti from "react-confetti";

function App() {
  const [currentWord, setCurrentWord] = useState(() => getRandomWord());
  const [guessedLetters, setGuessedLetters] = useState([]);

  const wrongGuessedCount = guessedLetters.filter(
    (letter) => !currentWord.includes(letter)
  ).length;
  const isGameWon = [...currentWord].every((letter) =>
    guessedLetters.includes(letter)
  );
  const isGameLost = wrongGuessedCount >= languages.length - 1;
  const isGameOver = isGameWon || isGameLost;
  const lastGuessedLetter = guessedLetters[guessedLetters.length - 1];
  const isLastGuessedIncorrect =
    lastGuessedLetter && !currentWord.includes(lastGuessedLetter);

  const alphabet = "abcdefghijklmnopqrstuvwxyz";

  function selectLetter(letter) {
    setGuessedLetters((prevLetter) =>
      prevLetter.includes(letter) ? prevLetter : [...prevLetter, letter]
    );
  }

  function resetGame() {
    return setCurrentWord(getRandomWord()), setGuessedLetters([]);
  }

  const languageElements = languages.map((chip, index) => {
    const isLangLost = index < wrongGuessedCount;
    const className = clsx("chip", { lost: isLangLost });
    const styles = {
      backgroundColor: chip.backgroundColor,
      color: chip.color,
    };
    return (
      <span style={styles} key={chip.name} className={className}>
        {chip.name}
      </span>
    );
  });

  const letterElements = currentWord.split("").map((letter, index) => {
    const className = clsx(
      isGameLost && !guessedLetters.includes(letter) && "missed-letter"
    );
    return (
      <span className={className} key={index}>
        {isGameLost || guessedLetters.includes(letter)
          ? letter.toUpperCase()
          : ""}
      </span>
    );
  });

  const keyBoardElement = alphabet.split("").map((letter) => {
    const isGuessed = guessedLetters.includes(letter);
    const isCorrect = isGuessed && currentWord.includes(letter);
    const isIncorrect = isGuessed && !currentWord.includes(letter);
    const className = clsx({
      correct: isCorrect,
      incorrect: isIncorrect,
    });

    return (
      <button
        key={letter}
        onClick={() => selectLetter(letter)}
        className={className}
        disabled={isGameOver}
      >
        {letter.toUpperCase()}
      </button>
    );
  });

  const gameStatusClass = clsx("status-section", {
    won: isGameWon,
    lost: isGameLost,
    farewell: !isGameOver && isLastGuessedIncorrect,
  });

  function renderGameStatus() {
    if (!isGameOver && isLastGuessedIncorrect) {
      return <p>{getFarewellText(languages[wrongGuessedCount - 1].name)}</p>;
    }

    if (isGameWon) {
      return (
        <>
          <h2>You Win!</h2>
          <p>Well done!🎉</p>
        </>
      );
    }

    if (isGameLost) {
      return (
        <>
          <h2>Game over!</h2>
          <p>You lose! Better start learning Assembly 😭</p>
        </>
      );
    }

    return null;
  }

  return (
    <main>
      {isGameWon && <Confetti recycle={false} numberOfPieces={3000} />}
      <header>
        <h1>Assembly: Endgame</h1>
        <p>
          Guess the word in under 8 attempts to keep the programming world safe
          from Assembly!
        </p>
      </header>
      <section className={gameStatusClass}>{renderGameStatus()}</section>
      <section className="languages-section">{languageElements}</section>
      <section className="current-word">{letterElements}</section>
      <section className="keyboard">{keyBoardElement}</section>
      {isGameOver && (
        <button className="new-game-btn" onClick={resetGame}>
          New Game
        </button>
      )}
    </main>
  );
}

export default App;
