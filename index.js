const FILE_PATH = "./data.json";
const simpleGit = require("simple-git");
const jsonfile = require("jsonfile");
const moment = require("moment");

console.log("Skrip dimulai...");

const git = simpleGit("/data/data/com.termux/files/home/Contri-new");
console.log("Git instance berhasil dibuat.");

const makeCommit = (n) => {
  if (n === 0) {
    console.log("Semua komit telah dibuat. Sekarang mendorong perubahan ke repositori remote...");
    git.push("origin", "master", (err, result) => {
      if (err) {
        console.error("Kesalahan saat mendorong ke remote:", err);
      } else {
        console.log("Perubahan berhasil didorong ke repositori remote:", result);
      }
    });
    return;
  }

  const DATE = moment().format(); // Menggunakan tanggal hari ini
  const data = { date: DATE };
  console.log(`Membuat komit dengan data tanggal: ${DATE}`);

  jsonfile.writeFile(FILE_PATH, data, (writeErr) => {
    if (writeErr) {
      console.error("Kesalahan saat menulis file:", writeErr);
      return;
    }
    console.log(`Berhasil menulis data ke ${FILE_PATH}`);

    git.add([FILE_PATH], (addErr) => {
      if (addErr) {
        console.error("Kesalahan saat menambahkan file ke git:", addErr);
        return;
      }
      console.log(`File ${FILE_PATH} berhasil ditambahkan ke git`);

      git.commit(DATE, { "--date": DATE }, (commitErr, commitResult) => {
        if (commitErr) {
          console.error("Kesalahan saat membuat komit:", commitErr);
          return;
        }
        console.log(`Berhasil membuat komit dengan tanggal: ${DATE}`, commitResult);

        makeCommit(--n);  // Lanjutkan membuat komit hingga n habis
      });
    });
  });
};

makeCommit(1); // Jumlah komit yang ingin dibuat
