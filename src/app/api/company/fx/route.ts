import { NextResponse } from "next/server";

// Frankfurter supports these DMC currencies
const FRANKFURTER_CODES = ["EUR", "GBP", "MXN", "JPY", "AUD", "THB", "TRY", "IDR"];
// ExchangeRate-API needed for these
const ERAPI_CODES = ["AED", "MAD", "PEN", "COP", "KES"];

const ALL_CODES = [...FRANKFURTER_CODES, ...ERAPI_CODES];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const target = searchParams.get("history"); // e.g. "EUR" for 30-day history

  try {
    // If requesting history for a specific currency
    if (target) {
      const end = new Date();
      const start = new Date();
      start.setDate(start.getDate() - 30);
      const fmt = (d: Date) => d.toISOString().split("T")[0];

      // Try Frankfurter first (has historical data)
      if (FRANKFURTER_CODES.includes(target)) {
        const res = await fetch(
          `https://api.frankfurter.dev/v1/${fmt(start)}..${fmt(end)}?base=USD&symbols=${target}`,
          { next: { revalidate: 3600 } }
        );
        if (res.ok) {
          const data = await res.json();
          // Convert { rates: { "2026-03-01": { EUR: 0.87 }, ... } } to array
          const points = Object.entries(data.rates as Record<string, Record<string, number>>)
            .map(([date, rates]) => ({ date, rate: rates[target] }))
            .sort((a, b) => a.date.localeCompare(b.date));
          return NextResponse.json({ history: points });
        }
      }

      // Fallback: no historical data available for non-Frankfurter currencies
      return NextResponse.json({ history: [] });
    }

    // Fetch latest rates from both sources in parallel
    const [frankfurterRes, erapiRes] = await Promise.all([
      fetch(
        `https://api.frankfurter.dev/v1/latest?base=USD&symbols=${FRANKFURTER_CODES.join(",")}`,
        { next: { revalidate: 3600 } }
      ),
      fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 3600 } }),
    ]);

    const rates: Record<string, number> = {};
    let lastUpdated = "";

    if (frankfurterRes.ok) {
      const data = await frankfurterRes.json();
      lastUpdated = data.date;
      for (const [code, rate] of Object.entries(data.rates as Record<string, number>)) {
        rates[code] = rate;
      }
    }

    if (erapiRes.ok) {
      const data = await erapiRes.json();
      if (!lastUpdated) lastUpdated = data.date || new Date().toISOString().split("T")[0];
      for (const code of ERAPI_CODES) {
        if (data.rates[code]) {
          rates[code] = data.rates[code];
        }
      }
    }

    return NextResponse.json({ rates, lastUpdated, currencies: ALL_CODES });
  } catch (err) {
    console.error("FX API error:", err);
    return NextResponse.json({ error: "Failed to fetch rates" }, { status: 500 });
  }
}
