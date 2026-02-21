import { Shield, Radar } from "lucide-react";
import { useThreatMonitor } from "@/hooks/useThreatMonitor";
import { StatsCards } from "@/components/dashboard/StatsCards";
import { ThreatTable } from "@/components/dashboard/ThreatTable";
import { ThreatCharts } from "@/components/dashboard/ThreatCharts";
import { DeviceList } from "@/components/dashboard/DeviceList";
import { DashboardFilters } from "@/components/dashboard/DashboardFilters";
import { NetworkTopology } from "@/components/dashboard/NetworkTopology";
import { AnalyticsPanel } from "@/components/dashboard/AnalyticsPanel";
import { IpVerification } from "@/components/dashboard/IpVerification";

const Index = () => {
  const monitor = useThreatMonitor();

  return (
    <div className="min-h-screen bg-background bg-grid">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 glow-primary">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-foreground flex items-center gap-2">
                NetGuard
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">LIVE</span>
              </h1>
              <p className="text-[10px] text-muted-foreground font-mono">WiFi Threat Detection System</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {monitor.isScanning && (
              <div className="flex items-center gap-2 text-xs text-primary font-mono">
                <Radar className="h-4 w-4 animate-spin" style={{ animationDuration: "3s" }} />
                <span className="hidden sm:inline">Monitoring Active</span>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {/* Stats */}
        <StatsCards {...monitor.stats} isScanning={monitor.isScanning} />

        {/* Network Topology */}
        <NetworkTopology devices={monitor.devices} />

        {/* Charts */}
        <ThreatCharts historyData={monitor.historyData} distributionData={monitor.distributionData} />

        {/* Filters */}
        <DashboardFilters
          searchQuery={monitor.searchQuery}
          setSearchQuery={monitor.setSearchQuery}
          filterSeverity={monitor.filterSeverity}
          setFilterSeverity={monitor.setFilterSeverity}
          filterType={monitor.filterType}
          setFilterType={monitor.setFilterType}
          isScanning={monitor.isScanning}
          toggleScanning={monitor.toggleScanning}
          exportLogs={monitor.exportLogs}
        />

        {/* Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ThreatTable threats={monitor.threats} />
          </div>
          <div>
            <DeviceList devices={monitor.devices} />
          </div>
        </div>

        {/* Advanced Analytics */}
        <AnalyticsPanel threats={monitor.allThreats} devices={monitor.devices} />

        {/* IP Verification */}
        <IpVerification devices={monitor.devices} />
      </main>
    </div>
  );
};

export default Index;
