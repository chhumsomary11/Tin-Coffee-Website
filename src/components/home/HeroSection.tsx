import Link from "next/link";
import InfoBar from "./InfoBar";

export default function HeroSection() {
  return (
    <section className="bg-tinColor text-espresso" aria-labelledby="hero-title">
      <div
        className="
          mx-auto flex min-h-[calc(100svh-5rem)] max-w-7xl flex-col
          px-4 pb-4 pt-8 sm:px-6 sm:pt-12 lg:px-8
        "
      >
        <div className="mx-auto w-full max-w-3xl text-center">
          <h1
            id="hero-title"
            className="
              font-cormorant text-4xl font-semibold leading-[0.95]
              text-espresso sm:text-6xl lg:text-7xl
            "
          >
            Life begins after coffee
          </h1>

          <p className="mt-3 font-cormorant text-2xl font-medium italic leading-none sm:text-4xl">
            Sip &amp; Stay
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
            <Link
              href="/menu"
              className="
                inline-flex h-11 min-w-36 items-center justify-center
                rounded-lg bg-darkBrown px-6 font-jost text-sm font-medium
                text-tinColor shadow-sm transition hover:bg-espresso
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-darkBrown focus-visible:ring-offset-2
                focus-visible:ring-offset-tinColor
              "
            >
              Explore Menu
            </Link>

            <Link
              href="/booking"
              className="
                inline-flex h-11 min-w-36 items-center justify-center
                rounded-lg border border-darkBrown px-6 font-jost text-sm
                font-medium text-darkBrown transition hover:bg-darkBrown/10
                focus-visible:outline-none focus-visible:ring-2
                focus-visible:ring-darkBrown focus-visible:ring-offset-2
                focus-visible:ring-offset-tinColor
              "
            >
              Book a Room
            </Link>
          </div>
        </div>

        <div
          className="
            mt-12 min-h-80 flex-1 overflow-hidden bg-page
            shadow-[0_12px_30px_rgba(92,58,30,0.12)]
            sm:mt-14 lg:mt-16
          "
        >
          {/* //Note: Need to replace with picture  */}
          <div
            aria-label="Tin Coffee interior photo placeholder"
            className="
              h-full min-h-80 w-full
              bg-[linear-gradient(45deg,#f5f1e8_25%,transparent_25%),linear-gradient(-45deg,#f5f1e8_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#f5f1e8_75%),linear-gradient(-45deg,transparent_75%,#f5f1e8_75%)]
              bg-[length:40px_40px]
              bg-[position:0_0,0_20px,20px_-20px,-20px_0]
            "
          />
        </div>
      </div>

      <InfoBar />
    </section>
  );
}
