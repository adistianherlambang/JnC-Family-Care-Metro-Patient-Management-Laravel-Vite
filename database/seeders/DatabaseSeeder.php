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

        User::firstOrCreate([
            'email' => 'bidan@meikahealth.id'
        ], [
            'name' => 'dr. Fitri Handayani, Sp.A',
            'password' => bcrypt('bidan123'),
        ]);

        User::firstOrCreate([
            'email' => 'aulia@meikahealth.id'
        ], [
            'name' => 'dr. Aulia Rahma, Sp.OG',
            'password' => bcrypt('dokter123'),
        ]);

        User::firstOrCreate([
            'email' => 'siti@meikahealth.id'
        ], [
            'name' => 'Bidan Siti Rahmawati, S.Tr.Keb',
            'password' => bcrypt('bidan123'),
        ]);

        // 2. Categories & Services (Resmi sesuai AGENTS.md Rule 3)
        $categoriesData = [
            [
                'title' => 'Poli',
                'services' => [
                    'Prenatal Class Yoga',
                    'Aquatic Yoga',
                    'Kelas Melahirkan',
                    'KB',
                    'Pemeriksaan dan Konsultasi Catin (Persiapan Hamil, Melahirkan, Menyusui)',
                    'Pemeriksaan Nifas',
                    'Pemeriksaan Kehamilan',
                    'IVA',
                    'Papsmear',
                    'Washing V'
                ]
            ],
            [
                'title' => "Mom's Treatment",
                'services' => [
                    'Special Pregnant Treatment',
                    'Treatment Laktasi',
                    'Treatment Babaran',
                    'Totok Wajah',
                    'Body Massage',
                    'Ratus V',
                    'Steambath',
                    'Lulur',
                    'Scrub',
                    'Creambath',
                    'Footbath'
                ]
            ],
            [
                'title' => 'Persalinan',
                'services' => [
                    'Pelayanan Persalinan',
                    'IMD (Inisiasi Menyusu Dini)',
                    'Pendampingan Persalinan',
                    'DCC (Delayed Cord Clamping)'
                ]
            ],
            [
                'title' => 'Pelayanan Bayi dan Anak',
                'services' => [
                    'Baby Infant dan Kids Massage',
                    'Massage Common Cold',
                    'Massage Diare',
                    'Massage Konstipasi',
                    'Massage Kolik',
                    'Massage Kembung',
                    'SHK (Skrining Hipotiroid Kongenital)',
                    'Konsultasi Tumbuh Kembang',
                    'MTBS/MTBM',
                    'Cukur Bayi',
                    'Jemur Bayi',
                    'Imunisasi',
                    'Baby Spa',
                    'Baby Spa with Parents',
                    'Potong Kuku',
                    'Manicure',
                    'Pedicure',
                    'Mandi Bayi',
                    'Cek Golongan Darah',
                    'Hygiene Lidah, Telinga, dan Hidung',
                    'Tindik Manual',
                    'Tindik dr Evoo'
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
                'services' => ['Konsultasi Tumbuh Kembang', 'Imunisasi', 'MTBS/MTBM', 'SHK (Skrining Hipotiroid Kongenital)', 'Baby Infant dan Kids Massage']
            ],
            [
                'doctor' => 'dr. Aulia Rahma, Sp.OG',
                'role' => 'Spesialis Kandungan & Kebidanan',
                'image' => '/img/landingPage/dummyDr.png',
                'start_day' => 'Senin',
                'end_day' => 'Sabtu',
                'start_time' => '09:00',
                'end_time' => '15:00',
                'services' => ['Pemeriksaan Kehamilan', 'Pemeriksaan Nifas', 'IVA', 'Papsmear', 'KB', 'Pemeriksaan dan Konsultasi Catin (Persiapan Hamil, Melahirkan, Menyusui)', 'Pelayanan Persalinan']
            ],
            [
                'doctor' => 'Bidan Siti Rahmawati, S.Tr.Keb',
                'role' => 'Bidan Senior & Treatment Specialist',
                'image' => '/img/landingPage/dummyDr.png',
                'start_day' => 'Selasa',
                'end_day' => 'Minggu',
                'start_time' => '08:00',
                'end_time' => '16:00',
                'services' => ['Treatment Laktasi', 'Special Pregnant Treatment', 'Treatment Babaran', 'Baby Spa', 'IMD (Inisiasi Menyusu Dini)', 'Pendampingan Persalinan', 'Prenatal Class Yoga', 'Mandi Bayi']
            ]
        ];

        foreach ($doctorsData as $doc) {
            Practitioner::firstOrCreate(['doctor' => $doc['doctor']], $doc);
        }

        // 4. Sample Queues
        $todayStr = date('Y-m-d');
        $tomorrowStr = date('Y-m-d', strtotime('+1 day'));
        $pastStr = date('Y-m-d', strtotime('-2 days'));

        $appointments = [
            [
                'queue_number' => 'A-014',
                'patient_name' => 'Siti Nurhaliza',
                'doctor_name' => 'dr. Fitri Handayani, Sp.A',
                'service_name' => 'Konsultasi Tumbuh Kembang',
                'date' => $todayStr,
                'time' => '09:30 WIB',
                'status' => 'Menunggu Antrean'
            ],
            [
                'queue_number' => 'A-015',
                'patient_name' => 'Budi Santoso',
                'doctor_name' => 'dr. Aulia Rahma, Sp.OG',
                'service_name' => 'Pemeriksaan Kehamilan',
                'date' => $todayStr,
                'time' => '10:00 WIB',
                'status' => 'Sedang Dilayani'
            ],
            [
                'queue_number' => 'A-012',
                'patient_name' => 'Dewi Lestari',
                'doctor_name' => 'Bidan Siti Rahmawati, S.Tr.Keb',
                'service_name' => 'Treatment Laktasi',
                'date' => $pastStr,
                'time' => '08:30 WIB',
                'status' => 'Selesai'
            ],
            [
                'queue_number' => 'A-016',
                'patient_name' => 'Rina Anggraini',
                'doctor_name' => 'Bidan Siti Rahmawati, S.Tr.Keb',
                'service_name' => 'Baby Spa',
                'date' => $tomorrowStr,
                'time' => '11:00 WIB',
                'status' => 'Menunggu Antrean'
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
