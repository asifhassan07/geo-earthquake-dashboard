import type React from "react";
import type { Earthquake } from "../../types/earthquake";
import useSelectionStore from "../../store/useSelectionStore";

interface Props {
  data: Earthquake[];
}

const headerCellStyle: React.CSSProperties = {
  padding: "8px 10px",
  borderBottom: "1px solid #1f2937",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "12px",
  backgroundColor: "#020617",
  position: "sticky",
  top: 0,
  zIndex: 1,
};

const bodyCellStyle: React.CSSProperties = {
  padding: "6px 10px",
  borderBottom: "1px solid #111827",
  fontSize: "12px",
  verticalAlign: "middle",
};

export default function DataTable({ data }: Props) {
  const selectedId = useSelectionStore((state) => state.selectedId);
  const hoverId = useSelectionStore((state) => state.hoverId);
  const setSelectedId = useSelectionStore((state) => state.setSelectedId);
  const setHoverId = useSelectionStore((state) => state.setHoverId);

  const visibleRows = data.slice(0, 200);

  return (
    <div style={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Title row */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginBottom: "8px",
        }}
      >
        <h2
          style={{
            fontSize: "18px",
            fontWeight: 600,
            margin: 0,
          }}
        >
          Earthquake Data Table
        </h2>
        <span
          style={{
            fontSize: "11px",
            opacity: 0.7,
          }}
        >
          Showing {visibleRows.length.toLocaleString()} of{" "}
          {data.length.toLocaleString()} rows
        </span>
      </div>

      {/* Scrollable table container */}
      <div
        style={{
          flex: 1,
          overflow: "auto",
          borderRadius: "8px",
          border: "1px solid #111827",
          background:
            "radial-gradient(circle at top left, #020617, #020617 40%, #020617 100%)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr>
              <th style={headerCellStyle}>ID</th>
              <th style={headerCellStyle}>Place</th>
              <th style={headerCellStyle}>Mag</th>
              <th style={headerCellStyle}>Depth (km)</th>
              <th style={headerCellStyle}>Time</th>
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((q, index) => {
              const isSelected = q.id === selectedId;
              const isHovered = q.id === hoverId;
              const stripeColor = index % 2 === 0 ? "#020617" : "#020819";

              let backgroundColor = stripeColor;
              if (isSelected) backgroundColor = "#4b5563";
              else if (isHovered) backgroundColor = "#1f2937";

              return (
                <tr
                  key={q.id}
                  onClick={() => setSelectedId(q.id)}
                  onMouseEnter={() => setHoverId(q.id)}
                  onMouseLeave={() => setHoverId(null)}
                  style={{
                    backgroundColor,
                    cursor: "pointer",
                    transition: "background-color 0.12s ease-out",
                  }}
                >
                  <td style={{ ...bodyCellStyle, fontFamily: "monospace" }}>
                    {q.id}
                  </td>

                  <td style={{ ...bodyCellStyle, maxWidth: "260px" }}>
                    <span
                      style={{
                        display: "inline-block",
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                      title={q.place}
                    >
                      {q.place}
                    </span>
                  </td>

                  {/* Magnitude pill with same color scale as chart */}
                  <td style={bodyCellStyle}>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        justifyContent: "center",
                        minWidth: "42px",
                        padding: "2px 6px",
                        borderRadius: "999px",
                        fontSize: "11px",
                        fontWeight: 600,
                        backgroundColor: getColorForMagnitude(q.mag),
                        color: "#020617",
                      }}
                    >
                      {q.mag.toFixed(1)}
                    </span>
                  </td>

                  <td style={bodyCellStyle}>{q.depth.toFixed(1)}</td>

                  <td style={bodyCellStyle}>
                    {new Date(q.time).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <p
        style={{
          fontSize: "11px",
          opacity: 0.65,
          marginTop: "6px",
        }}
      >
        Tip: Click a row to highlight it on the scatter plot. Hover over chart
        points to see the matching row highlighted here. Use the search and
        filters above to focus on specific events.
      </p>
    </div>
  );
}

function getColorForMagnitude(mag: number): string {
  if (mag < 2) return "#60a5fa"; // blue
  if (mag < 4) return "#22c55e"; // green
  if (mag < 6) return "#facc15"; // yellow
  return "#ef4444"; // red
}
