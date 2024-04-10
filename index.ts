import mqtt from "mqtt";
import { Client, type Presence } from "discord-rpc";

interface Payload {
	subject: {[key: string]: string}
	body: {
		state: "Playing" | "Paused" | "Stopped"
		tv_title: string;
		movie_title: string;
		season: string;
		episode: string;
		type: "episode" | "movie";
		poster: string;
		view_offset: string;
		duration: string;
	}
	topic: string;
}

interface Env {
	DISCORD_CLIENTID: string;
	MQTT_HOST: string;
	MQTT_USERNAME: string;
	MQTT_PASSWORD: string;
	MQTT_TOPIC: string;
}

const envText = await Bun.file(".env").text();
const env: Env = envText.split(/[\r\n]+/).reduce((prev, curr) => {
	const [key, value] = curr.split("=");
	return { ...prev, [key]: value };
}, {} as Env);

const discordClient = await new Client({ transport: "ipc" }).login({
	clientId: env.DISCORD_CLIENTID,
});
const client = await mqtt.connectAsync(env.MQTT_HOST, {
	username: env.MQTT_USERNAME,
	password: env.MQTT_PASSWORD,
	protocolVersion: 5,
	protocol: "mqtt",
});
console.log("Connected to MQTT.");
await client.subscribeAsync(env.MQTT_TOPIC);
console.log(`Subscribed to ${env.MQTT_TOPIC}.`);
client.on("message", async (_, payload)  => {
    const data: Payload = JSON.parse(payload.toString("utf8"));
	console.log(data);
	const presence: Presence = {
		state: data.body.state,
		details: data.body.type === "episode" ? data.body.tv_title : data.body.movie_title,
		largeImageKey: data.body.poster,
		endTimestamp: data.body.state === "Playing" ? +data.body.duration - +data.body.view_offset - 1000 : undefined
	}
	await discordClient.setActivity(presence);
});
