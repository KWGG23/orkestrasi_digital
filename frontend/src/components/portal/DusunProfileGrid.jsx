import { useEffect, useState } from "react";
import { Buildings } from "@phosphor-icons/react";
import { useProfilDusun } from "../../hooks/useProfilDusun.js";
import FeatureCard from "./FeatureCard.jsx";
import SectionHeading from "./SectionHeading.jsx";

const slides = [
  "/images/slider/foto1.jpg",
  "/images/slider/foto2.jpg",
  "/images/slider/foto3.jpg",
  "/images/slider/foto4.jpg",
  "/images/slider/foto5.jpg",
  "/images/slider/foto6.jpg",
];

function badgeFor(query) {
  if (!query.isSuccess) return undefined;

  return query.data?.konten ? "Profil tersedia" : "Segera hadir";
}

export default function DusunProfileGrid() {
  const karangasem = useProfilDusun("karangasem");

  // Untuk sementara tetap memakai slug backend lama
  const blongkeng = useProfilDusun("tegalwungu");

  const [activeSlide, setActiveSlide] = useState(0);

  const dusunCards = [
    {
      slug: "karangasem",
      title: "Dusun Karangasem",
      description:
        "Lokasi program Bank Sampah Digital dan bagian dari cakupan Portal Desa.",
      badge: badgeFor(karangasem),
    },
    {
      // Slug sementara tetap tegalwungu agar route lama tetap berjalan
      slug: "tegalwungu",
      title: "Dusun Blongkeng",
      description:
        "Mitra Portal Desa untuk pemetaan wilayah dan pengembangan potensi UMKM lokal.",
      badge: badgeFor(blongkeng),
    },
  ];

  // AUTO SLIDER
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlide((prev) => (prev + 1) % slides.length);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  // POSISI SLIDE
  const getPosition = (index) => {
    let diff = index - activeSlide;

    if (diff > slides.length / 2) {
      diff -= slides.length;
    }

    if (diff < -slides.length / 2) {
      diff += slides.length;
    }

    return diff;
  };

  return (
    <section id="profil-dusun" className="relative overflow-hidden pb-16 pt-8">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {/* JUDUL PROFIL WILAYAH */}
        <SectionHeading
          eyebrow="Profil Wilayah"
          title="Kenali dua dusun kami"
          description="Data geografis, demografis, dan potensi wilayah — diperbarui bertahap seiring survei lapangan."
        />

        {/* SLIDER FOTO */}
        <div className="relative mt-8">
          <div
            className="
              relative
              flex
              h-[250px]
              items-center
              justify-center
              sm:h-[300px]
              md:h-[350px]
              lg:h-[390px]
            "
            style={{
              perspective: "1200px",
            }}
          >
            {slides.map((slide, index) => {
              const position = getPosition(index);

              if (Math.abs(position) > 1) {
                return null;
              }

              const isActive = position === 0;

              return (
                <button
                  key={slide}
                  type="button"
                  onClick={() => setActiveSlide(index)}
                  aria-label={`Buka foto ${index + 1}`}
                  className="
                    absolute
                    h-[200px]
                    w-[82%]
                    overflow-hidden
                    rounded-2xl
                    border-0
                    bg-transparent
                    p-0
                    transition-all
                    duration-700
                    ease-in-out

                    sm:h-[250px]
                    sm:w-[70%]

                    md:h-[300px]
                    md:w-[560px]

                    lg:h-[350px]
                    lg:w-[650px]
                  "
                  style={{
                    transform: `
                      translateX(${position * 72}%)
                      translateZ(${isActive ? 0 : -160}px)
                      rotateY(${position * -12}deg)
                      scale(${isActive ? 1 : 0.86})
                    `,

                    opacity: isActive ? 1 : 0.62,

                    zIndex: isActive ? 20 : 10,

                    boxShadow: isActive
                      ? "0 20px 45px rgba(0, 0, 0, 0.16)"
                      : "0 12px 30px rgba(0, 0, 0, 0.08)",
                  }}
                >
                  <img
                    src={slide}
                    alt=""
                    className="block h-full w-full object-cover"
                  />

                  {!isActive && (
                    <div className="pointer-events-none absolute inset-0 bg-white/10" />
                  )}
                </button>
              );
            })}
          </div>

          {/* DOT NAVIGATION */}
          <div className="mt-1 flex justify-center gap-2">
            {slides.map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setActiveSlide(index)}
                aria-label={`Pilih foto ${index + 1}`}
                className={`
                  h-2.5
                  rounded-full
                  transition-all
                  duration-300

                  ${
                    activeSlide === index
                      ? "w-8 bg-primary"
                      : "w-2.5 bg-primary/25 hover:bg-primary/50"
                  }
                `}
              />
            ))}
          </div>
        </div>

        {/* KARTU PROFIL DUSUN */}
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {dusunCards.map((dusun) => (
            <FeatureCard
              key={dusun.slug}
              icon={Buildings}
              eyebrow="Profil Dusun"
              title={dusun.title}
              description={dusun.description}
              to={`/portal/profil/${dusun.slug}`}
              badge={dusun.badge}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
