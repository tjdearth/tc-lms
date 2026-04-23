"use client";

import { useState } from "react";
import AppShell from "@/components/AppShell";

interface SignatureTemplate {
  name: string;
  fields: { key: string; label: string; placeholder: string; defaultValue?: string; multiline?: boolean }[];
  render: (values: Record<string, string>) => string;
}

const SIGNATURE_TEMPLATES: Record<string, SignatureTemplate> = {
  "Sar Turkiye": {
    name: "Sar Turkiye",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Hazan Sucu" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phone", label: "Phone", placeholder: "e.g. +1 617 308 0125", defaultValue: "+1 617 308 0125" },
    ],
    render: (v) => `<div style="font-family:Arial,sans-serif;font-size:10pt;color:#444;line-height:1.38">
  <p style="margin:0"><img src="https://atlas.travelcollection.co/logos/sar-turkiye.png" width="200" alt="SAR Turkiye"></p>
  <p style="margin:0">${v.name || "Full Name"} | ${v.title || "Job Title"} | <a href="https://www.sarturkiye.com/" target="_blank">SAR Turkiye</a></p>
  <p style="margin:0">M: ${v.phone || "+0 000 000 0000"}</p>
</div>`,
  },
  "Awaken Peru": {
    name: "Awaken Peru",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Diego Nieto" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phone", label: "Phone", placeholder: "e.g. +51 943 982 628", defaultValue: "+51 943 982 628" },
    ],
    render: (v) => `<table cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;font-size:10pt"><tr>
  <td style="border-right:1px solid #000;padding-right:10px;vertical-align:bottom">
    <img src="https://atlas.travelcollection.co/logos/awaken-peru.png" width="200" height="68" alt="Awaken Peru">
  </td>
  <td style="padding-left:10px;vertical-align:middle">
    <div><b style="color:#666">${v.name || "Full Name"}</b></div>
    <div style="color:#888">${v.title || "Job Title"}</div>
    <div style="color:#888">M: ${v.phone || "+00 000 000 000"}</div>
    <div style="margin-top:4px">
      <a href="http://www.awakenperu.com" target="_blank"><img src="https://img1.gimm.io/assets/social/96/333333/3/website.png" width="24" height="24" alt="website" style="border:0"></a>&nbsp;
      <a href="https://www.linkedin.com/company/awaken-peru/" target="_blank"><img src="https://img1.gimm.io/assets/social/96/333333/3/linkedin.png" width="24" height="24" alt="linkedin" style="border:0"></a>&nbsp;
      <a href="https://www.instagram.com/awaken_peru/" target="_blank"><img src="https://img1.gimm.io/assets/social/96/333333/3/instagram.png" width="24" height="24" alt="instagram" style="border:0"></a>
    </div>
  </td>
</tr></table>`,
  },
  "Nira Thailand": {
    name: "Nira Thailand",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Nick Sakunworaratana" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phoneTH", label: "Thailand Phone", placeholder: "e.g. +66 85 915 9280", defaultValue: "+66 85 915 9280" },
      { key: "phoneUS", label: "US Phone", placeholder: "e.g. +1 (917) 854 0192", defaultValue: "+1 (917) 854 0192" },
    ],
    render: (v) => `<div style="color:rgb(136,136,136)">
  <div>${v.name || "Full Name"} | ${v.title || "Job Title"} | NiraThailand</div>
  <div>M: ${v.phoneTH || "+66 00 000 0000"}; ${v.phoneUS || "+1 (000) 000 0000"}</div>
  <div><a href="http://www.nirathailand.com" target="_blank" style="color:rgb(17,85,204)">www.nirathailand.com</a></div>
  <div><img src="https://atlas.travelcollection.co/logos/nira-thailand.png" width="96" height="80" alt="NiraThailand"></div>
</div>`,
  },
  "Elura Australia": {
    name: "Elura Australia",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Aaron Hocking" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phone", label: "Phone", placeholder: "e.g. +61 483 803 208", defaultValue: "+61 483 803 208" },
    ],
    render: (v) => `<table cellpadding="5" cellspacing="0" style="font-family:Arial,sans-serif;color:#000"><tr>
  <td style="vertical-align:top;text-align:center;width:115px">
    <a href="https://www.eluraaustralia.com" target="_blank"><img src="https://atlas.travelcollection.co/logos/elura-australia.png" width="75" height="97" alt="Elura Australia"></a>
  </td>
  <td style="vertical-align:middle">
    <div style="font-size:12pt;font-weight:700">${v.name || "Full Name"}</div>
    <div style="font-size:10.5pt">${v.title || "Job Title"} – Elura Australia</div>
    <div style="font-size:10.5pt">M: ${v.phone || "+61 000 000 000"}</div>
    <div style="font-size:10.5pt"><a href="http://eluraaustralia.com" target="_blank" style="color:#000">eluraaustralia.com</a> | @eluraaustralia</div>
  </td>
</tr></table>`,
  },
  "Essentially French": {
    name: "Essentially French",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Livy LEROY" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phoneFR", label: "France Phone", placeholder: "e.g. +33 6 67 43 39 45", defaultValue: "+33 6 67 43 39 45" },
      { key: "phoneUS", label: "US Phone", placeholder: "e.g. +1 (872) 266 3600", defaultValue: "+1 (872) 266 3600" },
    ],
    render: (v) => `<table cellpadding="0" cellspacing="0" style="font-family:Helvetica,Arial,sans-serif;font-size:13px;color:#333;line-height:1.6"><tr>
  <td style="padding:0 20px 0 0;vertical-align:middle;text-align:center">
    <img alt="Essentially French" src="https://atlas.travelcollection.co/logos/essentially-french.png" width="80">
  </td>
  <td style="border-left:3px solid rgb(75,45,35);padding:4px 0 4px 16px;vertical-align:middle">
    <div style="font-size:17px;font-weight:600;color:#1a1a1a;letter-spacing:0.3px;margin-bottom:2px">${v.name || "Full Name"}</div>
    <div style="font-size:13px;color:#666;margin-bottom:10px">${v.title || "Job Title"} · Essentially French · Paris, France</div>
    <div><span style="color:#888">M</span>&nbsp;&nbsp;${v.phoneFR || "+33 0 00 00 00 00"} &nbsp;·&nbsp; ${v.phoneUS || "+1 (000) 000 0000"}</div>
    <div><span style="color:#888">W</span>&nbsp;&nbsp;<a href="https://www.essentiallyfrench.com" target="_blank" style="color:rgb(75,45,35);text-decoration:none">essentiallyfrench.com</a></div>
  </td>
</tr></table>`,
  },
  "Oshinobi Travel": {
    name: "Oshinobi Travel",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Hiroshi Tsuji" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "address", label: "Address", placeholder: "Office address", defaultValue: "#401, Tensho Office Suidobashi, 3-5-9 Kanda-Misakicho, Chiyoda-ku, Tokyo, Japan" },
      { key: "phoneJP", label: "Japan Phone", placeholder: "e.g. +81 80 5009 1526", defaultValue: "+81 80 5009 1526" },
      { key: "phoneUS", label: "US Phone", placeholder: "e.g. +1 256 857 5171", defaultValue: "+1 256 857 5171" },
    ],
    render: (v) => `<div style="font-family:Arial,sans-serif;color:rgb(136,136,136);line-height:1.38">
  <p style="margin:0;font-size:10pt">${v.name || "Full Name"} | ${v.title || "Job Title"} | <a href="https://www.oshinobitravel.com/" target="_blank">Oshinobi Travel</a></p>
  <p style="margin:0;font-size:x-small">${v.address || "#401, Tensho Office Suidobashi, 3-5-9 Kanda-Misakicho, Chiyoda-ku, Tokyo, Japan"}</p>
  <p style="margin:0;font-size:7.5pt">M: ${v.phoneJP || "+81 00 0000 0000"} (Japan), ${v.phoneUS || "+1 000 000 0000"} (US)</p>
  <p style="margin:0"><img src="https://atlas.travelcollection.co/logos/oshinobi-travel.png" width="96" height="80" alt="Oshinobi Travel"></p>
  <p style="margin:0;font-size:7.5pt">* Oshinobi Travel serves as the secondary trade name registered by TCL Japan LLC under the Travel Agency Act of Japan (Tokyo Metropolitan Governor Registration Travel Agency No. 2-8700)</p>
</div>`,
  },
  "Majlis Retreats": {
    name: "Majlis Retreats",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Radia Tehitahe" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phoneUAE", label: "UAE Phone", placeholder: "e.g. +971 58 591 8922", defaultValue: "+971 58 591 8922" },
      { key: "phoneUSA", label: "USA Phone", placeholder: "e.g. +1 256 907 7487", defaultValue: "+1 256 907 7487" },
    ],
    render: (v) => `<div style="color:rgb(136,136,136)">
  <div>${v.name || "Full Name"} | ${v.title || "Job Title"} | <a href="https://majlisretreats.com/" target="_blank">Majlis Retreats</a></div>
  <div>UAE: ${v.phoneUAE || "+971 00 000 0000"} | USA: ${v.phoneUSA || "+1 000 000 0000"}</div>
  <div><img src="https://atlas.travelcollection.co/logos/majlis-retreats.png" width="200" height="79" alt="Majlis Retreats"></div>
</div>`,
  },
  "Authenticus Italy": {
    name: "Authenticus Italy",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Giulia Catalano" },
      { key: "title", label: "Job Title", placeholder: "e.g. Travel Designer" },
      { key: "address", label: "Address", placeholder: "e.g. Piazza San Sepolcro, 2 - Milano (MI)", defaultValue: "Piazza San Sepolcro, 2 - Milano (MI)" },
      { key: "phoneIT", label: "IT Phone", placeholder: "e.g. (+39) 3342207581", defaultValue: "(+39) 3342207581" },
      { key: "phoneUS", label: "US Phone", placeholder: "e.g. (+1) 3126346159", defaultValue: "(+1) 3126346159" },
      { key: "phoneOOH", label: "Outside Business Hours", placeholder: "e.g. (+39) 3311545758", defaultValue: "(+39) 3311545758" },
    ],
    render: (v) => `<div style="font-family:tahoma,sans-serif;font-size:13px;color:rgb(136,136,136)">
  <div><br></div>
  <div>${v.name || "Full Name"} | ${v.title || "Job Title"} | <a href="http://www.authenticusitaly.it/" target="_blank" style="color:rgb(5,99,193)">Authenticus Italy</a></div>
  <div>${v.address || "Piazza San Sepolcro, 2 - Milano (MI)"}</div>
  <div>IT: ${v.phoneIT || "(+39) 0000000000"}</div>
  <div>US: ${v.phoneUS || "(+1) 0000000000"}</div>
  <div>Outside business hours: ${v.phoneOOH || "(+39) 0000000000"}</div>
  <div><img src="https://atlas.travelcollection.co/logos/authenticus-italy.png" width="84" height="96" alt="Authenticus Italy"></div>
</div>`,
  },
  "Nostos Greece": {
    name: "Nostos Greece",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Aris Mitropoulos" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phone1", label: "Phone 1", placeholder: "e.g. +30 697 584 1714", defaultValue: "+30 697 584 1714" },
      { key: "phone2", label: "Phone 2", placeholder: "e.g. +1 464 733 2033", defaultValue: "+1 464 733 2033" },
      { key: "address", label: "Address", placeholder: "e.g. Solonos & Sina 53, Athens, 10672, Greece", defaultValue: "Solonos & Sina 53, Athens, 10672, Greece" },
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
  <div><img src="https://atlas.travelcollection.co/logos/nostos-greece.png" width="200" height="89" alt="Nostos Greece"></div>
</div>`,
  },
  "Experience Morocco": {
    name: "Experience Morocco",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Wahiba AMYN" },
      { key: "title", label: "Job Title", placeholder: "e.g. HR Manager" },
      { key: "email", label: "Email Address", placeholder: "e.g. w.amyn@experiencemorocco.com" },
      { key: "phone", label: "Phone", placeholder: "e.g. +212 6 70 091 236", defaultValue: "+212 6 70 091 236" },
    ],
    render: (v) => {
      const telHref = (v.phone || "+000000000000").replace(/\s/g, "");
      return `<table cellpadding="0" cellspacing="0" style="background:#a34e2f;font-family:Montserrat,Arial,sans-serif;color:#fff;border-collapse:collapse">
  <tr>
    <td style="padding:20px 16px 20px 20px;vertical-align:middle">
      <img alt="Experience Morocco" src="https://atlas.travelcollection.co/logos/experience-morocco.png" width="180">
    </td>
    <td style="padding:20px 16px;vertical-align:middle;font-size:13px;line-height:1.6;white-space:nowrap">
      <div style="font-weight:600;font-size:15px">${v.name || "Full Name"}</div>
      <div style="font-size:12px;margin-bottom:10px">${v.title || "Job Title"}</div>
      <div><b>Email:</b> <a href="mailto:${v.email || "email@experiencemorocco.com"}" style="color:#fff">${v.email || "email@experiencemorocco.com"}</a></div>
      <div><b>Website:</b> <a href="https://www.experiencemorocco.com/" style="color:#fff">www.experiencemorocco.com</a></div>
      <div><b>Phone:</b> <a href="tel:${telHref}" style="color:#fff">${v.phone || "+000 0 00 000 000"}</a></div>
    </td>
    <td style="padding:20px 20px 20px 8px;vertical-align:middle">
      <table cellpadding="0" cellspacing="0"><tr><td style="padding-bottom:8px">
        <a href="https://linkedin.com/company/experience-morocco"><img width="18" height="18" alt="LinkedIn" src="https://atlas.travelcollection.co/social/li.svg"></a>
      </td></tr><tr><td style="padding-bottom:8px">
        <a href="https://facebook.com/expmorocco"><img width="18" height="18" alt="Facebook" src="https://atlas.travelcollection.co/social/fb.svg"></a>
      </td></tr><tr><td>
        <a href="https://instagram.com/experiencemorocco"><img width="18" height="18" alt="Instagram" src="https://atlas.travelcollection.co/social/ig.svg"></a>
      </td></tr></table>
    </td>
  </tr>
</table>`;
    },
  },
  "Unbox Spain & Portugal": {
    name: "Unbox Spain & Portugal",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Lucía Arroyo" },
      { key: "title", label: "Job Title", placeholder: "e.g. Itinerary Coordinator" },
      { key: "cell", label: "Cell Phone", placeholder: "e.g. +34 625 663 518", defaultValue: "+34 625 663 518" },
    ],
    render: (v) => `<div style="font-family:Arial,sans-serif;color:rgb(136,136,136)">
  ${v.name || "Full Name"} | ${v.title || "Job Title"}, <a href="https://www.unboxspainandportugal.com/" target="_blank" style="color:rgb(17,85,204)">Unbox Spain &amp; Portugal</a> | Cell: ${v.cell || "+00 000 000 000"}
  <div><img src="https://atlas.travelcollection.co/logos/unbox-spain.png" width="200" height="56" alt="Unbox Spain &amp; Portugal"></div>
</div>`,
  },
  "Crown Journey": {
    name: "Crown Journey",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Karen Gee" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "email", label: "Email Address", placeholder: "e.g. karen@crownjourney.com" },
      { key: "phoneUK", label: "UK Phone", placeholder: "e.g. +44 7740 896780", defaultValue: "+44 7740 896780" },
      { key: "phoneUS", label: "US Phone", placeholder: "e.g. +1 646 917 6807", defaultValue: "+1 646 917 6807" },
    ],
    render: (v) => `<div style="color:rgb(136,136,136)">
  <img src="https://atlas.travelcollection.co/logos/crown-journey.png" alt="Crown Journey"><br>
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
      { key: "phoneMX", label: "MX / Whatsapp", placeholder: "e.g. +52 (55) 7844 5502", defaultValue: "+52 (55) 7844 5502" },
      { key: "phoneUSA", label: "USA / Only calls", placeholder: "e.g. +1 (914) 677 0888", defaultValue: "+1 (914) 677 0888" },
    ],
    render: (v) => `<div style="font-family:Arial,sans-serif;font-size:10pt;color:rgb(136,136,136);line-height:1.38">
  <p style="margin:0">${v.name || "Full Name"} | ${v.title || "Job Title"} | <a href="http://www.acrossmexico.com" target="_blank">Across Mexico</a></p>
  <p style="margin:0">MX / Whatsapp: ${v.phoneMX || "+52 (55) 0000 0000"}</p>
  <p style="margin:0">USA / Only calls: ${v.phoneUSA || "+1 (000) 000 0000"}</p>
  <p style="margin:0"><img src="https://atlas.travelcollection.co/logos/across-mexico.png" width="200" height="58" alt="Across Mexico"></p>
  <p style="margin:0;font-size:7.5pt"><i>Tourism license: 3509015c78ac2</i></p>
</div>`,
  },
  "Truly Swahili": {
    name: "Truly Swahili",
    fields: [
      { key: "name", label: "Full Name", placeholder: "e.g. Melvin Mapetla" },
      { key: "title", label: "Job Title", placeholder: "e.g. General Manager" },
      { key: "phone", label: "Phone Number(s)", placeholder: "e.g. +255 750 396 872; +254 11 4919820", defaultValue: "+255 750 396 872; +254 11 4919820; +256 752 963 926" },
    ],
    render: (v) => `<div dir="ltr">
  <p dir="ltr" style="line-height:1.38;margin:0">
    <span style="font-family:Arial,sans-serif;font-size:12.8px;color:rgb(136,136,136)">${v.name || "Full Name"} | ${v.title || "Job Title"} | </span><a href="https://www.trulyswahili.com/" target="_blank" style="font-family:Arial,sans-serif;font-size:12.8px;color:rgb(147,196,125);text-decoration:none">Truly Swahili</a><span style="font-family:Arial,sans-serif;font-size:12.8px;color:rgb(136,136,136)"> |</span>
  </p>
  <p dir="ltr" style="line-height:1.38;margin:0">
    <span style="font-family:Arial,sans-serif;font-size:12.8px;color:rgb(136,136,136)">M: ${v.phone || "+000 000 000 000"}</span>
  </p>
  <p dir="ltr" style="line-height:1.38;margin:0">&nbsp;</p>
  <img src="https://atlas.travelcollection.co/logos/truly-swahili.png" width="200" height="100" alt="Truly Swahili">
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
    const defaults: Record<string, string> = {};
    for (const field of SIGNATURE_TEMPLATES[sub].fields) {
      if (field.defaultValue) defaults[field.key] = field.defaultValue;
    }
    setValues(defaults);
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
