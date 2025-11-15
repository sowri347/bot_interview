/**
 * Application constants
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const ROUTES = {
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard',
  ADMIN_INTERVIEW: '/admin/interview/:id',
  ADMIN_REPORT: '/admin/report/:candidateId',
  INTERVIEW: '/interview/:linkId',
  CANDIDATE_LOGIN: '/candidate/login/:linkId',
  CANDIDATE_INTERVIEW: '/candidate/interview/:linkId',
};

export const TIMER_DURATIONS = {
  READING: 30, // 30 seconds for reading question
  RECORDING: 60, // 60 seconds for recording answer
};

