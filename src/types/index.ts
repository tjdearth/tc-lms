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
