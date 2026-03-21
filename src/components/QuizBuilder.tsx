"use client";

import { useState, useEffect, useCallback } from "react";
import type { Quiz, QuizQuestion, QuizOption, QuestionType } from "@/types";

interface QuizBuilderProps {
  quizId: string;
  onSave: () => void;
}

function generateId() {
  return "tmp-" + Math.random().toString(36).slice(2, 10);
}

function defaultOption(): QuizOption {
  return { id: generateId(), text: "", is_correct: false };
}

function defaultQuestion(sortOrder: number): QuizQuestion {
  return {
    id: generateId(),
    quiz_id: "",
    question_type: "single_choice",
    question_text: "",
    explanation: null,
    options: [defaultOption(), defaultOption()],
    points: 1,
    sort_order: sortOrder,
    created_at: "",
    updated_at: "",
  };
}

function trueFalseOptions(): QuizOption[] {
  return [
    { id: generateId(), text: "True", is_correct: true },
    { id: generateId(), text: "False", is_correct: false },
  ];
}

export default function QuizBuilder({ quizId, onSave }: QuizBuilderProps) {
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [passingScore, setPassingScore] = useState(70);
  const [maxAttempts, setMaxAttempts] = useState(0);
  const [shuffleQuestions, setShuffleQuestions] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchQuiz = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch quiz with questions from the quizzes table via supabase
      // Since there's no GET endpoint for quizzes by ID, we fetch via course detail
      // For now, fetch directly from the quiz data embedded in lesson
      const res = await fetch(`/api/learn/quizzes?quiz_id=${quizId}`);
      if (res.ok) {
        const data = await res.json();
        setQuiz(data);
        setQuestions(data.questions || []);
        setPassingScore(data.passing_score ?? 70);
        setMaxAttempts(data.max_attempts ?? 0);
        setShuffleQuestions(data.shuffle_questions ?? false);
      }
    } catch {
      // Quiz may not exist yet
    } finally {
      setLoading(false);
    }
  }, [quizId]);

  useEffect(() => {
    fetchQuiz();
  }, [fetchQuiz]);

  const addQuestion = () => {
    setQuestions((prev) => [...prev, defaultQuestion(prev.length)]);
  };

  const removeQuestion = (index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  };

  const updateQuestion = (index: number, updates: Partial<QuizQuestion>) => {
    setQuestions((prev) =>
      prev.map((q, i) => (i === index ? { ...q, ...updates } : q))
    );
  };

  const changeQuestionType = (index: number, newType: QuestionType) => {
    const q = questions[index];
    let newOptions: QuizOption[] = q.options;

    if (newType === "true_false") {
      newOptions = trueFalseOptions();
    } else if (q.question_type === "true_false") {
      newOptions = [defaultOption(), defaultOption()];
    }

    if (newType === "single_choice") {
      // Ensure only one is correct
      let found = false;
      newOptions = newOptions.map((o) => {
        if (o.is_correct && !found) {
          found = true;
          return o;
        }
        return { ...o, is_correct: false };
      });
    }

    updateQuestion(index, { question_type: newType, options: newOptions });
  };

  const addOption = (qIndex: number) => {
    const q = questions[qIndex];
    updateQuestion(qIndex, { options: [...q.options, defaultOption()] });
  };

  const removeOption = (qIndex: number, oIndex: number) => {
    const q = questions[qIndex];
    if (q.options.length <= 1) return;
    updateQuestion(qIndex, {
      options: q.options.filter((_, i) => i !== oIndex),
    });
  };

  const updateOption = (
    qIndex: number,
    oIndex: number,
    updates: Partial<QuizOption>
  ) => {
    const q = questions[qIndex];
    const newOptions = q.options.map((o, i) =>
      i === oIndex ? { ...o, ...updates } : o
    );
    updateQuestion(qIndex, { options: newOptions });
  };

  const setCorrectSingle = (qIndex: number, oIndex: number) => {
    const q = questions[qIndex];
    const newOptions = q.options.map((o, i) => ({
      ...o,
      is_correct: i === oIndex,
    }));
    updateQuestion(qIndex, { options: newOptions });
  };

  const toggleCorrectMulti = (qIndex: number, oIndex: number) => {
    const q = questions[qIndex];
    const newOptions = q.options.map((o, i) =>
      i === oIndex ? { ...o, is_correct: !o.is_correct } : o
    );
    updateQuestion(qIndex, { options: newOptions });
  };

  const updateOptionPosition = (
    qIndex: number,
    oIndex: number,
    position: number
  ) => {
    const q = questions[qIndex];
    const newOptions = q.options.map((o, i) =>
      i === oIndex ? { ...o, position } : o
    );
    updateQuestion(qIndex, { options: newOptions });
  };

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        lesson_id: quiz?.lesson_id || quizId,
        title: quiz?.title || "Quiz",
        passing_score: passingScore,
        max_attempts: maxAttempts,
        shuffle_questions: shuffleQuestions,
        questions: questions.map((q, i) => ({
          question_type: q.question_type,
          question_text: q.question_text,
          explanation: q.explanation,
          options: q.options,
          points: q.points,
          sort_order: i,
        })),
      };

      const res = await fetch("/api/learn/quizzes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save quiz");
      }

      onSave();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="w-6 h-6 border-2 border-[#27a28c] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const questionTypeLabels: Record<QuestionType, string> = {
    single_choice: "Single Choice",
    multi_choice: "Multiple Choice",
    true_false: "True / False",
    fill_blank: "Fill in the Blank",
    ordering: "Ordering",
  };

  return (
    <div className="space-y-6">
      {/* Settings */}
      <div className="bg-white border border-[#E8ECF1] rounded-xl p-4 shadow-sm">
        <h4 className="text-sm font-semibold text-[#304256] mb-3">
          Quiz Settings
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Passing Score (%)
            </label>
            <input
              type="number"
              min={0}
              max={100}
              value={passingScore}
              onChange={(e) => setPassingScore(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">
              Max Attempts (0 = unlimited)
            </label>
            <input
              type="number"
              min={0}
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
            />
          </div>
          <div className="flex items-end">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={shuffleQuestions}
                onChange={(e) => setShuffleQuestions(e.target.checked)}
                className="w-4 h-4 rounded border-[#E8ECF1] text-[#27a28c] focus:ring-[#27a28c]"
              />
              <span className="text-sm text-[#304256]">
                Shuffle Questions
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Questions */}
      {questions.map((q, qIdx) => (
        <div
          key={q.id || qIdx}
          className="bg-white border border-[#E8ECF1] rounded-xl p-4 shadow-sm"
        >
          <div className="flex items-start justify-between gap-3 mb-3">
            <span className="text-xs font-semibold text-[#27a28c] bg-[#27a28c]/10 px-2 py-0.5 rounded-full flex-shrink-0">
              Q{qIdx + 1}
            </span>
            <div className="flex-1 flex items-center gap-2">
              <select
                value={q.question_type}
                onChange={(e) =>
                  changeQuestionType(qIdx, e.target.value as QuestionType)
                }
                className="px-2 py-1.5 text-xs border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] bg-white"
              >
                {(Object.keys(questionTypeLabels) as QuestionType[]).map(
                  (type) => (
                    <option key={type} value={type}>
                      {questionTypeLabels[type]}
                    </option>
                  )
                )}
              </select>
              <input
                type="number"
                min={1}
                value={q.points}
                onChange={(e) =>
                  updateQuestion(qIdx, { points: Number(e.target.value) })
                }
                className="w-16 px-2 py-1.5 text-xs border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                title="Points"
              />
              <span className="text-[11px] text-gray-400">pts</span>
            </div>
            <button
              onClick={() => removeQuestion(qIdx)}
              className="text-gray-400 hover:text-red-500 transition-colors p-1"
              title="Delete question"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </div>

          {/* Question text */}
          <textarea
            value={q.question_text}
            onChange={(e) =>
              updateQuestion(qIdx, { question_text: e.target.value })
            }
            placeholder="Enter question text..."
            rows={2}
            className="w-full px-3 py-2 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] resize-none mb-3"
          />

          {/* Options editor per type */}
          {(q.question_type === "single_choice" ||
            q.question_type === "multi_choice") && (
            <div className="space-y-2 mb-3">
              <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                Options
              </label>
              {q.options.map((opt, oIdx) => (
                <div key={opt.id || oIdx} className="flex items-center gap-2">
                  {q.question_type === "single_choice" ? (
                    <input
                      type="radio"
                      name={`q-${qIdx}-correct`}
                      checked={opt.is_correct || false}
                      onChange={() => setCorrectSingle(qIdx, oIdx)}
                      className="w-4 h-4 text-[#27a28c] focus:ring-[#27a28c]"
                    />
                  ) : (
                    <input
                      type="checkbox"
                      checked={opt.is_correct || false}
                      onChange={() => toggleCorrectMulti(qIdx, oIdx)}
                      className="w-4 h-4 rounded text-[#27a28c] focus:ring-[#27a28c]"
                    />
                  )}
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) =>
                      updateOption(qIdx, oIdx, { text: e.target.value })
                    }
                    placeholder={`Option ${oIdx + 1}`}
                    className="flex-1 px-3 py-1.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                  />
                  <button
                    onClick={() => removeOption(qIdx, oIdx)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                    title="Remove option"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(qIdx)}
                className="text-xs text-[#27a28c] hover:text-[#27a28c]/80 font-medium"
              >
                + Add Option
              </button>
            </div>
          )}

          {q.question_type === "true_false" && (
            <div className="space-y-2 mb-3">
              <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                Correct Answer
              </label>
              {q.options.map((opt, oIdx) => (
                <div key={opt.id || oIdx} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name={`q-${qIdx}-tf`}
                    checked={opt.is_correct || false}
                    onChange={() => setCorrectSingle(qIdx, oIdx)}
                    className="w-4 h-4 text-[#27a28c] focus:ring-[#27a28c]"
                  />
                  <span className="text-sm text-[#304256]">{opt.text}</span>
                </div>
              ))}
            </div>
          )}

          {q.question_type === "fill_blank" && (
            <div className="space-y-2 mb-3">
              <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                Accepted Answers
              </label>
              {q.options.map((opt, oIdx) => (
                <div key={opt.id || oIdx} className="flex items-center gap-2">
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) =>
                      updateOption(qIdx, oIdx, {
                        text: e.target.value,
                        is_correct: true,
                      })
                    }
                    placeholder={`Accepted answer ${oIdx + 1}`}
                    className="flex-1 px-3 py-1.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                  />
                  <button
                    onClick={() => removeOption(qIdx, oIdx)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(qIdx)}
                className="text-xs text-[#27a28c] hover:text-[#27a28c]/80 font-medium"
              >
                + Add Answer
              </button>
            </div>
          )}

          {q.question_type === "ordering" && (
            <div className="space-y-2 mb-3">
              <label className="text-[11px] font-medium text-gray-400 uppercase tracking-wide">
                Items (set correct order with position numbers)
              </label>
              {q.options.map((opt, oIdx) => (
                <div key={opt.id || oIdx} className="flex items-center gap-2">
                  <input
                    type="number"
                    min={1}
                    value={opt.position ?? oIdx + 1}
                    onChange={(e) =>
                      updateOptionPosition(qIdx, oIdx, Number(e.target.value))
                    }
                    className="w-14 px-2 py-1.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] text-center"
                    title="Position"
                  />
                  <input
                    type="text"
                    value={opt.text}
                    onChange={(e) =>
                      updateOption(qIdx, oIdx, { text: e.target.value })
                    }
                    placeholder={`Item ${oIdx + 1}`}
                    className="flex-1 px-3 py-1.5 text-sm border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c]"
                  />
                  <button
                    onClick={() => removeOption(qIdx, oIdx)}
                    className="text-gray-300 hover:text-red-500 transition-colors p-1"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ))}
              <button
                onClick={() => addOption(qIdx)}
                className="text-xs text-[#27a28c] hover:text-[#27a28c]/80 font-medium"
              >
                + Add Item
              </button>
            </div>
          )}

          {/* Explanation */}
          <textarea
            value={q.explanation || ""}
            onChange={(e) =>
              updateQuestion(qIdx, {
                explanation: e.target.value || null,
              })
            }
            placeholder="Explanation (shown after answering)..."
            rows={2}
            className="w-full px-3 py-2 text-xs border border-[#E8ECF1] rounded-lg outline-none focus:border-[#27a28c] resize-none text-gray-500"
          />
        </div>
      ))}

      {/* Add question + Save */}
      <div className="flex items-center justify-between">
        <button
          onClick={addQuestion}
          className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-[#27a28c] border border-[#27a28c] rounded-lg hover:bg-[#27a28c]/5 transition-colors"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Add Question
        </button>
        <button
          onClick={handleSave}
          disabled={saving}
          className="px-4 py-2 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Quiz"}
        </button>
      </div>

      {error && (
        <p className="text-sm text-red-500 bg-red-50 px-3 py-2 rounded-lg">
          {error}
        </p>
      )}
    </div>
  );
}
