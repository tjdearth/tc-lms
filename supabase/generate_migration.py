import csv
from datetime import datetime
from collections import defaultdict

CSV_PATH = r"C:\Users\tdear\Downloads\learners_activity_report_learners-2026_03_22_00_33_09.csv"
OUTPUT_PATH = r"C:\Claudette\tc-lms\supabase\migrate_mangoapps.sql"

EMAIL_DOMAIN_TO_BRAND = {
    "travelcollection.co": "Travel Collection",
    "travelcollection.com": "Travel Collection",
    "authenticusitaly.it": "Authenticus Italy",
    "unboxspainandportugal.com": "Unbox Spain & Portugal",
    "unboxspain.com": "Unbox Spain & Portugal",
    "trulyswahili.com": "Truly Swahili",
    "crownjourney.com": "Crown Journey",
    "oshinobitravel.com": "Oshinobi Travel",
    "majlisretreats.com": "Majlis Retreats",
    "kembaliindonesia.com": "Kembali Indonesia",
    "acrossmexico.com": "Across Mexico",
    "essentiallyfrench.com": "Essentially French",
    "eluraaustralia.com": "Elura Australia",
    "nirathailand.com": "Nira Thailand",
    "sarturkiye.com": "Sar Turkiye",
    "nostosgreece.com": "Nostos Greece",
    "vistacolombia.com": "Vista Colombia",
    "awakenperu.com": "Awaken Peru",
    "experiencemorocco.com": "Experience Morocco",
}

VALID_CODES = {"TCL1", "TCL2", "SFAC01", "SFAC02", "SFAC03", "SFAC04", "SFAC05", "SFAC06", "TraAdv2", "TraAdv3", "BPG02"}

def brand_from_email(email):
    domain = email.split("@")[1].lower() if "@" in email else None
    return EMAIL_DOMAIN_TO_BRAND.get(domain) if domain else None

def parse_date(s):
    s = s.strip()
    if not s or s == "-":
        return None
    try:
        return datetime.strptime(s.strip(), "%b %d, %Y").strftime("%Y-%m-%d")
    except ValueError:
        return None

def escape_sql(s):
    return s.replace("'", "''")

rows = []
with open(CSV_PATH, "r", encoding="utf-8-sig") as f:
    reader = csv.DictReader(f)
    for row in reader:
        rows.append(row)

# Collect unique users (skip Alumni/empty emails)
users = {}
for row in rows:
    email = row.get("Email", "").strip().strip('"').lower()
    name = row.get("User", "").strip()
    if not email or email == "" or name == "Alumni User":
        continue
    if email not in users:
        users[email] = {"name": name, "brand": brand_from_email(email)}

# Collect enrollment records
enrollments = []
for row in rows:
    code = row.get("Code", "").strip()
    email = row.get("Email", "").strip().strip('"').lower()
    name = row.get("User", "").strip()
    status = row.get("Learner Status", "").strip()
    completion_date = row.get("Completion Date", "").strip()
    start_date = row.get("Start Date", "").strip()

    if not email or name == "Alumni User" or code not in VALID_CODES:
        continue

    enrollments.append({
        "email": email,
        "code": code,
        "status": status,
        "completion_date": parse_date(completion_date),
        "start_date": parse_date(start_date),
    })

# Generate SQL
lines = []
lines.append("-- MangoApps Migration: Auto-generated from learner CSV export")
lines.append("-- Generated: " + datetime.now().strftime("%Y-%m-%d %H:%M"))
lines.append("-- Users: " + str(len(users)))
lines.append("-- Enrollment records: " + str(len(enrollments)))
lines.append("")
lines.append("BEGIN;")
lines.append("")

# 1. Insert users
lines.append("-- ============================================")
lines.append("-- 1. INSERT LMS USERS (skip if already exists)")
lines.append("-- ============================================")
for email, info in sorted(users.items()):
    brand_val = f"'{escape_sql(info['brand'])}'" if info["brand"] else "NULL"
    lines.append(
        f"INSERT INTO lms_users (email, name, brand) "
        f"VALUES ('{escape_sql(email)}', '{escape_sql(info['name'])}', {brand_val}) "
        f"ON CONFLICT (email) DO NOTHING;"
    )

lines.append("")
lines.append("-- ============================================")
lines.append("-- 2. INSERT ENROLLMENTS + LESSON PROGRESS")
lines.append("-- ============================================")
lines.append("")

# Group enrollments by (email, code)
grouped = defaultdict(list)
for e in enrollments:
    grouped[(e["email"], e["code"])].append(e)

for (email, code), records in sorted(grouped.items()):
    # Pick the best record (completed > in_progress)
    best = None
    for r in records:
        if r["status"] == "Completed":
            best = r
            break
    if not best:
        best = records[0]

    is_completed = best["status"] == "Completed"
    db_status = "completed" if is_completed else "in_progress"
    completed_at = f"'{best['completion_date']}'" if best["completion_date"] else "NULL"
    enrolled_at = f"'{best['start_date']}'" if best["start_date"] else "now()"

    lines.append(f"-- {email} -> {code} ({db_status})")
    lines.append(
        f"INSERT INTO enrollments (user_id, course_id, status, enrolled_at, completed_at) "
        f"SELECT u.id, c.id, '{db_status}', {enrolled_at}, {completed_at} "
        f"FROM lms_users u, courses c "
        f"WHERE u.email = '{escape_sql(email)}' AND c.code = '{escape_sql(code)}' "
        f"ON CONFLICT (user_id, course_id) DO UPDATE SET "
        f"status = EXCLUDED.status, completed_at = EXCLUDED.completed_at;"
    )

    # For completed enrollments, mark all lessons as completed
    if is_completed:
        lines.append(
            f"INSERT INTO lesson_progress (user_id, lesson_id, status, started_at, completed_at) "
            f"SELECT u.id, l.id, 'completed', {enrolled_at}, {completed_at} "
            f"FROM lms_users u "
            f"CROSS JOIN courses c "
            f"JOIN modules m ON m.course_id = c.id "
            f"JOIN lessons l ON l.module_id = m.id "
            f"WHERE u.email = '{escape_sql(email)}' AND c.code = '{escape_sql(code)}' "
            f"ON CONFLICT (user_id, lesson_id) DO UPDATE SET "
            f"status = 'completed', completed_at = EXCLUDED.completed_at;"
        )

    lines.append("")

lines.append("COMMIT;")

with open(OUTPUT_PATH, "w", encoding="utf-8") as f:
    f.write("\n".join(lines))

print(f"Generated {OUTPUT_PATH}")
print(f"  Users: {len(users)}")
print(f"  Enrollment records: {len(enrollments)}")
print(f"  Unique (email, code) pairs: {len(grouped)}")
