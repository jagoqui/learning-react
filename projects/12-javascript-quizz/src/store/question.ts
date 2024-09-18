import { create } from 'zustand';
import { Question } from '../types';
import confetti from 'canvas-confetti';
import { devtools, persist } from 'zustand/middleware';

interface State {
  questions: Question[];
  currentQuestionIndex: number;
  fetchQuestions: (limit: number) => Promise<void>;
  selectAnswer: (questionId: number, answerIndex: number) => void;
  goNextQuestion: () => void;
  goPrevQuestion: () => void;
  reset: () => void;
}

export const useQuestionStore = create<State>()(
  devtools(
    persist(
      (set, get): State => ({
        questions: [],
        currentQuestionIndex: 0,
        fetchQuestions: async (limit: number) => {
          const res = await fetch('/data.json');
          const json = await res.json();

          const questions =
            json.sort(() => Math.random() - 0.5).slice(0, limit) ?? [];
          set({ questions }, false, 'FETCH_QUESTIONS');
        },
        selectAnswer: (questionId: number, answerIndex: number) => {
          set(
            (state) => {
              const questions = state.questions.map((question) => {
                if (question.id === questionId) {
                  const isCorrectUserAnswer =
                    question.correctAnswerIndex === answerIndex;
                  if (isCorrectUserAnswer) confetti();
                  return {
                    ...question,
                    userSelectedAnswer: answerIndex,
                    isCorrectUserAnswer,
                  };
                }
                return question;
              });
              return { questions };
            },
            false,
            'SELECT_ANSWER'
          );
        },
        goNextQuestion: () => {
          const { questions, currentQuestionIndex } = get();
          if (currentQuestionIndex === questions.length - 1) {
            return;
          }

          set(
            { currentQuestionIndex: currentQuestionIndex + 1 },
            false,
            'GO_NEXT_QUESTION'
          );
        },
        goPrevQuestion: () => {
          const { currentQuestionIndex } = get();
          if (currentQuestionIndex === 0) {
            return;
          }

          set(
            { currentQuestionIndex: currentQuestionIndex - 1 },
            false,
            'GO_PREVIOUS_QUESTION'
          );
        },
        reset: () => {
          set({ currentQuestionIndex: 0, questions: [] }, false, 'RESET_GAME');
        },
      }),
      { name: 'question-store' }
    ),
    { serialize: { options: true } }
  )
);
