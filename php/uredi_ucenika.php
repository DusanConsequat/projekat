<?php

include "konekcija_sa_bazom.php";

$id = $_POST["id"];
$ime = $_POST["ime"];
$odeljenje = $_POST["odeljenje"];
$pol = $_POST["pol"];
$brojOcena = $_POST["brojOcena"];
$zbirOcena = $_POST["zbirOcena"];
$prosek = $_POST["prosek"];
$uspeh = $_POST["uspeh"];
$napomena = $_POST["napomena"];

$staraSlikaUpit = $baza->prepare("SELECT slika FROM ucenici WHERE id = :id");
$staraSlikaUpit->bindValue(":id", $id);
$staraSlikaRez = $staraSlikaUpit->execute();
$staraSlikaRed = $staraSlikaRez->fetchArray(SQLITE3_ASSOC);
$nazivSlike = $staraSlikaRed["slika"];

if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";

    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    $originalniNaziv = $_FILES["slika"]["name"];
    $privremenaPutanja = $_FILES["slika"]["tmp_name"];

    $ekstenzija = pathinfo($originalniNaziv, PATHINFO_EXTENSION);

    $noviNaziv = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;
    $novaPutanja = $folder . $noviNaziv;

    move_uploaded_file($privremenaPutanja, $novaPutanja);
    $nazivSlike = $noviNaziv;
}

$upit = $baza->prepare("
UPDATE ucenici SET
    ime = :ime,
    odeljenje = :odeljenje,
    pol = :pol,
    brojOcena = :brojOcena,
    zbirOcena = :zbirOcena,
    prosek = :prosek,
    uspeh = :uspeh,
    napomena = :napomena,
    slika = :slika
WHERE id = :id
");

$upit->bindValue(":id", $id);
$upit->bindValue(":ime", $ime);
$upit->bindValue(":odeljenje", $odeljenje);
$upit->bindValue(":pol", $pol);
$upit->bindValue(":brojOcena", $brojOcena);
$upit->bindValue(":zbirOcena", $zbirOcena);
$upit->bindValue(":prosek", $prosek);
$upit->bindValue(":uspeh", $uspeh);
$upit->bindValue(":napomena", $napomena);
$upit->bindValue(":slika", $nazivSlike);

$rezultat = $upit->execute();

if ($rezultat) {
    echo "Učenik uspešno izmenjen.";
} else {
    echo "Greška pri izmeni.";
}

?>
