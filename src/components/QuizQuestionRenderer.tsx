"use client";

import type { QuizQuestion } from "@/types";

interface QuizQuestionRendererProps {
  question: QuizQuestion;
  answer: string[];
  onChange: (answer: string[]) => void;
  showResult?: boolean;
  isCorrect?: boolean;
}

export default function QuizQuestionRenderer({
  question,
  answer,
  onChange,
  showResult,
  isCorrect,
}: QuizQuestionRendererProps) {
  const borderColor = showResult
    ? isCorrect
      ? "border-green-500"
      : "border-red-500"
    : "border-[#E8ECF1]";

  // Single choice
  if (question.question_type === "single_choice") {
    return (
      <div className={`rounded-xl border ${borderColor} p-4`}>
        <p className="text-sm font-medium text-[#304256] mb-3">
          {question.question_text}
        </p>
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = answer.includes(opt.id);
            return (
              <label
                key={opt.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? "border-[#27a28c] bg-[#27a28c]/5"
                    : "border-[#E8ECF1] hover:bg-gray-50"
                } ${
                  showResult && isSelected && !isCorrect
                    ? "border-red-400 bg-red-50"
                    : ""
                }`}
              >
                <input
                  type="radio"
                  name={question.id}
                  checked={isSelected}
                  onChange={() => onChange([opt.id])}
                  disabled={showResult}
                  className="accent-[#27a28c]"
                />
                <span className="text-sm text-[#304256]">{opt.text}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // Multi choice
  if (question.question_type === "multi_choice") {
    return (
      <div className={`rounded-xl border ${borderColor} p-4`}>
        <p className="text-sm font-medium text-[#304256] mb-1">
          {question.question_text}
        </p>
        <p className="text-xs text-gray-400 mb-3">Select all that apply</p>
        <div className="space-y-2">
          {question.options.map((opt) => {
            const isSelected = answer.includes(opt.id);
            return (
              <label
                key={opt.id}
                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                  isSelected
                    ? "border-[#27a28c] bg-[#27a28c]/5"
                    : "border-[#E8ECF1] hover:bg-gray-50"
                } ${
                  showResult && isSelected && !isCorrect
                    ? "border-red-400 bg-red-50"
                    : ""
                }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => {
                    if (isSelected) {
                      onChange(answer.filter((a) => a !== opt.id));
                    } else {
                      onChange([...answer, opt.id]);
                    }
                  }}
                  disabled={showResult}
                  className="accent-[#27a28c]"
                />
                <span className="text-sm text-[#304256]">{opt.text}</span>
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  // True / False
  if (question.question_type === "true_false") {
    return (
      <div className={`rounded-xl border ${borderColor} p-4`}>
        <p className="text-sm font-medium text-[#304256] mb-3">
          {question.question_text}
        </p>
        <div className="flex gap-3">
          {["True", "False"].map((val) => {
            const isSelected = answer[0] === val.toLowerCase();
            return (
              <button
                key={val}
                onClick={() => !showResult && onChange([val.toLowerCase()])}
                disabled={showResult}
                className={`flex-1 py-3 rounded-lg text-sm font-medium border-2 transition-colors ${
                  isSelected
                    ? "border-[#27a28c] bg-[#27a28c]/10 text-[#27a28c]"
                    : "border-[#E8ECF1] text-gray-500 hover:border-gray-300"
                } ${
                  showResult && isSelected && !isCorrect
                    ? "border-red-400 bg-red-50 text-red-600"
                    : ""
                }`}
              >
                {val}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  // Fill in the blank
  if (question.question_type === "fill_blank") {
    return (
      <div className={`rounded-xl border ${borderColor} p-4`}>
        <p className="text-sm font-medium text-[#304256] mb-3">
          {question.question_text}
        </p>
        <input
          type="text"
          value={answer[0] || ""}
          onChange={(e) => onChange([e.target.value])}
          disabled={showResult}
          placeholder="Type your answer..."
          className={`w-full px-3 py-2.5 text-sm border rounded-lg outline-none transition-colors ${
            showResult
              ? isCorrect
                ? "border-green-400 bg-green-50"
                : "border-red-400 bg-red-50"
              : "border-[#E8ECF1] focus:border-[#27a28c]"
          }`}
        />
      </div>
    );
  }

  // Ordering
  if (question.question_type === "ordering") {
    const items = answer.length
      ? answer
      : question.options.map((o) => o.id);

    const moveItem = (idx: number, dir: -1 | 1) => {
      const next = [...items];
      const target = idx + dir;
      if (target < 0 || target >= next.length) return;
      [next[idx], next[target]] = [next[target], next[idx]];
      onChange(next);
    };

    const optionMap = new Map(question.options.map((o) => [o.id, o.text]));

    return (
      <div className={`rounded-xl border ${borderColor} p-4`}>
        <p className="text-sm font-medium text-[#304256] mb-1">
          {question.question_text}
        </p>
        <p className="text-xs text-gray-400 mb-3">
          Arrange items in the correct order
        </p>
        <div className="space-y-2">
          {items.map((itemId, idx) => (
            <div
              key={itemId}
              className="flex items-center gap-2 p-3 rounded-lg border border-[#E8ECF1] bg-white"
            >
              <span className="w-6 h-6 flex items-center justify-center text-xs font-medium text-gray-400 bg-gray-100 rounded">
                {idx + 1}
              </span>
              <span className="flex-1 text-sm text-[#304256]">
                {optionMap.get(itemId) || itemId}
              </span>
              {!showResult && (
                <div className="flex flex-col gap-0.5">
                  <button
                    onClick={() => moveItem(idx, -1)}
                    disabled={idx === 0}
                    className="p-0.5 text-gray-400 hover:text-[#304256] disabled:opacity-30"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="18 15 12 9 6 15" />
                    </svg>
                  </button>
                  <button
                    onClick={() => moveItem(idx, 1)}
                    disabled={idx === items.length - 1}
                    className="p-0.5 text-gray-400 hover:text-[#304256] disabled:opacity-30"
                  >
                    <svg
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}
