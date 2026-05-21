var ucenici = [];

var btnDodajUcenika = document.getElementById("btnDodajUcenika");
var btnPrikaziUcenike = document.getElementById("btnPrikaziUcenike");
var btnPrimeni = document.getElementById("btnPrimeni");
var btnSacuvajIzmene = document.getElementById("btnSacuvajIzmene");

var formaSekcija = document.getElementById("formaSekcija");
var uceniciSekcija = document.getElementById("uceniciSekcija");

var ucenikForm = document.getElementById("ucenikForm");
var editForm = document.getElementById("editForm");

var imeInput = document.getElementById("ime");
var odeljenjeInput = document.getElementById("odeljenje");
var brojOcenaInput = document.getElementById("brojOcena");
var zbirOcenaInput = document.getElementById("zbirOcena");
var napomenaInput = document.getElementById("napomena");

var filterUspeh = document.getElementById("filterUspeh");
var sortiranje = document.getElementById("sortiranje");

var uceniciContainer = document.getElementById("uceniciContainer");
var brojUcenika = document.getElementById("brojUcenika");

var modalUredi = new bootstrap.Modal(document.getElementById("modalUredi"));

btnDodajUcenika.addEventListener("click", prikaziFormu);
btnPrikaziUcenike.addEventListener("click", prikaziUcenike);
btnPrimeni.addEventListener("click", prikaziKarticeUcenika);
ucenikForm.addEventListener("submit", dodajUcenika);
btnSacuvajIzmene.addEventListener("click", sacuvajIzmene);

function prikaziFormu() {
  formaSekcija.classList.remove("d-none");
  uceniciSekcija.classList.add("d-none");
}

function dodajUcenika(e) {
  e.preventDefault();

  var ime = imeInput.value.trim();
  var odeljenje = odeljenjeInput.value.trim();
  var brojOcena = parseInt(brojOcenaInput.value);
  var zbirOcena = parseInt(zbirOcenaInput.value);
  var napomena = napomenaInput.value.trim();

  var polRadio = document.querySelector('input[name="pol"]:checked');
  var pol;

  if (polRadio) {
    pol = polRadio.value;
  } else {
    pol = "Nije definisano";
  }

  if (
    ime == "" ||
    odeljenje == "" ||
    isNaN(brojOcena) ||
    isNaN(zbirOcena) ||
    brojOcena <= 0 ||
    zbirOcena <= 0
  ) {
    alert("Unesi ispravne podatke.");
    return;
  }

  var prosek = izracunajProsek(brojOcena, zbirOcena);

  if (prosek < 1 || prosek > 5) {
    alert("Prosek mora biti između 1 i 5. Proveri broj i zbir ocena.");
    return;
  }

  var uspeh = odrediUspeh(prosek);

  var podaci = new FormData(ucenikForm);

  podaci.append("prosek", prosek);
  podaci.append("uspeh", uspeh);

  var zahtev = new XMLHttpRequest();

  zahtev.open("POST", "php/dodaj_ucenika.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);

    ucenikForm.reset();
    document.getElementById("muski").checked = true;

    prikaziUcenike();
  };

  zahtev.send(podaci);
}

function izracunajProsek(brojOcena, zbirOcena) {
  return zbirOcena / brojOcena;
}

function odrediUspeh(prosek) {
  if (prosek >= 4.5) {
    return "Odličan";
  } else if (prosek >= 3.5) {
    return "Vrlo dobar";
  } else if (prosek >= 2.5) {
    return "Dobar";
  } else if (prosek >= 1.5) {
    return "Dovoljan";
  } else {
    return "Nedovoljan";
  }
}

function prikaziUcenike() {
  formaSekcija.classList.add("d-none");
  uceniciSekcija.classList.remove("d-none");

  var zahtev = new XMLHttpRequest();

  zahtev.open("GET", "php/prikazi_ucenike.php", true);

  zahtev.onload = function () {
    ucenici = JSON.parse(zahtev.responseText);

    prikaziKarticeUcenika();
  };

  zahtev.send();
}

function prikaziKarticeUcenika() {
  uceniciContainer.innerHTML = "";

  var listaZaPrikaz = [];

  for (var i = 0; i < ucenici.length; i++) {
    listaZaPrikaz.push(ucenici[i]);
  }

  var uspehFilter = filterUspeh.value;

  if (uspehFilter != "Sve") {
    var filtrirani = [];

    for (var i = 0; i < listaZaPrikaz.length; i++) {
      if (listaZaPrikaz[i].uspeh == uspehFilter) {
        filtrirani.push(listaZaPrikaz[i]);
      }
    }

    listaZaPrikaz = filtrirani;
  }

  var nacinSortiranja = sortiranje.value;

  if (nacinSortiranja == "min-max") {
    listaZaPrikaz.sort(function (a, b) {
      return a.prosek - b.prosek;
    });
  }

  if (nacinSortiranja == "max-min") {
    listaZaPrikaz.sort(function (a, b) {
      return b.prosek - a.prosek;
    });
  }

  brojUcenika.textContent = listaZaPrikaz.length + " učenika";

  if (listaZaPrikaz.length == 0) {
    uceniciContainer.innerHTML =
      '<div class="col-12">' +
      '<div class="empty-box p-5 text-center">' +
      '<h4 class="mb-2">Nema učenika za prikaz</h4>' +
      '<p class="text-muted mb-0">Dodaj učenika ili promeni filter.</p>' +
      "</div>" +
      "</div>";

    return;
  }

  for (var i = 0; i < listaZaPrikaz.length; i++) {
    var ucenik = listaZaPrikaz[i];

    var linija = "";
    var badge = "";

    if (ucenik.uspeh == "Odličan") {
      linija = "line-odlican";
      badge = "text-bg-success";
    } else if (ucenik.uspeh == "Vrlo dobar") {
      linija = "line-vrlodobar";
      badge = "text-bg-primary";
    } else if (ucenik.uspeh == "Dobar") {
      linija = "line-dobar";
      badge = "text-bg-info";
    } else if (ucenik.uspeh == "Dovoljan") {
      linija = "line-dovoljan";
      badge = "text-bg-warning";
    } else {
      linija = "line-nedovoljan";
      badge = "text-bg-danger";
    }

    var napomenaTekst = "Nema napomene.";

    if (ucenik.napomena != "" && ucenik.napomena != null) {
      napomenaTekst = ucenik.napomena;
    }

    var slikaHTML = "";

    if (ucenik.slika != "" && ucenik.slika != null) {
      slikaHTML =
        '<img src="uploads/' +
        ucenik.slika +
        '" class="card-img-top slika-ucenika">';
    }

    var kartica = document.createElement("div");
    kartica.className = "col-12 col-md-6 col-xl-4";
    kartica.innerHTML =
      '<div class="card ucenik-card">' +
      slikaHTML +
      '<div class="card-top-line ' +
      linija +
      '"></div>' +
      '<div class="card-body p-4">' +
      '<h4 class="card-title mb-3">' +
      ucenik.ime +
      "</h4>" +
      '<div class="info-line"><strong>Razred i odeljenje:</strong> ' +
      ucenik.odeljenje +
      "</div>" +
      '<div class="info-line"><strong>Pol:</strong> ' +
      ucenik.pol +
      "</div>" +
      '<div class="info-line"><strong>Broj ocena:</strong> ' +
      ucenik.brojOcena +
      "</div>" +
      '<div class="info-line"><strong>Zbir ocena:</strong> ' +
      ucenik.zbirOcena +
      "</div>" +
      '<div class="info-line"><strong>Prosek:</strong> ' +
      parseFloat(ucenik.prosek).toFixed(2) +
      "</div>" +
      '<div class="info-line"><strong>Uspeh:</strong> <span class="badge ' +
      badge +
      '">' +
      ucenik.uspeh +
      "</span></div>" +
      '<div class="mt-3"><strong>Napomena:</strong><p class="text-muted mb-0">' +
      napomenaTekst +
      "</p></div>" +
      '<div class="d-flex gap-2 mt-3">' +
      '<button class="btn btn-sm btn-outline-primary btn-uredi">Uredi</button>' +
      '<button class="btn btn-sm btn-outline-danger btn-obrisi">Obriši</button>' +
      "</div>" +
      "</div>" +
      "</div>";

    var btnUredi = kartica.querySelector(".btn-uredi");
    var btnObrisi = kartica.querySelector(".btn-obrisi");

    (function (u) {
      btnUredi.addEventListener("click", function () {
        otvoriUrediModal(u);
      });
      btnObrisi.addEventListener("click", function () {
        obrisiUcenika(u.id, u.ime);
      });
    })(ucenik);

    uceniciContainer.appendChild(kartica);
  }
}

function otvoriUrediModal(ucenik) {
  document.getElementById("editId").value = ucenik.id;
  document.getElementById("editIme").value = ucenik.ime;
  document.getElementById("editOdeljenje").value = ucenik.odeljenje;
  document.getElementById("editBrojOcena").value = ucenik.brojOcena;
  document.getElementById("editZbirOcena").value = ucenik.zbirOcena;
  document.getElementById("editNapomena").value = ucenik.napomena || "";
  document.getElementById("editSlika").value = "";

  var polRadios = editForm.querySelectorAll('input[name="pol"]');
  for (var i = 0; i < polRadios.length; i++) {
    polRadios[i].checked = polRadios[i].value === ucenik.pol;
  }

  modalUredi.show();
}

function sacuvajIzmene() {
  var ime = document.getElementById("editIme").value.trim();
  var odeljenje = document.getElementById("editOdeljenje").value.trim();
  var brojOcena = parseInt(document.getElementById("editBrojOcena").value);
  var zbirOcena = parseInt(document.getElementById("editZbirOcena").value);

  if (
    ime == "" ||
    odeljenje == "" ||
    isNaN(brojOcena) ||
    isNaN(zbirOcena) ||
    brojOcena <= 0 ||
    zbirOcena <= 0
  ) {
    alert("Unesi ispravne podatke.");
    return;
  }

  var prosek = izracunajProsek(brojOcena, zbirOcena);

  if (prosek < 1 || prosek > 5) {
    alert("Prosek mora biti između 1 i 5. Proveri broj i zbir ocena.");
    return;
  }

  var uspeh = odrediUspeh(prosek);

  var podaci = new FormData(editForm);
  podaci.append("prosek", prosek);
  podaci.append("uspeh", uspeh);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/uredi_ucenika.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);
    modalUredi.hide();
    prikaziUcenike();
  };

  zahtev.send(podaci);
}

function obrisiUcenika(id, ime) {
  if (!confirm("Da li sigurno želiš da obrišeš učenika \"" + ime + "\"?")) {
    return;
  }

  var podaci = new FormData();
  podaci.append("id", id);

  var zahtev = new XMLHttpRequest();
  zahtev.open("POST", "php/obrisi_ucenika.php", true);

  zahtev.onload = function () {
    alert(zahtev.responseText);
    prikaziUcenike();
  };

  zahtev.send(podaci);
}
