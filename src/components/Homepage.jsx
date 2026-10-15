import React from 'react';

const Homepage = ({ onOpenCreate, onOpenTake }) => {
  return (
    <div className="hero-container">
      <video className="video-bg" autoPlay loop muted playsInline>
        <source src="/nature_background.mp4" type="video/mp4" />
      </video>

      <div className="video-overlay" />

      <div className="hero-content text-center px-3">
        <h1 className="hero-title mb-3">Interactive Knowledge Hub</h1>
        <p className="hero-subtitle mb-5">
          Challenge your mind, create custom quizzes, and evaluate knowledge seamlessly with our modern platform.
        </p>

        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <button className="btn btn-iconic d-inline-flex align-items-center gap-2" onClick={onOpenCreate}>
            <i className="bi bi-plus-circle-fill text-accent"></i>
            <span>Create Quiz</span>
          </button>

          <button className="btn btn-iconic d-inline-flex align-items-center gap-2" onClick={onOpenTake}>
            <i className="bi bi-play-circle-fill text-accent"></i>
            <span>Take Quiz</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Homepage;