interface Mqtt {
    host: string;
    username: string;
    password: string;
}

interface Discord {
    clientId: string;
}

interface Plex {
    host: string;
    key: string;
    username: string;
}

interface Settings { 
    excluded: string[];
}

interface Environment {
    mqtt: Mqtt;
    discord: Discord;
    plex: Plex;
    settings: Settings;
}