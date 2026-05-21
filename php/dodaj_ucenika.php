<?php

include "konekcija_sa_bazom.php";

$ime = $_POST["ime"];
$odeljenje = $_POST["odeljenje"];
$pol = $_POST["pol"];
$brojOcena = $_POST["brojOcena"];
$zbirOcena = $_POST["zbirOcena"];
$prosek = $_POST["prosek"];
$uspeh = $_POST["uspeh"];
$napomena = $_POST["napomena"];

$nazivSlike = "";

if (isset($_FILES["slika"]) && $_FILES["slika"]["error"] == 0) {
    $folder = __DIR__ . "/../uploads/";

    if (!file_exists($folder)) {
        mkdir($folder, 0777, true);
    }

    $originalniNaziv = $_FILES["slika"]["name"];
    $privremenaPutanja = $_FILES["slika"]["tmp_name"];

    $ekstenzija = pathinfo($originalniNaziv, PATHINFO_EXTENSION);

    $nazivSlike = time() . "_" . rand(1000, 9999) . "." . $ekstenzija;

    $novaPutanja = $folder . $nazivSlike;

    move_uploaded_file($privremenaPutanja, $novaPutanja);
}

$upit = $baza->prepare("
INSERT INTO ucenici
(
    ime,
    odeljenje,
    pol,
    brojOcena,
    zbirOcena,
    prosek,
    uspeh,
    napomena,
    slika
)
VALUES
(
    :ime,
    :odeljenje,
    :pol,
    :brojOcena,
    :zbirOcena,
    :prosek,
    :uspeh,
    :napomena,
    :slika
)
");

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
    echo "Učenik uspešno dodat.";
} else {
    echo "Greška pri dodavanju.";
}

?>
