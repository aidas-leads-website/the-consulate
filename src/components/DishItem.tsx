import type { Dish } from '@/content/menu';

const DIET_LABEL = { vegan: 'Vegan', vegetarian: 'Vegetarian', 'gluten-free': 'Gluten-free' } as const;

/** One menu entry: name, dotted leader, price, description and an optional meta line. */
export function DishItem({ dish, meta, ...rest }: { dish: Dish; meta?: React.ReactNode } & React.HTMLAttributes<HTMLLIElement>) {
  const dietMeta = !meta && (dish.diet?.length || dish.note);
  return (
    <li className="dish" {...rest}>
      <div className="dish-top">
        <h3>{dish.name}</h3>
        <span className="dots" />
        {dish.price !== undefined && <span className="price">${dish.price}</span>}
      </div>
      <p>{dish.description}</p>
      {meta && <div className="meta">{meta}</div>}
      {dietMeta && (
        <div className="meta">
          {dish.diet?.map((d) => <span key={d}>{DIET_LABEL[d]}</span>)}
          {dish.note && <span className="note">{dish.note}</span>}
        </div>
      )}
    </li>
  );
}
