interface Message {
    state: "paused" | "playing" | "stopped";
    title: string;
    season: string;
    episode: string;
    folder: string;
    poster: string;

}