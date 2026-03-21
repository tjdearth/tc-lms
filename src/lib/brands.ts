export interface DMCBrand {
  name: string;
  countries: string[];
  hex: string;
}

export const DMC_BRANDS: Record<string, DMCBrand> = {
  "Authenticus Italy": {
    name: "Authenticus Italy",
    countries: ["Italy"],
    hex: "#C6B356",
  },
  "Unbox Spain & Portugal": {
    name: "Unbox Spain & Portugal",
    countries: ["Spain", "Portugal"],
    hex: "#7C1137",
  },
  "Truly Swahili": {
    name: "Truly Swahili",
    countries: ["Kenya", "Tanzania", "Uganda", "Rwanda"],
    hex: "#4F9E2D",
  },
  "Across Mexico": {
    name: "Across Mexico",
    countries: ["Mexico"],
    hex: "#E56456",
  },
  "Kembali Indonesia": {
    name: "Kembali Indonesia",
    countries: ["Indonesia", "Singapore", "Malaysia"],
    hex: "#ADA263",
  },
  "Majlis Retreats": {
    name: "Majlis Retreats",
    countries: ["UAE"],
    hex: "#B28A72",
  },
  "Crown Journey": {
    name: "Crown Journey",
    countries: ["UK"],
    hex: "#6D7581",
  },
  "Oshinobi Travel": {
    name: "Oshinobi Travel",
    countries: ["Japan"],
    hex: "#E9395E",
  },
  "Essentially French": {
    name: "Essentially French",
    countries: ["France"],
    hex: "#58392E",
  },
  "Elura Australia": {
    name: "Elura Australia",
    countries: ["Australia"],
    hex: "#B04D32",
  },
  "Nira Thailand": {
    name: "Nira Thailand",
    countries: ["Thailand"],
    hex: "#636218",
  },
  "Sar Turkiye": {
    name: "Sar Turkiye",
    countries: ["Turkiye"],
    hex: "#247F82",
  },
  "Nostos Greece": {
    name: "Nostos Greece",
    countries: ["Greece"],
    hex: "#0E1952",
  },
  "Vista Colombia": {
    name: "Vista Colombia",
    countries: ["Colombia"],
    hex: "#FEE9A8",
  },
  "Awaken Peru": {
    name: "Awaken Peru",
    countries: ["Peru"],
    hex: "#95AFA2",
  },
  "Experience Morocco": {
    name: "Experience Morocco",
    countries: ["Morocco"],
    hex: "#F56A23",
  },
};

export const BRAND_NAMES = Object.keys(DMC_BRANDS).sort();

export function getBrandColor(brand: string): string {
  return DMC_BRANDS[brand]?.hex || "#304256";
}
