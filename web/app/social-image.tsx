import { ImageResponse } from "next/og";

export const SOCIAL_IMAGE_SIZE = { width: 1200, height: 630 };

export function renderSocialImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#F7F5EF",
          color: "#1F2A23",
          padding: "68px 76px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            right: -90,
            top: -110,
            width: 470,
            height: 470,
            borderRadius: 999,
            background: "#DCE8DD",
            display: "flex",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: 98,
            bottom: 64,
            width: 330,
            height: 238,
            borderRadius: 24,
            border: "2px solid #BFCDBF",
            background: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            padding: 28,
            gap: 18,
          }}
        >
          <div style={{ display: "flex", color: "#687169", fontSize: 18 }}>ANFRAGE → NÄCHSTER SCHRITT</div>
          {[
            ["Kontakt", "erfasst"],
            ["Anliegen", "strukturiert"],
            ["Übergabe", "vorbereitet"],
          ].map(([label, value]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #DDDCD3", paddingTop: 12, fontSize: 20 }}>
              <span style={{ color: "#687169" }}>{label}</span>
              <span style={{ color: "#2E6246", fontWeight: 700 }}>{value}</span>
            </div>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", position: "relative", width: 720 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14, fontSize: 24, fontWeight: 800, letterSpacing: 3 }}>
            <span style={{ display: "flex", width: 16, height: 16, borderRadius: 4, background: "#2E6246" }} />
            BASEMODUL
          </div>
          <h1 style={{ display: "flex", margin: "86px 0 0", fontSize: 68, lineHeight: 1.08, letterSpacing: -3, fontWeight: 800 }}>
            Aus Anfragen werden klare nächste Schritte.
          </h1>
          <p style={{ display: "flex", margin: "30px 0 0", maxWidth: 690, color: "#687169", fontSize: 27, lineHeight: 1.45 }}>
            Telefon, WhatsApp, Web und Fotos strukturiert aufnehmen und an das Team übergeben.
          </p>
          <div style={{ display: "flex", marginTop: "auto", color: "#2E6246", fontSize: 20, fontWeight: 700 }}>
            basemodul.de · Ein Produkt von AGENTEQ
          </div>
        </div>
      </div>
    ),
    SOCIAL_IMAGE_SIZE,
  );
}
