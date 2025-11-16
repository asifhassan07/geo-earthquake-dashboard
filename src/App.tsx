import { useEffect, useState } from "react";
import type React from "react";
import { fetchEarthquakeData } from "./utils/parseEarthquakeCsv";
import type { Earthquake } from "./types/earthquake";
import ChartPanel from "./components/charts/ChartPanel";
import DataTable from "./components/table/DataTable";
import DetailsDrawer from "./components/details/DetailsDrawer";


function App() {
  const [data, setData] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // UI filters
  const [searchTerm, setSearchTerm] = useState("");
  const [minMag, setMinMag] = useState<number>(0);
  const [minDepth, setMinDepth] = useState<number>(0); // NEW

  useEffect(() => {
    (async () => {
      try {
        const quakes = await fetchEarthquakeData();
        setData(quakes);
        console.log("Loaded quakes:", quakes);
      } catch (e) {
        const err = e as Error;
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Filtered dataset used by both chart and table
  const filteredData = data.filter((q) => {
    const matchesSearch = q.place
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesMag = Number.isNaN(minMag) ? true : q.mag >= minMag;
    const matchesDepth = Number.isNaN(minDepth) ? true : q.depth >= minDepth;

    return matchesSearch && matchesMag && matchesDepth;
  });

  // Simple stats for header cards
  const totalCount = data.length;
  const strongCount = data.filter((q) => q.mag >= 4.5).length;
  const maxMag =
    data.length > 0 ? Math.max(...data.map((q) => q.mag || 0)) : 0;

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          fontWeight: 600,
          color: "#e5e7eb",
          background: "#020617",
        }}
      >
        Loading earthquake data…
      </div>
    );
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "24px",
          color: "#ef4444",
          background: "#020617",
        }}
      >
        Error: {error}
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#020617",
        color: "#e5e7eb",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "24px 16px",
          boxSizing: "border-box",
        }}
      >
        {/* Header */}
        <header style={{ marginBottom: "16px" }}>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: 700,
              margin: 0,
            }}
          >
            Earthquake Dashboard
          </h1>
          <p
            style={{
              marginTop: "8px",
              fontSize: "13px",
              opacity: 0.7,
            }}
          >
            Use the chart and table below to explore recent global earthquakes.
          </p>
        </header>

        {/* Stats cards */}
        <section
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "16px",
            flexWrap: "wrap",
          }}
        >
          <StatsCard
            label="Total records"
            value={totalCount.toLocaleString()}
          />
          <StatsCard
            label="Strong quakes (≥ 4.5)"
            value={strongCount.toLocaleString()}
          />
          <StatsCard
            label="Max magnitude"
            value={maxMag.toFixed(1)}
          />
        </section>

        {/* Filters */}
        <section
          style={{
            display: "flex",
            gap: "16px",
            marginBottom: "16px",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          {/* Search by place */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                fontSize: "12px",
                opacity: 0.8,
                marginBottom: "4px",
              }}
            >
              Search by place
            </label>
            <input
              type="text"
              placeholder="e.g. Alaska, Japan, California..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={inputStyle}
            />
          </div>

          {/* Min magnitude */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                fontSize: "12px",
                opacity: 0.8,
                marginBottom: "4px",
              }}
            >
              Minimum magnitude
            </label>
            <input
              type="number"
              step="0.1"
              min={0}
              max={10}
              value={minMag}
              onChange={(e) => setMinMag(Number(e.target.value))}
              style={{ ...inputStyle, width: "120px" }}
            />
          </div>

          {/* Min depth slider */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <label
              style={{
                fontSize: "12px",
                opacity: 0.8,
                marginBottom: "4px",
              }}
            >
              Minimum depth (km)
            </label>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                minWidth: "220px",
              }}
            >
              <input
                type="range"
                min={0}
                max={700}
                value={minDepth}
                onChange={(e) => setMinDepth(Number(e.target.value))}
                style={{ flex: 1 }}
              />
              <span style={{ fontSize: "12px", opacity: 0.8 }}>
                {minDepth} km
              </span>
            </div>
          </div>

          <span
            style={{
              fontSize: "12px",
              opacity: 0.7,
              marginLeft: "auto",
            }}
          >
            Showing{" "}
            <strong>{filteredData.length.toLocaleString()}</strong> of{" "}
            {totalCount.toLocaleString()} records
          </span>
        </section>

        {/* Two-panel layout */}
        <div
          style={{
            display: "flex",
            gap: "16px",
            height: "calc(100vh - 230px)",
          }}
        >
          {/* Left: Chart */}
          <section
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              background:
                "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.7))",
              border: "1px solid #1f2937",
              boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            <ChartPanel data={filteredData} />
          </section>

          {/* Right: Table */}
          <section
            style={{
              flex: 1,
              padding: "12px",
              borderRadius: "10px",
              backgroundColor: "#020617",
              border: "1px solid #1f2937",
              boxShadow: "0 18px 40px rgba(0,0,0,0.4)",
              overflow: "hidden",
            }}
          >
            <DataTable data={filteredData} />
          </section>
        </div>

        {/* Details drawer (inside main container) */}
        <DetailsDrawer data={data} />
      </div>
    </div>
  );
}

interface StatsCardProps {
  label: string;
  value: string | number;
}

function StatsCard({ label, value }: StatsCardProps) {
  return (
    <div
      style={{
        flex: "0 0 auto",
        minWidth: "140px",
        padding: "10px 12px",
        borderRadius: "10px",
        backgroundColor: "#020617",
        border: "1px solid #1f2937",
      }}
    >
      <div
        style={{
          fontSize: "12px",
          opacity: 0.7,
          marginBottom: "4px",
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontSize: "18px",
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  backgroundColor: "#020617",
  color: "#e5e7eb",
  borderRadius: "6px",
  border: "1px solid #374151",
  padding: "6px 8px",
  fontSize: "13px",
  outline: "none",
};

export default App;
