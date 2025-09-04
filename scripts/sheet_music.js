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

function compareStrings(a, b) {
    a = a.toString().toLowerCase();
    b = b.toString().toLowerCase();

    return (a < b) ? -1 : (a > b) ? 1 : 0;
}

function generateTable() {
    const section = document.getElementById('sheet-music-table');
    section.innerHTML = '';
    
    const table = document.createElement('table');
            
    let headerRow = '<tr><th>Name</th><th>Type</th><th>Notes</th><th></th></tr>';
    let rows = files.map(file => `
        <tr>
            <td>${file.name}</td>
            <td>${file.type}</td>
            <td>${file.notes}</td>
            <td>
                <a href="/resources/music/sheet_music/${file.name}.pdf" target="_blank">View</a>
                <a href="/resources/music/sheet_music/${file.name.replace(/\s+/g, '_')}.pdf" download><i class="fas fa-circle-down"></i></a>
            </td>
        </tr>
    `).join('');
    table.innerHTML = headerRow + rows;
    
    section.appendChild(table);
}

window.addEventListener('DOMContentLoaded', generateTable)
window.addEventListener('resize', generateTable)