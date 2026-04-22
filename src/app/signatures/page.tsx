"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

interface SignatureTemplate {
  name: string;
  fields: { key: string; label: string; placeholder: string; multiline?: boolean }[];
  render: (values: Record<string, string>) => string;
}

const SIGNATURE_TEMPLATES: Record<string, SignatureTemplate> = {
  "Nostos Greece": {
    name: "Nostos Greece",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Aris Mitropoulos" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phone1", label: "Phone 1", placeholder: "e.g. +30 697 584 1714" },
      { key: "phone2", label: "Phone 2", placeholder: "e.g. +1 464 733 2033" },
      { key: "address", label: "Address", placeholder: "e.g. Solonos & Sina 53, Athens, 10672, Greece" },
      { key: "email", label: "Email Address", placeholder: "e.g. aris@nostosgreece.com" },
    ],
    render: (v) => `<div style="font-family:Montserrat,sans-serif;font-size:13px;color:#000">
  <div style="font-size:13.333px"><b>${v.name || "Full Name"}</b></div>
  <div>${v.title || "Job Title"}, <a href="https://www.nostosgreece.com/" target="_blank">Nostos Greece</a></div>
  <div>${v.phone1 || "+00 000 000 0000"}</div>
  <div>${v.phone2 || "+0 000 000 0000"}</div>
  <div>${v.address || "Address"}</div>
  <div><a href="mailto:${v.email || "email@nostosgreece.com"}">${v.email || "email@nostosgreece.com"}</a></div>
  <div><br></div>
  <div><img src="https://ci3.googleusercontent.com/mail-sig/AIorK4xtJI_VpdfkxhIjHMeNT7QRqIZBpCWPVwFM9r81aFTnOlaI2wAxk-uzMLbZpdvASIenlch_UzWl2uPA" width="200" height="89" alt="Nostos Greece"></div>
</div>`,
  },
  "Experience Morocco": {
    name: "Experience Morocco",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Wahiba AMYN" },
      { key: "title", label: "Job Title", placeholder: "e.g. HR Manager" },
      { key: "email", label: "Email Address", placeholder: "e.g. w.amyn@experiencemorocco.com" },
      { key: "phone", label: "Phone", placeholder: "e.g. +212 6 70 091 236" },
    ],
    render: (v) => {
      const telHref = (v.phone || "+000000000000").replace(/\s/g, "");
      return `<table cellpadding="0" cellspacing="0" style="background:#a34e2f;font-family:Montserrat,Arial,sans-serif;color:#fff;padding:20px;max-width:600px"><tr>
<td style="min-width:140px"><img alt="Experience Morocco" src="https://experiencemorocco.com/s/logo.png" style="max-width:100%"></td>
<td style="padding-left:20px;vertical-align:middle;font-size:13px;line-height:1.6">
<div style="font-weight:600;font-size:15px">${v.name || "Full Name"}</div>
<div style="font-size:12px;margin-bottom:10px">${v.title || "Job Title"}</div>
<div><b>Email:</b> <a href="mailto:${v.email || "email@experiencemorocco.com"}" style="color:#fff">${v.email || "email@experiencemorocco.com"}</a></div>
<div><b>Website:</b> <a href="https://www.experiencemorocco.com/" style="color:#fff">www.experiencemorocco.com</a></div>
<div><b>Phone:</b> <a href="tel:${telHref}" style="color:#fff">${v.phone || "+000 0 00 000 000"}</a></div>
</td>
<td style="vertical-align:bottom;padding-left:10px">
<a href="https://linkedin.com/company/experience-morocco"><img width="18" alt="LinkedIn" src="https://experiencemorocco.com/s/li.png"></a><br><br>
<a href="https://facebook.com/expmorocco"><img width="18" alt="Facebook" src="https://experiencemorocco.com/s/fb.png"></a><br><br>
<a href="https://instagram.com/experiencemorocco"><img width="18" alt="Instagram" src="https://experiencemorocco.com/s/ig.png"></a>
</td>
</tr></table>`;
    },
  },
  "Unbox Spain & Portugal": {
    name: "Unbox Spain & Portugal",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Lucía Arroyo" },
      { key: "title", label: "Job Title", placeholder: "e.g. Itinerary Coordinator" },
      { key: "cell", label: "Cell Phone", placeholder: "e.g. +34 625 663 518" },
    ],
    render: (v) => `<div style="font-family:Arial,sans-serif;color:rgb(136,136,136)">
  ${v.name || "Full Name"} | ${v.title || "Job Title"}, <a href="https://www.unboxspainandportugal.com/" target="_blank" style="color:rgb(17,85,204)">Unbox Spain &amp; Portugal</a> | Cell: ${v.cell || "+00 000 000 000"}
  <div><img src="https://ci3.googleusercontent.com/mail-sig/AIorK4xbEUdILY0QOQzDaO6w48QY2UDOBCFHCAYKjACf3RNzHUhoTEebxpYkJdqd0Yva3szuklMaE7lifXrg" width="200" height="56" alt="Unbox Spain &amp; Portugal"></div>
</div>`,
  },
  "Crown Journey": {
    name: "Crown Journey",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Karen Gee" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "email", label: "Email Address", placeholder: "e.g. karen@crownjourney.com" },
      { key: "phoneUK", label: "UK Phone", placeholder: "e.g. +44 7740 896780" },
      { key: "phoneUS", label: "US Phone", placeholder: "e.g. +1 646 917 6807" },
    ],
    render: (v) => `<div style="color:rgb(136,136,136)">
  <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4yP5VjWBj9ipcJUpFiHWOh6wSd2jxhSGca502sNmWNyaHvxjGgHiqoO7LWQAhS2CFxgv4oiX_JtLYjf" alt="Crown Journey"><br>
  <b>${(v.name || "Full Name").toUpperCase()}, ${v.title || "Job Title"}, Crown Journey</b>
  <div><b>E: <a href="mailto:${v.email || "email@crownjourney.com"}">${v.email || "email@crownjourney.com"}</a> &nbsp;W: <a href="http://crownjourney.com" target="_blank">crownjourney.com</a></b></div>
  <div>UK phone ${v.phoneUK || "+44 0000 000000"} &nbsp;US phone ${v.phoneUS || "+1 000 000 0000"}</div>
</div>`,
  },
  "Across Mexico": {
    name: "Across Mexico",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Cintli Chacón" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phoneMX", label: "MX / Whatsapp", placeholder: "e.g. +52 (55) 7844 5502" },
      { key: "phoneUSA", label: "USA / Only calls", placeholder: "e.g. +1 (914) 677 0888" },
    ],
    render: (v) => `<div style="font-family:Arial,sans-serif;font-size:10pt;color:rgb(136,136,136);line-height:1.38">
  <p style="margin:0">${v.name || "Full Name"} | ${v.title || "Job Title"} | <a href="http://www.acrossmexico.com" target="_blank">Across Mexico</a></p>
  <p style="margin:0">MX / Whatsapp: ${v.phoneMX || "+52 (55) 0000 0000"}</p>
  <p style="margin:0">USA / Only calls: ${v.phoneUSA || "+1 (000) 000 0000"}</p>
  <p style="margin:0"><img src="https://ci3.googleusercontent.com/mail-sig/AIorK4woiDWIsGgeWTZf_AxTTmf26Vf46l6olIhuPdjBk1E0-ZXW9E9bb3BhLwlQ_pbfSalY2a_m8hS0o1t7" width="200" height="58" alt="Across Mexico"></p>
  <p style="margin:0;font-size:7.5pt"><i>Tourism license: 3509015c78ac2</i></p>
</div>`,
  },
  "Truly Swahili": {
    name: "Truly Swahili",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Melvin Mapetla" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phone", label: "Phone Number(s)", placeholder: "e.g. +255 750 396 872; +254 11 4919820", multiline: false },
    ],
    render: (v) => `<div dir="ltr">
  <p dir="ltr" style="line-height:1.38;margin:0">
    <span style="font-family:Arial,sans-serif;font-size:12.8px;color:rgb(136,136,136)">${v.name || "Full Name"} | ${v.title || "Job Title"} | </span><a href="https://www.trulyswahili.com/" target="_blank" style="font-family:Arial,sans-serif;font-size:12.8px;color:rgb(147,196,125);text-decoration:none">Truly Swahili</a><span style="font-family:Arial,sans-serif;font-size:12.8px;color:rgb(136,136,136)"> |</span>
  </p>
  <p dir="ltr" style="line-height:1.38;margin:0">
    <span style="font-family:Arial,sans-serif;font-size:12.8px;color:rgb(136,136,136)">M: ${v.phone || "+000 000 000 000"}</span>
  </p>
  <p dir="ltr" style="line-height:1.38;margin:0">&nbsp;</p>
  <img src="https://ci3.googleusercontent.com/mail-sig/AIorK4zQSI0F9vUJCcBl_V5Bp9niZu3pVVxofVEnU504d9xP5TECskdh-Pz7-O_q_jcmaaGMf7atw-PDPRem" width="200" height="100" alt="Truly Swahili">
  <p dir="ltr" style="line-height:1.38;margin:0">&nbsp;</p>
</div>`,
  },
};

const SUBSIDIARIES = Object.keys(SIGNATURE_TEMPLATES);

export default function SignaturesPage() {
  const [selected, setSelected] = useState<string>("");
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  const template = selected ? SIGNATURE_TEMPLATES[selected] : null;

  function handleSelect(sub: string) {
    setSelected(sub);
    setValues({});
    setCopied(false);
  }

  function handleChange(key: string, value: string) {
    setValues((prev) => ({ ...prev, [key]: value }));
    setCopied(false);
  }

  const html = template ? template.render(values) : "";

  async function handleCopy() {
    await navigator.clipboard.writeText(html);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AppShell>
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "40px 24px" }}>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "#1a2332", marginBottom: 8 }}>
          Email Signatures
        </h1>
        <p style={{ fontSize: 14, color: "#6B7D8F", marginBottom: 32 }}>
          Select a subsidiary, fill in your details, and copy your signature HTML.
        </p>

        {/* Subsidiary selector */}
        <div style={{ marginBottom: 32 }}>
          <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: "#304256", marginBottom: 10 }}>
            Select Subsidiary
          </label>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 10 }}>
            {SUBSIDIARIES.map((sub) => (
              <button
                key={sub}
                onClick={() => handleSelect(sub)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: selected === sub ? "2px solid #4F9E2D" : "2px solid #e2e8f0",
                  background: selected === sub ? "#f0faf0" : "#fff",
                  color: selected === sub ? "#2d6a1a" : "#304256",
                  fontWeight: selected === sub ? 600 : 400,
                  fontSize: 13,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >
                {sub}
              </button>
            ))}
          </div>
        </div>

        {template && (
          <>
            {/* Input fields */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 24,
                marginBottom: 28,
              }}
            >
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#304256", marginBottom: 20 }}>
                Your Details
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {template.fields.map((field) => (
                  <div key={field.key}>
                    <label
                      style={{
                        display: "block",
                        fontSize: 12,
                        fontWeight: 600,
                        color: "#6B7D8F",
                        textTransform: "uppercase",
                        letterSpacing: "0.05em",
                        marginBottom: 6,
                      }}
                    >
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={values[field.key] || ""}
                      onChange={(e) => handleChange(field.key, e.target.value)}
                      placeholder={field.placeholder}
                      style={{
                        width: "100%",
                        padding: "10px 12px",
                        border: "1px solid #e2e8f0",
                        borderRadius: 8,
                        fontSize: 14,
                        color: "#1a2332",
                        outline: "none",
                        boxSizing: "border-box",
                        fontFamily: "inherit",
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Live preview */}
            <div
              style={{
                background: "#fff",
                border: "1px solid #e2e8f0",
                borderRadius: 12,
                padding: 24,
                marginBottom: 20,
              }}
            >
              <h2 style={{ fontSize: 15, fontWeight: 600, color: "#304256", marginBottom: 16 }}>
                Preview
              </h2>
              <div
                style={{
                  padding: "20px",
                  background: "#fafafa",
                  borderRadius: 8,
                  border: "1px solid #f0f0f0",
                }}
                dangerouslySetInnerHTML={{ __html: html }}
              />
            </div>

            {/* Copy button */}
            <button
              onClick={handleCopy}
              style={{
                padding: "12px 28px",
                borderRadius: 8,
                border: "none",
                background: copied ? "#4F9E2D" : "#304256",
                color: "#fff",
                fontSize: 14,
                fontWeight: 600,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: 8,
                transition: "background 0.15s",
              }}
            >
              {copied ? (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                  Copy HTML
                </>
              )}
            </button>
          </>
        )}
      </div>
    </AppShell>
  );
}
