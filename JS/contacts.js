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
    "Name": "Bernd Schlauer",
    "Kürzel": "BS",
    "Mailadresse": "bernd.schlauer@beispiel.de"
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

window.addEventListener("load", () => {
  nameList();
});

const contactList = document.getElementById("contacList");
const contactDetails = document.getElementById("contactSelectet");
const contactSidebarCss = document.querySelector('.sideBar');
const contactDetailsCss = document.querySelector('.contacts');

function nameList() {
    contacts.sort((a, b) => a.Name.localeCompare(b.Name, "de"));
    
    let currentLetter = "";

    contacts.forEach(contact => {
        const letter = contact.Name[0].toUpperCase();
        if (letter !== currentLetter) {
            currentLetter = letter;
            contactList.innerHTML += letterSection(letter);
        }
        contactList.innerHTML += contactEntry(contact.Name, contact["Kürzel"], contact["Mailadresse"]
);
    });
}

contactList.addEventListener("click", (event) => {
    const entry = event.target.closest(".contactEntry");
    if (!entry) return;

    const mail = entry.dataset.mail;
    const contact = contacts.find(c => c.Mailadresse === mail);

    contactDetails.innerHTML = showContactDetails(contact);

    Detailsvisible();
});


function sideBarvisible() {
    contactSidebarCss.classList.remove('hidden');
    contactDetailsCss.classList.remove('visible');

}

function Detailsvisible() {
    const screenWidth = window.innerWidth;
    console.log('Neue Fensterbreite:', screenWidth);
    if (screenWidth <= 1100) {
        contactSidebarCss.classList.add('hidden');
        contactDetailsCss.classList.add('visible');
    }
    return
}


function letterSection(letter) {
    return `<div class="sectionList">${letter}</div><hr>`
}

function contactEntry(Name, Kürzel, Mailadresse) {
    return `<div class="contactEntry"  data-mail="${Mailadresse}">
                <div class="contactlistIcon">
                    ${Kürzel}
                </div>
                <div class="contactDitails">
                    <div class="name">${Name}</div>
                    <div class="mail">${Mailadresse}</div>
                </div>
            </div>`
}

function showContactDetails(contact) {
    return `<div class="selectedIconName">
                <div class="selectetIcon">
                    ${contact.Kürzel}
                </div>
                <div class="selectedName">
                    ${contact.Name}
                    <div class="selectedNameButtons">
                        <button><img src="./assets/img/contacts/edit.svg" alt="edit">Edit</button>
                        <button><img src="./assets/img/contacts/delete.svg" alt="delite">Delete</button>
                    </div>
                </div>    
            </div>
            <div class="contactInfos">
                Contact Information
            </div>
            <table>
                <tr>
                    <th>Email</th>
                </tr>
                <tr>
                    <td class="mail">${contact.Mailadresse}</td>
                </tr>
                <tr>
                    <th>Phone</th>
                </tr>
                <tr>
                    <td>+49 1234 567890</td>
                </tr>
            </table>`
}


function sideBarVisable() {
    
}

const mobileEditeBar = document.getElementById('mobileEditeBar');
const mobileMenuTrigger = document.getElementById('mobileMenuTrigger'); 


mobileMenuTrigger.addEventListener('click', (e) => {
    e.stopPropagation(); 
    mobileEditeBar.classList.toggle('visible');
});


document.addEventListener('click', (e) => {
    const isClickInsideMenu = mobileEditeBar.contains(e.target);
    const isClickOnTrigger = mobileMenuTrigger.contains(e.target);

    
    if (!isClickInsideMenu && !isClickOnTrigger) {
        mobileEditeBar.classList.remove('visible');
    }
});