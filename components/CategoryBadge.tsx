import { getCategory } from "@/lib/categories";
import s from "@/styles/ui.module.scss";

export default function CategoryBadge({ categoryId }: { categoryId: number }) {
  const category = getCategory(categoryId);
  return (
    <span className={s.badge}>
      <span className={s.dot} style={{ background: category.color }} />
      {category.name}
    </span>
  );
}
