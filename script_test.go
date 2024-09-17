package main

import (
	"strconv"
	"testing"
	"time"
)

func TestLoadEnv(t *testing.T) {
	env, err := loadEnv()
	if err != nil {
		t.Errorf("loadEnv() returned error: %s", err)
	}
	if env.ClientID == "" || env.MQTTHost == "" || env.Username == "" || env.Password == "" || env.Topic == "" {
		t.Errorf("loadEnv() did not load environment variables correctly")
	}
}

func TestCalculateEnd(t *testing.T) {
	offset := 1000
	duration := 5000
	offsetStr := strconv.Itoa(offset)
	durationStr := strconv.Itoa(duration)
	now := time.Now()
	endTime := calculateEnd(now, offsetStr, durationStr)
	expectedTime := now.Add(time.Duration(duration-offset-1000) * time.Millisecond)
	if endTime != expectedTime {
		t.Errorf("calculateEnd(%s, %s) did not return correct end time", offsetStr, durationStr)
	}
}

func TestHandleTopicMessage(t *testing.T) {
	// This test is difficult to write because it depends on a real MQTT broker
	// and the client login process. You might need to mock out some of these dependencies.
}
