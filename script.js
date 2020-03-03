const callAJAX = (props) => {
    const url = props.url,
        method = props.method || "GET",
        type = props.type || "JSON",
        header = props.header
    ;
    
    return new Promise(waitForResult => {
        const xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState === 4 && this.status === 200) {
                type === "text" 
                    ? waitForResult(this.response)
                    : waitForResult(JSON.parse(this.response))
                ;
            }
        };
		
        if (method === "GET") {
            xhttp.open("GET", url, true);
            for (const key in props.header) {
                xhttp.setRequestHeader(key, header[key]);
            }
            xhttp.send();
        }
    });
};

const AJAXProps = {
    url: "https://api.twitch.tv/helix/streams?first=20",
    header: {"Client-ID": "2qyh8p71ip7wb5duz7s7j4ctujehqn"} //Clave api
};

var users = ["zeekyy", "zzraknoxzz", "minimuhyt", "redfalcon69yt", "bydanif_", "peroniaxdeluxe", "sutanrp"];
//Array de los usuarios, estén o no en directo (canales)

    var opciones = { // Opciones del embed
    width: 1280,
    height: 720,
    channel: "",
    allowfullscreen: false
    };
	
    var player = new Twitch.Player("container", opciones); // Crear iframe con las opciones
    player.setVolume(1);
	document.getElementsByTagName("iframe")[0].setAttribute("style", "display: none;");
    document.getElementsByTagName("iframe")[0].setAttribute("sandbox", "allow-scripts allow-top-navigation allow-same-origin");
	// Establece los atributos al frame
	
// Actualizamos las arrays y el iframe (comprobando los que siguen en directo)
function actualizarCanales() {
    var login = users.join('&login=');
    var user_login = users.join('&user_login=');
    AJAXProps.url = `https://api.twitch.tv/helix/users?login=${login}`;

    callAJAX(AJAXProps).then(allUser => {
        // Comprueba si los usuarios del array 'users' están en directo
        AJAXProps.url = `https://api.twitch.tv/helix/streams?user_login=${user_login}`;

        callAJAX(AJAXProps).then(usuariosOnline => {
			
			var live = [];
			// Nueva array de los usuarios de la antigua array, que están en directo y con la categoría de GTA V
			
            for (i = 0; i < usuariosOnline.data.length; i++) { // Se repite tantas veces como usuarios en directo estén o no en GTA V
                if (usuariosOnline.data[i].game_id == 32982) { // Game id de 32982 (GTA V)
                    live.push(usuariosOnline.data[i].user_name); // Metemos los usuarios a la array que están con GTA V
                }
            }
			
			// Variables de los DOM
			var infoCaja = document.getElementById("caja");
			var infoCanal = document.getElementById("canal");
			var infoEspectadores = document.getElementById("espectadores");
			var nodirecto = document.getElementById("nodirecto");
			var container = document.getElementById("container");
			var iframe = document.getElementsByTagName("iframe")[0];
			
            if (live.length >= 1) { // Si uno o más usuarios están en directo, el código de debajo se ejecuta
				player.setChannel(live[0]); // Establecemos canal con más viewers
				container.style.background = "url('')"; // Quitamos la imagen de fondo
				iframe.setAttribute("style", "display: block;"); // Mostramos el iframe
				
				var espectadores = usuariosOnline.data[0].viewer_count;
				infoCaja.style.height = "65px"; // Establecemos altura para que los dos textos quepan
				infoCanal.innerHTML = "<p>Canal actual: <span style='color: #089708;'>"+ live[0] + "</span></p>";  // Mostramos info canal
				
				infoEspectadores.innerHTML = "<p>Espectadores: <span style='color: orange;'>"
				+ espectadores + "</span></p>"; // Mostramos info espectadores
				nodirecto.innerHTML = "";
			} else { // Si ninguno está haciendo directo, el código de debajo se ejecuta
				container.style.background = "url('nodirecto.png')"; // Ponemos la imagen de fondo
				iframe.setAttribute("style", "display: none;"); // Ocultamos el iframe
				
				infoCaja.style.height = "145px"; // Establecemos altura del div para que quepa el texto grande
				infoCanal.innerHTML = ""; // Ocultamos info canal
				infoEspectadores.innerHTML = ""; // Ocultamos info espectadores
				nodirecto.innerHTML = "<p>Actualmente no hay ningún directo disponible.<br>Vuelve más tarde!</p>";
				// Mostramos texto cuando no hay canales en directo
			}
			
			function directoAcabado() { // Función que comprueba si el directo mostrado ha terminado
				if (player.getEnded() == true) { // Si el directo ha terminado el código de debajo se ejecuta
					container.style.background = "url('nodirecto.png')";
					iframe.setAttribute("style", "display: none;");
				
					infoCaja.style.height = "145px";
					infoCanal.innerHTML = "";
					infoEspectadores.innerHTML = "";
					nodirecto.innerHTML = "<p>Actualmente no hay ningún directo disponible.<br>Vuelve más tarde!</p>";
				}
			} setInterval(directoAcabado, 15000); // Intervalo de la función: 15 sec
        });
    });
	console.log("Actualizando canales"); // Mostramos en consola cuando la función se ejecuta
} setInterval(actualizarCanales, 210000); // Intervalo de la función: 1 min