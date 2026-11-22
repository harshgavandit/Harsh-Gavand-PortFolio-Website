// Technologies orbiting the hero core. `brand` refers to a symbol in
// /stack/technology-logos.svg; `glyph` is drawn as text for concepts.
export type HeroNode = {
  label: string;
  brand?: string;
  glyph?: string;
  ring: number; // orbit index 0..2
  phase: number; // starting angle (radians)
};

export const heroNodes: HeroNode[] = [
  { label: "Python", brand: "python", ring: 0, phase: 0.2 },
  { label: "React", brand: "react", ring: 1, phase: 1.4 },
  { label: "Node.js", brand: "nodedotjs", ring: 2, phase: 2.5 },
  { label: "LLM agents", glyph: "AI", ring: 0, phase: 3.4 },
  { label: "RAG", glyph: "RAG", ring: 1, phase: 4.5 },
  { label: "FastAPI", brand: "fastapi", ring: 2, phase: 5.4 },
  { label: "AWS", brand: "aws", ring: 1, phase: 0.1 + Math.PI },
  { label: "Docker", brand: "docker", ring: 2, phase: 0.9 },
  { label: "PostgreSQL", brand: "postgresql", ring: 0, phase: 1.9 + Math.PI },
];
