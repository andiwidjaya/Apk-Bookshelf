const listBuku = [];
const EVENT_RENDER = "buku-render";
const EVENT_SAVED = "buku-saved";
const KEY_BOOK = "APP_BOOK";

function bukuId() {
  return +new Date();
}

function bukuGenerateObjek(id, title, author, year, isComplete) {
  return {
    id,
    title,
    author,
    year,
    isComplete,
  };
}

function tambahBuku() {
  const judulBuku = document.getElementById("inputBookTitle").value;
  const penulisBuku = document.getElementById("inputBookAuthor").value;
  const tahunBuku = document.getElementById("inputBookYear").value;
  const chekBuku = document.getElementById("inputBookIsComplete").checked;

  const generateBuku = bukuId();
  const objekBuku = bukuGenerateObjek(
    generateBuku,
    judulBuku,
    penulisBuku,
    tahunBuku,
    chekBuku
  );
  listBuku.push(objekBuku);

  document.dispatchEvent(new Event(EVENT_RENDER));
  simpanBuku();
}

function cariBuku(bukuId) {
  for (const itemBuku of listBuku) {
    if (itemBuku.id === bukuId) {
      return itemBuku;
    }
  }
  return null;
}

function cariIndexBuku(bukuId) {
  for (const index in listBuku) {
    if (listBuku[index].id === bukuId) {
      return index;
    }
  }
  return -1;
}

function bukuShelf(objekBuku) {
  const judul = document.createElement("h3");
  judul.innerText = objekBuku.title;

  const penulis = document.createElement("p");
  penulis.innerText = "Penulis: " + objekBuku.author;

  const tahun = document.createElement("p");
  tahun.innerText = "Tahun: " + objekBuku.year;

  const isiContainer = document.createElement("article");
  isiContainer.classList.add("book_item");

  const tombolBuku = document.createElement("div");
  tombolBuku.classList.add("green", "red", "action");

  isiContainer.append(judul, penulis, tahun);
  isiContainer.append(tombolBuku);
  isiContainer.setAttribute("id", `listBuku-${objekBuku.id}`);

  if (objekBuku.isComplete) {
    const tombolTidakSelesai = document.createElement("button");
    tombolTidakSelesai.classList.add("green");
    tombolTidakSelesai.innerText = "Belum Selesai dibaca";

    tombolTidakSelesai.addEventListener("click", function () {
      bookshelfBelumSelesai(objekBuku.id);
    });

    const tombolHapus = document.createElement("button");
    tombolHapus.classList.add("red");
    tombolHapus.innerText = "Hapus buku";

    tombolHapus.addEventListener("click", function () {
      bookShelfdihapus(objekBuku.id);
    });

    tombolBuku.append(tombolTidakSelesai, tombolHapus);
  } else {
    const tombolSelesai = document.createElement("button");
    tombolSelesai.classList.add("green");
    tombolSelesai.innerText = "Selesai dibaca";

    tombolSelesai.addEventListener("click", function () {
      bookshelfSelesai(objekBuku.id);
    });

    const tombolHapus = document.createElement("button");
    tombolHapus.classList.add("red");
    tombolHapus.innerText = "Hapus buku";

    tombolHapus.addEventListener("click", function () {
      bookShelfdihapus(objekBuku.id);
    });

    tombolBuku.append(tombolSelesai, tombolHapus);
  }
  return isiContainer;
}

function bookshelfSelesai(bukuId) {
  const targetBuku = cariBuku(bukuId);

  if (targetBuku == null) return;

  targetBuku.isComplete = true;
  document.dispatchEvent(new Event(EVENT_RENDER));
  simpanBuku();
}

function bookShelfdihapus(bukuId) {
  const targetBuku = cariIndexBuku(bukuId);

  if (targetBuku === -1) return;

  listBuku.splice(targetBuku, 1);
  document.dispatchEvent(new Event(EVENT_RENDER));
  simpanBuku();
}

function bookshelfBelumSelesai(bukuId) {
  const targetBuku = cariBuku(bukuId);

  if (targetBuku == null) return;

  targetBuku.isComplete = false;
  document.dispatchEvent(new Event(EVENT_RENDER));
  simpanBuku();
}

function simpanBuku() {
  if (isStorage()) {
    const parsed = JSON.stringify(listBuku);
    localStorage.setItem(KEY_BOOK, parsed);
    document.dispatchEvent(new Event(EVENT_SAVED));
  }
}

function isStorage() {
  if (typeof Storage === "undefined") {
    alert("Browser kamu tidak mendukung local storage");
    return false;
  }
  return true;
}

function loadDataStorage() {
  const dataStorage = localStorage.getItem(KEY_BOOK);
  let data = JSON.parse(dataStorage);

  if (data !== null) {
    for (const i of data) {
      listBuku.push(i);
    }
  }

  document.dispatchEvent(new Event(EVENT_RENDER));
}

document.addEventListener("DOMContentLoaded", function () {
  const formSubmit = document.getElementById("inputBook");

  formSubmit.addEventListener("submit", function (event) {
    event.preventDefault();
    tambahBuku();
  });

  if (isStorage()) {
    loadDataStorage();
  }
});

document.addEventListener(EVENT_RENDER, function () {
  const bookshelfBelumSelesai = document.getElementById(
    "incompleteBookshelfList"
  );
  bookshelfBelumSelesai.innerHTML = "";

  const bookshelfSelesai = document.getElementById("completeBookshelfList");

  bookshelfSelesai.innerHTML = "";

  for (itemBuku of listBuku) {
    const daftarBuku = bukuShelf(itemBuku);

    if (!itemBuku.isComplete) {
      bookshelfBelumSelesai.append(daftarBuku);
    } else {
      bookshelfSelesai.append(daftarBuku);
    }
  }
});
