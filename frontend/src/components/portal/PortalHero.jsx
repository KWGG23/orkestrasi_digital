import { Buildings, Storefront, Recycle } from "@phosphor-icons/react";

import { useLiveStats } from "../../hooks/useLiveStats.js";
import OrganicBlob from "../decorative/OrganicBlob.jsx";

export default function PortalHero() {
  const { data } = useLiveStats();

  const stats = [
    {
      icon: Recycle,
      label: "Nasabah bank sampah",
      value: data?.nasabah,
    },
    {
      icon: Storefront,
      label: "UMKM terdata",
      value: data?.umkm,
    },
    {
      icon: Buildings,
      label: "Dusun tercakup",
      value: 2,
    },
  ];

  return (
    <section className="relative overflow-hidden pb-8 pt-12 sm:pt-14">
      {/* DEKORASI BACKGROUND */}
      <OrganicBlob
        tone="primary"
        className="
          pointer-events-none
          absolute
          -left-20
          -top-16
          h-80
          w-80
          opacity-20
        "
      />

      {/* CONTAINER UTAMA */}
      <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
        {/* SAPAAN */}
        <p
          className="
            text-sm
            font-semibold
            uppercase
            tracking-[0.18em]
            text-primary
          "
        >
          Selamat Datang di
        </p>

        {/* JUDUL UTAMA */}
        <h1
          className="
            mt-2
            max-w-3xl
            font-heading
            text-4xl
            font-semibold
            leading-tight
            text-primary-dark
            sm:text-5xl
          "
        >
          Portal Digital Desa Blongkeng
        </h1>

        {/* DESKRIPSI */}
        <p
          className="
            mt-4
            max-w-2xl
            text-base
            leading-relaxed
            text-bark/80
            sm:text-lg
          "
        >
          Satu pintu masuk untuk profil dusun, katalog UMKM, peta wilayah, dan
          pencatatan bank sampah — dirawat bersama warga, pengurus, dan tim KKN.
        </p>

        {/* STATISTIK */}
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {stats.map(({ icon: Icon, label, value }) => (
            <div
              key={label}
              className="
                group
                min-h-[165px]
                rounded-2xl
                border
                border-border
                bg-white
                px-6
                py-5
                transition-all
                duration-300
                hover:-translate-y-1
                hover:shadow-md
              "
            >
              {/* ICON */}
              <span
                className="
                  flex
                  h-11
                  w-11
                  items-center
                  justify-center
                  rounded-xl
                  bg-primary/10
                  text-primary
                  transition-transform
                  duration-300
                  group-hover:scale-110
                "
              >
                <Icon size={22} weight="duotone" />
              </span>

              {/* NILAI STATISTIK */}
              <p
                className="
                  mt-4
                  font-heading
                  text-3xl
                  font-semibold
                  leading-none
                  text-primary-dark
                "
              >
                {typeof value === "number" ? value : "—"}
              </p>

              {/* LABEL STATISTIK */}
              <p className="mt-2 text-sm text-muted">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
