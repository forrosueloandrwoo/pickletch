import HeroBackground from "./HeroBackground.jsx";
import Carousel from "./Carousel.jsx";

const images = [
  { src: "/img/pb1.webp", alt: "Pickletch court photo 1" },
  { src: "/img/pb2.webp", alt: "Pickletch court photo 2" },
  { src: "/img/pb3.webp", alt: "Pickletch court photo 3" },
  { src: "/img/pb4.webp", alt: "Pickletch court photo 4" },
];

export default function Hero() {
  return (
    <section
      id="landing"
      className="relative bg-yellow-50 min-h-[calc(100vh-64px)] flex flex-col-reverse lg:flex-row items-center px-4 sm:px-8 lg:px-16 py-10 gap-10 lg:gap-12 overflow-hidden"
    >
      <HeroBackground />

      <div className="relative z-10 w-full lg:w-1/2 px-2 sm:px-6 lg:px-12 text-center lg:text-left">
        <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-[0.95] text-gray-800">
          Tara,<br />Pickletch!
        </h1>

        <p className="text-gray-600 mb-8 max-w-md mx-auto lg:mx-0">
          Book a pickleball court in Sindangan in under a minute. Pick a date,
          pick a court, show up and play — no calls, no waiting on a reply.
        </p>

        <div className="flex flex-wrap justify-center lg:justify-start items-center gap-4 sm:gap-5">
          <a href="#offers" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors">
            Book Now!
          </a>
          <a href="#offers" className="text-green-700 font-semibold hover:text-green-800 transition-colors">
            See open times →
          </a>
        </div>
      </div>

      <div className="relative z-10 w-full lg:w-1/2 flex justify-center px-2">
        <Carousel images={images} />
      </div>
    </section>
  );
}
