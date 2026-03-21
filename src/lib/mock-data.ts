import { WikiNode, CalendarEvent } from "@/types";

export const mockWikiTree: WikiNode[] = [
  {
    id: "1",
    parent_id: null,
    title: "Getting Started",
    slug: null,
    sort_order: 1,
    node_type: "heading",
    html_content: null,
    search_text: null,
    brand: "salesforce-academy",
    icon: null,
    is_published: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    children: [
      {
        id: "1-1",
        parent_id: "1",
        title: "Welcome to Salesforce Academy",
        slug: "welcome",
        sort_order: 1,
        node_type: "article",
        html_content: null,
        search_text: "Welcome to the Salesforce Academy wiki.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
      },
      {
        id: "1-2",
        parent_id: "1",
        title: "How to Log In",
        slug: "how-to-log-in",
        sort_order: 2,
        node_type: "article",
        html_content: null,
        search_text: "Steps to log in to Salesforce.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
      },
      {
        id: "1-3",
        parent_id: "1",
        title: "Navigating the Dashboard",
        slug: "navigating-dashboard",
        sort_order: 3,
        node_type: "article",
        html_content: null,
        search_text: "How to navigate the Salesforce dashboard.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
      },
    ],
  },
  {
    id: "2",
    parent_id: null,
    title: "Leads & Opportunities",
    slug: null,
    sort_order: 2,
    node_type: "heading",
    html_content: null,
    search_text: null,
    brand: "salesforce-academy",
    icon: null,
    is_published: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    children: [
      {
        id: "2-1",
        parent_id: "2",
        title: "Creating a New Lead",
        slug: "creating-new-lead",
        sort_order: 1,
        node_type: "article",
        html_content: `<div class="scribe-steps-container">
          <div class="scribe-step">
            <div class="scribe-step-text">Navigate to the <strong>Leads</strong> tab in the top navigation bar.</div>
            <div class="scribe-screenshot-container"><img src="https://placehold.co/800x400/e2e8f0/475569?text=Salesforce+Leads+Tab" alt="Screenshot" /></div>
          </div>
          <div class="scribe-step">
            <div class="scribe-step-text">Click the <strong>"New"</strong> button in the top-right corner of the Leads list view.</div>
            <div class="scribe-screenshot-container"><img src="https://placehold.co/800x400/e2e8f0/475569?text=New+Lead+Button" alt="Screenshot" /></div>
          </div>
          <div class="scribe-step">
            <div class="scribe-step-text">Fill in the required fields: <strong>Last Name</strong>, <strong>Company</strong>, and <strong>Lead Status</strong>.</div>
          </div>
          <div class="scribe-step-tip">
            <strong>Tip:</strong> Always fill in the email and phone fields to make follow-up easier. Leads without contact info are harder to convert.
          </div>
          <div class="scribe-step">
            <div class="scribe-step-text">Add the lead source — select from the dropdown (e.g., Web, Referral, Trade Show).</div>
          </div>
          <div class="scribe-step">
            <div class="scribe-step-text">Click <strong>"Save"</strong> to create the lead.</div>
            <div class="scribe-screenshot-container"><img src="https://placehold.co/800x400/e2e8f0/475569?text=Save+Lead+Form" alt="Screenshot" /></div>
          </div>
          <div class="scribe-step-warning">
            <strong>Warning:</strong> Do not create duplicate leads. Always search for existing leads before creating a new one.
          </div>
        </div>`,
        search_text:
          "How to create a new lead in Salesforce. Navigate to leads tab, click new, fill fields, save.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-01-15",
        updated_at: "2026-02-10",
      },
      {
        id: "2-2",
        parent_id: "2",
        title: "Converting Leads to Opportunities",
        slug: "converting-leads",
        sort_order: 2,
        node_type: "article",
        html_content: null,
        search_text:
          "How to convert a lead into an opportunity in Salesforce.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-01-15",
        updated_at: "2026-01-15",
      },
      {
        id: "2-3",
        parent_id: "2",
        title: "Managing Opportunity Stages",
        slug: "opportunity-stages",
        sort_order: 3,
        node_type: "article",
        html_content: null,
        search_text: "Understanding and managing opportunity pipeline stages.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-01-20",
        updated_at: "2026-01-20",
      },
    ],
  },
  {
    id: "3",
    parent_id: null,
    title: "Contacts & Accounts",
    slug: null,
    sort_order: 3,
    node_type: "heading",
    html_content: null,
    search_text: null,
    brand: "salesforce-academy",
    icon: null,
    is_published: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    children: [
      {
        id: "3-1",
        parent_id: "3",
        title: "Adding a New Contact",
        slug: "adding-new-contact",
        sort_order: 1,
        node_type: "article",
        html_content: null,
        search_text: "How to add a new contact to Salesforce.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
      },
      {
        id: "3-2",
        parent_id: "3",
        title: "Linking Contacts to Accounts",
        slug: "linking-contacts-accounts",
        sort_order: 2,
        node_type: "article",
        html_content: null,
        search_text:
          "How to associate contacts with account records in Salesforce.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
      },
      {
        id: "3-3",
        parent_id: "3",
        title: "Account Hierarchies",
        slug: "account-hierarchies",
        sort_order: 3,
        node_type: "article",
        html_content: null,
        search_text: "Understanding parent and child account structures.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-01-01",
        updated_at: "2026-01-01",
      },
    ],
  },
  {
    id: "4",
    parent_id: null,
    title: "Reports & Dashboards",
    slug: null,
    sort_order: 4,
    node_type: "heading",
    html_content: null,
    search_text: null,
    brand: "salesforce-academy",
    icon: null,
    is_published: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    children: [
      {
        id: "4-1",
        parent_id: "4",
        title: "Creating a Basic Report",
        slug: "creating-basic-report",
        sort_order: 1,
        node_type: "article",
        html_content: null,
        search_text: "Step by step guide to creating a report in Salesforce.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-02-01",
        updated_at: "2026-02-01",
      },
      {
        id: "4-2",
        parent_id: "4",
        title: "Building Custom Dashboards",
        slug: "building-dashboards",
        sort_order: 2,
        node_type: "article",
        html_content: null,
        search_text: "How to build custom dashboards in Salesforce.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-02-01",
        updated_at: "2026-02-01",
      },
      {
        id: "4-3",
        parent_id: "4",
        title: "Scheduling Report Exports",
        slug: "scheduling-reports",
        sort_order: 3,
        node_type: "article",
        html_content: null,
        search_text: "How to schedule automated report exports.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-02-01",
        updated_at: "2026-02-01",
      },
    ],
  },
  {
    id: "5",
    parent_id: null,
    title: "Email & Communication",
    slug: null,
    sort_order: 5,
    node_type: "heading",
    html_content: null,
    search_text: null,
    brand: "salesforce-academy",
    icon: null,
    is_published: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
    children: [
      {
        id: "5-1",
        parent_id: "5",
        title: "Sending Emails from Salesforce",
        slug: "sending-emails",
        sort_order: 1,
        node_type: "article",
        html_content: null,
        search_text: "How to send emails directly from Salesforce.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-02-15",
        updated_at: "2026-02-15",
      },
      {
        id: "5-2",
        parent_id: "5",
        title: "Email Templates",
        slug: "email-templates",
        sort_order: 2,
        node_type: "article",
        html_content: null,
        search_text:
          "Creating and using email templates for consistent communication.",
        brand: "salesforce-academy",
        icon: null,
        is_published: true,
        created_at: "2026-02-15",
        updated_at: "2026-02-15",
      },
    ],
  },
];

export const mockCalendarEvents: CalendarEvent[] = [
  {
    id: "c1",
    brand: "Authenticus Italy",
    title: "Easter Monday",
    description: "Public holiday in Italy. Office closed.",
    date_start: "2026-04-06",
    date_end: null,
    event_type: "public_holiday",
    impact_notes: "No operations. Inform clients in advance.",
    country: "Italy",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c2",
    brand: "Unbox Spain & Portugal",
    title: "Semana Santa",
    description: "Holy Week celebrations across Spain.",
    date_start: "2026-03-29",
    date_end: "2026-04-05",
    event_type: "festival",
    impact_notes:
      "Major tourist period. Hotels at peak pricing. Book well in advance.",
    country: "Spain",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c3",
    brand: "Truly Swahili",
    title: "Great Migration Peak",
    description: "Wildebeest crossing in Masai Mara.",
    date_start: "2026-07-01",
    date_end: "2026-10-31",
    event_type: "peak_season",
    impact_notes:
      "Highest demand period. Premium pricing. Book 6-12 months ahead.",
    country: "Kenya",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c4",
    brand: "Oshinobi Travel",
    title: "Cherry Blossom Season",
    description: "Sakura viewing across Japan.",
    date_start: "2026-03-25",
    date_end: "2026-04-15",
    event_type: "peak_season",
    impact_notes:
      "Extremely high demand. Hotels sell out months in advance. Premium pricing.",
    country: "Japan",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c5",
    brand: "Kembali Indonesia",
    title: "Nyepi (Day of Silence)",
    description: "Balinese New Year. Complete shutdown in Bali.",
    date_start: "2026-03-29",
    date_end: null,
    event_type: "public_holiday",
    impact_notes:
      "Airport closed. No activities permitted. Guests must stay in hotel.",
    country: "Indonesia",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c6",
    brand: "Nira Thailand",
    title: "Songkran Festival",
    description: "Thai New Year water festival.",
    date_start: "2026-04-13",
    date_end: "2026-04-15",
    event_type: "festival",
    impact_notes:
      "Water fights in streets. Some roads closed. Festive atmosphere — great for clients who enjoy it.",
    country: "Thailand",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c7",
    brand: "Nostos Greece",
    title: "Orthodox Easter",
    description: "Major celebration across Greece.",
    date_start: "2026-04-12",
    date_end: "2026-04-13",
    event_type: "festival",
    impact_notes:
      "Authentic cultural experience. Some businesses may close. Great for culturally curious travellers.",
    country: "Greece",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c8",
    brand: "Across Mexico",
    title: "Day of the Dead",
    description: "Dia de los Muertos celebrations.",
    date_start: "2026-11-01",
    date_end: "2026-11-02",
    event_type: "festival",
    impact_notes:
      "Incredible cultural experience. Oaxaca and Mexico City are top destinations for this.",
    country: "Mexico",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c9",
    brand: "Crown Journey",
    title: "King's Birthday",
    description: "Official birthday celebration of the monarch.",
    date_start: "2026-06-13",
    date_end: null,
    event_type: "public_holiday",
    impact_notes:
      "Trooping the Colour ceremony. Some road closures in central London.",
    country: "UK",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c10",
    brand: "Majlis Retreats",
    title: "Eid al-Fitr",
    description: "End of Ramadan celebrations.",
    date_start: "2026-03-30",
    date_end: "2026-04-02",
    event_type: "festival",
    impact_notes:
      "Major holiday. Some businesses may adjust hours. Festive dining and events available.",
    country: "UAE",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c11",
    brand: "Essentially French",
    title: "Bastille Day",
    description: "French National Day.",
    date_start: "2026-07-14",
    date_end: null,
    event_type: "public_holiday",
    impact_notes:
      "Fireworks at Eiffel Tower. Parades on Champs-Elysees. Great spectacle for visitors.",
    country: "France",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c12",
    brand: "Sar Turkiye",
    title: "Republic Day",
    description: "Founding of the Turkish Republic.",
    date_start: "2026-10-29",
    date_end: null,
    event_type: "public_holiday",
    impact_notes: "National celebrations. Fireworks in major cities.",
    country: "Turkiye",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c13",
    brand: "Elura Australia",
    title: "Australia Day",
    description: "National day of Australia.",
    date_start: "2026-01-26",
    date_end: null,
    event_type: "public_holiday",
    impact_notes: "Public holiday. Fireworks in Sydney Harbour. Some businesses closed.",
    country: "Australia",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c14",
    brand: "Vista Colombia",
    title: "Carnival de Barranquilla",
    description: "One of the largest carnivals in the world.",
    date_start: "2026-02-14",
    date_end: "2026-02-17",
    event_type: "festival",
    impact_notes: "UNESCO heritage event. Book accommodation months ahead. Road closures in Barranquilla.",
    country: "Colombia",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c15",
    brand: "Awaken Peru",
    title: "Inti Raymi",
    description: "Festival of the Sun in Cusco. Ancient Inca celebration.",
    date_start: "2026-06-24",
    date_end: null,
    event_type: "festival",
    impact_notes: "Major cultural event in Cusco. Hotels sell out. Book 3-6 months ahead.",
    country: "Peru",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
  {
    id: "c16",
    brand: "Experience Morocco",
    title: "Ramadan",
    description: "Holy month of fasting.",
    date_start: "2026-02-18",
    date_end: "2026-03-19",
    event_type: "festival",
    impact_notes: "Many restaurants closed during day. Altered business hours. Evening atmosphere is magical.",
    country: "Morocco",
    recurring: true,
    created_at: "2026-01-01",
    updated_at: "2026-01-01",
  },
];

// Helper to get a flat list of all articles
export function getAllArticles(nodes: WikiNode[]): WikiNode[] {
  const articles: WikiNode[] = [];
  for (const node of nodes) {
    if (node.node_type === "article") {
      articles.push(node);
    }
    if (node.children) {
      articles.push(...getAllArticles(node.children));
    }
  }
  return articles;
}

// Helper to find an article by ID
export function findArticleById(
  nodes: WikiNode[],
  id: string
): WikiNode | null {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findArticleById(node.children, id);
      if (found) return found;
    }
  }
  return null;
}

// Helper to find parent heading for breadcrumb
export function findParentHeading(
  nodes: WikiNode[],
  articleId: string
): WikiNode | null {
  for (const node of nodes) {
    if (node.children) {
      for (const child of node.children) {
        if (child.id === articleId) return node;
      }
    }
  }
  return null;
}
