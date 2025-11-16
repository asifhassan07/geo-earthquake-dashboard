import type { Earthquake } from "../../types/earthquake";
import useSelectionStore from "../../store/useSelectionStore";


interface Props {
  data: Earthquake[];
}
export default function DetailsDrawer({ data }: Props) {
  const selectedId = useSelectionStore((state) => state.selectedId);
  const setSelectedId = useSelectionStore((state) => state.setSelectedId);

  if (!selectedId) return null;

  const quake = data.find((q) => q.id === selectedId);
  if (!quake) return null;

  return (
    <div
      style={{
        marginTop: "16px",
        borderRadius: "10px",
        border: "1px solid #1f2937",
        backgroundColor: "#020617",
        padding: "12px 14px",
        boxShadow: "0 18px 40px rgba(0,0,0,0.5)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          marginBottom: "8px",
        }}
      >
        <div>
          <div
            style={{
              fontSize: "13px",
              opacity: 0.7,
              marginBottom: "2px",
            }}
          >
            Selected earthquake
          </div>
          <h3
            style={{
              margin: 0,
              fontSize: "16px",
              fontWeight: 600,
            }}
          >
            {quake.place}
          </h3>
        </div>

        <button
          type="button"
          onClick={() => setSelectedId(null)}
          style={{
            border: "1px solid #4b5563",
            borderRadius: "999px",
            padding: "2px 8px",
            fontSize: "11px",
            backgroundColor: "#020617",
            color: "#9ca3af",
            cursor: "pointer",
          }}
        >
          Clear
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: "16px",
          fontSize: "12px",
        }}
      >
        <InfoItem label="ID" value={quake.id} mono />
        <InfoItem
          label="Magnitude"
          value={quake.mag.toFixed(1)}
          badgeColor={getColorForMagnitude(quake.mag)}
        />
        <InfoItem
          label="Depth"
          value={`${quake.depth.toFixed(1)} km`}
        />
        <InfoItem
          label="Time"
          value={new Date(quake.time).toLocaleString()}
        />
        <InfoItem
          label="Latitude"
          value={quake.latitude.toFixed(3)}
        />
        <InfoItem
          label="Longitude"
          value={quake.longitude.toFixed(3)}
        />
      </div>
    </div>
  );
}

interface InfoItemProps {
  label: string;
  value: string | number;
  mono?: boolean;
  badgeColor?: string;
}

function InfoItem({ label, value, mono, badgeColor }: InfoItemProps) {
  const isBadge = typeof badgeColor === "string";

  return (
    <div style={{ minWidth: "120px" }}>
      <div
        style={{
          fontSize: "11px",
          opacity: 0.7,
          marginBottom: "2px",
        }}
      >
        {label}
      </div>
      {isBadge ? (
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "3px 8px",
            borderRadius: "999px",
            fontSize: "11px",
            fontWeight: 600,
            backgroundColor: badgeColor,
            color: "#020617",
          }}
        >
          {value}
        </span>
      ) : (
        <div
          style={{
            fontFamily: mono ? "monospace" : "inherit",
          }}
        >
          {value}
        </div>
      )}
    </div>
  );
}

function getColorForMagnitude(mag: number): string {
  if (mag < 2) return "#60a5fa";
  if (mag < 4) return "#22c55e";
  if (mag < 6) return "#facc15";
  return "#ef4444";
}
