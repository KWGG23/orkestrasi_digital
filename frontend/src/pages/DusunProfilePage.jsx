import { Link, useParams } from 'react-router-dom'
import { Buildings, MapPin } from '@phosphor-icons/react'
import PortalLayout from '../components/layout/PortalLayout.jsx'
import { useProfilDusun } from '../hooks/useProfilDusun.js'
import ProfilContent from '../components/profil/ProfilContent.jsx'

const DUSUN_LABEL = {
  karangasem: 'Dusun Karangasem',
  tegalwungu: 'Dusun Tegalwungu',
}

export default function DusunProfilePage() {
  const { dusun } = useParams()
  const isValid = dusun in DUSUN_LABEL
  const { data, isLoading } = useProfilDusun(isValid ? dusun : undefined)

  if (!isValid) {
    return (
      <PortalLayout crumbs={[{ label: 'Profil Dusun' }]}>
        <div className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
          <h1 className="font-heading text-2xl font-semibold text-primary-dark">
            Dusun tidak ditemukan
          </h1>
          <p className="mt-2 text-bark/75">
            Profil hanya tersedia untuk Dusun Karangasem dan Dusun Tegalwungu.
          </p>
          <Link to="/" className="mt-6 inline-block font-semibold text-primary hover:text-primary-dark">
            Kembali ke Portal
          </Link>
        </div>
      </PortalLayout>
    )
  }

  return (
    <PortalLayout crumbs={[{ label: 'Profil Dusun', to: '/#profil-dusun' }, { label: DUSUN_LABEL[dusun] }]}>
      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <span className="inline-flex items-center gap-2 rounded-full bg-moss px-4 py-1.5 text-sm font-medium text-primary-dark">
          <Buildings size={18} weight="bold" />
          Profil Dusun
        </span>
        <h1 className="mt-4 font-heading text-3xl font-semibold text-primary-dark sm:text-4xl">
          {DUSUN_LABEL[dusun]}
        </h1>
        <p className="mt-2 flex items-center gap-1.5 text-sm text-muted">
          <MapPin size={16} />
          Kelurahan Muntilan, Kecamatan Muntilan, Kabupaten Magelang
        </p>

        <div className="mt-8 rounded-3xl border border-border bg-white p-6 sm:p-8">
          {isLoading ? (
            <p className="text-sm text-muted">Memuat profil…</p>
          ) : data?.konten ? (
            <ProfilContent konten={data.konten} />
          ) : (
            <div className="text-center">
              <p className="text-bark/80">
                Profil {DUSUN_LABEL[dusun]} sedang disusun oleh tim KKN bersama perangkat desa.
              </p>
              <p className="mt-2 text-sm text-muted">
                Data demografi, sejarah, dan potensi wilayah akan tampil di sini setelah survei
                lapangan selesai.
              </p>
            </div>
          )}
        </div>
      </div>
    </PortalLayout>
  )
}
