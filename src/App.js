import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import FlashCard from './components/FlashCard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; // Import Bootstrap CSS

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
  const [hintType, setHintType] = useState('last'); // Initialize hintType to 'first'
  const [answerRevealed, setAnswerRevealed] = useState(false);
  const [correctAnswer, setCorrectAnswer] = useState(false);
  const [difficulty, setDifficulty] = useState(8); // Default difficulty level
  const [gameStarted, setGameStarted] = useState(false);

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
      const subsetSize = Math.min(difficulty, breeds.length - 1);
      const subset = getRandomSubset(breeds.filter(b => b !== randomBreed), subsetSize);
      setSubsetBreeds([...subset, randomBreed]);

      try {
        const response = await axios.get(`https://dog.ceo/api/breed/${randomBreed}/images
