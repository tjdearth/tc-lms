"use client";

import { useState } from "react";
import type { Quiz } from "@/types";
import QuizQuestionRenderer from "@/components/QuizQuestionRenderer";

interface QuizPlayerProps {
  quiz: Quiz;
  lessonId: string;
  onComplete: (passed: boolean, score: number) => void;
}

interface QuizResult {
  score_pct: number;
  passed: boolean;
  results: {
    question_id: string;
    correct: boolean;
    explanation: string | null;
  }[];
}

export default function QuizPlayer({ quiz, lessonId, onComplete }: QuizPlayerProps) {
  const questions = quiz.questions || [];
  const showAllAtOnce = questions.length <= 5;

  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string[]>>({});
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<QuizResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const updateAnswer = (questionId: string, answer: string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const allAnswered = questions.every(
    (q) => (answers[q.id] || []).length > 0
  );

  const handleSubmit = async () => {
    if (!allAnswered || submitting) return;
    setSubmitting(true);

    try {
      const res = await fetch("/api/learn/quiz-submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quiz_id: quiz.id, lesson_id: lessonId, answers }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "Failed to submit quiz. Please try again.");
        return;
      }
      setError(null);
      setResult(data);
      onComplete(data.passed, data.score_pct);
    } catch (err) {
      console.error("Quiz submit error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers({});
    setResult(null);
    setError(null);
    setCurrentIdx(0);
  };

  // Results screen
  if (result) {
    const resultMap = new Map(
      result.results.map((r) => [r.question_id, r])
    );
    return (
      <div className="max-w-2xl mx-auto">
        {/* Score card */}
        <div
          className={`text-center p-6 rounded-xl border-2 mb-6 ${
            result.passed
              ? "border-green-200 bg-green-50"
              : "border-red-200 bg-red-50"
          }`}
        >
          <p className="text-4xl font-bold mb-1">
            {result.score_pct}%
          </p>
          <p
            className={`text-sm font-medium ${
              result.passed ? "text-green-700" : "text-red-700"
            }`}
          >
            {result.passed ? "Passed!" : "Not passed"}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Passing score: {quiz.passing_score}%
          </p>
        </div>

        {/* Per-question results */}
        <div className="space-y-4 mb-6">
          {questions.map((q, idx) => {
            const qResult = resultMap.get(q.id);
            return (
              <div key={q.id}>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-gray-400">
                    Q{idx + 1}
                  </span>
                  {qResult?.correct ? (
                    <span className="text-xs font-medium text-green-600">
                      Correct
                    </span>
                  ) : (
                    <span className="text-xs font-medium text-red-600">
                      Incorrect
                    </span>
                  )}
                </div>
                <QuizQuestionRenderer
                  question={q}
                  answer={answers[q.id] || []}
                  onChange={() => {}}
                  showResult
                  isCorrect={qResult?.correct}
                />
                {qResult?.explanation && (
                  <p className="text-xs text-gray-500 mt-2 pl-2 border-l-2 border-gray-200">
                    {qResult.explanation}
                  </p>
                )}
              </div>
            );
          })}
        </div>

        {/* Retry button */}
        {!result.passed && (
          <button
            onClick={handleRetry}
            className="w-full py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
          >
            Retake Quiz
          </button>
        )}
      </div>
    );
  }

  // Quiz taking - all at once
  if (showAllAtOnce) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-[#304256]">
            {quiz.title}
          </h3>
          <span className="text-xs text-gray-400">
            {questions.length} question{questions.length !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="space-y-4 mb-6">
          {questions.map((q, idx) => (
            <div key={q.id}>
              <p className="text-xs text-gray-400 mb-1">Q{idx + 1}</p>
              <QuizQuestionRenderer
                question={q}
                answer={answers[q.id] || []}
                onChange={(a) => updateAnswer(q.id, a)}
              />
            </div>
          ))}
        </div>

        {error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
            {error}
          </div>
        )}
        <button
          onClick={handleSubmit}
          disabled={!allAnswered || submitting}
          className="w-full py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? "Submitting..." : "Submit Answers"}
        </button>
      </div>
    );
  }

  // Quiz taking - paginated
  const currentQ = questions[currentIdx];
  return (
    <div className="max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-[#304256]">
          {quiz.title}
        </h3>
        <span className="text-xs text-gray-400">
          Q{currentIdx + 1} of {questions.length}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-1.5 mb-6">
        {questions.map((q, idx) => (
          <div
            key={q.id}
            className={`h-1 flex-1 rounded-full transition-colors ${
              idx === currentIdx
                ? "bg-[#27a28c]"
                : (answers[q.id] || []).length > 0
                ? "bg-[#27a28c]/40"
                : "bg-[#E8ECF1]"
            }`}
          />
        ))}
      </div>

      <QuizQuestionRenderer
        question={currentQ}
        answer={answers[currentQ.id] || []}
        onChange={(a) => updateAnswer(currentQ.id, a)}
      />

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between mt-6">
        <button
          onClick={() => setCurrentIdx((i) => Math.max(0, i - 1))}
          disabled={currentIdx === 0}
          className="px-4 py-2 text-sm text-gray-500 hover:text-[#304256] disabled:opacity-30"
        >
          Previous
        </button>

        {currentIdx < questions.length - 1 ? (
          <button
            onClick={() =>
              setCurrentIdx((i) => Math.min(questions.length - 1, i + 1))
            }
            className="px-4 py-2 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || submitting}
            className="px-4 py-2 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        )}
      </div>
    </div>
  );
}
