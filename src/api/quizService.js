import { fetchApi } from './config';


export const parseQuizId = (responseString) => {
  if (typeof responseString === 'number') return responseString;
  
  const match = responseString.match(/id=(\d+)/);
  if (match && match[1]) {
    return parseInt(match[1], 10);
  }
  
  throw new Error("Could not parse Quiz ID from backend response.");
};

/**
 * 1. POST /quiz/create
 * Payload: { categoryName, numQuestions, title }
 */
export const createQuiz = async (quizData) => {
  const rawResponse = await fetchApi('/quiz/create', {
    method: 'POST',
    body: JSON.stringify(quizData),
  });

  // Extract ID from response string
  const quizId = parseQuizId(rawResponse);

  return {
    rawResponse,
    quizId,
  };
};

/**
 * 2. GET /quiz/get/{id}
 * Example: /quiz/get/8
 */
export const getQuizById = async (quizId) => {
  return await fetchApi(`/quiz/get/${quizId}`, {
    method: 'GET',
  });
};