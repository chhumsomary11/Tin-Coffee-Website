import Image from "next/image";
import Link from "next/link";

type MenuCardProps = {
  id: string;
  name: string;
  price: number;
  description: string;
  imageUrl: string;
  isAvailable?: boolean;
  isNew?: boolean;
};

export default function MenuCard({
  id,
  name,
  price,
  description,
  imageUrl,
  isAvailable = true,
  isNew = false,
}: MenuCardProps) {
  const formattedPrice = new Intl.NumberFormat("en-US").format(price);

  return (
    <article className="min-w-0">
      {/* Product image */}
      <div className="relative aspect-[1/1.1] overflow-hidden rounded-bl-[50px] rounded-tr-[50px] bg-[#EEE9E0]">
        <Image
          src={imageUrl || "/images/menu-placeholder.jpg"}
          alt={name}
          fill
          sizes="
            (max-width: 768px) 50vw,
            (max-width: 1200px) 25vw,
            250px
          "
          className="object-cover transition duration-300 hover:scale-105"
        />

        {isNew && (
          <span className="absolute left-2 top-2 rounded-md border border-orange-300 bg-orange-50 px-2 py-0.5 text-[10px] text-orange-600">
            New
          </span>
        )}

        {!isAvailable && (
          <span className="absolute left-2 top-2 rounded-md border border-red-300 bg-white px-2 py-0.5 text-[10px] text-red-500">
            Sold out
          </span>
        )}
      </div>

      {/* Name and price */}
      <div className="mt-4 flex items-start justify-between gap-2">
        <h4 className="min-w-0 font-serif text-xs font-medium text-[#2D211A] sm:text-sm">
          {name}
        </h4>

        <span className="shrink-0 text-[11px] text-[#A47116] sm:text-xs">
          ៛ {formattedPrice}
        </span>
      </div>

      {/* Description */}
      <p className="mt-3 line-clamp-3 text-[10px] leading-relaxed text-[#796D64] sm:text-xs">
        {description}
      </p>

      {/* Action */}
      {isAvailable ? (
        <Link
          href={`/menu/${id}`}
          className="mt-4 inline-flex min-h-10 items-center justify-center rounded-lg border border-[#734B31] px-4 py-2 text-xs font-medium text-[#613C24] shadow-sm transition hover:bg-[#6B3E1F] hover:text-white"
        >
          Order Now
        </Link>
      ) : (
        <button
          type="button"
          disabled
          className="mt-4 min-h-10 cursor-not-allowed rounded-lg border border-[#CFC5BD] px-4 py-2 text-xs text-[#AAA099]"
        >
          Order Now
        </button>
      )}
    </article>
  );
}
