"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import AppShell from "@/components/AppShell";
import TrackSelector from "@/components/TrackSelector";
import { BRAND_NAMES } from "@/lib/brands";
import type { LmsUser, LmsTrack, Course } from "@/types";

const allBrands = ["Travel Collection HQ", ...BRAND_NAMES];

export default function OnboardingPage() {
  useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [, setUser] = useState<LmsUser | null>(null);
  const [brand, setBrand] = useState("");
  const [track, setTrack] = useState<LmsTrack | null>(null);
  const [matchingCourses, setMatchingCourses] = useState<Course[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Fetch user profile to pre-populate brand
  useEffect(() => {
    fetch("/api/learn/users")
      .then((r) => r.json())
      .then((data: LmsUser) => {
        setUser(data);
        if (data.brand) setBrand(data.brand);
      })
      .catch(console.error);
  }, []);

  // When track is selected, fetch matching courses for confirmation step
  useEffect(() => {
    if (!track) return;
    fetch("/api/learn/courses")
      .then((r) => r.json())
      .then((courses: Course[]) => {
        const filtered = courses.filter(
          (c) => c.is_published && c.tracks.includes(track)
        );
        setMatchingCourses(filtered);
      })
      .catch(console.error);
  }, [track]);

  const handleFinish = async () => {
    if (!track || submitting) return;
    setSubmitting(true);

    try {
      // Update user profile
      await fetch("/api/learn/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          track,
          brand,
          onboarded_at: new Date().toISOString(),
        }),
      });

      // Enroll in matching courses
      for (const course of matchingCourses) {
        await fetch("/api/learn/enroll", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ course_id: course.id }),
        });
      }

      router.push("/learn");
    } catch (err) {
      console.error("Onboarding error:", err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AppShell>
      <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Progress indicator */}
          <div className="flex gap-2 mb-8">
            {[1, 2, 3, 4].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
                  s <= step ? "bg-[#27a28c]" : "bg-[#E8ECF1]"
                }`}
              />
            ))}
          </div>

          <div className="bg-white border border-[#E8ECF1] rounded-xl shadow-sm p-8">
            {/* Step 1: Welcome */}
            {step === 1 && (
              <div className="text-center">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#27a28c] to-[#304256] flex items-center justify-center mx-auto mb-6">
                  <svg
                    width="32"
                    height="32"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="white"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                    <path d="M6 12v5c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2v-5" />
                  </svg>
                </div>
                <h1 className="text-2xl font-bold text-[#304256] mb-2">
                  Welcome to Atlas Learning
                </h1>
                <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                  Your personalised learning hub at Travel Collection. We&apos;ll set
                  up your profile in a few quick steps.
                </p>
                <button
                  onClick={() => setStep(2)}
                  className="px-8 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
                >
                  Get Started
                </button>
              </div>
            )}

            {/* Step 2: Brand selection */}
            {step === 2 && (
              <div>
                <h2 className="text-lg font-bold text-[#304256] mb-1">
                  Select Your Brand
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Which DMC brand are you part of?
                </p>

                <select
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm text-[#304256] bg-white border border-[#E8ECF1] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#27a28c]/30 focus:border-[#27a28c] transition-colors"
                >
                  <option value="">Choose a brand...</option>
                  {allBrands.map((b) => (
                    <option key={b} value={b}>
                      {b}
                    </option>
                  ))}
                </select>

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setStep(1)}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-[#304256] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    disabled={!brand}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Track selection */}
            {step === 3 && (
              <div>
                <h2 className="text-lg font-bold text-[#304256] mb-1">
                  Choose Your Learning Track
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  This determines which courses are recommended for you.
                </p>

                <TrackSelector selected={track} onSelect={setTrack} />

                <div className="flex items-center justify-between mt-8">
                  <button
                    onClick={() => setStep(2)}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-[#304256] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(4)}
                    disabled={!track}
                    className="px-6 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Confirmation */}
            {step === 4 && (
              <div>
                <h2 className="text-lg font-bold text-[#304256] mb-1">
                  You&apos;re All Set
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Here&apos;s a summary of your choices. You can change these later
                  in settings.
                </p>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between p-3 bg-[#eeeeee] rounded-lg">
                    <span className="text-xs text-gray-500">Brand</span>
                    <span className="text-sm font-medium text-[#304256]">
                      {brand}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-[#eeeeee] rounded-lg">
                    <span className="text-xs text-gray-500">
                      Learning Track
                    </span>
                    <span className="text-sm font-medium text-[#304256] capitalize">
                      {track?.replace(/_/g, " ")}
                    </span>
                  </div>
                </div>

                {matchingCourses.length > 0 && (
                  <div className="mb-6">
                    <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                      You&apos;ll be enrolled in
                    </p>
                    <div className="space-y-2">
                      {matchingCourses.map((c) => (
                        <div
                          key={c.id}
                          className="flex items-center gap-2 p-2.5 border border-[#E8ECF1] rounded-lg"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#27a28c"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                            <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                          </svg>
                          <span className="text-sm text-[#304256]">
                            {c.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <button
                    onClick={() => setStep(3)}
                    className="px-4 py-2 text-sm text-gray-500 hover:text-[#304256] transition-colors"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleFinish}
                    disabled={submitting}
                    className="px-8 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50"
                  >
                    {submitting ? "Setting up..." : "Start Learning"}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}
