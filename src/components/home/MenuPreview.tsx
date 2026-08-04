"use client";

import MenuCard from "../menu/MenuCard";
import { useMenu } from "@/app/hooks/useMenu";

export default function MenuPreview() {
  const { menuItems, isLoading, error } = useMenu();

  if (isLoading) return <p>Loading Menu</p>;

  if (error) return <p>{error}</p>;
  return (
    <section>
      {menuItems.map((item) => (
        <MenuCard
          key={item._id}
          id={item._id}
          name={item.name}
          price={item.price}
          description={item.description}
          imageUrl={item.imageUrl || ""}
          isNew={item.isNew}
          isAvailable={item.available}
        />
      ))}
    </section>
  );
}
