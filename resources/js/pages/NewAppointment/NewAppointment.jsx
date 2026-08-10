import { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./NewAppointment.module.css";
import { InputText, InputSelect, InputRadio, InputPassword, InputDate, InputImage } from "../../components/Input";
import layanan from "../../json/Layanan.json";
import dummyDokter from "../../json/DummyDokter.json";

const step = [
  "Data Pasien",
  "Layanan",
  "Jadwal Dokter",
  "Pembayaran",
  "Konfirmasi Pendaftaran"
];

export default function NewAppointment() {
  const [page, setPage] = useState(1);

  const [formData, setFormData] = useState({
    // Step 3: Data Pasien
    punyaNoRM: "",
    noRM: "",
    nama: "",
    jenisKelamin: "",
    tanggalLahir: "",
    telepon: "",
    email: "",
    kelurahan: "",
    kecamatan: "",
    kota: "",
    provinsi: "",
    alamat: "",
    tandaPengenal: "",

    // Step 4: Layanan
    kategoriLayanan: "",
    layanan: "",
    keluhan: "",

    // Step 5: Jadwal Dokter
    tanggalLayanan: "",
    dokter: "",

    // Step 6: Pembayaran
    metodePembayaran: "",
    noBpjs: "",
    fotoBPJS: "",

    // Step 7: Buat Akun Baru
    username: "",
    password: "",
    confirmPassword: ""
  });

  const [errors, setErrors] = useState({});

  const updateFormData = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Validation routines per step
  const validateStep3 = () => {
    const errs = {};
    if (!formData.punyaNoRM) errs.punyaNoRM = "Pilih apakah Anda memiliki nomor rekam medis";
    if (formData.punyaNoRM === "Ya" && !formData.noRM?.trim()) {
      errs.noRM = "Nomor rekam medis wajib diisi";
    }
    if (!formData.nama?.trim()) errs.nama = "Nama wajib diisi";
    if (!formData.jenisKelamin) errs.jenisKelamin = "Jenis kelamin wajib dipilih";
    if (!formData.tanggalLahir || formData.tanggalLahir.length < 10) errs.tanggalLahir = "Tanggal lahir wajib diisi (DD/MM/YYYY)";
    if (!formData.telepon?.trim()) errs.telepon = "Nomor telepon wajib diisi";
    if (!formData.email?.trim()) errs.email = "Email wajib diisi";
    if (!formData.kelurahan?.trim()) errs.kelurahan = "Kelurahan wajib diisi";
    if (!formData.kecamatan?.trim()) errs.kecamatan = "Kecamatan wajib diisi";
    if (!formData.kota?.trim()) errs.kota = "Kota wajib diisi";
    if (!formData.provinsi?.trim()) errs.provinsi = "Provinsi wajib diisi";
    if (!formData.alamat?.trim()) errs.alamat = "Alamat wajib diisi";
    if (!formData.tandaPengenal) errs.tandaPengenal = "Tanda pengenal wajib diunggah";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep4 = () => {
    const errs = {};
    if (!formData.kategoriLayanan) errs.kategoriLayanan = "Kategori layanan wajib dipilih";
    if (!formData.layanan) errs.layanan = "Layanan wajib dipilih";
    if (!formData.keluhan?.trim()) errs.keluhan = "Keluhan wajib diisi";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep5 = () => {
    const errs = {};
    if (!formData.tanggalLayanan) errs.tanggalLayanan = "Tanggal layanan wajib dipilih";
    if (!formData.dokter) errs.dokter = "Dokter wajib dipilih";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep6 = () => {
    const errs = {};
    if (!formData.metodePembayaran) errs.metodePembayaran = "Metode pembayaran wajib dipilih";
    if (formData.metodePembayaran === "BPJS") {
      if (!formData.noBpjs?.trim()) errs.noBpjs = "Nomor kartu BPJS wajib diisi";
      if (!formData.fotoBPJS) errs.fotoBPJS = "Foto kartu BPJS wajib diunggah";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep7 = () => {
    const errs = {};
    if (!formData.username?.trim()) errs.username = "Username wajib diisi";
    if (!formData.password) errs.password = "Password wajib diisi";
    if (!formData.confirmPassword) {
      errs.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.password !== formData.confirmPassword) {
      errs.confirmPassword = "Password tidak cocok";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  return (
    <div className={styles.container}>
      <Navbar />
      {page === 1 ? (
        <First setPage={setPage} />
      ) : page === 2 ? (
        <Second setPage={setPage} />
      ) : page === 3 ? (
        <Third
          page={page}
          setPage={setPage}
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          onNext={() => {
            if (validateStep3()) setPage(4);
          }}
        />
      ) : page === 4 ? (
        <Fourth
          page={page}
          setPage={setPage}
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          onNext={() => {
            if (validateStep4()) setPage(5);
          }}
        />
      ) : page === 5 ? (
        <Fifth
          page={page}
          setPage={setPage}
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          onNext={() => {
            if (validateStep5()) setPage(6);
          }}
        />
      ) : page === 6 ? (
        <Sixth
          page={page}
          setPage={setPage}
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          onNext={() => {
            if (validateStep6()) setPage(7);
          }}
        />
      ) : page === 7 ? (
        <Seventh
          page={page}
          setPage={setPage}
          formData={formData}
          updateFormData={updateFormData}
          errors={errors}
          onNext={() => {
            if (validateStep7()) setPage(8);
          }}
        />
      ) : page === 8 ? (
        <Eighth
          page={page}
          setPage={setPage}
          formData={formData}
          updateFormData={updateFormData}
        />
      ) : null}
    </div>
  );
}

function Navbar() {
  return (
    <div className={styles.nav}>
      <div className={styles.logo}>
        <img src="/logo.png" alt="Logo" />
      </div>
    </div>
  );
}

function First({ setPage }) {
  const routerNavigate = useNavigate();

  const handleLoginClick = () => {
    routerNavigate("/login");
  };

  return (
    <div className={styles.pageContainer}>
      <div className={styles.header}>
        <p className={styles.title}>Mulai permintaan appointment anda disini.</p>
        <p>Ini adalah cara termudah untuk menghubungi kami.</p>
      </div>
      <div className={styles.itemWrapper}>
        <div className={styles.item} onClick={() => setPage(2)}>
          <div className={styles.itemIn}>
            <a>Pasien Baru</a>
            <p>Berikan informasi Anda dan tentukan waktu untuk tindak lanjut.</p>
          </div>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.397 6V7.414L1.415 13.414L0 12L5.293 6.707L0 1.414L1.414 0L7.397 6Z" fill="#D896ED" />
          </svg>
        </div>
        <div className={styles.item} onClick={handleLoginClick}>
          <div className={styles.itemIn}>
            <a>Pasien Lama</a>
            <p>Silahkan masuk ke akun anda untuk melanjutkan.</p>
          </div>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M7.397 6V7.414L1.415 13.414L0 12L5.293 6.707L0 1.414L1.414 0L7.397 6Z" fill="#D896ED" />
          </svg>
        </div>
      </div>
    </div>
  );
}

function Second({ setPage }) {
  return (
    <div className={styles.secondContainer}>
      <p className={styles.back} onClick={() => setPage(1)}>
        <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M-2.66552e-05 7.41406L-2.65316e-05 6.00006L5.98197 6.18651e-05L7.39697 1.41406L2.10397 6.70706L7.39697 12.0001L5.98297 13.4141L-2.66552e-05 7.41406Z" fill="#D896ED" />
        </svg>
        Kembali
      </p>
      <div className={styles.header}>
        <p className={styles.title}>Mari kita mulai</p>
        <p className={styles.desc}>Kami akan mengajukan beberapa pertanyaan singkat mengenai kebutuhan kesehatan Anda. Jawaban Anda akan membantu kami menentukan layanan dan tenaga kesehatan yang paling sesuai untuk kebutuhan Anda dan keluarga.</p>
      </div>
      <div className={styles.button} onClick={() => setPage(3)}>Lanjutkan</div>
      <div className={styles.itemWrapper}>
        <p>Catatan:</p>
        <ul>
          <li>Jika Anda mengalami kondisi yang membutuhkan penanganan medis segera, segera kunjungi fasilitas kesehatan terdekat atau layanan gawat darurat.</li>
          <li>Untuk kebutuhan persalinan, pemeriksaan kehamilan, kesehatan ibu dan anak, serta layanan kebidanan, Anda dapat melanjutkan proses pendaftaran untuk menemukan layanan dan jadwal yang tersedia.</li>
        </ul>
      </div>
    </div>
  );
}

function Third({ page, setPage, formData, updateFormData, errors = {}, onNext }) {
  return (
    <div className={styles.thirdContainer}>
      <div className={styles.stepperWrapper}>
        {step.map((item, index) => (
          <div className={styles.stepper} key={index} style={{ opacity: index === 0 ? 1 : 0.3 }}>
            <div className={styles.stepIndicator}>
              <div className={styles.stepCircle} style={{ backgroundColor: index === 0 ? "white" : "" }}></div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={styles.stepText}>
              <p>{item}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.rightWrapper}>
        <p className={styles.back} onClick={() => setPage(2)}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2.66552e-05 7.41406L-2.65316e-05 6.00006L5.98197 6.18651e-05L7.39697 1.41406L2.10397 6.70706L7.39697 12.0001L5.98297 13.4141L-2.66552e-05 7.41406Z" fill="#D896ED" />
          </svg>
          Kembali
        </p>
        <div className={styles.header}>
          <p className={styles.title}>Informasi Identitas dan Kontak Pasien</p>
          <p className={styles.desc}>Lengkapi data diri pasien, mulai dari nama lengkap, jenis kelamin, tanggal lahir, nomor kontak, hingga alamat tempat tinggal untuk keperluan pendaftaran dan informasi terkait kunjungan.</p>
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <InputRadio
              label="Apakah Anda sudah memiliki Nomor Rekam Medis?"
              options={["Ya", "Tidak"]}
              value={formData.punyaNoRM}
              onChange={(val) => {
                updateFormData("punyaNoRM", val);
                if (val === "Tidak") {
                  updateFormData("noRM", "");
                }
              }}
              error={errors.punyaNoRM}
            />
            {formData.punyaNoRM === "Ya" && (
              <InputText
                label="Nomor Rekam Medis"
                value={formData.noRM}
                onChange={(e) => updateFormData("noRM", e.target.value)}
                placeholder="Masukkan nomor rekam medis Anda"
                error={errors.noRM}
              />
            )}
            <InputText
              label="Nama"
              value={formData.nama}
              onChange={(e) => updateFormData("nama", e.target.value)}
              placeholder="Masukkan nama lengkap"
              error={errors.nama}
            />
            <div className={styles.input}>
              <InputSelect
                label="Jenis Kelamin"
                options={["Laki-laki", "Perempuan"]}
                value={formData.jenisKelamin}
                onChange={(val) => updateFormData("jenisKelamin", val)}
                placeholder="Pilih Jenis Kelamin"
                error={errors.jenisKelamin}
              />
              <InputDate
                label="Tanggal Lahir"
                value={formData.tanggalLahir}
                onChange={(e, val) => updateFormData("tanggalLahir", val)}
                placeholder="DD/MM/YYYY"
                error={errors.tanggalLahir}
              />
            </div>
          </div>
          <p className={styles.title}>Bagaimana kami dapat menghubungi Anda?</p>
          <div className={styles.inputWrapper}>
            <InputText
              label="Nomor Telepon"
              value={formData.telepon}
              onChange={(e) => updateFormData("telepon", e.target.value)}
              placeholder="Masukkan nomor telepon"
              error={errors.telepon}
            />
            <InputText
              label="Email"
              value={formData.email}
              onChange={(e) => updateFormData("email", e.target.value)}
              placeholder="Masukkan email"
              error={errors.email}
            />
          </div>
          <p className={styles.title}>Di mana alamat pasien?</p>
          <div className={styles.inputWrapper}>
            <div className={styles.input}>
              <InputText
                label="Kelurahan"
                value={formData.kelurahan}
                onChange={(e) => updateFormData("kelurahan", e.target.value)}
                placeholder="Masukkan kelurahan"
                error={errors.kelurahan}
              />
              <InputText
                label="Kecamatan"
                value={formData.kecamatan}
                onChange={(e) => updateFormData("kecamatan", e.target.value)}
                placeholder="Masukkan kecamatan"
                error={errors.kecamatan}
              />
            </div>
            <div className={styles.input}>
              <InputText
                label="Kota"
                value={formData.kota}
                onChange={(e) => updateFormData("kota", e.target.value)}
                placeholder="Masukkan kota"
                error={errors.kota}
              />
              <InputText
                label="Provinsi"
                value={formData.provinsi}
                onChange={(e) => updateFormData("provinsi", e.target.value)}
                placeholder="Masukkan provinsi"
                error={errors.provinsi}
              />
            </div>
            <InputText
              label="Alamat"
              value={formData.alamat}
              onChange={(e) => updateFormData("alamat", e.target.value)}
              placeholder="Masukkan alamat"
              error={errors.alamat}
            />
          </div>
          <p className={styles.title}>Tanda pengenal pasien</p>
          <div className={styles.inputWrapper}>
            <InputImage
              label="Tanda pengenal pasien"
              value={formData.tandaPengenal}
              onChange={(file, previewUrl) => updateFormData("tandaPengenal", previewUrl || file)}
              placeholder="Masukkan tanda pengenal"
              error={errors.tandaPengenal}
            />
          </div>
        </div>
        <div className={styles.button} onClick={onNext}>Next</div>
      </div>
    </div>
  );
}

function Fourth({ page, setPage, formData, updateFormData, errors = {}, onNext }) {
  const selectCategoryObj = layanan.find((item) => item.title === formData.kategoriLayanan);
  const listLayanan = selectCategoryObj?.list || [];

  return (
    <div className={styles.thirdContainer}>
      <div className={styles.stepperWrapper}>
        {step.map((item, index) => (
          <div className={styles.stepper} key={index} style={{ opacity: index <= 1 ? 1 : 0.3 }}>
            <div className={styles.stepIndicator}>
              <div className={styles.stepCircle} style={{ backgroundColor: index <= 1 ? "white" : "" }}></div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={styles.stepText}>
              <p>{item}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.rightWrapper}>
        <p className={styles.back} onClick={() => setPage(3)}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2.66552e-05 7.41406L-2.65316e-05 6.00006L5.98197 6.18651e-05L7.39697 1.41406L2.10397 6.70706L7.39697 12.0001L5.98297 13.4141L-2.66552e-05 7.41406Z" fill="#D896ED" />
          </svg>
          Kembali
        </p>
        <div className={styles.header}>
          <p className={styles.title}>Layanan apa yang Anda butuhkan?</p>
          <p className={styles.desc}>Pilih layanan yang ingin Anda dapatkan.</p>
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <InputRadio
              label="Kategori Layanan"
              options={layanan.map((item) => item.title)}
              value={formData.kategoriLayanan}
              onChange={(val) => {
                updateFormData("kategoriLayanan", val);
                updateFormData("layanan", "");
              }}
              error={errors.kategoriLayanan}
            />
            <InputSelect
              label="Layanan"
              options={listLayanan}
              value={formData.layanan}
              onChange={(val) => updateFormData("layanan", val)}
              placeholder="Pilih Layanan"
              error={errors.layanan}
            />
          </div>
          <p className={styles.title}>Ceritakan keluhan atau kebutuhan pasien</p>
          <div className={styles.inputWrapper}>
            <InputText
              label="Keluhan atau kebutuhan pasien"
              value={formData.keluhan}
              onChange={(e) => updateFormData("keluhan", e.target.value)}
              placeholder="Ceritakan keluhan atau kebutuhan pasien"
              error={errors.keluhan}
            />
          </div>
        </div>
        <div className={styles.button} onClick={onNext}>Next</div>
      </div>
    </div>
  );
}

function Fifth({ page, setPage, formData, updateFormData, errors = {}, onNext }) {
  const getDayName = (dateVal) => {
    const daysMap = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"];
    const now = new Date();

    if (dateVal === "Hari Ini" || !dateVal) {
      return daysMap[now.getDay()];
    }
    if (dateVal === "Besok") {
      const tomorrow = new Date(now);
      tomorrow.setDate(now.getDate() + 1);
      return daysMap[tomorrow.getDay()];
    }
    if (dateVal && dateVal.length === 10) {
      const parts = dateVal.split("/");
      if (parts.length === 3) {
        const day = parseInt(parts[0], 10);
        const month = parseInt(parts[1], 10) - 1;
        const year = parseInt(parts[2], 10);
        const d = new Date(year, month, day);
        if (!isNaN(d.getTime())) {
          return daysMap[d.getDay()];
        }
      }
    }
    return null;
  };

  const currentDayName = getDayName(formData.tanggalLayanan);

  // Filter doctors matching selected service AND input date day of week
  const getFilteredDoctors = () => {
    return dummyDokter.filter((doc) => {
      return doc.schedules.some((sched) => {
        const matchService = !formData.layanan || sched.services.includes(formData.layanan);
        const matchDay = !currentDayName || sched.days.includes(currentDayName);
        return matchService && matchDay;
      });
    });
  };

  const availableDoctors = getFilteredDoctors();
  const doctorOptions = availableDoctors.map((doc) => doc.doctor);

  return (
    <div className={styles.thirdContainer}>
      <div className={styles.stepperWrapper}>
        {step.map((item, index) => (
          <div className={styles.stepper} key={index} style={{ opacity: index <= 2 ? 1 : 0.3 }}>
            <div className={styles.stepIndicator}>
              <div className={styles.stepCircle} style={{ backgroundColor: index <= 2 ? "white" : "" }}></div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={styles.stepText}>
              <p>{item}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.rightWrapper}>
        <p className={styles.back} onClick={() => setPage(4)}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2.66552e-05 7.41406L-2.65316e-05 6.00006L5.98197 6.18651e-05L7.39697 1.41406L2.10397 6.70706L7.39697 12.0001L5.98297 13.4141L-2.66552e-05 7.41406Z" fill="#D896ED" />
          </svg>
          Kembali
        </p>
        <div className={styles.header}>
          <p className={styles.title}>Cari Dokter</p>
          <p className={styles.desc}>Pilih dokter sesuai ketersediaan jadwal</p>
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <InputSelect
              label="Kapan Anda ingin mendapatkan layanan?"
              options={["Hari Ini", "Besok"]}
              value={formData.tanggalLayanan}
              onChange={(val) => {
                updateFormData("tanggalLayanan", val);
                updateFormData("dokter", "");
              }}
              placeholder="Pilih Tanggal Layanan"
              error={errors.tanggalLayanan}
            />
          </div>
          <p className={styles.title}>Pilih Dokter</p>
          <div className={styles.inputWrapper}>
            <InputSelect
              label="Dokter"
              options={doctorOptions}
              value={formData.dokter}
              onChange={(val) => updateFormData("dokter", val)}
              placeholder="Pilih Dokter"
              error={errors.dokter}
            />
          </div>
        </div>
        <div className={styles.button} onClick={onNext}>Next</div>
      </div>
    </div>
  );
}

function Sixth({ page, setPage, formData, updateFormData, errors = {}, onNext }) {
  return (
    <div className={styles.thirdContainer}>
      <div className={styles.stepperWrapper}>
        {step.map((item, index) => (
          <div className={styles.stepper} key={index} style={{ opacity: index <= 3 ? 1 : 0.3 }}>
            <div className={styles.stepIndicator}>
              <div className={styles.stepCircle} style={{ backgroundColor: index <= 3 ? "white" : "" }}></div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={styles.stepText}>
              <p>{item}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.rightWrapper}>
        <p className={styles.back} onClick={() => setPage(5)}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2.66552e-05 7.41406L-2.65316e-05 6.00006L5.98197 6.18651e-05L7.39697 1.41406L2.10397 6.70706L7.39697 12.0001L5.98297 13.4141L-2.66552e-05 7.41406Z" fill="#D896ED" />
          </svg>
          Kembali
        </p>
        <div className={styles.header}>
          <p className={styles.title}>Pembayaran</p>
          <p className={styles.desc}>Bagaimana Anda akan membayar layanan ini?</p>
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <InputRadio
              label="Metode Pembayaran"
              options={["Mandiri", "BPJS"]}
              value={formData.metodePembayaran}
              onChange={(val) => updateFormData("metodePembayaran", val)}
              error={errors.metodePembayaran}
            />
          </div>
          {formData.metodePembayaran === "BPJS" && (
            <div className={styles.inputWrapper}>
              <InputText
                label="No. Kartu BPJS"
                value={formData.noBpjs}
                onChange={(e) => updateFormData("noBpjs", e.target.value)}
                placeholder="Masukkan No. Kartu BPJS"
                error={errors.noBpjs}
              />
              <InputImage
                label="Foto BPJS"
                value={formData.fotoBPJS}
                onChange={(file, previewUrl) => updateFormData("fotoBPJS", previewUrl || file)}
                placeholder="Masukkan foto BPJS"
                error={errors.fotoBPJS}
              />
            </div>
          )}
          {formData.metodePembayaran === "BPJS" ? (
            <p>BPJS Kesehatan hanya dapat digunakan untuk layanan persalinan sesuai dengan ketentuan yang berlaku.</p>
          ) : formData.metodePembayaran === "Mandiri" ? (
            <p>Saya akan membayar biaya pelayanan secara mandiri.</p>
          ) : null}
        </div>
        <div className={styles.button} onClick={onNext}>Next</div>
      </div>
    </div>
  );
}

function Seventh({ page, setPage, formData, updateFormData, errors = {}, onNext }) {
  return (
    <div className={styles.thirdContainer}>
      <div className={styles.stepperWrapper}>
        {step.map((item, index) => (
          <div className={styles.stepper} key={index} style={{ opacity: index <= 4 ? 1 : 0.3 }}>
            <div className={styles.stepIndicator}>
              <div className={styles.stepCircle} style={{ backgroundColor: index <= 4 ? "white" : "" }}></div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={styles.stepText}>
              <p>{item}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.rightWrapper}>
        <p className={styles.back} onClick={() => setPage(6)}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2.66552e-05 7.41406L-2.65316e-05 6.00006L5.98197 6.18651e-05L7.39697 1.41406L2.10397 6.70706L7.39697 12.0001L5.98297 13.4141L-2.66552e-05 7.41406Z" fill="#D896ED" />
          </svg>
          Kembali
        </p>
        <div className={styles.header}>
          <p className={styles.title}>Buat Akun Baru</p>
          <p className={styles.desc}>Daftarkan diri Anda untuk melanjutkan proses pendaftaran dan mendapatkan layanan kesehatan.</p>
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <InputText
              label="Username"
              value={formData.username}
              onChange={(e) => updateFormData("username", e.target.value)}
              placeholder="Masukkan username baru anda"
              error={errors.username}
            />
            <InputPassword
              label="Password"
              value={formData.password}
              onChange={(e) => updateFormData("password", e.target.value)}
              placeholder="Masukkan password baru anda"
              error={errors.password}
            />
            <InputPassword
              label="Konfirmasi Password"
              value={formData.confirmPassword}
              onChange={(e) => updateFormData("confirmPassword", e.target.value)}
              placeholder="Masukkan kembali password baru anda"
              error={errors.confirmPassword}
            />
          </div>
        </div>
        <div className={styles.button} onClick={onNext}>Next</div>
      </div>
    </div>
  );
}

function Eighth({ page, setPage, formData, updateFormData }) {
  const navigate = useNavigate();

  const handleFinishRegistration = () => {
    localStorage.setItem("registeredUser", JSON.stringify(formData));
    navigate("/login", { state: { username: formData.username, password: formData.password } });
  };

  return (
    <div className={styles.thirdContainer}>
      <div className={styles.stepperWrapper}>
        {step.map((item, index) => (
          <div className={styles.stepper} key={index} style={{ opacity: index <= 4 ? 1 : 0.3 }}>
            <div className={styles.stepIndicator}>
              <div className={styles.stepCircle} style={{ backgroundColor: index <= 4 ? "white" : "" }}></div>
              <div className={styles.stepLine}></div>
            </div>
            <div className={styles.stepText}>
              <p>{item}</p>
            </div>
          </div>
        ))}
      </div>
      <div className={styles.rightWrapper}>
        <p className={styles.back} onClick={() => setPage(7)}>
          <svg width="8" height="14" viewBox="0 0 8 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M-2.66552e-05 7.41406L-2.65316e-05 6.00006L5.98197 6.18651e-05L7.39697 1.41406L2.10397 6.70706L7.39697 12.0001L5.98297 13.4141L-2.66552e-05 7.41406Z" fill="#D896ED" />
          </svg>
          Kembali
        </p>
        <div className={styles.header}>
          <p className={styles.title}>Konfirmasi Pendaftaran</p>
          <p className={styles.desc}>Silahkan periksa kembali data anda sebelum melakukan pendaftaran</p>
        </div>
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            {formData.punyaNoRM === "Ya" && formData.noRM && (
              <div className={styles.confirm}>
                <p className={styles.label}>Nomor Rekam Medis</p>
                <p className={styles.value}>{formData.noRM}</p>
              </div>
            )}
            <div className={styles.confirm}>
              <p className={styles.label}>Nama</p>
              <p className={styles.value}>{formData.nama}</p>
            </div>
            <div className={styles.input}>
              <div className={styles.confirm}>
                <p className={styles.label}>Jenis Kelamin</p>
                <p className={styles.value}>{formData.jenisKelamin}</p>
              </div>
              <div className={styles.confirm}>
                <p className={styles.label}>Tanggal Lahir</p>
                <p className={styles.value}>{formData.tanggalLahir}</p>
              </div>
            </div>
            <div className={styles.confirm}>
              <p className={styles.label}>Telepon</p>
              <p className={styles.value}>{formData.telepon}</p>
            </div>
            <div className={styles.confirm}>
              <p className={styles.label}>Email</p>
              <p className={styles.value}>{formData.email}</p>
            </div>
            <div className={styles.input}>
              <div className={styles.confirm}>
                <p className={styles.label}>Kelurahan</p>
                <p className={styles.value}>{formData.kelurahan}</p>
              </div>
              <div className={styles.confirm}>
                <p className={styles.label}>Kecamatan</p>
                <p className={styles.value}>{formData.kecamatan}</p>
              </div>
              <div className={styles.confirm}>
                <p className={styles.label}>Kota</p>
                <p className={styles.value}>{formData.kota}</p>
              </div>
              <div className={styles.confirm}>
                <p className={styles.label}>Provinsi</p>
                <p className={styles.value}>{formData.provinsi}</p>
              </div>
            </div>
            <div className={styles.confirm}>
              <p className={styles.label}>Alamat Lengkap</p>
              <p className={styles.value}>{formData.alamat}</p>
            </div>
            {formData.tandaPengenal && (
              <div className={styles.confirm}>
                <p className={styles.label}>Tanda Pengenal</p>
                <img src={typeof formData.tandaPengenal === "string" ? formData.tandaPengenal : URL.createObjectURL(formData.tandaPengenal)} alt="tanda-pengenal" />
              </div>
            )}
            <div className={styles.confirm}>
              <p className={styles.label}>Metode Pembayaran</p>
              <p className={styles.value}>{formData.metodePembayaran}</p>
            </div>
            {formData.metodePembayaran === "BPJS" && (
              <div className={styles.confirm}>
                <p className={styles.label}>No. Kartu BPJS</p>
                <p className={styles.value}>{formData.noBpjs}</p>
              </div>
            )}
            {formData.metodePembayaran === "BPJS" && formData.fotoBPJS && (
              <div className={styles.confirm}>
                <p className={styles.label}>Foto BPJS</p>
                <img src={typeof formData.fotoBPJS === "string" ? formData.fotoBPJS : URL.createObjectURL(formData.fotoBPJS)} alt="foto-bpjs" />
              </div>
            )}
            <div className={styles.confirm}>
              <p className={styles.label}>Username</p>
              <p className={styles.value}>{formData.username}</p>
            </div>
          </div>
        </div>
        <div className={styles.button} onClick={handleFinishRegistration}>Masuk ke dashboard</div>
      </div>
    </div>
  );
}