<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            // Postgres men-validasi SEMUA baris yang sudah ada begitu constraint
            // di-ADD -- jadi tidak bisa persempit constraint duluan (baris
            // 'tegalwungu' yang masih ada bakal ditolak), juga tidak bisa update
            // data duluan (constraint lama belum izinkan 'blongkeng'). Longgarkan
            // dulu jadi superset (izinkan ketiganya), baru update data, baru
            // persempit ke set final -- lihat replacePgsqlCheckConstraint().
            $this->replacePgsqlCheckConstraint('umkms', 'dusun', ['karangasem', 'tegalwungu', 'blongkeng']);
            $this->replacePgsqlCheckConstraint('profil_dusuns', 'dusun', ['karangasem', 'tegalwungu', 'blongkeng']);
        }

        DB::table('umkms')->where('dusun', 'tegalwungu')->update(['dusun' => 'blongkeng']);
        DB::table('profil_dusuns')->where('dusun', 'tegalwungu')->update(['dusun' => 'blongkeng']);

        if ($driver === 'mysql') {
            // ALTER ... MODIFY hanya valid di MySQL.
            DB::statement("ALTER TABLE umkms MODIFY dusun ENUM('karangasem', 'blongkeng') NOT NULL");
            DB::statement("ALTER TABLE profil_dusuns MODIFY dusun ENUM('karangasem', 'blongkeng') NOT NULL");
        } elseif ($driver === 'pgsql') {
            // Postgres tidak punya tipe ENUM bawaan ala MySQL -- enum() Laravel
            // compile jadi "varchar(255) check (... in (...))", yang valid dipakai
            // inline di CREATE TABLE tapi TIDAK valid di ALTER COLUMN ... TYPE
            // (Postgres nolak keyword "check" muncul di situ -- itu persis
            // "syntax error at or near check" yang muncul kalau pakai ->change()
            // di sini). Constraint harus di-drop lalu ditambah ulang terpisah.
            $this->replacePgsqlCheckConstraint('umkms', 'dusun', ['karangasem', 'blongkeng']);
            $this->replacePgsqlCheckConstraint('profil_dusuns', 'dusun', ['karangasem', 'blongkeng']);
        } else {
            // SQLite (dipakai test suite) menegakkan enum lewat CHECK constraint yang
            // dibuat sekali saat tabel dibuat — masih berisi 'tegalwungu' kalau tidak
            // di-rebuild di sini. ->change() membuat Schema Builder merekonstruksi tabel.
            Schema::table('umkms', function (Blueprint $table) {
                $table->enum('dusun', ['karangasem', 'blongkeng'])->change();
            });
            Schema::table('profil_dusuns', function (Blueprint $table) {
                $table->enum('dusun', ['karangasem', 'blongkeng'])->change();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        $driver = DB::connection()->getDriverName();

        if ($driver === 'pgsql') {
            $this->replacePgsqlCheckConstraint('umkms', 'dusun', ['karangasem', 'tegalwungu', 'blongkeng']);
            $this->replacePgsqlCheckConstraint('profil_dusuns', 'dusun', ['karangasem', 'tegalwungu', 'blongkeng']);
        }

        DB::table('umkms')->where('dusun', 'blongkeng')->update(['dusun' => 'tegalwungu']);
        DB::table('profil_dusuns')->where('dusun', 'blongkeng')->update(['dusun' => 'tegalwungu']);

        if ($driver === 'mysql') {
            DB::statement("ALTER TABLE umkms MODIFY dusun ENUM('karangasem', 'tegalwungu') NOT NULL");
            DB::statement("ALTER TABLE profil_dusuns MODIFY dusun ENUM('karangasem', 'tegalwungu') NOT NULL");
        } elseif ($driver === 'pgsql') {
            $this->replacePgsqlCheckConstraint('umkms', 'dusun', ['karangasem', 'tegalwungu']);
            $this->replacePgsqlCheckConstraint('profil_dusuns', 'dusun', ['karangasem', 'tegalwungu']);
        } else {
            Schema::table('umkms', function (Blueprint $table) {
                $table->enum('dusun', ['karangasem', 'tegalwungu'])->change();
            });
            Schema::table('profil_dusuns', function (Blueprint $table) {
                $table->enum('dusun', ['karangasem', 'tegalwungu'])->change();
            });
        }
    }

    /**
     * Ganti CHECK constraint di kolom Postgres dengan daftar nilai baru.
     * Nama constraint dicari lewat pg_constraint (bukan ditebak dari
     * konvensi penamaan) supaya tidak salah drop constraint lain.
     */
    private function replacePgsqlCheckConstraint(string $table, string $column, array $allowedValues): void
    {
        $constraintName = DB::selectOne(
            "SELECT con.conname
             FROM pg_constraint con
             JOIN pg_class rel ON rel.oid = con.conrelid
             JOIN pg_attribute att ON att.attrelid = rel.oid AND att.attnum = ANY(con.conkey)
             WHERE con.contype = 'c' AND rel.relname = ? AND att.attname = ?",
            [$table, $column]
        )?->conname;

        if ($constraintName) {
            DB::statement("ALTER TABLE {$table} DROP CONSTRAINT \"{$constraintName}\"");
        }

        $values = implode(', ', array_map(fn ($v) => "'{$v}'", $allowedValues));
        DB::statement("ALTER TABLE {$table} ADD CONSTRAINT \"{$table}_{$column}_check\" CHECK ({$column} IN ({$values}))");
    }
};
