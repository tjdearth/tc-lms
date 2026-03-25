export interface WikiNode {
  id: string;
  parent_id: string | null;
  title: string;
  slug: string | null;
  sort_order: number;
  node_type: "heading" | "article";
  html_content: string | null;
  search_text: string | null;
  brand: string;
  icon: string | null;
  is_published: boolean;
  created_at: string;
  updated_at: string;
  children?: WikiNode[];
}

export interface CalendarEvent {
  id: string;
  brand: string;
  title: string;
  description: string | null;
  date_start: string;
  date_end: string | null;
  event_type:
    | "public_holiday"
    | "festival"
    | "peak_season"
    | "low_season"
    | "office_closure"
    | "custom";
  impact_notes: string | null;
  country: string | null;
  recurring: boolean;
  created_at: string;
  updated_at: string;
}

export type LmsTrack = 'general' | 'travel_advisor' | 'operations' | 'both' | 'business_development';
export type CompletionRule = 'all_lessons' | 'all_quizzes' | 'min_score' | 'manual';
export type QuestionType = 'single_choice' | 'multi_choice' | 'true_false' | 'fill_blank' | 'ordering';
export type EnrollmentStatus = 'enrolled' | 'in_progress' | 'completed';
export type LessonStatus = 'not_started' | 'in_progress' | 'completed';
export type LessonType = 'content' | 'video' | 'quiz' | 'wiki_link';

export interface LmsUser {
  id: string;
  email: string;
  name: string | null;
  image_url: string | null;
  brand: string | null;
  track: LmsTrack | null;
  onboarded_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  code: string;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  category: string;
  tracks: LmsTrack[];
  estimated_minutes: number;
  is_published: boolean;
  is_sequential: boolean;
  completion_rule: CompletionRule;
  min_score_pct: number | null;
  brand: string;
  sort_order: number;
  due_days_after_enrollment: number | null;
  created_by: string | null;
  created_at: string;
  updated_at: string;
  modules?: Module[];
  prerequisite_ids?: string[];
  enrollment?: Enrollment;
  progress_pct?: number;
}

export interface CoursePrerequisite {
  id: string;
  course_id: string;
  prerequisite_id: string;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  lessons?: Lesson[];
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  lesson_type: LessonType;
  html_content: string | null;
  wiki_node_id: string | null;
  video_url: string | null;
  transcript: string | null;
  estimated_minutes: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
  quiz?: Quiz;
  progress?: LessonProgress;
  wiki_node?: WikiNode;
}

export interface Quiz {
  id: string;
  lesson_id: string;
  title: string;
  passing_score: number;
  max_attempts: number;
  shuffle_questions: boolean;
  created_at: string;
  updated_at: string;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_type: QuestionType;
  question_text: string;
  explanation: string | null;
  options: QuizOption[];
  points: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface QuizOption {
  id: string;
  text: string;
  is_correct?: boolean;
  position?: number;
}

export interface Enrollment {
  id: string;
  user_id: string;
  course_id: string;
  enrolled_at: string;
  due_date: string | null;
  completed_at: string | null;
  status: EnrollmentStatus;
  created_at: string;
  updated_at: string;
}

export interface LessonProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  status: LessonStatus;
  started_at: string | null;
  completed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface QuizAttempt {
  id: string;
  user_id: string;
  quiz_id: string;
  answers: Record<string, string[]>;
  score_pct: number;
  passed: boolean;
  started_at: string;
  completed_at: string | null;
  created_at: string;
}

export interface CourseTemplate {
  name: string;
  description: string;
  category: string;
  modules: { title: string; lessons: { title: string; type: LessonType }[] }[];
}
