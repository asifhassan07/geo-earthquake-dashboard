import Papa from "papaparse";
import type { ParseResult } from "papaparse";
import type { Earthquake } from "../types/earthquake";

const CSV_URL =
  "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.csv";

// Raw CSV row shape (before we convert to our Earthquake type)
interface RawEarthquakeRow {
  id?: string;
  time?: string | number;
  place?: string;
  mag?: number | string;
  depth?: number | string;
  latitude?: number | string;
  longitude?: number | string;
}

export async function fetchEarthquakeData(): Promise<Earthquake[]> {
  const response = await fetch(CSV_URL);
  if (!response.ok) {
    throw new Error("Failed to load earthquake dataset.");
  }

  const csvText = await response.text();

  return new Promise<Earthquake[]>((resolve) => {
    Papa.parse<RawEarthquakeRow>(csvText, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete(results: ParseResult<RawEarthquakeRow>) {
        // We just log parse errors instead of failing the whole load
        if (results.errors && results.errors.length > 0) {
          console.warn("PapaParse reported errors:", results.errors);
        }

        const rows = results.data ?? [];

        const quakes: Earthquake[] = rows
          .filter((row): row is RawEarthquakeRow => !!row && !!row.id)
          .map((row) => {
            const timeValue =
              typeof row.time === "number"
                ? row.time
                : row.time
                ? new Date(row.time).getTime()
                : Date.now();

            return {
              id: row.id as string,
              time: timeValue,
              place: row.place ?? "Unknown",
              mag: Number(row.mag ?? 0),
              depth: Number(row.depth ?? 0),
              latitude: Number(row.latitude ?? 0),
              longitude: Number(row.longitude ?? 0),
            };
          });

        resolve(quakes);
      },
    });
  });
}
