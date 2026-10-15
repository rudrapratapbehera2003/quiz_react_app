// src/api/quizService.js
import { BASE_URL } from './config';

/**
 * Extracts Quiz ID from backend response string:
 * "Quiz{id=8, title='Quiz questions for psu students', questionIds=[8, 5]}" -> 8
 */
export const parseQuizId = (responseString) => {
  if (typeof responseString === 'number') return responseString;
  if (typeof responseString === 'object' && responseString !== null && responseString.id) {
    return responseString.id;
  }

  const match = String(responseString).match(/id=(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }

  const rawNum = parseInt(responseString, 10);
  if (!isNaN(rawNum)) return rawNum;

  throw new Error("Could not parse Quiz ID from response: " + responseString);
};

/**
 * 1. POST /quiz/create
 * Pure POST request with JSON payload:
 * {
 *   "categoryName": "Java",
 *   "numQuestions": 2,
 *   "title": "Quiz questions for psu students"
 * }
 */
export const createQuiz = async (quizData) => {
  const response = await fetch(`${BASE_URL}/quiz/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      categoryName: quizData.categoryName,
      numQuestions: Number(quizData.numQuestions),
      title: quizData.title,
    }),
  });

  if (!response.ok) {
    throw new Error(`Server Error (${response.status}): Failed to create quiz.`);
  }

  const rawText = await response.text();
  const quizId = parseQuizId(rawText);

  // Store the generated Quiz ID in localStorage so Take Quiz remembers it automatically
  localStorage.setItem('latestQuizId', quizId);

  return { rawText, quizId };
};

/**
 * 2. GET /quiz/get/{id}
 * Pure GET request to retrieve questions for the Quiz ID
 */
export const getQuizById = async (quizId) => {
  const response = await fetch(`${BASE_URL}/quiz/get/${quizId}`, {
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Server Error (${response.status}): Could not fetch Quiz #${quizId}`);
  }

  return await response.json();
};

/**
 * 3. POST /quiz/submit
 * Sends responses in format:
 * [ { "id": 8, "response": "List" }, { "id": 5, "response": "false" } ]
 */
export const submitQuiz = async (submissionPayload) => {
  const response = await fetch(`${BASE_URL}/quiz/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(submissionPayload),
  });

  if (!response.ok) {
    throw new Error(`Server Error (${response.status}): Failed to submit quiz.`);
  }

  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return await response.json();
  }
  return await response.text();
};