<?php

include "konekcija_sa_bazom.php";

$sql = "
CREATE TABLE IF NOT EXISTS ucenici (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ime TEXT,
    odeljenje TEXT,
    pol TEXT,
    brojOcena INTEGER,
    zbirOcena INTEGER,
    prosek REAL,
    uspeh TEXT,
    napomena TEXT,
    slika TEXT
)
";

$baza->exec($sql);

echo "Baza i tabela su uspešno kreirane.<br>";
echo "Putanja baze: " . $putanja;

?>
