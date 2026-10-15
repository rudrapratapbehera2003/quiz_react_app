import React from 'react'

export default function Navbar() {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-glass fixed-top shadow-sm">
      <div className="container">
        <a className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white" href="#">
          <i className="bi bi-patch-question-fill fs-4 text-accent"></i>
          <span className="brand-text">QuizApp</span>
        </a>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto gap-lg-2 mt-2 mt-lg-0">
            <li className="nav-item">
              <a className="nav-link active nav-custom-link" href="#">
                <i className="bi bi-house-door me-1"></i> Home
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-custom-link" href="#">
                <i className="bi bi-plus-circle me-1"></i> Create Quiz
              </a>
            </li>
            <li className="nav-item">
              <a className="nav-link nav-custom-link" href="#">
                <i className="bi bi-play-circle me-1"></i> Take Quiz
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  )
}