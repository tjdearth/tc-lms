"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import TrackSelector from "@/components/TrackSelector";
import { brandFromEmail, getBrandColor, getBrandLogo } from "@/lib/brands";
import type { LmsUser, LmsTrack, Course } from "@/types";

interface TeamMember {
  name: string;
  email: string;
  avatar_url: string | null;
}

interface BrandTeam {
  gm: TeamMember | null;
  team: TeamMember[];
}

interface WikiResource {
  id: string;
  title: string;
  icon: string | null;
  node_type: string;
}

const TOTAL_STEPS = 5;

export default function OnboardingPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [step, setStep] = useState(1);
  const [user, setUser] = useState<LmsUser | null>(null);
  const [brand, setBrand] = useState("");
  const [track, setTrack] = useState<LmsTrack | null>(null);
  const [matchingCourses, setMatchingCourses] = useState<Course[]>([]);
  const [teamData, setTeamData] = useState<BrandTeam | null>(null);
  const [teamLoading, setTeamLoading] = useState(false);
  const [resources, setResources] = useState<WikiResource[]>([]);
  const [resourcesLoading, setResourcesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Auto-detect brand from session email
  const detectedBrand = session?.user?.email
    ? brandFromEmail(session.user.email)
    : null;
  const brandColor = detectedBrand ? getBrandColor(detectedBrand) : "#27a28c";

  // Derive display name
  const userName =
    user?.name || session?.user?.name || session?.user?.email?.split("@")[0] || "there";
  const firstName = userName.split(" ")[0];

  // Effective brand for team lookup and saving
  const effectiveBrand = brand || detectedBrand || "Travel Collection";

  // Fetch user profile on mount
  useEffect(() => {
    fetch("/api/learn/users")
      .then((r) => r.json())
      .then((data: LmsUser) => {
        setUser(data);
        if (data.brand) setBrand(data.brand);
        else if (detectedBrand) setBrand(detectedBrand);
      })
      .catch(console.error);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // When track is selected, fetch matching courses
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

  // Fetch team data
  const fetchTeam = useCallback(() => {
    setTeamLoading(true);
    fetch("/api/company/team")
      .then((r) => r.json())
      .then((byBrand: Record<string, BrandTeam>) => {
        setTeamData(byBrand[effectiveBrand] || null);
      })
      .catch(console.error)
      .finally(() => setTeamLoading(false));
  }, [effectiveBrand]);

  // Load team when entering step 5
  useEffect(() => {
    if (step === 4) fetchTeam();
  }, [step, fetchTeam]);

  // Load wiki resources when entering step 6
  useEffect(() => {
    if (step !== 5) return;
    setResourcesLoading(true);
    fetch("/api/learn/onboarding-resources")
      .then((r) => r.json())
      .then((data: WikiResource[]) => {
        setResources(Array.isArray(data) ? data : []);
      })
      .catch(console.error)
      .finally(() => setResourcesLoading(false));
  }, [step]);

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
          brand: effectiveBrand,
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

  // Group courses by category for Step 4
  const coursesByCategory: Record<string, Course[]> = {};
  for (const c of matchingCourses) {
    const cat = c.category || "General";
    if (!coursesByCategory[cat]) coursesByCategory[cat] = [];
    coursesByCategory[cat].push(c);
  }
  const totalMinutes = matchingCourses.reduce(
    (sum, c) => sum + (c.estimated_minutes || 0),
    0
  );

  return (
    <div className="min-h-screen bg-[#eeeeee] flex items-center justify-center p-4">
      <div className="w-full max-w-lg">
        {/* Progress indicator */}
        <div className="flex gap-2 mb-8">
          {Array.from({ length: TOTAL_STEPS }, (_, i) => i + 1).map((s) => (
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
              <div className="w-[180px] h-[100px] flex items-center justify-center mx-auto mb-6">
                <img
                  src={getBrandLogo(detectedBrand || "Travel Collection")}
                  alt={detectedBrand || "Travel Collection"}
                  style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }}
                />
              </div>
              <h1 className="text-2xl font-bold text-[#304256] mb-2">
                Welcome, {firstName}!
              </h1>
              {detectedBrand && (
                <p
                  className="text-sm font-medium mb-1"
                  style={{ color: brandColor }}
                >
                  {detectedBrand}
                </p>
              )}
              <p className="text-sm text-gray-500 mb-8 max-w-sm mx-auto">
                Your personalised learning hub at Travel Collection. We&apos;ll
                set up your profile in a few quick steps.
              </p>
              <button
                onClick={() => setStep(2)}
                className="px-8 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
              >
                Get Started
              </button>
            </div>
          )}

          {/* Step 2: Track selection */}
          {step === 2 && (
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
                  onClick={() => setStep(1)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-[#304256] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(3)}
                  disabled={!track}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Your Learning Plan */}
          {step === 3 && (
            <div>
              <h2 className="text-lg font-bold text-[#304256] mb-1">
                Your Learning Plan
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Based on your{" "}
                <span className="capitalize">
                  {track?.replace(/_/g, " ")}
                </span>{" "}
                track, here are the courses we&apos;ll enroll you in.
                We&apos;ll handle the enrollment — just click Continue.
              </p>

              {matchingCourses.length > 0 ? (
                <>
                  {Object.entries(coursesByCategory).map(([category, courses]) => (
                    <div key={category} className="mb-4">
                      <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                        {category}
                      </p>
                      <div className="space-y-2">
                        {courses.map((c) => (
                          <div
                            key={c.id}
                            className="flex items-center gap-3 p-3 border border-[#E8ECF1] rounded-lg"
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
                              className="flex-shrink-0"
                            >
                              <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z" />
                              <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z" />
                            </svg>
                            <div className="flex-1 min-w-0">
                              <span className="text-sm text-[#304256] block truncate">
                                {c.title}
                              </span>
                            </div>
                            {c.estimated_minutes > 0 && (
                              <span className="text-xs text-gray-400 flex-shrink-0">
                                {c.estimated_minutes} min
                              </span>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}

                  {totalMinutes > 0 && (
                    <div className="mt-4 p-3 bg-[#27a28c]/5 border border-[#27a28c]/20 rounded-lg text-center">
                      <span className="text-sm text-[#27a28c] font-medium">
                        {matchingCourses.length} course
                        {matchingCourses.length !== 1 ? "s" : ""} &middot; ~
                        {totalMinutes >= 60
                          ? `${Math.round(totalMinutes / 60)} hr${Math.round(totalMinutes / 60) !== 1 ? "s" : ""}`
                          : `${totalMinutes} min`}{" "}
                        total
                      </span>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-gray-400 mb-6">
                  No courses matched yet — more will be added soon.
                </p>
              )}

              <div className="flex items-center justify-between mt-8">
                <button
                  onClick={() => setStep(2)}
                  className="px-4 py-2 text-sm text-gray-500 hover:text-[#304256] transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={() => setStep(4)}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Meet Your Team */}
          {step === 4 && (
            <div>
              <h2 className="text-lg font-bold text-[#304256] mb-1">
                Meet Your Team
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Here are the people you&apos;ll be working with
                {effectiveBrand !== "Travel Collection"
                  ? ` at ${effectiveBrand}`
                  : ""}
                .
              </p>

              {teamLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#27a28c] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : teamData && (teamData.gm || teamData.team.length > 0) ? (
                <div className="space-y-4 mb-6">
                  {/* GM card — larger */}
                  {teamData.gm && (
                    <div className="flex items-center gap-4 p-4 bg-[#304256]/5 border border-[#304256]/10 rounded-xl">
                      {teamData.gm.avatar_url ? (
                        <img
                          src={teamData.gm.avatar_url}
                          alt={teamData.gm.name}
                          className="w-12 h-12 rounded-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-[#304256] flex items-center justify-center text-white font-semibold text-lg">
                          {teamData.gm.name.charAt(0)}
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-semibold text-[#304256]">
                          {teamData.gm.name}
                        </p>
                        <p className="text-xs text-gray-500">General Manager</p>
                      </div>
                    </div>
                  )}

                  {/* Team member grid */}
                  {teamData.team.length > 0 && (
                    <div className="grid grid-cols-2 gap-3">
                      {teamData.team.map((m) => (
                        <div
                          key={m.email}
                          className="flex items-center gap-3 p-3 border border-[#E8ECF1] rounded-lg"
                        >
                          {m.avatar_url ? (
                            <img
                              src={m.avatar_url}
                              alt={m.name}
                              className="w-8 h-8 rounded-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-600 font-medium text-sm">
                              {m.name.charAt(0)}
                            </div>
                          )}
                          <span className="text-sm text-[#304256] truncate">
                            {m.name}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="#9CA3AF"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">
                    Team information will be available once your brand profile is
                    fully set up.
                  </p>
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
                  onClick={() => setStep(5)}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-[#27a28c] rounded-lg hover:bg-[#27a28c]/90 transition-colors"
                >
                  Continue
                </button>
              </div>
            </div>
          )}

          {/* Step 5: Key Resources + Finish */}
          {step === 5 && (
            <div>
              <h2 className="text-lg font-bold text-[#304256] mb-1">
                Key Resources
              </h2>
              <p className="text-sm text-gray-500 mb-6">
                Explore these essential knowledge base sections as you get
                started. You can always find them in the Wiki.
              </p>

              {resourcesLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="w-6 h-6 border-2 border-[#27a28c] border-t-transparent rounded-full animate-spin" />
                </div>
              ) : resources.length > 0 ? (
                <div className="space-y-2 mb-6">
                  {resources.map((r) => (
                    <a
                      key={r.id}
                      href={`/wiki?article=${r.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 p-3 border border-[#E8ECF1] rounded-lg hover:border-[#27a28c]/40 hover:bg-[#27a28c]/5 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-[#304256]/5 flex items-center justify-center flex-shrink-0">
                        {r.icon ? (
                          <span className="text-base">{r.icon}</span>
                        ) : (
                          <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#304256"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                          </svg>
                        )}
                      </div>
                      <span className="text-sm text-[#304256] group-hover:text-[#27a28c] transition-colors">
                        {r.title}
                      </span>
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-auto text-gray-300 group-hover:text-[#27a28c] transition-colors flex-shrink-0"
                      >
                        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                        <polyline points="15 3 21 3 21 9" />
                        <line x1="10" y1="14" x2="21" y2="3" />
                      </svg>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="text-center py-6 text-sm text-gray-400 mb-6">
                  Resources will be available once the wiki is set up.
                </div>
              )}

              <div className="flex items-center justify-between">
                <button
                  onClick={() => setStep(4)}
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
  );
}
