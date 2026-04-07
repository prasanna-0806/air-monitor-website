#include "DHT.h"
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1306.h>
#include <SPI.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

#define DHTPIN 4
#define DHTTYPE DHT22
#define MQ135PIN 34

#define SCREEN_WIDTH 128
#define SCREEN_HEIGHT 64
#define OLED_MOSI 23
#define OLED_CLK  18
#define OLED_DC   17
#define OLED_CS   -1
#define OLED_RESET 16

const char* ssid     = "YOUR_WIFI_NAME";
const char* password = "YOUR_WIFI_PASSWORD";

const char* supabaseUrl = "https://your_supabase_url";
const char* supabaseKey = "your_supabase_key";

Adafruit_SSD1306 display(SCREEN_WIDTH, SCREEN_HEIGHT, OLED_MOSI, OLED_CLK, OLED_DC, OLED_RESET, OLED_CS);
DHT dht(DHTPIN, DHTTYPE);

float temperature, humidity;
int gasValue;
unsigned long lastSend = 0;

String getAirQuality() {
  if (gasValue < 1000) return "Good";
  else if (gasValue < 2000) return "Moderate";
  else return "Bad";
}

void sendToSupabase() {
  HTTPClient http;
  http.begin(supabaseUrl);
  http.addHeader("Content-Type", "application/json");
  http.addHeader("apikey", supabaseKey);
  http.addHeader("Authorization", String("Bearer ") + supabaseKey);

  StaticJsonDocument<200> doc;
  doc["temperature"] = temperature;
  doc["humidity"] = humidity;
  doc["gas"] = gasValue;
  doc["air_quality"] = getAirQuality();

  String body;
  serializeJson(doc, body);

  int responseCode = http.POST(body);

  if (responseCode == 201) {
    Serial.println("Data sent to Supabase! ✓");
  } else {
    Serial.print("Supabase error: ");
    Serial.println(responseCode);
  }
  http.end();
}

void setup() {
  Serial.begin(115200);
  dht.begin();

  if (!display.begin(SSD1306_SWITCHCAPVCC)) {
    Serial.println("OLED not found!");
    while (true);
  }

  display.clearDisplay();
  display.setTextColor(SSD1306_WHITE);
  display.setTextSize(1);
  display.setCursor(0, 20);
  display.println("Connecting WiFi...");
  display.display();

  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\nWiFi connected!");
  Serial.println(WiFi.localIP());

  display.clearDisplay();
  display.setCursor(0, 0);
  display.println("WiFi Connected!");
  display.setCursor(0, 16);
  display.println(WiFi.localIP());
  display.display();
  delay(2000);
}

void loop() {
  if (millis() - lastSend > 10000) {
    lastSend = millis();

    humidity = dht.readHumidity();
    temperature = dht.readTemperature();
    gasValue = analogRead(MQ135PIN);

    if (isnan(humidity) || isnan(temperature)) return;

    sendToSupabase();

    // OLED update
    display.clearDisplay();
    display.setTextSize(1);
    display.setCursor(0, 0);
    display.println("== Air Monitor ==");
    display.setCursor(0, 16);
    display.print("Temp: "); display.print(temperature); display.println(" C");
    display.setCursor(0, 28);
    display.print("Hum:  "); display.print(humidity); display.println(" %");
    display.setCursor(0, 40);
    display.print("Gas:  "); display.println(gasValue);
    display.setCursor(0, 52);
    display.println("Air: " + getAirQuality());
    display.display();

    Serial.print("Temp: "); Serial.print(temperature);
    Serial.print(" | Hum: "); Serial.print(humidity);
    Serial.print(" | Gas: "); Serial.println(gasValue);
  }
}