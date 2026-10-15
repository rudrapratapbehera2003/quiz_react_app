// src/components/TakeQuizModal.jsx
import React, { useState } from 'react';
import { getQuizById } from '../api/quizService';

export default function TakeQuizModal({ show, onClose, initialQuizId = '' }) {
  const [quizId, setQuizId] = useState(initialQuizId);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [questionId]: "option1" }
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!show) return null;

  const handleFetchQuiz = async (e) => {
    e.preventDefault();
    if (!quizId) return;

    setLoading(true);
    setError(null);
    setIsSubmitted(false);

    try {
      const data = await getQuizById(quizId);
      // Ensure data is parsed correctly if it arrived as a string or array
      const parsedQuestions = typeof data === 'string' ? JSON.parse(data) : data;

      if (Array.isArray(parsedQuestions) && parsedQuestions.length > 0) {
        setQuestions(parsedQuestions);
        setCurrentQuestionIdx(0);
        setSelectedAnswers({});
      } else {
        setError('No questions found for this Quiz ID.');
      }
    } catch (err) {
      setError(`Failed to fetch Quiz #${quizId}. Please verify backend connection.`);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionKey) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionKey,
    }));
  };

  const handleNext = () => {
    if (currentQuestionIdx < questions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIdx > 0) {
      setCurrentQuestionIdx((prev) => prev - 1);
    }
  };

  const handleSubmitQuiz = () => {
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setQuestions([]);
    setQuizDataNull();
    onClose();
  };

  const setQuizDataNull = () => {
    setQuestions([]);
    setError(null);
    setIsSubmitted(false);
    setCurrentQuestionIdx(0);
  };

  const currentQ = questions[currentQuestionIdx];

  return (
    <div className="modal-backdrop-custom d-flex align-items-center justify-content-center">
      <div
        className="modal-card-glass p-4 rounded-4 text-white shadow-lg"
        style={{ maxWidth: '650px', width: '92%', maxHeight: '85vh', overflowY: 'auto' }}
      >
        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
          <h4 className="fw-bold m-0 brand-text">
            <i className="bi bi-play-circle-fill me-2 text-accent"></i>
            {questions.length > 0 ? `Quiz #${quizId}` : 'Take Quiz'}
          </h4>
          <button className="btn-close btn-close-white" onClick={handleClose}></button>
        </div>

        {/* STEP 1: Quiz ID Input Form */}
        {questions.length === 0 && (
          <form onSubmit={handleFetchQuiz}>
            {error && <div className="alert alert-danger py-2 fs-6">{error}</div>}

            <div className="mb-4">
              <label className="form-label text-light opacity-75 fw-semibold">Enter Quiz ID</label>
              <div className="input-group">
                <input
                  type="text"
                  className="form-control bg-dark text-white border-secondary"
                  placeholder="e.g. 8"
                  value={quizId}
                  onChange={(e) => setQuizId(e.target.value)}
                  required
                />
                <button type="submit" className="btn btn-iconic rounded-start-0" disabled={loading}>
                  {loading ? (
                    <span className="spinner-border spinner-border-sm"></span>
                  ) : (
                    'Start Quiz'
                  )}
                </button>
              </div>
            </div>
          </form>
        )}

        {/* STEP 2: Interactive Question Screen */}
        {questions.length > 0 && !isSubmitted && currentQ && (
          <div>
            {/* Progress Bar */}
            <div className="d-flex justify-content-between align-items-center mb-2 fs-6 text-light opacity-75">
              <span>
                Question {currentQuestionIdx + 1} of {questions.length}
              </span>
              <span>{Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}% Completed</span>
            </div>
            <div className="progress mb-4" style={{ height: '6px', backgroundColor: 'rgba(255,255,255,0.1)' }}>
              <div
                className="progress-bar bg-accent"
                style={{ width: `${((currentQuestionIdx + 1) / questions.length) * 100}%` }}
              ></div>
            </div>

            {/* Question Card */}
            <div className="p-3 bg-dark rounded-3 border border-secondary mb-4">
              <h5 className="fw-bold mb-3">{currentQ.questionTitle}</h5>

              {/* Options List */}
              <div className="d-flex flex-column gap-2">
                {['option1', 'option2', 'option3', 'option4'].map((optKey, idx) => {
                  const optionValue = currentQ[optKey];
                  if (!optionValue) return null;

                  const isSelected = selectedAnswers[currentQ.id] === optKey;

                  return (
                    <button
                      key={optKey}
                      type="button"
                      className={`btn text-start p-3 rounded-3 border d-flex align-items-center justify-content-between transition-all ${
                        isSelected
                          ? 'btn-accent border-purple text-white shadow-sm'
                          : 'btn-outline-light border-secondary text-light'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'rgba(170, 59, 255, 0.3)' : 'rgba(0,0,0,0.2)',
                      }}
                      onClick={() => handleOptionSelect(currentQ.id, optKey)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge rounded-circle bg-secondary me-2">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{optionValue}</span>
                      </div>
                      {isSelected && <i className="bi bi-check-circle-fill text-accent fs-5"></i>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Navigation Controls */}
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-outline-light rounded-pill px-4"
                onClick={handlePrev}
                disabled={currentQuestionIdx === 0}
              >
                <i className="bi bi-arrow-left me-1"></i> Previous
              </button>

              {currentQuestionIdx < questions.length - 1 ? (
                <button className="btn btn-iconic rounded-pill px-4" onClick={handleNext}>
                  Next <i className="bi bi-arrow-right ms-1"></i>
                </button>
              ) : (
                <button className="btn btn-success rounded-pill px-4" onClick={handleSubmitQuiz}>
                  <i className="bi bi-send-fill me-1"></i> Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {/* STEP 3: Submission Summary View */}
        {isSubmitted && (
          <div className="text-center py-4">
            <div className="mb-3 text-success fs-1">
              <i className="bi bi-trophy-fill"></i>
            </div>
            <h4 className="fw-bold mb-2">Quiz Completed!</h4>
            <p className="text-light opacity-75">
              You answered {Object.keys(selectedAnswers).length} out of {questions.length} questions.
            </p>

            <div className="d-flex gap-2 mt-4">
              <button className="btn btn-outline-light w-50 rounded-pill" onClick={setQuizDataNull}>
                Take Another Quiz
              </button>
              <button className="btn btn-iconic w-50" onClick={handleClose}>
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}