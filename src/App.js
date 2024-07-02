import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FlashCard from './components/FlashCard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function App() {
  const [breeds, setBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currentBreed, setCurrentBreed] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintType, setHintType] = useState('last'); // Initialize hintType to 'first'
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(false);

  useEffect(() => {
    async function fetchBreeds() {
      try {
        const response = await axios.get('https://dog.ceo/api/breeds/list/all');
        setBreeds(Object.keys(response.data.message));
      } catch (error) {
        console.error('Error fetching breeds', error);
      }
    }

    fetchBreeds();
  }, []);

  const getRandomDog = useCallback(async () => {
    if (breeds.length > 0) {
      const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
      setCurrentBreed(randomBreed);

      try {
        const response = await axios.get(`https://dog.ceo/api/breed/${randomBreed}/images/random`);
        setImageUrl(response.data.message);
      } catch (error) {
        console.error('Error fetching dog image', error);
      }
    }
  }, [breeds]);

  useEffect(() => {
    if (breeds.length > 0) {
      getRandomDog();
    }
  }, [breeds, getRandomDog]);

  const handleBreedChange = (event) => {
    const breed = event.target.value;
    setSelectedBreed(breed);
    setFeedback('');
  };

  const checkGuess = () => {
    const selectedBreedLower = selectedBreed.toLowerCase();
    const currentBreedLower = currentBreed.toLowerCase();

    if (selectedBreedLower === currentBreedLower) {
      setFeedback(<span style={{ color: 'green' }}>Correct! You guessed the right breed: {capitalizeFirstLetter(currentBreed)}</span>);
      setCorrectAnswer(true);
    } else {
      setFeedback(<span style={{ color: 'red' }}>Incorrect.</span>);
    }

    // Hide the hint after submitting the guess
    setShowHint(false);
  };

  const nextDog = () => {
    setSelectedBreed('');
    setFeedback('');
    setShowHint(false); // Reset hint visibility on next dog
    setHintType('first'); // Reset hint type on next dog
    setAnswerRevealed(false); // Reset answer revealed state on next dog
    setCorrectAnswer(false); // Reset correct answer state on next dog
    getRandomDog();
  };

  const toggleHint = () => {
    setShowHint(true);
    setHintType(prevHintType => (prevHintType === 'first' ? 'last' : 'first'));
  };

  const revealAnswer = () => {
    // Assuming 'currentBreed' is the correct answer variable
    setFeedback(`The correct answer is: ${capitalizeFirstLetter(currentBreed)}`);
    setAnswerRevealed(true);
    setShowHint(false);
  };

  return (
    <div className="App container">
      <h1 className="small-title">Guess The Dog Breed!</h1>
      <FlashCard imageUrl={imageUrl} />
      <div className="mt-4">
        <label htmlFor="breedSelect" className="form-label">Select a Breed:</label>
        <select
          id="breedSelect"
          className="form-select"
          value={selectedBreed}
          onChange={handleBreedChange}
          disabled={answerRevealed || correctAnswer}
        >
          <option value="">Select...</option>
          {breeds.map(breed => (
            <option key={breed} value={breed}>{capitalizeFirstLetter(breed)}</option>
          ))}
        </select>
        <div className="button-group mt-3">
          {!answerRevealed && !correctAnswer && (
            <>
              <button className="btn btn-info" onClick={toggleHint}>Hint</button>
              <button className="btn btn-primary" onClick={checkGuess}>Submit Guess</button>
              <button className="btn btn-warning" onClick={revealAnswer}>Reveal Answer</button>
            </>
          )}
          <button className="btn btn-secondary" onClick={nextDog}>Next</button>
        </div>
        {showHint && (
          <p className="mt-3">
            Hint: {hintType === 'first'
              ? `First letter is "${currentBreed.charAt(0).toUpperCase()}"`
              : `Last letter is "${currentBreed.charAt(currentBreed.length - 1).toUpperCase()}"`}
          </p>
        )}
        {feedback && <p className="mt-3">{feedback}</p>}
      </div>
    </div>
  );
}

export default App;
