import type { ReactNode } from "react";

interface MainLayoutProps {
  left: ReactNode;
  right: ReactNode;
}

export default function MainLayout({ left, right }: MainLayoutProps) {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        background: "#020617",
        color: "#e5e7eb",
      }}
    >
      <section
        style={{
          flex: 1,
          borderRight: "1px solid #1f2937",
          padding: "12px",
          overflow: "auto",
        }}
      >
        {left}
      </section>

      <section
        style={{
          flex: 1,
          padding: "12px",
          overflow: "auto",
        }}
      >
        {right}
      </section>
    </div>
  );
}
