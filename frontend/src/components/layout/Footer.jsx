import { Leaf } from "@phosphor-icons/react";

export default function Footer() {
  return (
    <footer className="border-t border-border bg-white py-10">
      <div
        className="
          mx-auto
          flex
          max-w-6xl
          flex-col
          gap-5
          px-4
          sm:px-6
          md:flex-row
          md:items-center
          md:justify-between
        "
      >
        {/* BRAND */}
        <div className="flex items-center gap-3">
          <span
            className="
              flex
              h-10
              w-10
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-primary
              text-white
            "
          >
            <Leaf size={20} weight="fill" />
          </span>

          <div>
            <p className="font-heading text-lg font-semibold text-primary-dark">
              Portal Digital
            </p>

            <p className="font-heading text-lg font-semibold text-primary-dark">
              Desa Blongkeng
            </p>
          </div>
        </div>

        {/* DESKRIPSI */}
        <p
          className="
            max-w-3xl
            text-sm
            leading-relaxed
            text-muted
            md:text-right
          "
        >
          Portal digital Desa Blongkeng yang saat ini mencakup Dusun Karangasem
          dan Dusun Blongkeng. Dikembangkan melalui program KKN untuk mendukung
          informasi wilayah, UMKM lokal, pemetaan desa, dan pengelolaan bank
          sampah digital.
        </p>
      </div>
    </footer>
  );
}
