import { MapPin } from "lucide-react";

export default function InfoBar() {
  return (
    <aside
      aria-label="Opening hours and address"
      className="
        border-y border-darkBrown/45 bg-tinColor px-4 py-5 text-center
        text-espresso sm:px-6
      "
    >
      <p className="font-cormorant text-3xl font-medium italic leading-none sm:text-4xl">
        Daily 7:00 — 20:00
      </p>

      <p
        className="
          mx-auto mt-3 flex max-w-fit items-center justify-center gap-2
          border-b border-darkBrown/60 px-2 pb-2
          font-jost text-xs font-normal uppercase tracking-wide sm:text-sm
        "
      >
        <MapPin className="h-4 w-4 flex-none text-darkBrown" strokeWidth={2} />
        <span>ST. 1003, Sen Sok, Phnom Penh</span>
      </p>
    </aside>
  );
}
