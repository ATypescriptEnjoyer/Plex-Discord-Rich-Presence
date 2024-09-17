package main

type State string

const (
	StatePlaying State = "Playing"
	StatePaused  State = "Paused"
	StateStopped State = "Stopped"
)

type Type string

const (
	TypeEpisode Type = "episode"
	TypeMovie   Type = "movie"
)

type Payload struct {
	Subject map[string]string
	Body    struct {
		State      State  `json:"state,omitempty"`
		TVTitle    string `json:"tv_title,omitempty"`
		MovieTitle string `json:"movie_title,omitempty"`
		Season     string `json:"season,omitempty"`
		Episode    string `json:"episode,omitempty"`
		Type       Type   `json:"type,omitempty"`
		Poster     string `json:"poster,omitempty"`
		ViewOffset string `json:"view_offset,omitempty"`
		Duration   string `json:"duration,omitempty"`
	}
	Topic string
}

type Env struct {
	ClientID string
	MQTTHost string
	Username string
	Password string
	Topic    string
}
