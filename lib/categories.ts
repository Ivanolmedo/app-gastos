export type Category = { id: number; name: string; color: string };

// Los IDs coinciden con el orden de inserción en la tabla categories
export const CATEGORIES: Category[] = [
  { id: 1, name: "Vivienda / Arriendo", color: "#3B82F6" },
  { id: 2, name: "Alimentación", color: "#22C55E" },
  { id: 3, name: "Transporte", color: "#F97316" },
  { id: 4, name: "Servicios", color: "#A855F7" },
  { id: 5, name: "Salud", color: "#EF4444" },
  { id: 6, name: "Educación", color: "#6366F1" },
  { id: 7, name: "Ocio / Entretenimiento", color: "#EC4899" },
  { id: 8, name: "Ropa", color: "#EAB308" },
  { id: 9, name: "Suscripciones", color: "#06B6D4" },
  { id: 10, name: "Otros", color: "#6B7280" },
];

export const DEFAULT_CATEGORY_ID = 10; // "Otros"

export const getCategory = (id: number) =>
  CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];
