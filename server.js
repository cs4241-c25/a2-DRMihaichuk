const http = require( "node:http" ),
    fs   = require( "node:fs" ),
    // IMPORTANT: you must run `npm install` in the directory for this assignment
    // to install the mime library if you're testing this on your local machine.
    // However, Glitch will install it automatically by looking in your package.json
    // file.
    mime = require( "mime" ),
    dir  = "public/",
    port = 3000

const appdata = [
    { "Pokemon": "Pikachu", "HP": 45, "Attack": 80 , "Defense": 50,
        "Special Attack": 75, "Special Defense": 60, "Speed": 120, "Specialty": ""},
    { "Pokemon": "Eevee", "HP": 65, "Attack": 75, "Defense": 70,
        "Special Attack": 65, "Special Defense": 85, "Speed": 75, "Specialty": ""},
    { "Pokemon": "Shuckle", "HP": 20, "Attack": 10 , "Defense": 230,
        "Special Attack": 10, "Special Defense": 230, "Speed": 5, "Specialty": ""}
]

// let fullURL = ""
const server = http.createServer( function( request,response ) {
    if( request.method === "GET" ) {
        handleGet( request, response )
    }else if( request.method === "POST" ){
        handlePost( request, response )
    }
});

const handleGet = function( request, response ) {
    const filename = dir + request.url.slice( 1 )

    if( request.url === "/") {
        sendFile( response, "public/index.html" )
    } else if (request.url === "/load") {
        // Send data as JSON
        response.writeHead(200, { "Content-Type": "text/plain" });
        console.log(JSON.stringify(appdata));
        response.end(JSON.stringify(appdata));
    } else{
        sendFile( response, filename )
    }
}

const handlePost = function( request, response ) {
    let dataString = ""

    request.on( "data", function( data ) {
        dataString += data
    })

    request.on( "end", function() {
        console.log( JSON.parse( dataString ) );
        const newPokemon = JSON.parse( dataString );

        if (newPokemon.Pokemon !== "") {
            for (const index in newPokemon) {
                console.log(index);
                console.log(newPokemon[index])
                console.log(newPokemon[index] === null);
                if (newPokemon[index] === null) {newPokemon[index] = 1;}
            }

            if (request.url === "/add") {
                const index = appdata.findIndex(pokemon => pokemon.Pokemon.toUpperCase() === newPokemon.Pokemon.toUpperCase());
                if (index > -1){
                    appdata.splice(index, 1);
                }
                appdata.push(newPokemon);
            }
            else if (request.url === "/remove") {
                const index = appdata.findIndex(pokemon => pokemon.Pokemon.toUpperCase() === newPokemon.Pokemon.toUpperCase());
                if (index > -1) {
                    appdata.splice(index, 1);
                }
            }
        }

        appdata.forEach(pokemon => {
            // Determining Pokemon's Damage type
            let atkrate = 0
            if (pokemon.Attack - 15 > pokemon["Special Attack"]) {
                pokemon.Specialty = "Physical"
                atkrate = pokemon.Attack * pokemon.Attack * pokemon.Speed;
            }
            else if (pokemon["Special Attack"] - 15 > pokemon.Attack) {
                pokemon.Specialty = "Special"
                atkrate = pokemon["Special Attack"] * pokemon["Special Attack"] * pokemon.Speed;
            }
            else {
                pokemon.Specialty = "Mixed"
                atkrate = pokemon.Attack * pokemon["Special Attack"] * pokemon.Speed;
            }
            // Determining Pokemon's battle style
            const defrate = pokemon.HP * pokemon.Defense * pokemon["Special Defense"];
            if (atkrate / 1.5 > defrate) {pokemon.Specialty += " Sweeper"}
            else if (defrate / 1.5 > atkrate) {pokemon.Specialty += " Staller"}
            else {pokemon.Specialty += " Generalist"}
        });

        response.writeHead( 200, "OK", {"Content-Type": "text/plain" })
        response.end( JSON.stringify(appdata))
    })
}

const sendFile = function( response, filename ) {
    const type = mime.getType( filename )
    console.log("filename:", filename )

    fs.readFile( filename, function( err, content ) {

        // if the error = null, then we've loaded the file successfully
        if( err === null ) {

            // status code: https://httpstatuses.com
            response.writeHeader( 200, { "Content-Type": type })
            response.end( content )

        } else {

            // file not found, error code 404
            response.writeHeader( 404 )
            response.end( "404 Error: File Not Found" )

        }
    })
}

// process.env.PORT references the port that Glitch uses
// the following line will either use the Glitch port or one that we provided
server.listen( process.env.PORT || port )

