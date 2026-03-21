-- TC Wiki/LMS Seed Data
-- Run this AFTER the migration (001_initial_schema.sql)

-- ============================================================
-- PART A: Wiki Tree — Salesforce Academy
-- ============================================================

-- Use a DO block so we can use variables for parent references
DO $$
DECLARE
  -- Level 1
  v_sf_academy UUID;
  -- Level 2
  v_02_setting_up UUID;
  v_03_core UUID;
  -- Level 3
  v_31_inquiries UUID;
  v_32_trips UUID;
  v_33_dashboards UUID;
  v_34_agencies UUID;
  v_35_locations UUID;
  -- Level 4
  v_321_creating UUID;
  v_322_status UUID;
  v_323_sold UUID;
  v_324_cases UUID;
  -- Level 5
  v_3211_new_trip UUID;
  v_3212_proposal UUID;
  v_3213_editing UUID;
  v_3214_sold_proposal UUID;
  v_3215_combo UUID;
  v_3216_manual UUID;
  v_3217_automation UUID;
  -- Level 6
  v_32121_scratch UUID;
  v_32122_import UUID;
  v_32123_breakdown UUID;
BEGIN

-- Salesforce Academy (root heading)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), NULL, 'Salesforce Academy', 'salesforce-academy', 1, 'heading', 'tc', 'graduation-cap')
RETURNING id INTO v_sf_academy;

-- 02. Setting Up Salesforce
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_sf_academy, '02. Setting Up Salesforce', 'setting-up-salesforce', 2, 'heading', 'tc', 'settings')
RETURNING id INTO v_02_setting_up;

-- 03. Core Salesforce
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_sf_academy, '03. Core Salesforce', 'core-salesforce', 3, 'heading', 'tc', 'database')
RETURNING id INTO v_03_core;

-- 3.1 Managing Inquiries
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_03_core, '3.1 Managing Inquiries', 'managing-inquiries', 1, 'heading', 'tc', 'inbox')
RETURNING id INTO v_31_inquiries;

-- 3.2 Managing Trips
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_03_core, '3.2 Managing Trips', 'managing-trips', 2, 'heading', 'tc', 'map')
RETURNING id INTO v_32_trips;

-- 3.3 Travel Advisors Dashboards
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_03_core, '3.3 Travel Advisors Dashboards', 'travel-advisors-dashboards', 3, 'heading', 'tc', 'bar-chart')
RETURNING id INTO v_33_dashboards;

-- 3.4 Managing Agencies
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_03_core, '3.4 Managing Agencies', 'managing-agencies', 4, 'heading', 'tc', 'building')
RETURNING id INTO v_34_agencies;

-- 3.5 Managing Locations
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_03_core, '3.5 Managing Locations', 'managing-locations', 5, 'heading', 'tc', 'map-pin')
RETURNING id INTO v_35_locations;

-- 3.2.1 Creating a Trip
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_32_trips, '3.2.1 Creating a Trip', 'creating-a-trip', 1, 'heading', 'tc', NULL)
RETURNING id INTO v_321_creating;

-- 3.2.2 Trip Status
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_32_trips, '3.2.2 Trip Status', 'trip-status', 2, 'heading', 'tc', NULL)
RETURNING id INTO v_322_status;

-- 3.2.3 Sold Trips
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_32_trips, '3.2.3 Sold Trips', 'sold-trips', 3, 'heading', 'tc', NULL)
RETURNING id INTO v_323_sold;

-- 3.2.4 Trip Cases
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, icon)
VALUES (gen_random_uuid(), v_32_trips, '3.2.4 Trip Cases', 'trip-cases', 4, 'heading', 'tc', NULL)
RETURNING id INTO v_324_cases;

-- 3.2.1.1 Creating a New Trip (ARTICLE with Scribe-style content)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, html_content, search_text)
VALUES (gen_random_uuid(), v_321_creating, '3.2.1.1 Creating a New Trip', 'creating-a-new-trip', 1, 'article', 'tc',
'<div class="scribe-content">
  <h1>Creating a New Trip</h1>
  <p class="scribe-description">This guide walks you through creating a new trip record in Salesforce, from the initial inquiry through to trip confirmation.</p>

  <div class="scribe-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <p>Navigate to the <strong>Trips</strong> tab in the top navigation bar of Salesforce.</p>
      <div class="screenshot-placeholder" style="background: #f0f4f8; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 40px; text-align: center; color: #718096; margin: 16px 0;">
        <p>[Screenshot: Salesforce top navigation with Trips tab highlighted]</p>
      </div>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <p>Click the <strong>"New Trip"</strong> button in the upper right corner of the Trips list view.</p>
      <div class="screenshot-placeholder" style="background: #f0f4f8; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 40px; text-align: center; color: #718096; margin: 16px 0;">
        <p>[Screenshot: Trips list view with New Trip button highlighted]</p>
      </div>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <p>Fill in the <strong>Trip Details</strong> form:</p>
      <ul>
        <li><strong>Trip Name:</strong> Use the format <code>[Agency] - [Destination] - [Travel Date]</code></li>
        <li><strong>Inquiry:</strong> Link to the related inquiry record</li>
        <li><strong>Travel Advisor:</strong> Select the assigned TA from the lookup</li>
        <li><strong>Destination:</strong> Select the primary destination country</li>
        <li><strong>Pax Count:</strong> Enter total number of travellers</li>
        <li><strong>Travel Dates:</strong> Enter the start and end dates</li>
      </ul>
      <div class="screenshot-placeholder" style="background: #f0f4f8; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 40px; text-align: center; color: #718096; margin: 16px 0;">
        <p>[Screenshot: New Trip form with fields filled in]</p>
      </div>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">4</div>
    <div class="step-content">
      <p>Set the <strong>Trip Status</strong> to "New" (this is the default).</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">5</div>
    <div class="step-content">
      <p>Click <strong>"Save"</strong> to create the trip record.</p>
      <div class="screenshot-placeholder" style="background: #f0f4f8; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 40px; text-align: center; color: #718096; margin: 16px 0;">
        <p>[Screenshot: Saved trip record detail page]</p>
      </div>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">6</div>
    <div class="step-content">
      <p>After saving, you will be redirected to the <strong>Trip Detail</strong> page. From here you can:</p>
      <ul>
        <li>Create a new <strong>Proposal</strong> (see section 3.2.1.2)</li>
        <li>Add <strong>Trip Notes</strong> in the Activity section</li>
        <li>Link related <strong>Cases</strong> for supplier communications</li>
        <li>Upload relevant <strong>Documents</strong></li>
      </ul>
    </div>
  </div>

  <div class="scribe-tip" style="background: #ebf8ff; border-left: 4px solid #4299e1; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
    <strong>Tip:</strong> Always link the trip to an inquiry first. This ensures proper tracking in reporting and the TA dashboard.
  </div>
</div>',
'Creating a new trip Salesforce navigate trips tab new trip button trip details form trip name inquiry travel advisor destination pax count travel dates trip status save proposal trip notes cases documents')
RETURNING id INTO v_3211_new_trip;

-- 3.2.1.2 Creating a Proposal (heading)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand)
VALUES (gen_random_uuid(), v_321_creating, '3.2.1.2 Creating a Proposal', 'creating-a-proposal', 2, 'heading', 'tc')
RETURNING id INTO v_3212_proposal;

-- 3.2.1.2.1 Creating a proposal from scratch (article)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, html_content, search_text)
VALUES (gen_random_uuid(), v_3212_proposal, '3.2.1.2.1 Creating a proposal from scratch', 'creating-proposal-from-scratch', 1, 'article', 'tc',
'<div class="scribe-content">
  <h1>Creating a Proposal from Scratch</h1>
  <p class="scribe-description">Learn how to build a brand new proposal in Salesforce without using an existing template or import.</p>

  <div class="scribe-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <p>Open the <strong>Trip record</strong> you want to create a proposal for.</p>
      <div class="screenshot-placeholder" style="background: #f0f4f8; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 40px; text-align: center; color: #718096; margin: 16px 0;">
        <p>[Screenshot: Trip detail page]</p>
      </div>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <p>In the <strong>Proposals</strong> related list, click <strong>"New Proposal"</strong>.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <p>Select <strong>"Create from Scratch"</strong> as the proposal creation method.</p>
      <div class="screenshot-placeholder" style="background: #f0f4f8; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 40px; text-align: center; color: #718096; margin: 16px 0;">
        <p>[Screenshot: Proposal creation method selection dialog]</p>
      </div>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">4</div>
    <div class="step-content">
      <p>Fill in the proposal header fields:</p>
      <ul>
        <li><strong>Proposal Name:</strong> A descriptive name (e.g., "Italy Luxury 10-Day")</li>
        <li><strong>Currency:</strong> Select the billing currency</li>
        <li><strong>Valid Until:</strong> Set the proposal expiry date</li>
        <li><strong>Margin %:</strong> Enter the target margin percentage</li>
      </ul>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">5</div>
    <div class="step-content">
      <p>Add <strong>day-by-day itinerary lines</strong> using the "Add Day" button. For each day, specify:</p>
      <ul>
        <li>Date and location</li>
        <li>Accommodation (linked to supplier)</li>
        <li>Activities and transfers</li>
        <li>Meal plan</li>
      </ul>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">6</div>
    <div class="step-content">
      <p>Click <strong>"Calculate Pricing"</strong> to generate the cost breakdown, then click <strong>"Save"</strong>.</p>
    </div>
  </div>

  <div class="scribe-tip" style="background: #ebf8ff; border-left: 4px solid #4299e1; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
    <strong>Tip:</strong> You can duplicate a proposal later if the client requests changes. Always keep the original version for audit purposes.
  </div>
</div>',
'Creating proposal from scratch new proposal create trip record proposals related list header fields proposal name currency valid until margin itinerary lines add day accommodation activities transfers meal plan calculate pricing')
RETURNING id INTO v_32121_scratch;

-- 3.2.1.2.2 Importing a proposal (article)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, html_content, search_text)
VALUES (gen_random_uuid(), v_3212_proposal, '3.2.1.2.2 Importing a proposal', 'importing-a-proposal', 2, 'article', 'tc',
'<div class="scribe-content">
  <h1>Importing a Proposal</h1>
  <p class="scribe-description">How to import a proposal from an Excel template or an existing proposal in another trip.</p>

  <div class="scribe-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <p>Open the Trip record and navigate to the <strong>Proposals</strong> related list.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <p>Click <strong>"New Proposal"</strong> and select <strong>"Import"</strong> as the creation method.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <p>Choose your import source:</p>
      <ul>
        <li><strong>Excel Upload:</strong> Upload a properly formatted .xlsx file using the TC template</li>
        <li><strong>Copy from Trip:</strong> Select an existing trip and proposal to duplicate</li>
      </ul>
      <div class="screenshot-placeholder" style="background: #f0f4f8; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 40px; text-align: center; color: #718096; margin: 16px 0;">
        <p>[Screenshot: Import source selection dialog]</p>
      </div>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">4</div>
    <div class="step-content">
      <p>Review the imported data, make any adjustments, and click <strong>"Save"</strong>.</p>
    </div>
  </div>
</div>',
'Importing proposal import excel upload copy from trip xlsx template duplicate existing proposal import source')
RETURNING id INTO v_32122_import;

-- 3.2.1.2.3 Breakdown (article)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, html_content, search_text)
VALUES (gen_random_uuid(), v_3212_proposal, '3.2.1.2.3 Breakdown', 'proposal-breakdown', 3, 'article', 'tc',
'<div class="scribe-content">
  <h1>Proposal Breakdown</h1>
  <p class="scribe-description">Understanding the cost breakdown view and how pricing is structured in a proposal.</p>

  <div class="scribe-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <p>Open a saved proposal and click the <strong>"Breakdown"</strong> tab.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <p>The breakdown shows costs organized by category:</p>
      <ul>
        <li><strong>Accommodation:</strong> Hotel/lodge costs per night</li>
        <li><strong>Transfers:</strong> Ground transport, flights, boats</li>
        <li><strong>Activities:</strong> Excursions, tours, experiences</li>
        <li><strong>Meals:</strong> Included meals beyond accommodation plans</li>
        <li><strong>Guides:</strong> Tour guide fees and expenses</li>
        <li><strong>Extras:</strong> Travel insurance, visa fees, tips</li>
      </ul>
      <div class="screenshot-placeholder" style="background: #f0f4f8; border: 2px dashed #cbd5e0; border-radius: 8px; padding: 40px; text-align: center; color: #718096; margin: 16px 0;">
        <p>[Screenshot: Proposal breakdown view with cost categories]</p>
      </div>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <p>Review the <strong>margin summary</strong> at the bottom showing: cost price, selling price, margin amount, and margin percentage.</p>
    </div>
  </div>
</div>',
'Proposal breakdown cost pricing accommodation transfers activities meals guides extras margin summary cost price selling price margin percentage')
RETURNING id INTO v_32123_breakdown;

-- 3.2.1.3 Editing a Proposal (article)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, html_content, search_text)
VALUES (gen_random_uuid(), v_321_creating, '3.2.1.3 Editing a Proposal', 'editing-a-proposal', 3, 'article', 'tc',
'<div class="scribe-content">
  <h1>Editing a Proposal</h1>
  <p class="scribe-description">How to modify an existing proposal including adding days, changing suppliers, and recalculating pricing.</p>

  <div class="scribe-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <p>Open the proposal you want to edit from the Trip''s Proposals related list.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <p>Click the <strong>"Edit"</strong> button at the top of the proposal detail page.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <p>Make your changes — you can modify any field, add/remove itinerary days, or change supplier links.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">4</div>
    <div class="step-content">
      <p>Click <strong>"Recalculate"</strong> if you changed any pricing elements, then <strong>"Save"</strong>.</p>
    </div>
  </div>

  <div class="scribe-tip" style="background: #fefcbf; border-left: 4px solid #ecc94b; padding: 16px; border-radius: 0 8px 8px 0; margin: 16px 0;">
    <strong>Warning:</strong> If the proposal has already been sent to the client, consider creating a new version instead of editing the existing one.
  </div>
</div>',
'Editing proposal modify existing add days change suppliers recalculate pricing edit button itinerary save version')
RETURNING id INTO v_3213_editing;

-- 3.2.1.4 Sold Proposal (article)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, html_content, search_text)
VALUES (gen_random_uuid(), v_321_creating, '3.2.1.4 Sold Proposal', 'sold-proposal', 4, 'article', 'tc',
'<div class="scribe-content">
  <h1>Sold Proposal</h1>
  <p class="scribe-description">What happens when a proposal is marked as sold and the steps to confirm it.</p>

  <div class="scribe-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <p>Once the client confirms, open the winning proposal and click <strong>"Mark as Sold"</strong>.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <p>Confirm the <strong>final selling price</strong> and <strong>payment terms</strong> in the confirmation dialog.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <p>The system will automatically:</p>
      <ul>
        <li>Update the Trip Status to "Sold"</li>
        <li>Generate supplier confirmation tasks</li>
        <li>Create the payment schedule</li>
        <li>Notify the operations team</li>
      </ul>
    </div>
  </div>
</div>',
'Sold proposal mark as sold client confirms final selling price payment terms trip status supplier confirmation tasks payment schedule operations team')
RETURNING id INTO v_3214_sold_proposal;

-- 3.2.1.5 Creating a Combo (article)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, html_content, search_text)
VALUES (gen_random_uuid(), v_321_creating, '3.2.1.5 Creating a Combo', 'creating-a-combo', 5, 'article', 'tc',
'<div class="scribe-content">
  <h1>Creating a Combo Trip</h1>
  <p class="scribe-description">How to create combo trips that span multiple DMC destinations.</p>

  <div class="scribe-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <p>From the Trip record, click <strong>"Create Combo"</strong> in the actions menu.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <p>Select the <strong>additional DMC destinations</strong> that will be part of the combo (e.g., Italy + France).</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <p>The system creates linked trip records in each DMC''s Salesforce org. Each DMC manages their portion independently.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">4</div>
    <div class="step-content">
      <p>The <strong>lead DMC</strong> (usually the first destination) coordinates the overall proposal and client communication.</p>
    </div>
  </div>
</div>',
'Creating combo trip multiple DMC destinations linked trip records lead DMC coordinate overall proposal')
RETURNING id INTO v_3215_combo;

-- 3.2.1.6 Manually Creating (article)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, html_content, search_text)
VALUES (gen_random_uuid(), v_321_creating, '3.2.1.6 Manually Creating', 'manually-creating', 6, 'article', 'tc',
'<div class="scribe-content">
  <h1>Manually Creating a Trip</h1>
  <p class="scribe-description">When and how to manually create a trip record without going through the standard inquiry flow.</p>

  <div class="scribe-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <p>This is used for <strong>direct bookings</strong>, <strong>repeat clients</strong>, or when a trip needs to be created outside the normal inquiry process.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <p>Go to the Trips tab and click <strong>"New Trip"</strong>. Select <strong>"Manual Entry"</strong> as the source.</p>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">3</div>
    <div class="step-content">
      <p>Fill in all required fields. Note: you must manually link or create an inquiry record for proper reporting.</p>
    </div>
  </div>
</div>',
'Manually creating trip direct bookings repeat clients manual entry source inquiry record reporting')
RETURNING id INTO v_3216_manual;

-- 3.2.1.7 Automation (article)
INSERT INTO wiki_nodes (id, parent_id, title, slug, sort_order, node_type, brand, html_content, search_text)
VALUES (gen_random_uuid(), v_321_creating, '3.2.1.7 Automation', 'trip-automation', 7, 'article', 'tc',
'<div class="scribe-content">
  <h1>Trip Automation</h1>
  <p class="scribe-description">Overview of automated workflows that trigger during the trip lifecycle.</p>

  <div class="scribe-step">
    <div class="step-number">1</div>
    <div class="step-content">
      <p>Salesforce has several <strong>automated flows</strong> configured for trips:</p>
      <ul>
        <li><strong>Auto-assignment:</strong> New inquiries route to the correct DMC based on destination</li>
        <li><strong>Status updates:</strong> Trip status changes trigger notifications to relevant team members</li>
        <li><strong>Payment reminders:</strong> Automated emails sent before payment due dates</li>
        <li><strong>Supplier confirmations:</strong> Tasks auto-created when a proposal is sold</li>
        <li><strong>Post-trip survey:</strong> Sent automatically 3 days after the trip end date</li>
      </ul>
    </div>
  </div>

  <div class="scribe-step">
    <div class="step-number">2</div>
    <div class="step-content">
      <p>To view or modify automations, navigate to <strong>Setup > Process Automation > Flows</strong> (admin access required).</p>
    </div>
  </div>
</div>',
'Trip automation automated workflows auto-assignment inquiries destination status updates notifications payment reminders supplier confirmations post-trip survey flows process automation')
RETURNING id INTO v_3217_automation;

END $$;


-- ============================================================
-- PART B: Calendar Events — Public Holidays & Festivals 2025-2026
-- ============================================================

-- Clear existing calendar seed data (safe for re-runs)
DELETE FROM calendar_events WHERE created_at < now();

-- ============================
-- ITALY (authenticus_italy)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('authenticus_italy', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Italy', true, 'National holiday — offices and most businesses closed'),
('authenticus_italy', 'Epiphany', '2025-01-06', 'public_holiday', 'Italy', true, 'National holiday — La Befana celebrations'),
('authenticus_italy', 'Easter Monday', '2025-04-21', 'public_holiday', 'Italy', true, 'Pasquetta — many Italians travel; high domestic tourism'),
('authenticus_italy', 'Liberation Day', '2025-04-25', 'public_holiday', 'Italy', true, 'National holiday — parades and ceremonies'),
('authenticus_italy', 'Labour Day', '2025-05-01', 'public_holiday', 'Italy', true, 'National holiday'),
('authenticus_italy', 'Republic Day', '2025-06-02', 'public_holiday', 'Italy', true, 'Festa della Repubblica — military parade in Rome'),
('authenticus_italy', 'Ferragosto', '2025-08-15', 'public_holiday', 'Italy', true, 'Major holiday — most Italians on vacation; many businesses closed for 1-2 weeks around this date'),
('authenticus_italy', 'All Saints'' Day', '2025-11-01', 'public_holiday', 'Italy', true, 'National holiday'),
('authenticus_italy', 'Immaculate Conception', '2025-12-08', 'public_holiday', 'Italy', true, 'National holiday — Christmas markets open'),
('authenticus_italy', 'Christmas Day', '2025-12-25', 'public_holiday', 'Italy', true, 'National holiday — offices closed Dec 24-Jan 1 typically'),
('authenticus_italy', 'St Stephen''s Day', '2025-12-26', 'public_holiday', 'Italy', true, 'National holiday'),
('authenticus_italy', 'Venice Carnival', '2025-02-15', 'festival', 'Italy', true, 'Major festival — Venice extremely busy; book accommodation months ahead'),
('authenticus_italy', 'Palio di Siena (July)', '2025-07-02', 'festival', 'Italy', true, 'Famous horse race — Siena fully booked well in advance'),
('authenticus_italy', 'Palio di Siena (August)', '2025-08-16', 'festival', 'Italy', true, 'Second annual Palio horse race'),
('authenticus_italy', 'Venice Film Festival', '2025-08-27', 'festival', 'Italy', false, 'Major international event — Venice Lido very busy'),
-- 2026
('authenticus_italy', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Italy', true, NULL),
('authenticus_italy', 'Epiphany', '2026-01-06', 'public_holiday', 'Italy', true, NULL),
('authenticus_italy', 'Easter Monday', '2026-04-06', 'public_holiday', 'Italy', true, NULL),
('authenticus_italy', 'Liberation Day', '2026-04-25', 'public_holiday', 'Italy', true, NULL),
('authenticus_italy', 'Labour Day', '2026-05-01', 'public_holiday', 'Italy', true, NULL),
('authenticus_italy', 'Republic Day', '2026-06-02', 'public_holiday', 'Italy', true, NULL),
('authenticus_italy', 'Ferragosto', '2026-08-15', 'public_holiday', 'Italy', true, 'Most businesses closed mid-August'),
('authenticus_italy', 'All Saints'' Day', '2026-11-01', 'public_holiday', 'Italy', true, NULL),
('authenticus_italy', 'Christmas Day', '2026-12-25', 'public_holiday', 'Italy', true, NULL),
('authenticus_italy', 'St Stephen''s Day', '2026-12-26', 'public_holiday', 'Italy', true, NULL);

-- ============================
-- SPAIN (unbox_spain_portugal)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('unbox_spain_portugal', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Spain', true, NULL),
('unbox_spain_portugal', 'Epiphany', '2025-01-06', 'public_holiday', 'Spain', true, 'Three Kings Day — major gift-giving holiday; parades evening before'),
('unbox_spain_portugal', 'Good Friday', '2025-04-18', 'public_holiday', 'Spain', true, 'Semana Santa — massive processions especially in Seville, Malaga'),
('unbox_spain_portugal', 'Labour Day', '2025-05-01', 'public_holiday', 'Spain', true, NULL),
('unbox_spain_portugal', 'Assumption', '2025-08-15', 'public_holiday', 'Spain', true, NULL),
('unbox_spain_portugal', 'National Day', '2025-10-12', 'public_holiday', 'Spain', true, 'Fiesta Nacional — military parade in Madrid'),
('unbox_spain_portugal', 'All Saints'' Day', '2025-11-01', 'public_holiday', 'Spain', true, NULL),
('unbox_spain_portugal', 'Constitution Day', '2025-12-06', 'public_holiday', 'Spain', true, 'Puente holiday — many take Dec 6-8 off'),
('unbox_spain_portugal', 'Immaculate Conception', '2025-12-08', 'public_holiday', 'Spain', true, NULL),
('unbox_spain_portugal', 'Christmas Day', '2025-12-25', 'public_holiday', 'Spain', true, NULL),
('unbox_spain_portugal', 'La Tomatina', '2025-08-27', 'festival', 'Spain', true, 'Famous tomato fight festival in Bunol — book early'),
('unbox_spain_portugal', 'San Fermin / Running of the Bulls', '2025-07-06', 'festival', 'Spain', true, 'Pamplona — runs July 6-14; extremely busy'),
('unbox_spain_portugal', 'Las Fallas', '2025-03-15', 'festival', 'Spain', true, 'Valencia — March 15-19; massive fire festival'),
('unbox_spain_portugal', 'Semana Santa', '2025-04-13', 'festival', 'Spain', true, 'Holy Week — processions nationwide; peak hotel demand in Andalusia'),
-- 2026
('unbox_spain_portugal', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Spain', true, NULL),
('unbox_spain_portugal', 'Epiphany', '2026-01-06', 'public_holiday', 'Spain', true, NULL),
('unbox_spain_portugal', 'Good Friday', '2026-04-03', 'public_holiday', 'Spain', true, NULL),
('unbox_spain_portugal', 'National Day', '2026-10-12', 'public_holiday', 'Spain', true, NULL),
('unbox_spain_portugal', 'Christmas Day', '2026-12-25', 'public_holiday', 'Spain', true, NULL);

-- ============================
-- PORTUGAL (unbox_spain_portugal)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('unbox_spain_portugal', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'Good Friday', '2025-04-18', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'Liberty Day', '2025-04-25', 'public_holiday', 'Portugal', true, 'Carnation Revolution anniversary'),
('unbox_spain_portugal', 'Labour Day', '2025-05-01', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'Portugal Day', '2025-06-10', 'public_holiday', 'Portugal', true, 'Dia de Portugal — celebrations nationwide'),
('unbox_spain_portugal', 'Assumption', '2025-08-15', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'Republic Day', '2025-10-05', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'All Saints'' Day', '2025-11-01', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'Restoration of Independence', '2025-12-01', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'Christmas Day', '2025-12-25', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'Lisbon Festa de Santo Antonio', '2025-06-13', 'festival', 'Portugal', true, 'Patron saint festival — Lisbon''s biggest party; sardine grills and street celebrations'),
-- 2026
('unbox_spain_portugal', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'Liberty Day', '2026-04-25', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'Portugal Day', '2026-06-10', 'public_holiday', 'Portugal', true, NULL),
('unbox_spain_portugal', 'Christmas Day', '2026-12-25', 'public_holiday', 'Portugal', true, NULL);

-- ============================
-- KENYA (truly_swahili)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('truly_swahili', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Kenya', true, NULL),
('truly_swahili', 'Good Friday', '2025-04-18', 'public_holiday', 'Kenya', true, NULL),
('truly_swahili', 'Easter Monday', '2025-04-21', 'public_holiday', 'Kenya', true, NULL),
('truly_swahili', 'Labour Day', '2025-05-01', 'public_holiday', 'Kenya', true, NULL),
('truly_swahili', 'Madaraka Day', '2025-06-01', 'public_holiday', 'Kenya', true, 'Self-rule anniversary'),
('truly_swahili', 'Eid al-Fitr', '2025-03-30', 'public_holiday', 'Kenya', true, 'End of Ramadan — date varies; especially celebrated on the coast'),
('truly_swahili', 'Eid al-Adha', '2025-06-07', 'public_holiday', 'Kenya', true, 'Festival of sacrifice — date varies'),
('truly_swahili', 'Mashujaa Day', '2025-10-20', 'public_holiday', 'Kenya', true, 'Heroes Day'),
('truly_swahili', 'Jamhuri Day', '2025-12-12', 'public_holiday', 'Kenya', true, 'Independence Day'),
('truly_swahili', 'Christmas Day', '2025-12-25', 'public_holiday', 'Kenya', true, NULL),
('truly_swahili', 'Boxing Day', '2025-12-26', 'public_holiday', 'Kenya', true, NULL),
('truly_swahili', 'Great Wildebeest Migration (Masai Mara)', '2025-07-01', 'peak_season', 'Kenya', true, 'Peak wildlife viewing July-October; lodges book up 6+ months ahead'),
('truly_swahili', 'Lamu Cultural Festival', '2025-11-20', 'festival', 'Kenya', false, 'Traditional Swahili culture showcase on Lamu Island'),
-- 2026
('truly_swahili', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Kenya', true, NULL),
('truly_swahili', 'Madaraka Day', '2026-06-01', 'public_holiday', 'Kenya', true, NULL),
('truly_swahili', 'Eid al-Fitr', '2026-03-20', 'public_holiday', 'Kenya', true, 'Approximate date — varies with moon sighting'),
('truly_swahili', 'Jamhuri Day', '2026-12-12', 'public_holiday', 'Kenya', true, NULL),
('truly_swahili', 'Christmas Day', '2026-12-25', 'public_holiday', 'Kenya', true, NULL);

-- ============================
-- TANZANIA (truly_swahili)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('truly_swahili', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Tanzania', true, NULL),
('truly_swahili', 'Zanzibar Revolution Day', '2025-01-12', 'public_holiday', 'Tanzania', true, NULL),
('truly_swahili', 'Good Friday', '2025-04-18', 'public_holiday', 'Tanzania', true, NULL),
('truly_swahili', 'Union Day', '2025-04-26', 'public_holiday', 'Tanzania', true, 'Celebrates union of Tanganyika and Zanzibar'),
('truly_swahili', 'Labour Day', '2025-05-01', 'public_holiday', 'Tanzania', true, NULL),
('truly_swahili', 'Saba Saba Day', '2025-07-07', 'public_holiday', 'Tanzania', true, 'Industry and commerce day'),
('truly_swahili', 'Nane Nane Day', '2025-08-08', 'public_holiday', 'Tanzania', true, 'Farmers Day'),
('truly_swahili', 'Nyerere Day', '2025-10-14', 'public_holiday', 'Tanzania', true, NULL),
('truly_swahili', 'Independence Day', '2025-12-09', 'public_holiday', 'Tanzania', true, NULL),
('truly_swahili', 'Christmas Day', '2025-12-25', 'public_holiday', 'Tanzania', true, NULL),
('truly_swahili', 'Eid al-Fitr', '2025-03-30', 'public_holiday', 'Tanzania', true, 'Especially celebrated in Zanzibar'),
('truly_swahili', 'Serengeti Wildebeest Calving Season', '2025-01-15', 'peak_season', 'Tanzania', true, 'Jan-March in southern Serengeti; popular for safari'),
('truly_swahili', 'Zanzibar International Film Festival', '2025-07-10', 'festival', 'Tanzania', false, 'Major cultural event in Stone Town');

-- ============================
-- UGANDA (truly_swahili)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('truly_swahili', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Uganda', true, NULL),
('truly_swahili', 'NRM Liberation Day', '2025-01-26', 'public_holiday', 'Uganda', true, NULL),
('truly_swahili', 'International Women''s Day', '2025-03-08', 'public_holiday', 'Uganda', true, NULL),
('truly_swahili', 'Good Friday', '2025-04-18', 'public_holiday', 'Uganda', true, NULL),
('truly_swahili', 'Labour Day', '2025-05-01', 'public_holiday', 'Uganda', true, NULL),
('truly_swahili', 'Martyrs Day', '2025-06-03', 'public_holiday', 'Uganda', true, 'Uganda Martyrs — pilgrimage to Namugongo'),
('truly_swahili', 'Heroes Day', '2025-06-09', 'public_holiday', 'Uganda', true, NULL),
('truly_swahili', 'Independence Day', '2025-10-09', 'public_holiday', 'Uganda', true, NULL),
('truly_swahili', 'Christmas Day', '2025-12-25', 'public_holiday', 'Uganda', true, NULL),
('truly_swahili', 'Eid al-Fitr', '2025-03-30', 'public_holiday', 'Uganda', true, NULL),
('truly_swahili', 'Eid al-Adha', '2025-06-07', 'public_holiday', 'Uganda', true, NULL);

-- ============================
-- RWANDA (truly_swahili)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('truly_swahili', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Rwanda', true, NULL),
('truly_swahili', 'Heroes Day', '2025-02-01', 'public_holiday', 'Rwanda', true, NULL),
('truly_swahili', 'Good Friday', '2025-04-18', 'public_holiday', 'Rwanda', true, NULL),
('truly_swahili', 'Genocide Memorial Day', '2025-04-07', 'public_holiday', 'Rwanda', true, 'Kwibuka — solemn week of remembrance; be sensitive with tourism activities'),
('truly_swahili', 'Labour Day', '2025-05-01', 'public_holiday', 'Rwanda', true, NULL),
('truly_swahili', 'Independence Day', '2025-07-01', 'public_holiday', 'Rwanda', true, NULL),
('truly_swahili', 'Liberation Day', '2025-07-04', 'public_holiday', 'Rwanda', true, NULL),
('truly_swahili', 'Assumption', '2025-08-15', 'public_holiday', 'Rwanda', true, NULL),
('truly_swahili', 'Christmas Day', '2025-12-25', 'public_holiday', 'Rwanda', true, NULL),
('truly_swahili', 'Kwita Izina (Gorilla Naming Ceremony)', '2025-09-05', 'festival', 'Rwanda', true, 'Major annual event — gorilla naming; attracts international visitors');

-- ============================
-- MEXICO (across_mexico)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('across_mexico', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Mexico', true, NULL),
('across_mexico', 'Constitution Day', '2025-02-03', 'public_holiday', 'Mexico', true, 'First Monday in February'),
('across_mexico', 'Benito Juarez Birthday', '2025-03-17', 'public_holiday', 'Mexico', true, 'Third Monday in March'),
('across_mexico', 'Holy Thursday', '2025-04-17', 'public_holiday', 'Mexico', true, 'Semana Santa — massive domestic travel; beaches packed'),
('across_mexico', 'Good Friday', '2025-04-18', 'public_holiday', 'Mexico', true, NULL),
('across_mexico', 'Labour Day', '2025-05-01', 'public_holiday', 'Mexico', true, NULL),
('across_mexico', 'Independence Day', '2025-09-16', 'public_holiday', 'Mexico', true, 'El Grito — celebrations night of Sep 15; national holiday Sep 16'),
('across_mexico', 'Revolution Day', '2025-11-17', 'public_holiday', 'Mexico', true, 'Third Monday in November'),
('across_mexico', 'Christmas Day', '2025-12-25', 'public_holiday', 'Mexico', true, NULL),
('across_mexico', 'Day of the Dead', '2025-11-01', 'festival', 'Mexico', true, 'Dia de los Muertos Nov 1-2 — iconic festival; Oaxaca and Mexico City especially busy'),
('across_mexico', 'Guelaguetza', '2025-07-21', 'festival', 'Mexico', true, 'Major indigenous cultural festival in Oaxaca — two Mondays in late July'),
('across_mexico', 'Carnival (various cities)', '2025-02-28', 'festival', 'Mexico', true, 'Mazatlan and Veracruz carnivals — vibrant street festivals'),
-- 2026
('across_mexico', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Mexico', true, NULL),
('across_mexico', 'Independence Day', '2026-09-16', 'public_holiday', 'Mexico', true, NULL),
('across_mexico', 'Day of the Dead', '2026-11-01', 'festival', 'Mexico', true, NULL),
('across_mexico', 'Christmas Day', '2026-12-25', 'public_holiday', 'Mexico', true, NULL);

-- ============================
-- INDONESIA (kembali_indonesia)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('kembali_indonesia', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Indonesia', true, NULL),
('kembali_indonesia', 'Chinese New Year', '2025-01-29', 'public_holiday', 'Indonesia', true, 'Significant in Jakarta, Medan, Surabaya'),
('kembali_indonesia', 'Isra Mi''raj', '2025-01-27', 'public_holiday', 'Indonesia', true, 'Islamic observance'),
('kembali_indonesia', 'Nyepi (Day of Silence)', '2025-03-29', 'public_holiday', 'Indonesia', true, 'Bali shuts down completely — no flights, no activities, hotels must stay dark; plan around this'),
('kembali_indonesia', 'Eid al-Fitr', '2025-03-30', 'public_holiday', 'Indonesia', true, 'Lebaran — massive domestic travel; flights/trains fully booked weeks ahead; typically 1-2 week holiday'),
('kembali_indonesia', 'Labour Day', '2025-05-01', 'public_holiday', 'Indonesia', true, NULL),
('kembali_indonesia', 'Waisak (Vesak)', '2025-05-12', 'public_holiday', 'Indonesia', true, 'Buddhist celebrations at Borobudur'),
('kembali_indonesia', 'Pancasila Day', '2025-06-01', 'public_holiday', 'Indonesia', true, NULL),
('kembali_indonesia', 'Eid al-Adha', '2025-06-07', 'public_holiday', 'Indonesia', true, NULL),
('kembali_indonesia', 'Independence Day', '2025-08-17', 'public_holiday', 'Indonesia', true, 'National celebrations — parades and competitions'),
('kembali_indonesia', 'Mawlid (Prophet''s Birthday)', '2025-09-05', 'public_holiday', 'Indonesia', true, NULL),
('kembali_indonesia', 'Christmas Day', '2025-12-25', 'public_holiday', 'Indonesia', true, NULL),
('kembali_indonesia', 'Bali Arts Festival', '2025-06-14', 'festival', 'Indonesia', true, 'Month-long cultural festival in Denpasar — June to July'),
('kembali_indonesia', 'Galungan & Kuningan', '2025-04-09', 'festival', 'Indonesia', true, 'Balinese Hindu celebration — temples beautifully decorated'),
-- 2026
('kembali_indonesia', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Indonesia', true, NULL),
('kembali_indonesia', 'Nyepi', '2026-03-19', 'public_holiday', 'Indonesia', true, 'Bali complete shutdown'),
('kembali_indonesia', 'Eid al-Fitr', '2026-03-20', 'public_holiday', 'Indonesia', true, 'Approximate — massive travel disruption'),
('kembali_indonesia', 'Independence Day', '2026-08-17', 'public_holiday', 'Indonesia', true, NULL),
('kembali_indonesia', 'Christmas Day', '2026-12-25', 'public_holiday', 'Indonesia', true, NULL);

-- ============================
-- SINGAPORE (kembali_indonesia)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('kembali_indonesia', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Singapore', true, NULL),
('kembali_indonesia', 'Chinese New Year', '2025-01-29', 'public_holiday', 'Singapore', true, 'Two-day holiday (Jan 29-30); major celebrations in Chinatown'),
('kembali_indonesia', 'Good Friday', '2025-04-18', 'public_holiday', 'Singapore', true, NULL),
('kembali_indonesia', 'Labour Day', '2025-05-01', 'public_holiday', 'Singapore', true, NULL),
('kembali_indonesia', 'Vesak Day', '2025-05-12', 'public_holiday', 'Singapore', true, NULL),
('kembali_indonesia', 'Hari Raya Puasa', '2025-03-31', 'public_holiday', 'Singapore', true, 'Eid al-Fitr'),
('kembali_indonesia', 'Hari Raya Haji', '2025-06-07', 'public_holiday', 'Singapore', true, 'Eid al-Adha'),
('kembali_indonesia', 'National Day', '2025-08-09', 'public_holiday', 'Singapore', true, 'Major celebration — NDP parade; Marina Bay area restricted'),
('kembali_indonesia', 'Deepavali', '2025-10-20', 'public_holiday', 'Singapore', true, 'Festival of Lights — Little India celebrations'),
('kembali_indonesia', 'Christmas Day', '2025-12-25', 'public_holiday', 'Singapore', true, 'Orchard Road light-up from mid-November'),
('kembali_indonesia', 'Singapore Grand Prix', '2025-10-03', 'festival', 'Singapore', false, 'F1 Night Race — hotels at premium; Marina Bay area restricted');

-- ============================
-- MALAYSIA (kembali_indonesia)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('kembali_indonesia', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Malaysia', true, NULL),
('kembali_indonesia', 'Chinese New Year', '2025-01-29', 'public_holiday', 'Malaysia', true, 'Two-day holiday; major celebrations'),
('kembali_indonesia', 'Nuzul Al-Quran', '2025-03-17', 'public_holiday', 'Malaysia', true, NULL),
('kembali_indonesia', 'Hari Raya Aidilfitri', '2025-03-30', 'public_holiday', 'Malaysia', true, 'Two-day holiday; massive balik kampung (homecoming) travel'),
('kembali_indonesia', 'Labour Day', '2025-05-01', 'public_holiday', 'Malaysia', true, NULL),
('kembali_indonesia', 'Yang di-Pertuan Agong Birthday', '2025-06-02', 'public_holiday', 'Malaysia', true, 'King''s birthday'),
('kembali_indonesia', 'Hari Raya Haji', '2025-06-07', 'public_holiday', 'Malaysia', true, NULL),
('kembali_indonesia', 'Malaysia Day', '2025-09-16', 'public_holiday', 'Malaysia', true, NULL),
('kembali_indonesia', 'Deepavali', '2025-10-20', 'public_holiday', 'Malaysia', true, NULL),
('kembali_indonesia', 'Merdeka Day', '2025-08-31', 'public_holiday', 'Malaysia', true, 'Independence Day — celebrations in KL'),
('kembali_indonesia', 'Christmas Day', '2025-12-25', 'public_holiday', 'Malaysia', true, NULL),
('kembali_indonesia', 'Thaipusam', '2025-02-11', 'festival', 'Malaysia', true, 'Hindu festival — Batu Caves extremely crowded');

-- ============================
-- UAE (majlis_retreats)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('majlis_retreats', 'New Year''s Day', '2025-01-01', 'public_holiday', 'UAE', true, NULL),
('majlis_retreats', 'Eid al-Fitr', '2025-03-30', 'public_holiday', 'UAE', true, 'Typically 3-4 day holiday; malls busy; some restaurants closed during Ramadan before'),
('majlis_retreats', 'Arafat Day', '2025-06-06', 'public_holiday', 'UAE', true, NULL),
('majlis_retreats', 'Eid al-Adha', '2025-06-07', 'public_holiday', 'UAE', true, 'Typically 3-4 day holiday'),
('majlis_retreats', 'Islamic New Year', '2025-06-27', 'public_holiday', 'UAE', true, NULL),
('majlis_retreats', 'Prophet''s Birthday', '2025-09-05', 'public_holiday', 'UAE', true, NULL),
('majlis_retreats', 'Commemoration Day', '2025-11-30', 'public_holiday', 'UAE', true, NULL),
('majlis_retreats', 'National Day', '2025-12-02', 'public_holiday', 'UAE', true, 'Dec 2-3; massive celebrations across UAE'),
('majlis_retreats', 'Ramadan (approximate start)', '2025-03-01', 'festival', 'UAE', true, 'Approx March 1 - March 29; restaurants closed daytime; shorter business hours; iftar experiences popular'),
('majlis_retreats', 'Dubai Shopping Festival', '2025-12-15', 'festival', 'UAE', false, 'Dec-Jan; retail promotions; high tourist season'),
('majlis_retreats', 'Abu Dhabi Grand Prix', '2025-11-21', 'festival', 'UAE', false, 'F1 weekend — Yas Island hotels premium pricing'),
-- 2026
('majlis_retreats', 'New Year''s Day', '2026-01-01', 'public_holiday', 'UAE', true, NULL),
('majlis_retreats', 'Eid al-Fitr', '2026-03-20', 'public_holiday', 'UAE', true, 'Approximate date'),
('majlis_retreats', 'National Day', '2026-12-02', 'public_holiday', 'UAE', true, NULL);

-- ============================
-- UK (crown_journey)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('crown_journey', 'New Year''s Day', '2025-01-01', 'public_holiday', 'UK', true, NULL),
('crown_journey', 'Good Friday', '2025-04-18', 'public_holiday', 'UK', true, NULL),
('crown_journey', 'Easter Monday', '2025-04-21', 'public_holiday', 'UK', true, 'Long weekend — domestic travel peaks'),
('crown_journey', 'Early May Bank Holiday', '2025-05-05', 'public_holiday', 'UK', true, NULL),
('crown_journey', 'Spring Bank Holiday', '2025-05-26', 'public_holiday', 'UK', true, NULL),
('crown_journey', 'Summer Bank Holiday', '2025-08-25', 'public_holiday', 'UK', true, 'England/Wales — Scotland is first Monday of August'),
('crown_journey', 'Christmas Day', '2025-12-25', 'public_holiday', 'UK', true, 'Most services shut Dec 25-26'),
('crown_journey', 'Boxing Day', '2025-12-26', 'public_holiday', 'UK', true, NULL),
('crown_journey', 'Trooping the Colour', '2025-06-14', 'festival', 'UK', true, 'King''s official birthday parade — The Mall closed'),
('crown_journey', 'Wimbledon', '2025-06-30', 'festival', 'UK', true, 'Two weeks — SW London busy; hotel demand high'),
('crown_journey', 'Edinburgh Fringe Festival', '2025-08-01', 'festival', 'UK', true, 'August — Edinburgh hotels fully booked months in advance'),
('crown_journey', 'Notting Hill Carnival', '2025-08-24', 'festival', 'UK', true, 'August bank holiday weekend — West London streets closed'),
('crown_journey', 'Glastonbury Festival', '2025-06-25', 'festival', 'UK', false, 'Major music festival — Somerset area impacted'),
-- 2026
('crown_journey', 'New Year''s Day', '2026-01-01', 'public_holiday', 'UK', true, NULL),
('crown_journey', 'Good Friday', '2026-04-03', 'public_holiday', 'UK', true, NULL),
('crown_journey', 'Easter Monday', '2026-04-06', 'public_holiday', 'UK', true, NULL),
('crown_journey', 'Christmas Day', '2026-12-25', 'public_holiday', 'UK', true, NULL),
('crown_journey', 'Boxing Day', '2026-12-26', 'public_holiday', 'UK', true, NULL);

-- ============================
-- JAPAN (oshinobi_travel)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('oshinobi_travel', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Japan', true, 'Shogatsu — Jan 1-3 most businesses closed; temples very busy'),
('oshinobi_travel', 'Coming of Age Day', '2025-01-13', 'public_holiday', 'Japan', true, 'Second Monday of January'),
('oshinobi_travel', 'National Foundation Day', '2025-02-11', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Emperor''s Birthday', '2025-02-23', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Vernal Equinox Day', '2025-03-20', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Showa Day', '2025-04-29', 'public_holiday', 'Japan', true, 'Start of Golden Week'),
('oshinobi_travel', 'Constitution Day', '2025-05-03', 'public_holiday', 'Japan', true, 'Golden Week'),
('oshinobi_travel', 'Greenery Day', '2025-05-04', 'public_holiday', 'Japan', true, 'Golden Week'),
('oshinobi_travel', 'Children''s Day', '2025-05-05', 'public_holiday', 'Japan', true, 'End of Golden Week — extremely busy travel period; book months ahead'),
('oshinobi_travel', 'Marine Day', '2025-07-21', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Mountain Day', '2025-08-11', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Respect for the Aged Day', '2025-09-15', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Autumnal Equinox', '2025-09-23', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Sports Day', '2025-10-13', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Culture Day', '2025-11-03', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Labour Thanksgiving Day', '2025-11-23', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Cherry Blossom Season (Tokyo)', '2025-03-25', 'peak_season', 'Japan', true, 'Hanami peak late March-mid April; Kyoto/Tokyo extremely crowded; hotels at premium'),
('oshinobi_travel', 'Golden Week', '2025-04-29', 'peak_season', 'Japan', true, 'Apr 29 - May 5; entire country travels; shinkansen fully booked'),
('oshinobi_travel', 'Obon', '2025-08-13', 'festival', 'Japan', true, 'Aug 13-16; Buddhist ancestor festival; major domestic travel; Kyoto especially busy'),
('oshinobi_travel', 'Gion Matsuri', '2025-07-01', 'festival', 'Japan', true, 'Month-long Kyoto festival; main procession July 17 & 24'),
('oshinobi_travel', 'Autumn Foliage Peak (Kyoto)', '2025-11-15', 'peak_season', 'Japan', true, 'Mid-Nov to early Dec; Kyoto temples extremely popular'),
-- 2026
('oshinobi_travel', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Golden Week Start', '2026-04-29', 'public_holiday', 'Japan', true, NULL),
('oshinobi_travel', 'Cherry Blossom Season', '2026-03-25', 'peak_season', 'Japan', true, NULL),
('oshinobi_travel', 'Christmas Day', '2026-12-25', 'public_holiday', 'Japan', false, 'Not an official holiday but widely celebrated commercially');

-- ============================
-- FRANCE (essentially_french)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('essentially_french', 'New Year''s Day', '2025-01-01', 'public_holiday', 'France', true, NULL),
('essentially_french', 'Easter Monday', '2025-04-21', 'public_holiday', 'France', true, NULL),
('essentially_french', 'Labour Day', '2025-05-01', 'public_holiday', 'France', true, 'Fete du Travail — virtually everything closed'),
('essentially_french', 'Victory in Europe Day', '2025-05-08', 'public_holiday', 'France', true, NULL),
('essentially_french', 'Ascension Day', '2025-05-29', 'public_holiday', 'France', true, 'Many take the Friday off for a pont (bridge) long weekend'),
('essentially_french', 'Whit Monday', '2025-06-09', 'public_holiday', 'France', true, NULL),
('essentially_french', 'Bastille Day', '2025-07-14', 'public_holiday', 'France', true, 'National Day — fireworks, parades; Champs-Elysees military parade'),
('essentially_french', 'Assumption', '2025-08-15', 'public_holiday', 'France', true, 'Many French on summer holiday July 14 - Aug 31'),
('essentially_french', 'All Saints'' Day', '2025-11-01', 'public_holiday', 'France', true, 'Toussaint school holidays'),
('essentially_french', 'Armistice Day', '2025-11-11', 'public_holiday', 'France', true, NULL),
('essentially_french', 'Christmas Day', '2025-12-25', 'public_holiday', 'France', true, NULL),
('essentially_french', 'Cannes Film Festival', '2025-05-13', 'festival', 'France', false, 'May — Cote d''Azur hotels at extreme premium'),
('essentially_french', 'Tour de France', '2025-07-05', 'festival', 'France', true, 'July — road closures along route; major national event'),
('essentially_french', 'Fete de la Musique', '2025-06-21', 'festival', 'France', true, 'Free music events in every city — wonderful atmosphere'),
('essentially_french', 'Lavender Season (Provence)', '2025-06-15', 'peak_season', 'France', true, 'Mid-June to mid-August; Provence extremely popular'),
-- 2026
('essentially_french', 'New Year''s Day', '2026-01-01', 'public_holiday', 'France', true, NULL),
('essentially_french', 'Bastille Day', '2026-07-14', 'public_holiday', 'France', true, NULL),
('essentially_french', 'Christmas Day', '2026-12-25', 'public_holiday', 'France', true, NULL);

-- ============================
-- AUSTRALIA (elura_australia)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('elura_australia', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Australia', true, NULL),
('elura_australia', 'Australia Day', '2025-01-26', 'public_holiday', 'Australia', true, 'National Day — fireworks, events nationwide; controversial'),
('elura_australia', 'Good Friday', '2025-04-18', 'public_holiday', 'Australia', true, NULL),
('elura_australia', 'Saturday before Easter', '2025-04-19', 'public_holiday', 'Australia', true, NULL),
('elura_australia', 'Easter Monday', '2025-04-21', 'public_holiday', 'Australia', true, 'Four-day long weekend — peak domestic travel'),
('elura_australia', 'Anzac Day', '2025-04-25', 'public_holiday', 'Australia', true, 'Dawn services nationwide — significant national day'),
('elura_australia', 'Queen''s Birthday', '2025-06-09', 'public_holiday', 'Australia', true, 'Varies by state; most observe second Monday of June'),
('elura_australia', 'Christmas Day', '2025-12-25', 'public_holiday', 'Australia', true, 'Summer Christmas — beach destinations very busy'),
('elura_australia', 'Boxing Day', '2025-12-26', 'public_holiday', 'Australia', true, 'Sydney to Hobart yacht race starts'),
('elura_australia', 'Melbourne Cup', '2025-11-04', 'festival', 'Australia', true, 'First Tuesday in November — public holiday in Melbourne; ''the race that stops a nation'''),
('elura_australia', 'Sydney New Year''s Eve', '2025-12-31', 'festival', 'Australia', true, 'Harbour Bridge fireworks — iconic; harbour-view hotels booked year ahead'),
('elura_australia', 'Vivid Sydney', '2025-05-23', 'festival', 'Australia', true, 'Light festival — May/June; major tourist draw'),
('elura_australia', 'Australian Open', '2025-01-12', 'festival', 'Australia', true, 'Tennis Grand Slam — Melbourne hotels busy late January'),
-- 2026
('elura_australia', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Australia', true, NULL),
('elura_australia', 'Australia Day', '2026-01-26', 'public_holiday', 'Australia', true, NULL),
('elura_australia', 'Anzac Day', '2026-04-25', 'public_holiday', 'Australia', true, NULL),
('elura_australia', 'Christmas Day', '2026-12-25', 'public_holiday', 'Australia', true, NULL);

-- ============================
-- THAILAND (nira_thailand)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('nira_thailand', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Thailand', true, NULL),
('nira_thailand', 'Makha Bucha', '2025-02-12', 'public_holiday', 'Thailand', true, 'Buddhist holiday — no alcohol sales'),
('nira_thailand', 'Chakri Memorial Day', '2025-04-06', 'public_holiday', 'Thailand', true, NULL),
('nira_thailand', 'Songkran', '2025-04-13', 'public_holiday', 'Thailand', true, 'Thai New Year Apr 13-15; massive water festival; busiest domestic travel period; Chiang Mai especially wild'),
('nira_thailand', 'Labour Day', '2025-05-01', 'public_holiday', 'Thailand', true, NULL),
('nira_thailand', 'Coronation Day', '2025-05-04', 'public_holiday', 'Thailand', true, NULL),
('nira_thailand', 'Visakha Bucha', '2025-05-11', 'public_holiday', 'Thailand', true, 'Most important Buddhist holiday — no alcohol sales'),
('nira_thailand', 'Queen Suthida Birthday', '2025-06-03', 'public_holiday', 'Thailand', true, NULL),
('nira_thailand', 'King''s Birthday', '2025-07-28', 'public_holiday', 'Thailand', true, NULL),
('nira_thailand', 'Queen Mother''s Birthday', '2025-08-12', 'public_holiday', 'Thailand', true, 'Also Mother''s Day in Thailand'),
('nira_thailand', 'Chulalongkorn Day', '2025-10-23', 'public_holiday', 'Thailand', true, NULL),
('nira_thailand', 'King Bhumibol Memorial Day', '2025-12-05', 'public_holiday', 'Thailand', true, 'Also Father''s Day; national celebrations'),
('nira_thailand', 'Constitution Day', '2025-12-10', 'public_holiday', 'Thailand', true, NULL),
('nira_thailand', 'Loi Krathong', '2025-11-05', 'festival', 'Thailand', true, 'Floating lantern festival — Chiang Mai (Yi Peng) especially magical'),
('nira_thailand', 'Full Moon Parties (Koh Phangan)', '2025-01-13', 'festival', 'Thailand', true, 'Monthly — island very crowded; ferries packed'),
-- 2026
('nira_thailand', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Thailand', true, NULL),
('nira_thailand', 'Songkran', '2026-04-13', 'public_holiday', 'Thailand', true, 'Thai New Year water festival'),
('nira_thailand', 'Christmas Day', '2026-12-25', 'public_holiday', 'Thailand', false, 'Not official holiday but tourist areas celebrate');

-- ============================
-- TURKIYE (sar_turkiye)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('sar_turkiye', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Turkiye', true, NULL),
('sar_turkiye', 'National Sovereignty & Children''s Day', '2025-04-23', 'public_holiday', 'Turkiye', true, NULL),
('sar_turkiye', 'Labour Day', '2025-05-01', 'public_holiday', 'Turkiye', true, NULL),
('sar_turkiye', 'Commemoration of Ataturk & Youth Day', '2025-05-19', 'public_holiday', 'Turkiye', true, NULL),
('sar_turkiye', 'Eid al-Fitr (Ramazan Bayrami)', '2025-03-30', 'public_holiday', 'Turkiye', true, 'Three-day holiday; domestic travel surge'),
('sar_turkiye', 'Eid al-Adha (Kurban Bayrami)', '2025-06-06', 'public_holiday', 'Turkiye', true, 'Four-day holiday; biggest holiday period; flights/hotels very busy'),
('sar_turkiye', 'Democracy & National Unity Day', '2025-07-15', 'public_holiday', 'Turkiye', true, NULL),
('sar_turkiye', 'Victory Day', '2025-08-30', 'public_holiday', 'Turkiye', true, NULL),
('sar_turkiye', 'Republic Day', '2025-10-29', 'public_holiday', 'Turkiye', true, 'Major national celebration'),
('sar_turkiye', 'Istanbul Tulip Festival', '2025-04-01', 'festival', 'Turkiye', true, 'April — millions of tulips across Istanbul parks'),
('sar_turkiye', 'Whirling Dervish Festival (Konya)', '2025-12-07', 'festival', 'Turkiye', true, 'Dec 7-17; Mevlana commemorations; Konya hotels booked out'),
('sar_turkiye', 'Cappadocia Hot Air Balloon Season', '2025-04-01', 'peak_season', 'Turkiye', true, 'April-November; best flying conditions; book well ahead'),
-- 2026
('sar_turkiye', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Turkiye', true, NULL),
('sar_turkiye', 'Eid al-Fitr', '2026-03-20', 'public_holiday', 'Turkiye', true, 'Approximate date'),
('sar_turkiye', 'Republic Day', '2026-10-29', 'public_holiday', 'Turkiye', true, NULL);

-- ============================
-- GREECE (nostos_greece)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('nostos_greece', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Greece', true, NULL),
('nostos_greece', 'Epiphany', '2025-01-06', 'public_holiday', 'Greece', true, 'Blessing of the Waters — harbour ceremonies'),
('nostos_greece', 'Clean Monday', '2025-03-03', 'public_holiday', 'Greece', true, 'Start of Orthodox Lent; kite-flying traditions'),
('nostos_greece', 'Independence Day', '2025-03-25', 'public_holiday', 'Greece', true, 'Also Annunciation — military parades'),
('nostos_greece', 'Orthodox Good Friday', '2025-04-18', 'public_holiday', 'Greece', true, 'Epitaphios processions — deeply moving tradition'),
('nostos_greece', 'Orthodox Easter Monday', '2025-04-21', 'public_holiday', 'Greece', true, 'Easter is the biggest holiday in Greece; islands fill up'),
('nostos_greece', 'Labour Day', '2025-05-01', 'public_holiday', 'Greece', true, NULL),
('nostos_greece', 'Holy Spirit Monday', '2025-06-09', 'public_holiday', 'Greece', true, NULL),
('nostos_greece', 'Assumption of Mary', '2025-08-15', 'public_holiday', 'Greece', true, 'Dekapentavgoustos — major pilgrimage; Tinos island extremely busy; all islands packed'),
('nostos_greece', 'Ochi Day', '2025-10-28', 'public_holiday', 'Greece', true, 'Military parades'),
('nostos_greece', 'Christmas Day', '2025-12-25', 'public_holiday', 'Greece', true, NULL),
('nostos_greece', 'Athens Epidaurus Festival', '2025-06-01', 'festival', 'Greece', true, 'June-August — ancient theatre performances; world-class'),
('nostos_greece', 'Carnival Season (Patras)', '2025-02-15', 'festival', 'Greece', true, 'Largest carnival in Greece — Patras very busy'),
('nostos_greece', 'Greek Island Peak Season', '2025-07-01', 'peak_season', 'Greece', true, 'July-August; Santorini/Mykonos extremely crowded and expensive'),
-- 2026
('nostos_greece', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Greece', true, NULL),
('nostos_greece', 'Orthodox Easter Monday', '2026-04-13', 'public_holiday', 'Greece', true, NULL),
('nostos_greece', 'Assumption of Mary', '2026-08-15', 'public_holiday', 'Greece', true, NULL),
('nostos_greece', 'Christmas Day', '2026-12-25', 'public_holiday', 'Greece', true, NULL);

-- ============================
-- COLOMBIA (vista_colombia)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('vista_colombia', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Epiphany (observed)', '2025-01-06', 'public_holiday', 'Colombia', true, 'Moved to Monday'),
('vista_colombia', 'St Joseph''s Day (observed)', '2025-03-24', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Holy Thursday', '2025-04-17', 'public_holiday', 'Colombia', true, 'Semana Santa — major domestic travel'),
('vista_colombia', 'Good Friday', '2025-04-18', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Labour Day', '2025-05-01', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Ascension (observed)', '2025-06-02', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Corpus Christi (observed)', '2025-06-23', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Independence Day', '2025-07-20', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Battle of Boyaca', '2025-08-07', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Assumption (observed)', '2025-08-18', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Columbus Day (observed)', '2025-10-13', 'public_holiday', 'Colombia', true, 'Dia de la Raza'),
('vista_colombia', 'All Saints'' Day (observed)', '2025-11-03', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Independence of Cartagena', '2025-11-17', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Christmas Day', '2025-12-25', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Barranquilla Carnival', '2025-03-01', 'festival', 'Colombia', true, 'UNESCO heritage — second-largest carnival after Rio; 4 days before Ash Wednesday'),
('vista_colombia', 'Feria de las Flores (Medellin)', '2025-08-01', 'festival', 'Colombia', true, 'Flower Festival — Medellin''s biggest event; silleteros parade'),
('vista_colombia', 'Feria de Cali', '2025-12-25', 'festival', 'Colombia', true, 'Dec 25-30; salsa festival; Cali comes alive'),
-- 2026
('vista_colombia', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Independence Day', '2026-07-20', 'public_holiday', 'Colombia', true, NULL),
('vista_colombia', 'Barranquilla Carnival', '2026-02-14', 'festival', 'Colombia', true, NULL),
('vista_colombia', 'Christmas Day', '2026-12-25', 'public_holiday', 'Colombia', true, NULL);

-- ============================
-- PERU (awaken_peru)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('awaken_peru', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Holy Thursday', '2025-04-17', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Good Friday', '2025-04-18', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Labour Day', '2025-05-01', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'St Peter & St Paul', '2025-06-29', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Independence Day', '2025-07-28', 'public_holiday', 'Peru', true, 'Fiestas Patrias Jul 28-29; major celebrations; domestic travel peak'),
('awaken_peru', 'Independence Day (Day 2)', '2025-07-29', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Santa Rosa de Lima', '2025-08-30', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Battle of Angamos', '2025-10-08', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'All Saints'' Day', '2025-11-01', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Immaculate Conception', '2025-12-08', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Christmas Day', '2025-12-25', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Inti Raymi', '2025-06-24', 'festival', 'Peru', true, 'Festival of the Sun — Cusco''s biggest event; Sacsayhuaman ceremony; book months ahead'),
('awaken_peru', 'Qoyllur Rit''i', '2025-06-03', 'festival', 'Peru', true, 'Ancient pilgrimage festival near Cusco — spectacular but remote'),
('awaken_peru', 'Mistura Food Festival', '2025-09-05', 'festival', 'Peru', false, 'Latin America''s largest food festival — Lima'),
('awaken_peru', 'Machu Picchu Dry Season', '2025-05-01', 'peak_season', 'Peru', true, 'May-September; best weather; Inca Trail permits sell out months ahead'),
-- 2026
('awaken_peru', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Independence Day', '2026-07-28', 'public_holiday', 'Peru', true, NULL),
('awaken_peru', 'Inti Raymi', '2026-06-24', 'festival', 'Peru', true, NULL),
('awaken_peru', 'Christmas Day', '2026-12-25', 'public_holiday', 'Peru', true, NULL);

-- ============================
-- MOROCCO (experience_morocco)
-- ============================
INSERT INTO calendar_events (brand, title, date_start, event_type, country, recurring, impact_notes) VALUES
('experience_morocco', 'New Year''s Day', '2025-01-01', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Independence Manifesto Day', '2025-01-11', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Amazigh New Year', '2025-01-14', 'public_holiday', 'Morocco', true, 'Berber New Year — newly recognized holiday'),
('experience_morocco', 'Labour Day', '2025-05-01', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Eid al-Fitr', '2025-03-30', 'public_holiday', 'Morocco', true, 'Two-day holiday; family-focused'),
('experience_morocco', 'Eid al-Adha', '2025-06-07', 'public_holiday', 'Morocco', true, 'Biggest holiday — most Moroccans travel home; some businesses closed for a week'),
('experience_morocco', 'Throne Day', '2025-07-30', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Oued Ed-Dahab Day', '2025-08-14', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Revolution Day', '2025-08-20', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Youth Day', '2025-08-21', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Islamic New Year', '2025-06-27', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Prophet''s Birthday (Mawlid)', '2025-09-05', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Green March Day', '2025-11-06', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Independence Day', '2025-11-18', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Ramadan (approximate start)', '2025-03-01', 'festival', 'Morocco', true, 'March 1 - March 29 approx; shorter business hours; many restaurants closed daytime; riads offer iftar experiences'),
('experience_morocco', 'Fes Festival of World Sacred Music', '2025-06-06', 'festival', 'Morocco', false, 'Major cultural event — Fes medina hotels in high demand'),
('experience_morocco', 'Marrakech International Film Festival', '2025-11-28', 'festival', 'Morocco', false, 'November/December — adds glamour to Marrakech'),
('experience_morocco', 'Rose Festival (Kelaa M''gouna)', '2025-05-09', 'festival', 'Morocco', true, 'May — Dades Valley rose harvest celebration'),
-- 2026
('experience_morocco', 'New Year''s Day', '2026-01-01', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Eid al-Fitr', '2026-03-20', 'public_holiday', 'Morocco', true, 'Approximate'),
('experience_morocco', 'Eid al-Adha', '2026-05-27', 'public_holiday', 'Morocco', true, 'Approximate'),
('experience_morocco', 'Throne Day', '2026-07-30', 'public_holiday', 'Morocco', true, NULL),
('experience_morocco', 'Independence Day', '2026-11-18', 'public_holiday', 'Morocco', true, NULL);
