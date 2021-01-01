/* TWITCH API LURP | Dj_Expo | Última actualización: 01/01/2020 */

const users = ["r4kn0x", "redfalcon69yt", "lurp_es"];
const clientID = "XXXXXXXX";
const clientSecret = "XXXXXXXX";
var user_login = users.join('&user_login=');
var token = null;
var refresh = 0;

var options = {
	width: 1280,
	height: 720,
	channel: "test",
	allowfullscreen: false
};

var player = new Twitch.Player("container", options);
$("iframe").attr("sandbox", "allow-scripts allow-top-navigation allow-same-origin");
$("iframe").css("display", "none");

$.post(`https://id.twitch.tv/oauth2/token?client_id=${clientID}&client_secret=${clientSecret}&grant_type=client_credentials`, function(result) {
	token = result.access_token;
	getData();
});

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
	var liveChannel = [];
	var liveViewers = [];
	
	for (i=0;i<data.length;i++) {
		if (data[i].game_id == 32982) {
			liveChannel.push(data[i].user_name);
			liveViewers.push(data[i].viewer_count);
		}
	}
	
	if (liveChannel.length >= 1) {
		if (player.getChannel() == liveChannel[0]) return;
		player.setChannel(liveChannel[0]);
		
		if (player.isPaused()) player.play();
		
		$("#container").css("background", "url('')");
		$("iframe").css("display", "block");
		
		$("#footer").css("height", "65px");
		$("#channel").html(`<p>Canal actual: <span style="color: #089708;">${liveChannel[0]}</span></p>`);
		$("#viewers").html(`<p>Espectadores: <span style='color: orange;'>${liveViewers[0]}</span></p>`);
	} else {
		player.pause();
		
		$("#container").css("background", "url('nodirecto.png')");
		$("iframe").css("display", "none");
		
		$("#footer").css("height", "145px");
		$("#channel").html("");
		$("#viewers").html("");
		$("#nochannels").html("<p>Actualmente no hay ningún directo disponible.<br>Vuelve más tarde!</p>");
	}
}

setInterval(() => getData(), 15000);