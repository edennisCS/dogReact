import React from 'react';
import './FlashCard.css';

function FlashCard({ imageUrl, breed }) {
  return (
    <div className="flashcard-container">
      <div className="flashcard">
        <div className="front">
          {imageUrl && ( // Conditionally render image if imageUrl is not empty
            <img src={imageUrl} alt="Dog" style={{ maxWidth: '300px' }} />
          )}
        </div>
        <div className="back">
          <p>{breed}</p>
        </div>
      </div>
    </div>
  );
}

export default FlashCard;

