module sasha/plex-discord-rpc

go 1.23.1

replace sasha/plex-discord-rpc/rich-dp => ./rich-dp

require (
	github.com/eclipse/paho.mqtt.golang v1.5.0
	sasha/plex-discord-rpc/rich-dp v0.0.0-00010101000000-000000000000
)

require (
	github.com/gorilla/websocket v1.5.3 // indirect
	github.com/joho/godotenv v1.5.1
	golang.org/x/net v0.27.0 // indirect
	golang.org/x/sync v0.7.0 // indirect
	gopkg.in/natefinch/npipe.v2 v2.0.0-20160621034901-c1b8fa8bdcce // indirect
)
