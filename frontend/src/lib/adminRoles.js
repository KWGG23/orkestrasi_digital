export const ROLE_BANK_SAMPAH = 'admin_bank_sampah'
export const ROLE_DESA = 'admin_desa'

// Halaman pertama yang dilihat admin sesudah login, sesuai role -- dipakai
// AdminLoginPage (redirect sesudah login) dan RequireAuth (redirect kalau
// role tidak cocok dengan grup route yang diakses).
export function adminHomePath(role) {
  return role === ROLE_DESA ? '/admin/umkm' : '/admin'
}
