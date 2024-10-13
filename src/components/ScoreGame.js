// src/ScoreGame.js
import React, { useState, useEffect } from 'react';

const ScoreGame = () => {
    const [score, setScore] = useState(0);
    const [highScore, setHighScore] = useState(0);

    useEffect(() => {
        // Retrieve high score from local storage when the component mounts
        const storedHighScore = localStorage.getItem('highScore') || 0;
        setHighScore(storedHighScore);
    }, []);

    // Function to save high score
    const saveHighScore = (newScore) => {
        if (newScore > highScore) {
            localStorage.setItem('highScore', newScore);
            setHighScore(newScore);
            console.log('New high score saved:', newScore);
        }
    };

    // Event handler for scoring points
    const handleScore = () => {
        const newScore = score + 1; // Increment score
        setScore(newScore); // Update state with new score
        saveHighScore(newScore); // Save high score if applicable
    };

    return (
        <div>
            <h1>Score Game</h1>
            <div id="scoreDisplay">Score: {score}</div>
            <div id="highScoreDisplay">High Score: {highScore}</div>
            <button id="scoreButton" onClick={handleScore}>
                Score Points
            </button>
        </div>
    );
};

export default ScoreGame;
