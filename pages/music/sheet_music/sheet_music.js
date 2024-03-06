let files = [
    { name: "A Hero's Crossing", type: "Hornpipe", notes: "GHB" },
    { name: "Blackbird in the Rain", type: "Waltz", notes: "" },
    { name: "Conrad's Conundrum", type: "Jig", notes: "GHB" },
    { name: "Fiery Skies", type: "Jig", notes: "GHB" },
    { name: "Libby's Lullaby", type: "Slow Air", notes: "GHB" },
    { name: "Loophole", type: "Jig", notes: "" },
    { name: "Meadow Dance", type: "Slow Air", notes: "GHB, dedication" },
    { name: "Moonlit Nights", type: "Slow Air", notes: "GHB" },
    { name: "Riffle Shuffle", type: "Hornpipe", notes: "GHB" },
    { name: "Second Guesses", type: "Reel", notes: "GHB, Smallpipes" },
    { name: "The Bird's Eye", type: "Jig", notes: "GHB" },
    { name: "The Haus Jig", type: "Jig", notes: "GHB" },
    { name: "The Train Line to Masterton", type: "Hornpipe", notes: "GHB" },
    { name: "Up Your Game", type: "Hornpipe", notes: "GHB" },
    { name: "Weaving Memories", type: "Slow Air", notes: "GHB, dedication" }
]

function generateTableHead(table, data) {
    let thead = table.createTHead();
    let row = thead.insertRow();
    for (let key of data) {
        key = key.charAt(0).toUpperCase() + key.slice(1);
        let th = document.createElement("th");
        
        if (key == "Name") {
            th.style.width = "50%";
        }
        else if (key == "Type") {
            th.style.width = "25%";
        }
        else {
            th.style.width = "25%";
        }
        let text = document.createTextNode(key);
        th.appendChild(text);
        row.appendChild(th);
    }
}

function generateTable(table, data) {
    for (let element of data) {
        let row = table.insertRow();
        
        for (key in element) {
            let cell = row.insertCell();
            let text = document.createTextNode(element[key]);
            cell.appendChild(text);
        }

        let cell = row.insertCell();
        let a = document.createElement('a');
        a.href = "/resources/music/sheet_music/" + element.name + ".pdf";
        a.download = element.name + ".pdf";
        let dl = document.createElement("i");
        dl.classList.add("fa-solid", "fa-circle-down");
        a.appendChild(dl);
        cell.appendChild(a);
    }
}

function compareStrings(a, b) {
    a = a.toString().toLowerCase();
    b = b.toString().toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

let table = document.querySelector("table");
let data = Object.keys(files[0]);
files.sort((a, b) => compareStrings(a, b));
generateTable(table, files);
generateTableHead(table, data);