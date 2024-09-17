# Plex-Discord-Rich-Presence
A discord rich presence plugin for plex

## How Do I use it?

You'll need to have a few things ready:

- Discord!
- MQTT (I use mosquitto)
- Tautulli
  
Create an `.env` that looks something like this:

```
DISCORD_CLIENTID=<Your app key, or use 791384816192192523>
MQTT_HOST=mqtt://<Your MQTT Host>
MQTT_USERNAME=<Your MQTT Username>
MQTT_PASSWORD=<Your MQTT Password>
MQTT_TOPIC=<Your MQTT Topic>
```

1. Download the latest release
2. put your `.env` in the same directory as where you put the exe
3. configure tautulli the following way:

Create a MQTT notification on tautulli like the following way:

## Settings
![image](https://github.com/SashaRyder/Plex-Discord-Rich-Presence/assets/8694395/20bf1aef-0b0e-4c8d-9fb2-dd01d8ebd28a)

## Triggers
![image](https://github.com/SashaRyder/Plex-Discord-Rich-Presence/assets/8694395/55da8314-ae5a-43b8-97d9-e2c8f71e368f)

## Conditions
![image](https://github.com/SashaRyder/Plex-Discord-Rich-Presence/assets/8694395/220c9175-e37a-41b5-9b78-aa04a0544ae6)

## Text

For all the following subject i use `{"test": "test"}` because we don't use it.

### Playback start/resume
```
{
  "state": "Playing",
  "tv_title": "{show_name} - S{season_num00}E{episode_num00}",
  "movie_title": "{title}",
  "type": "{media_type}",
  "poster": "{poster_url}",
  "view_offset": "{view_offset}",
  "duration":  "{duration_ms}"
}
```

### Playback pause
```
{
  "state": "Paused",
  "tv_title": "{show_name} - S{season_num00}E{episode_num00}",
  "movie_title": "{title}",
  "type": "{media_type}",
  "poster": "{poster_url}",
  "view_offset": "{view_offset}",
  "duration":  "{duration_ms}"
}
```

### Playback stopped
```
{
  "state": "Stopped",
  "tv_title": "{show_name} - S{season_num00}E{episode_num00}",
  "movie_title": "{title}",
  "type": "{media_type}",
  "poster": "{poster_url}",
  "view_offset": "{view_offset}",
  "duration":  "{duration_ms}"
}
```


I use nssm.exe to set everything up as a windows service, but if you don't want to do that, that's fine! :) 
