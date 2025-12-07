const contacts = [
  {
    "Name": "Anna Bergmann",
    "Kürzel": "AB",
    "Mailadresse": "anna.bergmann@beispiel.de"
  },
  {
    "Name": "Bernd Schmidt",
    "Kürzel": "BS",
    "Mailadresse": "bernd.schmidt@beispiel.de"
  },
  {
    "Name": "Clara Müller",
    "Kürzel": "CM",
    "Mailadresse": "clara.mueller@beispiel.de"
  },
  {
    "Name": "David Wagner",
    "Kürzel": "DW",
    "Mailadresse": "david.wagner@beispiel.de"
  },
  {
    "Name": "Elena Koch",
    "Kürzel": "EK",
    "Mailadresse": "elena.koch@beispiel.de"
  },
  {
    "Name": "Frank Fischer",
    "Kürzel": "FF",
    "Mailadresse": "frank.fischer@beispiel.de"
  },
  {
    "Name": "Gisela Hoffmann",
    "Kürzel": "GH",
    "Mailadresse": "gisela.hoffmann@beispiel.de"
  },
  {
    "Name": "Hans Keller",
    "Kürzel": "HK",
    "Mailadresse": "hans.keller@beispiel.de"
  },
  {
    "Name": "Ina Richter",
    "Kürzel": "IR",
    "Mailadresse": "ina.richter@beispiel.de"
  },
  {
    "Name": "Jens Bauer",
    "Kürzel": "JB",
    "Mailadresse": "jens.bauer@beispiel.de"
  }
]


function sortiereArrayNachNamen(personenArray) {
  // Die .sort()-Methode wird auf dem Array aufgerufen.
  // Sie modifiziert das Original-Array und gibt es zurück.
  return personenArray.sort((a, b) => {
    const nameA = a.Name.toLowerCase();
    const nameB = b.Name.toLowerCase();

    // 2. Die Vergleichslogik:
    if (nameA < nameB) {
      return -1; // a kommt vor b
    }
    if (nameA > nameB) {
      return 1;  // a kommt nach b
    }
    return 0;    // a und b sind gleich (Sortierung bleibt unverändert)
  });
}