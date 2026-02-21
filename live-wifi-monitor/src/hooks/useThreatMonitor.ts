import { useState, useEffect, useCallback } from "react";
import { ThreatEntry, Device, Severity, ThreatType } from "@/lib/types";
import { generateThreat, generateDevices, generateThreatHistory, generateThreatTypeDistribution } from "@/lib/threatData";

export function useThreatMonitor() {
  const [threats, setThreats] = useState<ThreatEntry[]>([]);
  const [devices, setDevices] = useState<Device[]>(() => generateDevices(12));
  const [historyData, setHistoryData] = useState(() => generateThreatHistory(12));
  const [distributionData] = useState(() => generateThreatTypeDistribution());
  const [isScanning, setIsScanning] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<Severity | "all">("all");
  const [filterType, setFilterType] = useState<ThreatType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    // Seed initial threats
    const initial = Array.from({ length: 15 }, generateThreat);
    setThreats(initial);
  }, []);

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      const newThreat = generateThreat();
      setThreats(prev => [newThreat, ...prev].slice(0, 100));
    }, 3000);
    return () => clearInterval(interval);
  }, [isScanning]);

  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setDevices(generateDevices(12));
    }, 8000);
    return () => clearInterval(interval);
  }, [isScanning]);

  const filteredThreats = threats.filter(t => {
    if (filterSeverity !== "all" && t.severity !== filterSeverity) return false;
    if (filterType !== "all" && t.threatType !== filterType) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return t.deviceName.toLowerCase().includes(q) || t.macAddress.toLowerCase().includes(q) || t.ssid.toLowerCase().includes(q);
    }
    return true;
  });

  const stats = {
    totalThreats: threats.length,
    criticalCount: threats.filter(t => t.severity === "critical").length,
    highCount: threats.filter(t => t.severity === "high").length,
    activeDevices: devices.length,
    compromisedDevices: devices.filter(d => d.status === "compromised").length,
  };

  const toggleScanning = useCallback(() => setIsScanning(prev => !prev), []);

  const exportLogs = useCallback(() => {
    const csv = [
      "ID,Device,MAC,Signal,Threat,Severity,Timestamp,Channel,SSID",
      ...threats.map(t =>
        `${t.id},${t.deviceName},${t.macAddress},${t.signalStrength},${t.threatType},${t.severity},${t.timestamp.toISOString()},${t.channel},${t.ssid}`
      )
    ].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `threat-logs-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }, [threats]);

  return {
    threats: filteredThreats,
    allThreats: threats,
    devices,
    historyData,
    distributionData,
    isScanning,
    filterSeverity,
    setFilterSeverity,
    filterType,
    setFilterType,
    searchQuery,
    setSearchQuery,
    stats,
    toggleScanning,
    exportLogs,
  };
}
