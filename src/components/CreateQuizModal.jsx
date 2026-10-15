// src/components/CreateQuizModal.jsx
import React, { useState } from 'react';
import { createQuiz } from '../api/quizService';

export default function CreateQuizModal({ show, onClose, onQuizCreated }) {
  const [categoryName, setCategoryName] = useState('Java');
  const [numQuestions, setNumQuestions] = useState(2);
  const [title, setTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdQuizId, setCreatedQuizId] = useState(null);
  const [error, setError] = useState(null);

  if (!show) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        categoryName,
        numQuestions: parseInt(numQuestions, 10),
        title,
      };

      const result = await createQuiz(payload);
      setCreatedQuizId(result.quizId);
      if (onQuizCreated) onQuizCreated(result.quizId);
    } catch (err) {
      setError(err.message || 'Failed to create quiz. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setCreatedQuizId(null);
    setError(null);
    setTitle('');
    onClose();
  };

  return (
    <div className="modal-backdrop-custom d-flex align-items-center justify-content-center">
      <div className="modal-card-glass p-4 rounded-4 text-white shadow-lg" style={{ maxWidth: '500px', width: '90%' }}>
        <div className="d-flex justify-content-between align-items-center mb-3 border-bottom border-secondary pb-2">
          <h4 className="fw-bold m-0 brand-text">
            <i className="bi bi-plus-circle-fill me-2 text-accent"></i>Create Quiz
          </h4>
          <button className="btn-close btn-close-white" onClick={resetForm}></button>
        </div>

        {createdQuizId ? (
          <div className="text-center py-3">
            <div className="mb-3 text-success fs-1">
              <i className="bi bi-check-circle-fill"></i>
            </div>
            <h5 className="fw-bold">Quiz Created Successfully!</h5>
            <p className="text-light opacity-75">Share this Quiz ID with students:</p>
            <div className="p-3 rounded-3 bg-dark border border-secondary my-3 d-flex align-items-center justify-content-between">
              <span className="fs-4 fw-bold text-accent">ID: {createdQuizId}</span>
              <button
                className="btn btn-sm btn-outline-light"
                onClick={() => navigator.clipboard.writeText(createdQuizId)}
              >
                <i className="bi bi-clipboard me-1"></i>Copy
              </button>
            </div>
            <button className="btn btn-iconic w-100 mt-2" onClick={resetForm}>
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {error && <div className="alert alert-danger py-2 fs-6">{error}</div>}

            <div className="mb-3">
              <label className="form-label text-light opacity-75 fw-semibold">Quiz Title</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="e.g. Quiz questions for PSU students"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label text-light opacity-75 fw-semibold">Category Name</label>
              <input
                type="text"
                className="form-control bg-dark text-white border-secondary"
                placeholder="e.g. Java, Python, SQL"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
              />
            </div>

            <div className="mb-4">
              <label className="form-label text-light opacity-75 fw-semibold">Number of Questions</label>
              <input
                type="number"
                min="1"
                max="50"
                className="form-control bg-dark text-white border-secondary"
                value={numQuestions}
                onChange={(e) => setNumQuestions(e.target.value)}
                required
              />
            </div>

            <div className="d-flex gap-2">
              <button type="button" className="btn btn-outline-light w-50 rounded-pill" onClick={resetForm}>
                Cancel
              </button>
              <button type="submit" className="btn btn-iconic w-50" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>Creating...
                  </>
                ) : (
                  'Generate Quiz'
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}