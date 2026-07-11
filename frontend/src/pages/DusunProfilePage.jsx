import { Link, useParams } from "react-router-dom";
import { Buildings, MapPin, ArrowLeft } from "@phosphor-icons/react";

import PortalLayout from "../components/layout/PortalLayout.jsx";
import { useProfilDusun } from "../hooks/useProfilDusun.js";
import ProfilContent from "../components/profil/ProfilContent.jsx";

const DUSUN_LABEL = {
  karangasem: "Dusun Karangasem",
  tegalwungu: "Dusun Blongkeng",
};

export default function DusunProfilePage() {
  const { dusun } = useParams();

  const isValid = dusun in DUSUN_LABEL;

  const { data, isLoading } = useProfilDusun(isValid ? dusun : undefined);

  // =========================================
  // JIKA DUSUN TIDAK DITEMUKAN
  // =========================================

  if (!isValid) {
    return (
      <PortalLayout
        crumbs={[
          {
            label: "Profil Dusun",
          },
        ]}
      >
        <div className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6">
          <span
            className="
              mx-auto
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-primary/10
              text-primary
            "
          >
            <Buildings size={30} weight="duotone" />
          </span>

          <h1
            className="
              mt-5
              font-heading
              text-3xl
              font-semibold
              text-primary-dark
            "
          >
            Dusun tidak ditemukan
          </h1>

          <p className="mt-3 text-bark/75">
            Profil hanya tersedia untuk Dusun Karangasem dan Dusun Blongkeng.
          </p>

          <Link
            to="/"
            className="
              mt-7
              inline-flex
              items-center
              gap-2
              font-semibold
              text-primary
              transition-colors
              hover:text-primary-dark
            "
          >
            <ArrowLeft size={18} />
            Kembali ke Portal
          </Link>
        </div>
      </PortalLayout>
    );
  }

  // =========================================
  // HALAMAN PROFIL
  // =========================================

  return (
    <PortalLayout
      crumbs={[
        {
          label: "Profil Dusun",
          to: "/#profil-dusun",
        },
        {
          label: DUSUN_LABEL[dusun],
        },
      ]}
    >
      <section className="relative overflow-hidden">
        <div
          className="
            mx-auto
            max-w-6xl
            px-4
            pb-16
            pt-10
            sm:px-6
            sm:pt-14
          "
        >
          {/* HEADER PROFIL */}

          <div className="max-w-3xl">
            <span
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-moss
                px-4
                py-1.5
                text-sm
                font-medium
                text-primary-dark
              "
            >
              <Buildings size={18} weight="bold" />
              Profil Dusun
            </span>

            {/* NAMA DUSUN */}

            <h1
              className="
                mt-5
                font-heading
                text-4xl
                font-semibold
                leading-tight
                text-primary-dark
                sm:text-5xl
              "
            >
              {DUSUN_LABEL[dusun]}
            </h1>

            {/* LOKASI */}

            <p
              className="
                mt-3
                flex
                items-center
                gap-2
                text-sm
                text-muted
                sm:text-base
              "
            >
              <MapPin size={18} weight="duotone" />
              Desa Blongkeng, Kecamatan Ngluwar, Kabupaten Magelang
            </p>
          </div>

          {/* =====================================
              KONTEN PROFIL
          ====================================== */}

          <div
            className="
              mt-10
              rounded-3xl
              border
              border-border
              bg-white
              p-6
              shadow-sm
              sm:p-8
              lg:p-10
            "
          >
            {/* LOADING */}

            {isLoading ? (
              <div className="space-y-4">
                <div
                  className="
                    h-6
                    w-48
                    animate-pulse
                    rounded-lg
                    bg-primary/10
                  "
                />

                <div
                  className="
                    h-4
                    w-full
                    animate-pulse
                    rounded
                    bg-primary/5
                  "
                />

                <div
                  className="
                    h-4
                    w-4/5
                    animate-pulse
                    rounded
                    bg-primary/5
                  "
                />
              </div>
            ) : data?.konten ? (
              // DATA DARI API

              <ProfilContent konten={data.konten} />
            ) : (
              // JIKA DATA BELUM TERSEDIA

              <div className="py-10 text-center">
                <span
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    bg-primary/10
                    text-primary
                  "
                >
                  <Buildings size={26} weight="duotone" />
                </span>

                <h2
                  className="
                    mt-4
                    font-heading
                    text-2xl
                    font-semibold
                    text-primary-dark
                  "
                >
                  Profil Sedang Disusun
                </h2>

                <p
                  className="
                    mx-auto
                    mt-3
                    max-w-xl
                    leading-relaxed
                    text-bark/80
                  "
                >
                  Profil {DUSUN_LABEL[dusun]} sedang disusun oleh tim KKN
                  bersama perangkat desa.
                </p>

                <p
                  className="
                    mx-auto
                    mt-2
                    max-w-xl
                    text-sm
                    leading-relaxed
                    text-muted
                  "
                >
                  Informasi mengenai sejarah, kondisi geografis, demografi,
                  fasilitas umum, dan potensi wilayah akan ditampilkan setelah
                  proses pengumpulan data selesai.
                </p>
              </div>
            )}
          </div>

          {/* TOMBOL KEMBALI */}

          <div className="mt-8">
            <Link
              to="/#profil-dusun"
              className="
                inline-flex
                items-center
                gap-2
                font-semibold
                text-primary
                transition-colors
                hover:text-primary-dark
              "
            >
              <ArrowLeft size={18} />
              Kembali ke daftar dusun
            </Link>
          </div>
        </div>
      </section>
    </PortalLayout>
  );
}
