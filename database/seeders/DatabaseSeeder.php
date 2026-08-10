<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\ServiceCategory;
use App\Models\Service;
use App\Models\Practitioner;
use App\Models\Appointment;
use App\Models\News;
use App\Models\Faq;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // 1. Users
        User::firstOrCreate([
            'email' => 'admin@meikahealth.id'
        ], [
            'name' => 'Administrator Klinik',
            'password' => bcrypt('admin123'),
        ]);

        // 2. Categories & Services
        $categoriesData = [
            [
                'title' => 'Poli',
                'services' => [
                    'Pemeriksaan dan konsultasi pranikah',
                    'Konsultasi persiapan kehamilan',
                    'Pemeriksaan kehamilan',
                    'Prenatal yoga',
                    'Aquatic yoga',
                    'Kelas persiapan persalinan',
                    'Pelayanan keluarga berencana',
                    'Konsultasi menyusui dan laktasi',
                    'Pemeriksaan masa nifas',
                    'Pemeriksaan IVA',
                    'Pemeriksaan Pap Smear',
                    'Vaginal washing'
                ]
            ],
            [
                'title' => "Mom's Treatment",
                'services' => [
                    'Perawatan ibu hamil',
                    'Perawatan laktasi',
                    'Perawatan pasca melahirkan',
                    'Totok Wajah',
                    'Body massage',
                    'Ratus vagina',
                    'Steambath',
                    'Lulur badan',
                    'Body scrub',
                    'Creambath',
                    'Footbath'
                ]
            ],
            [
                'title' => 'Persalinan',
                'services' => [
                    'Pelayanan persalinan normal',
                    'Inisiasi Menyusu Dini',
                    'Pendampingan persalinan',
                    'Delayed Cord Clamping'
                ]
            ],
            [
                'title' => 'Pelayanan Bayi dan Anak',
                'services' => [
                    'Pijat bayi, infant, dan anak',
                    'Pijat untuk common cold',
                    'Pijat untuk diare',
                    'Pijat untuk konstipasi',
                    'Pijat untuk kolik',
                    'Pijat untuk perut kembung',
                    'Skrining Hipotiroid Kongenital',
                    'Konsultasi tumbuh kembang anak',
                    'Manajemen Terpadu Balita Sakit',
                    'Cukur rambut bayi',
                    'Terapi jemur bayi',
                    'Imunisasi',
                    'Baby spa',
                    'Baby spa bersama orang tua',
                    'Potong kuku bayi',
                    'Manicure dan pedicure anak',
                    'Mandi bayi',
                    'Pemeriksaan golongan darah',
                    'Perawatan kebersihan lidah, telinga, dan hidung',
                    'Tindik manual',
                    'Tindik menggunakan Dr. Evoo'
                ]
            ]
        ];

        foreach ($categoriesData as $catData) {
            $cat = ServiceCategory::firstOrCreate(['title' => $catData['title']]);
            foreach ($catData['services'] as $svcName) {
                Service::firstOrCreate([
                    'category_id' => $cat->id,
                    'name' => $svcName
                ]);
            }
        }

        // 3. Practitioners (Doctors & Midwives)
        $doctorsData = [
            [
                'doctor' => 'dr. Fitri Handayani, Sp.A',
                'role' => 'Spesialis Anak & Tumbuh Kembang',
                'image' => '/img/landingPage/dummyDr.png',
                'start_day' => 'Senin',
                'end_day' => 'Jumat',
                'start_time' => '08:00',
                'end_time' => '14:00',
                'services' => ['Pemeriksaan Anak', 'Imunisasi', 'Konsultasi Tumbuh Kembang']
            ],
            [
                'doctor' => 'dr. Aulia Rahma, Sp.OG',
                'role' => 'Spesialis Kandungan & Kebidanan',
                'image' => '/img/landingPage/dummyDr.png',
                'start_day' => 'Senin',
                'end_day' => 'Sabtu',
                'start_time' => '09:00',
                'end_time' => '15:00',
                'services' => ['Pemeriksaan Kehamilan', 'Konsultasi Pranikah', 'Pemeriksaan IVA']
            ],
            [
                'doctor' => 'Bidan Siti Rahmawati, S.Tr.Keb',
                'role' => 'Bidan Senior & Laktasi',
                'image' => '/img/landingPage/dummyDr.png',
                'start_day' => 'Selasa',
                'end_day' => 'Minggu',
                'start_time' => '08:00',
                'end_time' => '16:00',
                'services' => ['Konsultasi Laktasi', 'Perawatan Pasca Melahirkan', 'Baby Spa']
            ]
        ];

        foreach ($doctorsData as $doc) {
            Practitioner::firstOrCreate(['doctor' => $doc['doctor']], $doc);
        }

        // 4. Sample Queues
        $appointments = [
            [
                'queue_number' => 'A-014',
                'patient_name' => 'Siti Nurhaliza',
                'doctor_name' => 'dr. Fitri Handayani, Sp.A',
                'service_name' => 'Konsultasi tumbuh kembang anak',
                'date' => 'Hari Ini',
                'time' => '09:30 WIB',
                'status' => 'Menunggu Antrean'
            ],
            [
                'queue_number' => 'A-015',
                'patient_name' => 'Budi Santoso',
                'doctor_name' => 'dr. Aulia Rahma, Sp.OG',
                'service_name' => 'Pemeriksaan Kehamilan',
                'date' => 'Hari Ini',
                'time' => '10:00 WIB',
                'status' => 'Dipanggil'
            ]
        ];

        foreach ($appointments as $app) {
            Appointment::firstOrCreate(['queue_number' => $app['queue_number']], $app);
        }

        // 5. News
        $newsItems = [
            [
                'title' => 'Pentingnya Imunisasi Dasar Lengkap untuk Tumbuh Kembang Optimal Balita',
                'category' => 'Kesehatan Anak',
                'summary' => 'Imunisasi melindungi anak dari berbagai penyakit infeksi berbahaya. Simak jadwal imunisasi terbaru rekomendasi IDAI di klinik kami.',
                'date' => '08 Agustus 2026'
            ],
            [
                'title' => 'Tips Mempersiapkan Persalinan Nyaman dan Minim Rasa Sakit',
                'category' => 'Kehamilan & Persalinan',
                'summary' => 'Metode melahirkan dengan pernapasan relaksasi dan pendampingan doula terbukti membantu kelancaran proses persalinan.',
                'date' => '05 Agustus 2026'
            ],
            [
                'title' => 'Manfaat Pijat Bayi (Infant Massage) Terhadap Kualitas Tidur dan Pencernaan',
                'category' => 'Mom & Baby Care',
                'summary' => 'Pijat bayi secara rutin membantu mengatasi perut kembung, kolik, dan merangsang nafsu makan si kecil.',
                'date' => '01 Agustus 2026'
            ]
        ];

        foreach ($newsItems as $n) {
            News::firstOrCreate(['title' => $n['title']], $n);
        }

        // 6. FAQs
        $faqs = [
            [
                'question' => 'Bagaimana cara melakukan pendaftaran antrean online?',
                'answer' => 'Anda cukup memilih menu Registrasi Online, memilih kategori layanan, menentukan jadwal dokter, dan konfirmasi. Nomor antrean digital akan langsung terbit.'
            ],
            [
                'question' => 'Apakah BPJS Kesehatan berlaku untuk semua jenis pelayanan?',
                'answer' => 'BPJS Kesehatan berlaku untuk pelayanan persalinan dan pemeriksaan medis kebidanan sesuai dengan ketentuan fasilitas kesehatan rujukan.'
            ],
            [
                'question' => 'Bagaimana jika saya terlambat datang sesuai estimasi jam pelayanan?',
                'answer' => 'Nomor antrean Anda akan dipanggil kembali setelah 2 nomor antrean berikutnya diproses oleh petugas pendaftaran/klinik.'
            ]
        ];

        foreach ($faqs as $f) {
            Faq::firstOrCreate(['question' => $f['question']], $f);
        }
    }
}
