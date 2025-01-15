<?php

namespace App\Console\Commands;

use App\Models\Peminjamans;
use App\Models\PeminjamanBarang;
use Illuminate\Console\Command;
use App\Events\NewNotification;

class PerbaruiStatusPeminjaman extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'peminjaman:update-statusD';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Memperbarui status peminjaman barang';

    /**
     * Execute the console command.
     */
    public function handle()
    {
       $peminjamanBarangs = PeminjamanBarang::whereIn('status_peminjaman', ['Disetujui', 'Dipinjam'])->get();

        foreach ($peminjamanBarangs as $peminjamanBarang) {
            // Ambil peminjaman terkait melalui relasi Eloquent
            $peminjaman = $peminjamanBarang->peminjaman;

            if (!$peminjaman) {
                continue;
            }

            if ($peminjamanBarang->status_peminjaman === 'Disetujui') {
                // Cek apakah waktu peminjaman sudah dimulai
                if ($peminjaman->tgl_peminjaman <= now()) {
                    // Ubah status menjadi 'Dipinjam'
                    $namaBarang = $peminjamanBarang->barang->nama_barang; // Asumsikan model Barang memiliki kolom nama_barang
                    $tglPeminjaman = $peminjaman->tgl_peminjaman;
                    $notifikasiMessage = "Anda sedang meminjaman barang: $namaBarang sejak tanggal $tglPeminjaman.";

                    $peminjamanBarang->update([
                        'status_peminjaman' => 'Dipinjam',
                        'notifikasi' => $notifikasiMessage
                    ]);
                    // Kirim notifikasi menggunakan Pusher
                    broadcast(new NewNotification($notifikasiMessage))->toOthers();
                    $this->info("Status peminjaman barang {$peminjamanBarang->id} diperbarui menjadi 'Dipinjam'.");
                }
            } elseif ($peminjamanBarang->status_peminjaman === 'Dipinjam') {
                // Cek apakah waktu pengembalian sudah terlewat
                if ($peminjaman->tgl_pengembalian && $peminjaman->tgl_pengembalian < now()) {
                    // Ubah status menjadi 'Terlambat'
                    $notifikasiMessage = "Peminjaman barang telah melewati batas waktu: Mohon segera mengembalikannya.";

                    $peminjamanBarang->update([
                        'status_peminjaman' => 'Terlambat',
                        'notifikasi' => $notifikasiMessage
                    ]);

                    // Kirim notifikasi menggunakan Pusher
                    broadcast(new NewNotification($notifikasiMessage))->toOthers();
                    $this->info("Status peminjaman barang {$peminjamanBarang->id} diperbarui menjadi 'Terlambat'.");
                }
            }
        }

        $this->info('Pembaruan status peminjaman selesai.');
    }
}
