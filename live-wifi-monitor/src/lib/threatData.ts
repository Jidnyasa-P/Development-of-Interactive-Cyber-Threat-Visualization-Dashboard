import { ThreatEntry, Device, ThreatType, Severity } from "./types";

const DEVICE_NAMES = [
  "iPhone-14-Pro", "Galaxy-S23", "MacBook-Air", "Windows-PC", "iPad-Mini",
  "Pixel-7", "OnePlus-11", "Surface-Pro", "Chromebook", "Echo-Dot",
  "Ring-Doorbell", "Nest-Thermostat", "SmartTV-LG", "PS5-Console", "Unknown-Device"
];

const THREAT_TYPES: ThreatType[] = [
  "Rogue AP", "MAC Spoofing", "Evil Twin", "Deauth Attack",
  "MITM Attack", "Packet Injection", "Unauthorized Access", "Signal Jamming"
];

const SEVERITIES: Severity[] = ["low", "medium", "high", "critical"];

function randomMac(): string {
  return Array.from({ length: 6 }, () =>
    Math.floor(Math.random() * 256).toString(16).padStart(2, "0")
  ).join(":").toUpperCase();
}

function randomSignal(): number {
  return -(Math.floor(Math.random() * 60) + 30);
}

const macPool = Array.from({ length: 20 }, randomMac);

let threatId = 0;

export function generateThreat(): ThreatEntry {
  const severity = SEVERITIES[Math.floor(Math.random() * SEVERITIES.length)];
  const macIndex = Math.floor(Math.random() * macPool.length);
  return {
    id: `threat-${++threatId}`,
    deviceName: DEVICE_NAMES[Math.floor(Math.random() * DEVICE_NAMES.length)],
    macAddress: macPool[macIndex],
    signalStrength: randomSignal(),
    threatType: THREAT_TYPES[Math.floor(Math.random() * THREAT_TYPES.length)],
    severity,
    timestamp: new Date(),
    channel: Math.floor(Math.random() * 13) + 1,
    ssid: ["HomeNet", "CorpWiFi", "Guest-5G", "FreeWiFi", "SecureNet"][Math.floor(Math.random() * 5)],
  };
}

export function generateDevices(count: number): Device[] {
  return Array.from({ length: count }, (_, i) => ({
    id: `dev-${i}`,
    name: DEVICE_NAMES[i % DEVICE_NAMES.length],
    macAddress: macPool[i % macPool.length],
    signalStrength: randomSignal(),
    status: (["safe", "suspicious", "compromised"] as const)[Math.floor(Math.random() * 3)],
    lastSeen: new Date(Date.now() - Math.random() * 3600000),
    ipAddress: `192.168.1.${Math.floor(Math.random() * 254) + 1}`,
  }));
}

export function generateThreatHistory(hours: number): { time: string; high: number; medium: number; low: number }[] {
  const data = [];
  for (let i = hours; i >= 0; i--) {
    const time = new Date(Date.now() - i * 3600000);
    data.push({
      time: time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      high: Math.floor(Math.random() * 8),
      medium: Math.floor(Math.random() * 15) + 2,
      low: Math.floor(Math.random() * 20) + 5,
    });
  }
  return data;
}

export function generateThreatTypeDistribution(): { name: string; value: number }[] {
  return THREAT_TYPES.map(t => ({ name: t, value: Math.floor(Math.random() * 30) + 5 }));
}
