import { useCallback, useEffect, useRef, useState } from "react";

const REFERENCE_WIDTH = 560; // the width the offsets below were tuned for; everything scales to the real stage width

export default function Carousel({ images }) {
  const n = images.length;
  const [current, setCurrent] = useState(0);

  const stageRef = useRef(null);
  const cardRefs = useRef([]);
  const autoplayRef = useRef(null);
  const draggingRef = useRef(false);
  const dragStartXRef = useRef(0);

  const goTo = useCallback((index) => setCurrent(((index % n) + n) % n), [n]);
  const nextSlide = useCallback(() => goTo(current + 1), [current, goTo]);
  const prevSlide = useCallback(() => goTo(current - 1), [current, goTo]);

  const layout = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const stageWidth = stage.offsetWidth || REFERENCE_WIDTH;
    const ratio = stageWidth / REFERENCE_WIDTH;

    cardRefs.current.forEach((card, i) => {
      if (!card) return;
      let diff = i - current;
      if (diff > n / 2) diff -= n;
      if (diff < -n / 2) diff += n;
      const abs = Math.abs(diff);

      let translateX, translateZ, rotateY, scale, opacity, z, tint;

      if (abs === 0) {
        translateX = 0; translateZ = 0; rotateY = 0; scale = 1;
        opacity = 1; z = 30; tint = 0;
        card.classList.add("is-center");
      } else if (abs === 1) {
        translateX = diff * 150 * ratio; translateZ = -140 * ratio; rotateY = -diff * 38; scale = 0.82;
        opacity = 0.55; z = 20; tint = 1;
        card.classList.remove("is-center");
      } else {
        // fully hidden -- the "opposite" card, shouldn't linger on screen
        translateX = diff * 210 * ratio; translateZ = -280 * ratio; rotateY = -diff * 42; scale = 0.68;
        opacity = 0; z = 10; tint = 1;
        card.classList.remove("is-center");
      }

      card.style.transform =
        `translate(-50%, -50%) translateX(${translateX}px) translateZ(${translateZ}px) rotateY(${rotateY}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = z;
      card.style.pointerEvents = abs <= 1 ? "auto" : "none";
      const tintEl = card.querySelector(".tint");
      if (tintEl) tintEl.style.opacity = tint;
    });
  }, [current, n]);

  useEffect(() => { layout(); }, [layout]);

  useEffect(() => {
    window.addEventListener("resize", layout);
    return () => window.removeEventListener("resize", layout);
  }, [layout]);

  const resetAutoplay = useCallback(() => {
    // always clear before setting a new one -- this is the exact bug that made
    // the vanilla version's autoplay stack multiple intervals and speed up
    clearInterval(autoplayRef.current);
    autoplayRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % n);
    }, 5000);
  }, [n]);

  useEffect(() => {
    resetAutoplay();
    return () => clearInterval(autoplayRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const handlePointerDown = (e) => {
    if (e.target.closest(".carousel-dot")) return;
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    stageRef.current.classList.add("is-dragging");
    stageRef.current.setPointerCapture(e.pointerId);
    clearInterval(autoplayRef.current);
  };

  const handlePointerUp = (e) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    stageRef.current.classList.remove("is-dragging");
    const delta = e.clientX - dragStartXRef.current;
    if (delta < -50) nextSlide();
    else if (delta > 50) prevSlide();
    resetAutoplay();
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowRight") { nextSlide(); resetAutoplay(); }
    if (e.key === "ArrowLeft") { prevSlide(); resetAutoplay(); }
  };

  return (
    <div
      className="carousel-stage"
      tabIndex={0}
      ref={stageRef}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={() => {
        draggingRef.current = false;
        stageRef.current?.classList.remove("is-dragging");
      }}
      onMouseEnter={() => clearInterval(autoplayRef.current)}
      onMouseLeave={() => { if (!draggingRef.current) resetAutoplay(); }}
      onKeyDown={handleKeyDown}
    >
      <div className="carousel-floor" />

      {images.map((img, i) => (
        <div
          key={i}
          className="carousel-card"
          ref={(el) => (cardRefs.current[i] = el)}
          onClick={(e) => {
            e.stopPropagation();
            if (i !== current) { goTo(i); resetAutoplay(); }
          }}
        >
          <img src={img.src} alt={img.alt} />
          <div className="tint" />
        </div>
      ))}

      <div className="carousel-dots">
        {images.map((_, i) => (
          <div
            key={i}
            className={`carousel-dot ${i === current ? "active" : ""}`}
            onClick={(e) => { e.stopPropagation(); goTo(i); resetAutoplay(); }}
          />
        ))}
      </div>
    </div>
  );
}
