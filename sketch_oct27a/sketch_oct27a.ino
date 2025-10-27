

/* ============================================================
   🌿 SMART FARM HYBRID VERSION
   Combines local ESP32 Web Dashboard + Cloud API Integration
   ============================================================ */

#include <Arduino.h>
#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>
#include <AsyncTCP.h>
#include <ESPAsyncWebServer.h>
#include <LiquidCrystal_I2C.h>
#include <dht11.h>
#include <ESP32_Servo.h>

/* ---------------- WIFI CONFIG ---------------- */
const char* SSID = "DEV_WIFI";
const char* PASS = "1qaz2wsx!";

/* ---- Cloud API Configuration ---- */
const char* API_BASE  = "https://smart-farm-dashboard-omega.vercel.app/api";
const char* DEVICE_ID = "farm_001";

/* ---------------- PIN MAP ---------------- */
#define DHT11PIN        17
#define LEDPIN          27
#define SERVOPIN        26
#define FANPIN1         19
#define FANPIN2         18
#define STEAMPIN        35
#define LIGHTPIN        34
#define SOILHUMIDITYPIN 32
#define WATERLEVELPIN   33
#define RELAYPIN        25

/* ---------------- GLOBAL OBJECTS ---------------- */
dht11 DHT11;
LiquidCrystal_I2C lcd(0x27,16,2);
AsyncWebServer server(80);
Servo myservo;

/* ---------------- FLAGS ---------------- */
static int A = 0, B = 0, C = 0;

/* ---------------- TIMERS ---------------- */
unsigned long lastSensorSend = 0;
unsigned long lastCommandCheck = 0;
const long sensorInterval  = 10000;  // send to cloud every 10 s
const long commandInterval = 4000;   // check commands every 4 s

/* ============================================================
   ==========  HTML DASHBOARD (same as before)  ===============
   ============================================================ */
const char index_html[] PROGMEM = R"rawliteral(
<!DOCTYPE HTML><html><head>
<meta charset="utf-8"><title>Smart Farm</title></head>
<body>
  <div class="btn">
    <div id="dht"></div>
    <button onclick="set('A')">LED</button>
    <button onclick="set('B')">Fan</button>
    <button onclick="set('C')">Feeding</button>
    <button onclick="set('D')">Watering</button>
  </div>
<script>
function set(v){var x=new XMLHttpRequest();x.open("GET","/set?value="+v,true);x.send();}
setInterval(()=>{var r=new XMLHttpRequest();
r.onreadystatechange=function(){if(this.readyState==4&&this.status==200)
document.getElementById("dht").innerHTML=this.responseText;};
r.open("GET","/dht",true);r.send();},1000);
</script>
<style>html,body{margin:0;width:100%;height:100%;}
body{display:flex;justify-content:center;align-items:center;}
#dht{text-align:center;width:100%;color:#fff;background:#47a047;font-size:28px;}
button{width:100%;font-size:22px;margin:10px;background:#89e689;border:none;}
button:active{top:2px;}
</style></body></html>
)rawliteral";

/* ============================================================
   SENSOR PACKAGING FOR BOTH WEB + CLOUD
   ============================================================ */
String Merge_Data() {
  DHT11.read(DHT11PIN);
  float steam = analogRead(STEAMPIN) / 4095.0 * 100;
  float light = analogRead(LIGHTPIN);
  float soil  = min((analogRead(SOILHUMIDITYPIN) / 4095.0 * 100 * 2.3), 100.0);
  float water = min((analogRead(WATERLEVELPIN) / 4095.0 * 100 * 2.5), 100.0);

  String data;
  data += "<h2>Sensor Data</h2>";
  data += "Temp: " + String(DHT11.temperature) + "°C<br/>";
  data += "Humidity: " + String(DHT11.humidity) + "%<br/>";
  data += "Soil: " + String(soil) + "%<br/>";
  data += "Water: " + String(water) + "%<br/>";
  data += "Steam: " + String(steam) + "%<br/>";
  data += "Light: " + String(light) + "<br/>";
  return data;
}

/* ============================================================
   LOCAL CALLBACK HANDLER (unchanged)
   ============================================================ */
void Config_Callback(AsyncWebServerRequest *request) {
  if (request->hasParam("value")) {
    String val = request->getParam("value")->value();
    Serial.printf("[%lu] %s\n", millis(), val.c_str());

    if (val == "A") { // LED
      digitalWrite(LEDPIN, A ? LOW : HIGH); A = !A;
    }
    if (val == "B") { // Fan
      if (B) { digitalWrite(FANPIN1, LOW); digitalWrite(FANPIN2, LOW); }
      else { digitalWrite(FANPIN1, HIGH); digitalWrite(FANPIN2, LOW); }
      B = !B;
    }
    if (val == "C") { // Feeding
      myservo.write(C ? 180 : 80);
      C = !C;
    }
    if (val == "D") { // Watering
      digitalWrite(RELAYPIN,HIGH);
      delay(400);
      digitalWrite(RELAYPIN,LOW);
    }
  }
  request->send(200,"text/plain","OK");
}

/* ============================================================
   CLOUD UPLOAD & COMMAND FUNCTIONS
   ============================================================ */
void sendSensorData() {
  if (WiFi.status() != WL_CONNECTED) return;
  HTTPClient http;
  String url = String(API_BASE) + "/sensors";
  http.begin(url);
  http.addHeader("Content-Type","application/json");

  StaticJsonDocument<512> doc;
  doc["device_id"] = DEVICE_ID;
  JsonArray r = doc.createNestedArray("readings");

  DHT11.read(DHT11PIN);
  r.createNestedObject()["metric"] = "temp";  r[0]["value"] = DHT11.temperature;
  r.createNestedObject()["metric"] = "hum";   r[1]["value"] = DHT11.humidity;
  r.createNestedObject()["metric"] = "soil";  r[2]["value"] = analogRead(SOILHUMIDITYPIN);
  r.createNestedObject()["metric"] = "light"; r[3]["value"] = analogRead(LIGHTPIN);
  r.createNestedObject()["metric"] = "water"; r[4]["value"] = analogRead(WATERLEVELPIN);
  r.createNestedObject()["metric"] = "steam"; r[5]["value"] = analogRead(STEAMPIN);

  String payload; serializeJson(doc, payload);
  int code = http.POST(payload);
  Serial.printf("Sent sensors → HTTP %d\n", code);
  http.end();
}

void executeCommand(JsonObject cmd) {
  if (cmd.containsKey("action")) {
    String action = cmd["action"]; // Get the action string
    Serial.printf("Received action: %s\n", action.c_str()); // Debug print

    if (action == "water") {
      Serial.println("Executing: Water Pump");
      digitalWrite(RELAYPIN, HIGH);
      // Use a default duration or get one from the command if needed
      delay(cmd["duration_ms"] | 3000); // Default 3 seconds if not provided
      digitalWrite(RELAYPIN, LOW);
    } else if (action == "fan") {
      Serial.println("Executing: Fan");
      digitalWrite(FANPIN1, HIGH);
      digitalWrite(FANPIN2, LOW);
      delay(cmd["duration_ms"] | 5000); // Default 5 seconds
      digitalWrite(FANPIN1, LOW);
    } else if (action == "light") {
      Serial.println("Executing: Light Toggle");
      // Assuming LEDPIN controls the light you want to toggle via command
      digitalWrite(LEDPIN, A ? LOW : HIGH); // Toggle based on current state 'A'
      A = !A; // Update the state
      // Note: The original code used a delay, which might not be desired for a toggle.
      // If you want timed light, send duration_ms and use delay like the others.
    } else {
      Serial.printf("Unknown action: %s\n", action.c_str());
    }
  } else {
    Serial.println("Command JSON does not contain 'action' key.");
  }
}
void acknowledgeCommand(long id, bool ok) {
  HTTPClient http;
  String url = String(API_BASE) + "/commands";
  http.begin(url);
  http.addHeader("Content-Type","application/json");
  StaticJsonDocument<128> d;
  d["command_id"]=id; d["status"]= ok ? "ack":"error";
  String p; serializeJson(d,p);
  http.PATCH(p);
  http.end();
}

void checkCommands() {
  Serial.println("DEBUG: Entering checkCommands()..."); // <<< ADDED THIS LINE

  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("DEBUG: WiFi not connected, skipping command check."); // <<< ADDED THIS LINE
    return; // Exit if WiFi is not connected
  }

  Serial.println("DEBUG: WiFi connected, proceeding with command check."); // <<< ADDED THIS LINE

  HTTPClient http;
  String url = String(API_BASE) + "/commands?device_id=" + DEVICE_ID + "&status=pending";
  Serial.printf("DEBUG: Command check URL: %s\n", url.c_str()); // <<< ADDED THIS LINE

  http.begin(url);
  int code = http.GET();
  Serial.printf("DEBUG: Command check GET request returned HTTP %d\n", code); // <<< ADDED THIS LINE

  if (code == 200) {
    Serial.println("DEBUG: Received HTTP 200, parsing commands..."); // <<< ADDED THIS LINE
    StaticJsonDocument<1024> doc;
    // Use a temporary variable for http.getString() for easier debugging if needed
    String responsePayload = http.getString();
    Serial.printf("DEBUG: Response payload: %s\n", responsePayload.c_str()); // <<< ADDED THIS LINE (Optional, can be long)

    DeserializationError error = deserializeJson(doc, responsePayload);

    if (error) {
       Serial.print("DEBUG: deserializeJson() failed: ");
       Serial.println(error.f_str()); // <<< ADDED ERROR HANDLING
       http.end();
       return;
    }


    JsonArray cmds = doc.as<JsonArray>();
    if (cmds.size() > 0) { // <<< ADDED CHECK if any commands were received
        Serial.printf("DEBUG: Found %d pending command(s).\n", cmds.size());
        for (JsonObject c : cmds) {
          long id = c["id"];
          JsonObject command = c["command"];
          Serial.printf("Executing cmd %ld\n", id); // Original log
          executeCommand(command);
          acknowledgeCommand(id, true); // Assuming success for now
        }
    } else {
        Serial.println("DEBUG: No pending commands found."); // <<< ADDED THIS LINE
    }
  } else {
    // Log if the GET request failed for reasons other than no commands (e.g., 404, 500)
    Serial.printf("DEBUG: Command check GET request failed with code %d\n", code); // <<< ADDED THIS LINE
  }
  http.end();
}

/* ============================================================
   SETUP + LOOP
   ============================================================ */
void setup() {
  Serial.begin(115200);
  pinMode(LEDPIN,OUTPUT);
  pinMode(FANPIN1,OUTPUT);
  pinMode(FANPIN2,OUTPUT);
  pinMode(RELAYPIN,OUTPUT);
  pinMode(STEAMPIN,INPUT);
  pinMode(LIGHTPIN,INPUT);
  pinMode(SOILHUMIDITYPIN,INPUT);
  pinMode(WATERLEVELPIN,INPUT);
  myservo.attach(SERVOPIN);
  myservo.write(180);

  WiFi.begin(SSID,PASS);
  Serial.print("Connecting");
  while (WiFi.status()!=WL_CONNECTED){delay(500);Serial.print(".");}
  Serial.println("\nConnected. IP: "+WiFi.localIP().toString());

  lcd.init(); lcd.backlight();
  lcd.clear(); lcd.setCursor(0,0); lcd.print("IP:");
  lcd.setCursor(0,1); lcd.print(WiFi.localIP());

  server.on("/",HTTP_GET,[](AsyncWebServerRequest *req){req->send(200,"text/html",index_html);});
  server.on("/dht",HTTP_GET,[](AsyncWebServerRequest *req){req->send(200,"text/plain",Merge_Data().c_str());});
  server.on("/set",HTTP_GET,Config_Callback);
  server.onNotFound([](AsyncWebServerRequest *r){r->send(404,"text/plain","Not Found");});
  server.begin();
}

void loop() {
  unsigned long now = millis();
  if (now - lastSensorSend >= sensorInterval) {
    sendSensorData();
    lastSensorSend = now;
  }
  if (now - lastCommandCheck >= commandInterval) {
    Serial.printf("DEBUG: Time condition met for command check. Now: %lu, LastCheck: %lu\n", now, lastCommandCheck);
    checkCommands();
    lastCommandCheck = now;
  }
}
