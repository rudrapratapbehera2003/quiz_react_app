// src/components/TakeQuizModal.jsx
import React, { useState, useEffect } from 'react';
import { getQuizById, submitQuiz } from '../api/quizService';

export default function TakeQuizModal({ show, onClose, quizId }) {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({}); // { [q.id]: "optionText" }
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [scoreResult, setScoreResult] = useState(null);

  // Automatically fetch questions on modal open using the passed ID or stored ID
  useEffect(() => {
    const targetId = quizId || localStorage.getItem('latestQuizId');
    
    if (show) {
      if (targetId) {
        loadQuestions(targetId);
      } else {
        setError("No Quiz found. Please click 'Create Quiz' first to generate a quiz!");
      }
    }
  }, [show, quizId]);

  if (!show) return null;

  const loadQuestions = async (idToFetch) => {
    setLoading(true);
    setError(null);
    setScoreResult(null);

    try {
      const data = await getQuizById(idToFetch);
      const questionList = typeof data === 'string' ? JSON.parse(data) : data;

      if (Array.isArray(questionList) && questionList.length > 0) {
        setQuestions(questionList);
        setCurrentQuestionIdx(0);
        setSelectedAnswers({});
      } else {
        setError('No questions available for this quiz.');
      }
    } catch (err) {
      setError(`Failed to load quiz. Verify backend server is running on localhost:8082.`);
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionText) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionText,
    }));
  };

  // Submit responses to POST /quiz/submit
  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    setError(null);

    // Exact payload format required by backend:
    // [ { "id": 8, "response": "List" }, { "id": 5, "response": "false" } ]
    const payload = questions.map((q) => ({
      id: q.id,
      response: selectedAnswers[q.id] || '',
    }));

    try {
      const score = await submitQuiz(payload);
      setScoreResult(score);
    } catch (err) {
      setError('Failed to submit quiz responses.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setQuestions([]);
    setError(null);
    setScoreResult(null);
    setCurrentQuestionIdx(0);
    onClose();
  };

  const activeQuizId = quizId || localStorage.getItem('latestQuizId');
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
            {activeQuizId ? `Quiz #${activeQuizId}` : 'Take Quiz'}
          </h4>
          <button className="btn-close btn-close-white" onClick={handleClose}></button>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-accent mb-3" style={{ width: '3rem', height: '3rem' }}></div>
            <p className="text-light opacity-75">Loading quiz questions from server...</p>
          </div>
        )}

        {/* Error State */}
        {error && !loading && (
          <div className="text-center py-4">
            <div className="alert alert-danger py-3 fs-6 mb-4">{error}</div>
            <button className="btn btn-outline-light rounded-pill px-4" onClick={handleClose}>
              Close
            </button>
          </div>
        )}

        {/* Questions View */}
        {!loading && !error && questions.length > 0 && scoreResult === null && currentQ && (
          <div>
            {/* Progress */}
            <div className="d-flex justify-content-between align-items-center mb-2 fs-6 text-light opacity-75">
              <span>Question {currentQuestionIdx + 1} of {questions.length}</span>
              <span>{Math.round(((currentQuestionIdx + 1) / questions.length) * 100)}%</span>
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

              <div className="d-flex flex-column gap-2">
                {['option1', 'option2', 'option3', 'option4'].map((optKey, idx) => {
                  const optionText = currentQ[optKey];
                  if (!optionText) return null;

                  const isSelected = selectedAnswers[currentQ.id] === optionText;

                  return (
                    <button
                      key={optKey}
                      type="button"
                      className={`btn text-start p-3 rounded-3 border d-flex align-items-center justify-content-between ${
                        isSelected
                          ? 'btn-accent border-purple text-white shadow-sm'
                          : 'btn-outline-light border-secondary text-light'
                      }`}
                      style={{
                        backgroundColor: isSelected ? 'rgba(170, 59, 255, 0.35)' : 'rgba(0,0,0,0.2)',
                      }}
                      onClick={() => handleOptionSelect(currentQ.id, optionText)}
                    >
                      <div className="d-flex align-items-center gap-2">
                        <span className="badge rounded-circle bg-secondary me-2">
                          {String.fromCharCode(65 + idx)}
                        </span>
                        <span>{optionText}</span>
                      </div>
                      {isSelected && <i className="bi bi-check-circle-fill text-accent fs-5"></i>}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Controls */}
            <div className="d-flex justify-content-between align-items-center">
              <button
                className="btn btn-outline-light rounded-pill px-4"
                onClick={() => setCurrentQuestionIdx((p) => Math.max(0, p - 1))}
                disabled={currentQuestionIdx === 0}
              >
                <i className="bi bi-arrow-left me-1"></i> Previous
              </button>

              {currentQuestionIdx < questions.length - 1 ? (
                <button
                  className="btn btn-iconic rounded-pill px-4"
                  onClick={() => setCurrentQuestionIdx((p) => Math.min(questions.length - 1, p + 1))}
                >
                  Next <i className="bi bi-arrow-right ms-1"></i>
                </button>
              ) : (
                <button
                  className="btn btn-success rounded-pill px-4"
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                >
                  {submitting ? (
                    <span className="spinner-border spinner-border-sm me-2"></span>
                  ) : (
                    <i className="bi bi-send-fill me-1"></i>
                  )}
                  Submit Quiz
                </button>
              )}
            </div>
          </div>
        )}

        {/* Score Screen */}
        {scoreResult !== null && (
          <div className="text-center py-4">
            <div className="mb-3 text-warning fs-1">
              <i className="bi bi-trophy-fill"></i>
            </div>
            <h3 className="fw-bold mb-2">Quiz Completed!</h3>
            <p className="text-light opacity-75">Your score evaluated by backend:</p>

            <div className="p-4 bg-dark rounded-4 border border-secondary my-4">
              <h6 className="text-accent fw-bold text-uppercase tracking-wider mb-2">Total Score</h6>
              <div className="display-3 fw-bold text-white mb-0">
                {typeof scoreResult === 'object' ? JSON.stringify(scoreResult) : scoreResult}
              </div>
            </div>

            <button className="btn btn-iconic w-100" onClick={handleClose}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}