import React, { useState } from 'react';
import './FlashCard.css';

function FlashCard({ imageUrl, breed, getRandomDog }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  const handleNext = () => {
    setFlipped(false);
    getRandomDog();
  };

  return (
    <div className="flashcard-container">
      <div className={`flashcard ${flipped ? 'flipped' : ''}`} onClick={handleFlip}>
        <div className="front">
          {imageUrl && ( // Conditionally render image if imageUrl is not empty
            <img src={imageUrl} alt="Dog" style={{ maxWidth: '300px' }} />
          )}
        </div>
        <div className="back">
          <p>{breed}</p>
        </div>
      </div>
      {flipped && (
        <button onClick={handleNext} className="next-button">Next</button>
      )}
    </div>
  );
}

export default FlashCard;

