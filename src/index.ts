import { Client, Presence } from "discord-rpc";
import * as mqttjs from "mqtt";
import { default as axios } from "axios";
import * as moment from "moment";
import * as fs from "fs";

/**
 * Main class for Discord Rich Presence
 * @class
 * @public
 */
class DiscordRichPresence {
  timeout: NodeJS.Timeout | number = 0;
  environment: Environment;
  discordClient: Client;
  mqttClient: mqttjs.Client;

  constructor() {
    console.log("Rich Presence Started");
    const fileText = fs.readFileSync("./env.json").toString("utf-8");
    this.environment = JSON.parse(fileText) as Environment;
    this.discordClient = new Client({ transport: "ipc" });
    this.mqttClient = mqttjs.connect(this.environment.mqtt.host, {
      username: this.environment.mqtt.username,
      password: this.environment.mqtt.password,
    });
    this.mqttClient.on("connect", () => this.mqttClient.subscribe("discord"));
    this.mqttClient.on("error", (e) => console.log(e.message));
    this.mqttClient.on("message", (_, payload) => this.parseMessage(payload));
    this.discordClient.login({ clientId: this.environment.discord.clientId });
  }

  parseMessage = async (payload: Buffer) => {
    const messageString = Buffer.from(payload).toString("utf-8");
    const message: Message = JSON.parse(messageString).body;
    if (
      message.state === "stopped" ||
      this.environment.settings.excluded.includes(message.folder)
    ) {
      await this.discordClient.clearActivity();
      return;
    }
    const details =
      message.folder === "Movies"
        ? message.title
        : `${message.title
          .substring(0, message.title.indexOf(" - "))
          .trim()} S${message.season}E${message.episode}`;
    this.setDiscordPresence(message, details);
  };

  clearPresence = () => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = 0;
    }
    this.discordClient.clearActivity();
  };

  setDiscordPresence = async (message: Message, details: string) => {
    if (this.timeout) {
      clearTimeout(this.timeout);
      this.timeout = 0;
    }
    let activity: Presence = {
      state: message.state.charAt(0).toUpperCase() + message.state.slice(1),
      details,
      largeImageKey: message.poster,
      smallImageKey: `${message.state === "playing" ? "play" : "pause"}_512`,
      instance: true,
    };
    if (message.state === "playing") {
      const { data: sessions } = await axios.get(
        `${this.environment.plex.host}/status/sessions?X-Plex-Token=${this.environment.plex.key}`,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
          },
        }
      );
      const userSession = sessions.MediaContainer.Metadata.find(
        (session: Session) => session.User.title === this.environment.plex.username
      );
      const endTimeMilliseconds = userSession.duration - userSession.viewOffset;
      const endTimestamp: number = moment()
        .add(endTimeMilliseconds, "milliseconds")
        .subtract("1", "second")
        .valueOf();
      activity = { ...activity, endTimestamp };
      this.timeout = setTimeout(
        () => this.clearPresence(),
        endTimeMilliseconds - 1000
      );
      await this.discordClient.setActivity(activity);
    } else {
      this.clearPresence(); //Clear when paused
    }
  };
}

new DiscordRichPresence();
