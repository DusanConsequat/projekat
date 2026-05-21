<?php

include "konekcija_sa_bazom.php";

$rezultat = $baza->query("
SELECT *
FROM ucenici
ORDER BY id DESC
");

$ucenici = array();

while ($red = $rezultat->fetchArray(SQLITE3_ASSOC)) {
    $ucenici[] = $red;
}

echo json_encode($ucenici, JSON_UNESCAPED_UNICODE);

?>
