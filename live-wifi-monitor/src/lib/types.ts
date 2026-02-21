export type Severity = "low" | "medium" | "high" | "critical";
export type ThreatType = 
  | "Rogue AP" | "MAC Spoofing" | "Evil Twin" | "Deauth Attack"
  | "MITM Attack" | "Packet Injection" | "Unauthorized Access" | "Signal Jamming";

export interface ThreatEntry {
  id: string;
  deviceName: string;
  macAddress: string;
  signalStrength: number;
  threatType: ThreatType;
  severity: Severity;
  timestamp: Date;
  channel: number;
  ssid: string;
}

export interface Device {
  id: string;
  name: string;
  macAddress: string;
  signalStrength: number;
  status: "safe" | "suspicious" | "compromised";
  lastSeen: Date;
  ipAddress: string;
}
