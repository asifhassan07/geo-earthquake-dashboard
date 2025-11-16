import { useState } from "react";
import type React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import type { Earthquake } from "../../types/earthquake";
import useSelectionStore from "../../store/useSelectionStore";

interface Props {
  data: Earthquake[];
}

type NumericField = "longitude" | "latitude" | "mag" | "depth";

const FIELD_LABELS: Record<NumericField, string> = {
  longitude: "Longitude (°)",
  latitude: "Latitude (°)",
  mag: "Magnitude",
  depth: "Depth (km)",
};

export default function ChartPanel({ data }: Props) {
  const selectedId = useSelectionStore((state) => state.selectedId);
  const setSelectedId = useSelectionStore((state) => state.setSelectedId);
  const setHoverId = useSelectionStore((state) => state.setHoverId);

  const [xField, setXField] = useState<NumericField>("longitude");
  const [yField, setYField] = useState<NumericField>("latitude");

  const selectedPoint = selectedId
    ? data.find((q) => q.id === selectedId) ?? null
    : null;

  const handlePointClick = (entry: unknown) => {
    const point = entry as { payload?: Earthquake };
    const quake = point.payload;
    if (quake && quake.id) {
      setSelectedId(quake.id);
    }
  };

  const handlePointHover = (entry: unknown | null) => {
    if (!entry) {
      setHoverId(null);
      return;
    }
    const point = entry as { payload?: Earthquake };
    const quake = point.payload;
    if (quake && quake.id) {
      setHoverId(quake.id);
    } else {
      setHoverId(null);
    }
  };

  const handleXChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setXField(event.target.value as NumericField);
  };

  const handleYChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setYField(event.target.value as NumericField);
  };

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Title + controls */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "12px",
          alignItems: "center",
          marginBottom: "8px",
          flexWrap: "wrap",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Earthquake Scatter Plot
        </h2>

        <div
          style={{
            display: "flex",
            gap: "8px",
            fontSize: "13px",
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <label>
            X axis:&nbsp;
            <select
              value={xField}
              onChange={handleXChange}
              style={selectStyle}
            >
              {(Object.keys(FIELD_LABELS) as NumericField[]).map((field) => (
                <option key={field} value={field}>
                  {FIELD_LABELS[field]}
                </option>
              ))}
            </select>
          </label>

          <label>
            Y axis:&nbsp;
            <select
              value={yField}
              onChange={handleYChange}
              style={selectStyle}
            >
              {(Object.keys(FIELD_LABELS) as NumericField[]).map((field) => (
                <option key={field} value={field}>
                  {FIELD_LABELS[field]}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {/* Chart */}
      <div style={{ flex: 1 }}>
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart>
            <XAxis
              dataKey={xField}
              type="number"
              name={FIELD_LABELS[xField]}
              stroke="#9ca3af"
            />
            <YAxis
              dataKey={yField}
              type="number"
              name={FIELD_LABELS[yField]}
              stroke="#9ca3af"
            />
            <Tooltip cursor={{ stroke: "red", strokeWidth: 2 }} />

            {/* All points with magnitude-based colors */}
            <Scatter
              data={data}
              onClick={handlePointClick}
              onMouseOver={handlePointHover}
              onMouseOut={() => handlePointHover(null)}
            >
              {data.map((q) => (
                <Cell key={q.id} fill={getColorForMagnitude(q.mag)} />
              ))}
            </Scatter>

            {/* Highlighted selected point overlay */}
            {selectedPoint && (
              <Scatter data={[selectedPoint]} fill="#f97316" shape="circle" />
            )}
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      {/* Simple legend */}
      <div
        style={{
          marginTop: "8px",
          fontSize: "11px",
          opacity: 0.7,
          display: "flex",
          gap: "12px",
          flexWrap: "wrap",
        }}
      >
        <LegendItem color="#60a5fa" label="Mag < 2.0" />
        <LegendItem color="#22c55e" label="2.0 – 3.9" />
        <LegendItem color="#facc15" label="4.0 – 5.9" />
        <LegendItem color="#ef4444" label="≥ 6.0" />
      </div>
    </div>
  );
}

function LegendItem(props: { color: string; label: string }) {
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: "4px" }}>
      <span
        style={{
          width: "10px",
          height: "10px",
          borderRadius: "999px",
          backgroundColor: props.color,
        }}
      />
      {props.label}
    </span>
  );
}

function getColorForMagnitude(mag: number): string {
  if (mag < 2) return "#60a5fa"; // blue
  if (mag < 4) return "#22c55e"; // green
  if (mag < 6) return "#facc15"; // yellow
  return "#ef4444"; // red
}

const selectStyle: React.CSSProperties = {
  backgroundColor: "#020617",
  color: "#e5e7eb",
  border: "1px solid #4b5563",
  borderRadius: "4px",
  padding: "2px 6px",
  fontSize: "13px",
  outline: "none",
};
