// src/components/Homepage.jsx
import React, { useState } from 'react';
import CreateQuizModal from './CreateQuizModal';
import TakeQuizModal from './TakeQuizModal';

const Homepage = () => {
  const [showCreate, setShowCreate] = useState(false);
  const [showTake, setShowTake] = useState(false);
  const [activeQuizId, setActiveQuizId] = useState('');

  const handleQuizCreated = (newId) => {
    setActiveQuizId(newId);
  };

  return (
    <div className="hero-container">
      {/* Background Video */}
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="/nature_background.mp4" type="video/mp4" />
      </video>

      <div className="video-overlay" />

      {/* Hero Content */}
      <div className="hero-content text-center px-3">
        <h1 className="hero-title mb-3">Interactive Knowledge Hub</h1>
        <p className="hero-subtitle mb-5">
          Challenge your mind, create custom quizzes, and evaluate knowledge seamlessly with our modern platform.
        </p>

        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <button className="btn btn-iconic d-inline-flex align-items-center gap-2" onClick={() => setShowCreate(true)}>
            <i className="bi bi-plus-circle-fill text-accent"></i>
            <span>Create Quiz</span>
          </button>

          <button className="btn btn-iconic d-inline-flex align-items-center gap-2" onClick={() => setShowTake(true)}>
            <i className="bi bi-play-circle-fill text-accent"></i>
            <span>Take Quiz</span>
          </button>
        </div>
      </div>

      {/* Modals */}
      <CreateQuizModal
        show={showCreate}
        onClose={() => setShowCreate(false)}
        onQuizCreated={handleQuizCreated}
      />
      
      <TakeQuizModal
        show={showTake}
        onClose={() => setShowTake(false)}
        initialQuizId={activeQuizId}
      />
    </div>
  );
};

export default Homepage;