// FRONT-END (CLIENT) JAVASCRIPT HERE

const add = async function(event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day

    event.preventDefault()

    const body = definebody();

    const response = await fetch( "/add", {
        method:'POST',
        body
    })

    const text = await response.text()
    console.log( "text:", text )

    // change to table later
    let pokemonList = JSON.parse(text)

    generateTable(pokemonList);
}

const remove = async function(event ) {
    // stop form submission from trying to load
    // a new .html page for displaying results...
    // this was the original browser behavior and still
    // remains to this day
    event.preventDefault();

    const body = definebody();

    const response = await fetch("/remove", {
        method: 'POST',
        body
    });

    const text = await response.text()
    console.log( "text:", text )

    let pokemonList = JSON.parse(text);
    console.log(pokemonList);

    generateTable(pokemonList);
}

const generateTable = function(pokemonList) {
    let table = document.createElement("table");
    let thead = document.createElement("thead");
    let tbody = document.createElement("tbody");

    const headerRow = document.createElement("tr");
    for (const key in pokemonList[0]) {
        const header = document.createElement('th');
        header.textContent = key;
        headerRow.appendChild(header);
    }
    thead.appendChild(headerRow);

    for (const rowData of pokemonList) {
        const row = document.createElement('tr');
        for (const key in rowData) {
            const td = document.createElement('td');
            td.textContent = rowData[key];
            row.appendChild(td);
        }
        tbody.appendChild(row);
    }

    table.appendChild(thead);
    table.appendChild(tbody);

    // coded this before I remembered HTML templates exist...
    document.getElementById("info").replaceChildren(table);
}

const definebody = () => {
    const name = document.querySelector( "#pkmnName" ),
        hp = document.querySelector( "#pkmnHP" ),
        atk = document.querySelector( "#pkmnAttack" ),
        def = document.querySelector( "#pkmnDefense" ),
        spatk = document.querySelector( "#pkmnSpAttack" ),
        spdef = document.querySelector( "#pkmnSpDefense" ),
        spd = document.querySelector( "#pkmnSpeed" ),
        json = { Pokemon: name.value, HP: parseInt(hp.value), Attack: parseInt(atk.value), Defense: parseInt(def.value),
            "Special Attack": parseInt(spatk.value), "Special Defense": parseInt(spdef.value), Speed: parseInt(spd.value), Specialty: "" }
    return JSON.stringify(json)
}

window.onload = async function() {
    const addButton = document.querySelector("#addbut");
    const removeButton = document.querySelector("#rembut")
    addButton.onclick = add;
    removeButton.onclick = remove;

    const body = definebody();

    const response = await fetch("/load", {
        method: 'POST',
        body
    });

    const text = await response.text()
    let pokemonList = JSON.parse(text)

    generateTable(pokemonList);
}