package main

import (
	"encoding/json"
	"fmt"
	"os"
	"os/signal"
	"strconv"
	"syscall"
	"time"

	"sasha/plex-discord-rpc/rich-dp/client"

	mqtt "github.com/eclipse/paho.mqtt.golang"
	"github.com/joho/godotenv"
)

func loadEnv() (Env, error) {
	if err := godotenv.Load(".env"); err != nil {
		return Env{}, err
	}
	return Env{
		ClientID: os.Getenv("DISCORD_CLIENTID"),
		MQTTHost: os.Getenv("MQTT_HOST"),
		Username: os.Getenv("MQTT_USERNAME"),
		Password: os.Getenv("MQTT_PASSWORD"),
		Topic:    os.Getenv("MQTT_TOPIC"),
	}, nil
}

func calculateEnd(now time.Time, offset string, duration string) time.Time {
	offsetIntVal, offsetErr := strconv.Atoi(offset)
	durationIntVal, durationErr := strconv.Atoi(duration)
	if offsetErr != nil || durationErr != nil {
		return now
	}
	mediaDuration := time.Duration(durationIntVal) * time.Millisecond
	offsetDuration := time.Duration(offsetIntVal) * time.Millisecond
	return now.Add(mediaDuration - offsetDuration - 1000*time.Millisecond)
}

var handleTopicMessage mqtt.MessageHandler = func(c mqtt.Client, m mqtt.Message) {
	var payload Payload
	err := json.Unmarshal(m.Payload(), &payload)
	if err != nil {
		panic(err)
	}
	if payload.Body.State == StateStopped {
		client.ClearActivity()
		return
	}
	details := payload.Body.TVTitle
	if payload.Body.Type == TypeMovie {
		details = payload.Body.MovieTitle
	}
	activity := client.Activity{
		State:      string(payload.Body.State),
		Details:    details,
		LargeImage: payload.Body.Poster,
	}
	if payload.Body.State == StatePlaying {
		endTime := calculateEnd(time.Now(), payload.Body.ViewOffset, payload.Body.Duration)
		activity.Timestamps = &client.Timestamps{End: &endTime}
	}
	setErr := client.SetActivity(activity)
	if setErr != nil {
		panic(setErr)
	}
}

func main() {
	keepAlive := make(chan os.Signal, 1)
	signal.Notify(keepAlive, os.Interrupt, syscall.SIGTERM)

	env, envErr := loadEnv()
	if envErr != nil {
		panic(envErr)
	}
	fmt.Println("Env variables loaded")

	discErr := client.Login(env.ClientID)
	if discErr != nil {
		panic(discErr)
	}
	fmt.Println("Connected to Discord RPC")

	mqttOptions := mqtt.NewClientOptions().
		SetUsername(env.Username).
		SetPassword(env.Password).
		AddBroker(env.MQTTHost)
	mqttClient := mqtt.NewClient(mqttOptions)
	if token := mqttClient.Connect(); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}
	if token := mqttClient.Subscribe(env.Topic, 1, handleTopicMessage); token.Wait() && token.Error() != nil {
		panic(token.Error())
	}
	fmt.Println("Connected to MQTT")

	<-keepAlive

}
