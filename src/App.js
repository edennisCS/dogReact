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
  const [currentBreed, setCurrentBreed] = useState('');
  const [imageUrl, setImageUrl] = useState('');

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
      setCurrentBreed(capitalizeFirstLetter(randomBreed));

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

  return (
    <div className="App container">
      <h1 className="mt-5 mb-4">Guess the Dog Breed!</h1>
      <FlashCard imageUrl={imageUrl} breed={currentBreed} getRandomDog={getRandomDog} />
    </div>
  );
}

export default App;
