/* TWITCH API LURP | Dj_Expo | Última actualización: 02/01/2020 */

const users = ["r4kn0x", "redfalcon69yt", "lurp_es"];
const clientID = "XXXXXXXX";
const clientSecret = "XXXXXXXX";
var user_login = users.join('&user_login=');
var token = null;

var options = {
	width: 1280,
	height: 720,
	channel: "test",
	allowfullscreen: false
};

var player = new Twitch.Player("container", options);
$("iframe").attr("sandbox", "allow-scripts allow-top-navigation allow-same-origin");
$("iframe").css("display", "none");

function load() {
	$.post(`https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`, function(result) {
		token = result.access_token;
		getData();
	});
}

function getData() {
	$.ajax({
		type: "GET",
		url: `https://api.twitch.tv/helix/streams?user_login=${user_login.toLowerCase()}`,
		headers: {
			"Client-ID": clientID,
			"Authorization": "Bearer " + token
		}
	}).done(function(rawdata) {
		loadChannels(rawdata.data);
	});
}

function loadChannels(data) {
	var liveChannel = [], liveViewers = [];
	
	for (i=0;i<data.length;i++) {
		if (data[i].game_id == 32982) {
			liveChannel.push(data[i].user_name);
			liveViewers.push(data[i].viewer_count);
		}
	}
	
	if (liveChannel.length >= 1) {
		if (player.getChannel() != liveChannel[0]) player.setChannel(liveChannel[0]);
		
		if (player.isPaused()) player.play();
		
		$("#container").css("background", "url('')");
		$("iframe").css("display", "block");
		
		$("#channel").html(`<p>Canal actual: <span id="g">${liveChannel[0]}</span></p>`);
		$("#viewers").html(`<p>Espectadores: <span id="y">${liveViewers[0]}</span></p>`);
		$("#channel").css("display", "block");
		$("#viewers").css("display", "block");
		$("#nochannels").css("display", "none");
	} else {
		player.pause();
		
		$("#container").css("background", "url('nodirecto.png')");
		$("iframe").css("display", "none");
		
		$("#channel").css("display", "none");
		$("#viewers").css("display", "none");
		$("#nochannels").css("display", "block");
		$("#nochannels").html("<p>Actualmente no hay ningún directo disponible. Vuelve más tarde!</p>");
	}
}

setInterval(() => getData(), 12000);