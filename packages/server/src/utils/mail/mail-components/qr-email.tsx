import React from "react";

interface QREmailProps {
  recipientEmail: string;
  message?: string;
}

export const QREmail: React.FC<QREmailProps> = (props) => {
  const recipientEmail = props.recipientEmail;
  const message =
    props.message ??
    "Love You! Hope you enjoy your trip to the float spa! - Jacob";

  return (
    <div
      style={{
        backgroundColor: "#c41e3a",
        background:
          "linear-gradient(135deg, #c41e3a 0%, #8b0000 50%, #006400 100%)",
        width: "100%",
        maxWidth: "40rem",
        height: "100%",
        margin: "auto",
        borderRadius: "15px",
        opacity: "1",
        boxShadow: "0px 8px 16px rgba(0, 0, 0, 0.3)",
        padding: "20px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Snowflake decorations */}
      <div
        style={{
          position: "absolute",
          top: "10px",
          left: "10%",
          fontSize: "20px",
          color: "rgba(255, 255, 255, 0.6)",
        }}
      >
        ❄️
      </div>
      <div
        style={{
          position: "absolute",
          top: "30px",
          right: "15%",
          fontSize: "18px",
          color: "rgba(255, 255, 255, 0.5)",
        }}
      >
        ❄️
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "50px",
          left: "20%",
          fontSize: "16px",
          color: "rgba(255, 255, 255, 0.4)",
        }}
      >
        ❄️
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "80px",
          right: "10%",
          fontSize: "22px",
          color: "rgba(255, 255, 255, 0.5)",
        }}
      >
        ❄️
      </div>

      {/* Ornament decorations */}
      <div
        style={{
          position: "absolute",
          top: "20px",
          right: "10%",
          fontSize: "24px",
        }}
      >
        🎄
      </div>
      <div
        style={{
          position: "absolute",
          top: "15px",
          left: "5%",
          fontSize: "20px",
        }}
      >
        🎁
      </div>

      <div
        style={{
          height: "100%",
          width: "90%",
          margin: "auto",
          paddingTop: "2rem",
          paddingBottom: "1rem",
          position: "relative",
          zIndex: "1",
        }}
      >
        <div
          style={{
            backgroundColor: "#ffffff",
            height: "100%",
            borderRadius: "15px",
            paddingLeft: "30px",
            paddingRight: "30px",
            paddingTop: "40px",
            paddingBottom: "40px",
            alignItems: "center",
            boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.2)",
            border: "4px solid #ffd700",
            background: "linear-gradient(to bottom, #ffffff 0%, #fff8f0 100%)",
          }}
        >
          {/* Top decorative border */}
          <div
            style={{
              textAlign: "center",
              fontSize: "28px",
              marginBottom: "20px",
              lineHeight: "1.2",
            }}
          >
            🎅 🎄 🎁
          </div>

          <div
            style={{
              width: "auto",
              borderRadius: "10px",
            }}
          >
            <div style={{ width: "100%", textAlign: "center" }}>
              <h2
                style={{
                  color: "#c41e3a",
                  marginBottom: "1.5rem",
                  fontSize: "32px",
                  fontWeight: "bold",
                  fontFamily: "Georgia, serif",
                  textShadow: "2px 2px 4px rgba(0, 0, 0, 0.1)",
                  letterSpacing: "1px",
                }}
              >
                🎄 Merry Christmas! 🎄
              </h2>
              <div
                style={{
                  width: "80%",
                  height: "3px",
                  background:
                    "linear-gradient(to right, #c41e3a, #ffd700, #006400, #ffd700, #c41e3a)",
                  margin: "0 auto 25px",
                  borderRadius: "2px",
                }}
              />
              <p
                style={{
                  color: "#1a1a1a",
                  lineHeight: "1.8",
                  marginBottom: "1.5rem",
                  fontSize: "18px",
                  fontFamily: "Arial, sans-serif",
                }}
              >
                {message}
              </p>
              <div
                style={{
                  marginTop: "30px",
                  fontSize: "40px",
                  lineHeight: "1.5",
                }}
              >
                🎁 🎄 ⛄ 🎅 🦌
              </div>
            </div>
          </div>
        </div>
        <div
          style={{
            height: "fit-content",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
            color: "#ffffff",
            fontSize: "0.75rem",
            marginTop: "1.5rem",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.3)",
          }}
        >
          <p>
            This email was sent to{" "}
            <a
              rel="nofollow"
              style={{ color: "#ffd700", textDecoration: "underline" }}
            >
              {recipientEmail}
            </a>
          </p>
          <p style={{ marginTop: "8px", fontSize: "20px" }}>⛄ 🎄 ⛄</p>
        </div>
      </div>
    </div>
  );
};
