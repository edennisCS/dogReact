import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FlashCard from './components/FlashCard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS
import Slider from 'react-slider';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLightbulb, faCheck, faEye, faArrowRight, faPlay } from '@fortawesome/free-solid-svg-icons';

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function getRandomSubset(array, size) {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, size);
}

function App() {
  const [breeds, setBreeds] = useState([]);
  const [subsetBreeds, setSubsetBreeds] = useState([]);
  const [selectedBreed, setSelectedBreed] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [currentBreed, setCurrentBreed] = useState('');
  const [feedback, setFeedback] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [hintType, setHintType] = useState('first'); // Initialize hintType to 'first'
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [difficulty, setDifficulty] = useState(4); // Default difficulty level
  const [gameStarted, setGameStarted] = useState(false);
  const [pageReady, setPageReady] = useState(false); // Track if the page is ready

  
useEffect(() => {
  async function fetchBreeds() {
    try {
      const response = await axios.get('https://dog.ceo/api/breeds/list/all');
      const breedsArray = Object.keys(response.data.message);
      breedsArray.sort(); // Sort the breeds alphabetically
      setBreeds(breedsArray);
      setPageReady(true); // Set pageReady to true once breeds are fetched
    } catch (error) {
      console.error('Error fetching breeds', error);
    }
  }

  fetchBreeds();
}, []);

  const startGame = () => {
    if (breeds.length > 0) {
      getRandomDog();
      setGameStarted(true);
    }
  };

  const getRandomDog = useCallback(async () => {
  if (breeds.length > 0) {
    const randomBreed = breeds[Math.floor(Math.random() * breeds.length)];
    setCurrentBreed(randomBreed);

    // Get a random subset of breeds including the correct breed based on difficulty
    const subsetSize = Math.min(difficulty - 1, breeds.length - 1);
    const subset = getRandomSubset(breeds.filter(b => b !== randomBreed), subsetSize);

    // Add the correct breed to the subset and sort the subset alphabetically
    const sortedSubset = [...subset, randomBreed].sort();

    setSubsetBreeds(sortedSubset);

    try {
      const response = await axios.get(`https://dog.ceo/api/breed/${randomBreed}/images/random`);
      setImageUrl(response.data.message);
    } catch (error) {
      console.error('Error fetching dog image', error);
    }
  }
}, [breeds, difficulty]);

  const handleBreedChange = (event) => {
    const breed = event.target.value;
    setSelectedBreed(breed);
    setFeedback('');
  };

  const handleDifficultyChange = (value) => {
    setDifficulty(value);
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
    setImageUrl(''); // Clear the current image
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
      {!gameStarted ? (
        <div className="mt-4">
          <label htmlFor="difficultyRange" className="form-label">Select Difficulty:</label>
          <div className="slider-container">
            {pageReady && (
              <Slider 
                id="difficultyRange"
                min={4} 
                max={breeds.length} 
                value={difficulty} 
                onChange={handleDifficultyChange} 
                className="react-slider" 
                thumbClassName="thumb"
                trackClassName="track"
              />
            )}
          </div>
          <span className="ms-2">Breeds: {difficulty}</span>
          <div className="mt-3">
            <button className="btn btn-primary" onClick={startGame}>
              <FontAwesomeIcon icon={faPlay} /> Start Game
            </button>
          </div>
        </div>
      ) : (
        <>
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
              {subsetBreeds.map(breed => (
                <option key={breed} value={breed}>{capitalizeFirstLetter(breed)}</option>
              ))}
            </select>
            <div className="button-group mt-3">
              {!answerRevealed && !correctAnswer && (
                <>
                  <button className="btn btn-info" onClick={toggleHint}>
                    <FontAwesomeIcon icon={faLightbulb} /> Hint
                  </button>
                  <button className="btn btn-primary" onClick={checkGuess}>
                    <FontAwesomeIcon icon={faCheck} /> Submit Guess
                  </button>
                  <button className="btn btn-warning" onClick={revealAnswer}>
                    <FontAwesomeIcon icon={faEye} /> Reveal Answer
                  </button>
                </>
              )}
            </div>
            {showHint && (
              <p className="mt-3">
                Hint: {hintType === 'first'
                  ? `First letter is "${currentBreed.charAt(0).toUpperCase()}"`
                  : `Last letter is "${currentBreed.charAt(currentBreed.length - 1).toUpperCase()}"`}
              </p>
            )}
        <div className="feedback-section">
          <p className="feedback-text">{feedback}</p>
          {(answerRevealed || correctAnswer) && (
            <button className="btn btn-secondary next-button" onClick={nextDog}>
              <FontAwesomeIcon icon={faArrowRight} /> Next
            </button>
          )}
        </div>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
