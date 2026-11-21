import { format, parseISO } from "date-fns";
import { es } from "date-fns/locale";

export const formatCLP = (value: number) =>
  new Intl.NumberFormat("es-CL", {
    style: "currency",
    currency: "CLP",
    maximumFractionDigits: 0,
  }).format(value); // "$12.990"

export const formatDate = (isoDate: string) =>
  format(parseISO(isoDate), "d 'de' MMM yyyy", { locale: es });

export const monthLabel = (date: Date) => format(date, "MMMM yyyy", { locale: es });

export const toISODate = (date: Date) => format(date, "yyyy-MM-dd");
