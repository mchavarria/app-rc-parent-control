import type { ConnectionStatus } from "@/lib/sessionTypes";

const labels: Record<ConnectionStatus, string> = {
  idle: "Waiting",
  connecting: "Connecting",
  connected: "Live",
  reconnecting: "Reconnecting",
  failed: "Failed"
};

export function ViewerStatus({ status }: { status: ConnectionStatus }) {
  return <span className="status">{labels[status]}</span>;
}
