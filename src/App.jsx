import React, { useState, useEffect } from "react";

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

const generateRandomCode = (length = 4) => {
  let code = "";
  for (let i = 0; i < length; i++) {
    code += BASE62.charAt(Math.floor(Math.random() * BASE62.length));
  }
  return code;
};

const getTimeRemaining = (endTime) => {
  const total = Date.parse(endTime) - Date.now();
  const minutes = Math.floor((total / 1000 / 60) % 60);
  const seconds = Math.floor((total / 1000) % 60);
  return {
    total,
    minutes,
    seconds,
  };
};

const Countdown = ({ expiresAt }) => {
  const [timeLeft, setTimeLeft] = useState(getTimeRemaining(expiresAt));

  useEffect(() => {
    const interval = setInterval(() => {
      const newTime = getTimeRemaining(expiresAt);
      setTimeLeft(newTime);
      if (newTime.total <= 0) clearInterval(interval);
    }, 1000);
    return () => clearInterval(interval);
  }, [expiresAt]);

  if (timeLeft.total <= 0)
    return <span style={{ color: "#f44336", fontWeight: "bold" }}>Expired</span>;

  return (
    <span>
      {String(timeLeft.minutes).padStart(2, "0")}:
      {String(timeLeft.seconds).padStart(2, "0")}
    </span>
  );
};

const App = () => {
  const [url, setUrl] = useState("");
  const [shortLinks, setShortLinks] = useState([]);

  const CUSTOM_DOMAIN = window.location.origin; // This uses your current domain (localhost or deployed)

  const handleShorten = () => {
    const trimmedUrl = url.trim();
    if (!trimmedUrl) return;

    let shortCode;
    do {
      shortCode = generateRandomCode(4);
    } while (shortLinks.some((link) => link.shortCode === shortCode));

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000); // expires in 30 minutes

    const newLink = {
      original: trimmedUrl,
      short: `${CUSTOM_DOMAIN}/${shortCode}`,
      shortCode,
      expiresAt,
    };

    setShortLinks([newLink, ...shortLinks]);
    setUrl("");
  };

  const styles = {
    app: {
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      background: "linear-gradient(to right, #0f2027, #203a43, #2c5364)",
      color: "#f5f5f5",
      minHeight: "100vh",
      paddingBottom: "60px",
      paddingTop: "20px",
    },
    navbar: {
      padding: "20px",
      textAlign: "center",
      fontSize: "2rem",
      backgroundColor: "#111",
      borderBottom: "1px solid #444",
      color: "#90caf9",
      fontWeight: "bold",
      letterSpacing: "1px",
    },
    hero: {
      textAlign: "center",
      padding: "40px 20px",
    },
    heroTitle: {
      fontSize: "2.4rem",
      marginBottom: "10px",
    },
    heroDesc: {
      color: "#ccc",
      fontSize: "1.1rem",
    },
    container: {
      maxWidth: "800px",
      margin: "0 auto",
      padding: "0 20px",
    },
    section: {
      marginTop: "30px",
      padding: "30px",
      borderRadius: "15px",
      background: "rgba(255, 255, 255, 0.05)",
      backdropFilter: "blur(8px)",
      boxShadow: "0 4px 20px rgba(0, 0, 0, 0.3)",
    },
    inputGroup: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      padding: "12px",
      fontSize: "1rem",
      borderRadius: "8px",
      border: "1px solid #333",
      backgroundColor: "#1e1e1e",
      color: "#eee",
    },
    button: {
      padding: "12px",
      borderRadius: "8px",
      backgroundColor: "#3949ab",
      color: "#fff",
      fontWeight: "bold",
      fontSize: "1rem",
      border: "none",
      cursor: "pointer",
      transition: "0.3s",
    },
    linkCard: {
      marginTop: "20px",
      padding: "20px",
      borderRadius: "12px",
      background: "rgba(0,0,0,0.4)",
      borderLeft: "5px solid #3949ab",
      boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
    },
    link: {
      color: "#81d4fa",
      textDecoration: "none",
      fontWeight: "bold",
    },
    smallText: {
      fontSize: "0.85rem",
      color: "#bbb",
      wordBreak: "break-word",
    },
    footer: {
      marginTop: "40px",
      padding: "25px 10px",
      textAlign: "center",
      color: "#999",
      borderTop: "1px solid #2a2a2a",
      fontSize: "0.9rem",
    },
  };

  return (
    <div style={styles.app}>
      <header style={styles.navbar}>🔗 ShortLinker Pro</header>

      <section style={styles.hero}>
        <h2 style={styles.heroTitle}>Instant URL Shortening with Live Timer</h2>
        <p style={styles.heroDesc}>
          Create shareable links that expire in 30 minutes. No sign-up, no clutter.
        </p>
      </section>

      <div style={styles.container}>
        <section style={styles.section}>
          <div style={styles.inputGroup}>
            <input
              type="text"
              value={url}
              placeholder="Paste a long URL here..."
              onChange={(e) => setUrl(e.target.value)}
              style={styles.input}
            />
            <button style={styles.button} onClick={handleShorten}>
              Shorten URL
            </button>
          </div>
        </section>

        {shortLinks.length > 0 && (
          <section style={styles.section}>
            <h3>📋 Shortened Links with Countdown</h3>
            {shortLinks.map((link, i) => (
              <div key={i} style={styles.linkCard}>
                <p>
                  <strong>Original:</strong>
                  <br />
                  <a
                    href={link.original}
                    target="_blank"
                    rel="noreferrer"
                    style={styles.smallText}
                  >
                    {link.original}
                  </a>
                </p>
                <p>
                  <strong>Short URL:</strong>{" "}
                  <a href={link.short} target="_blank" rel="noreferrer" style={styles.link}>
                    {/* Show short/ + code */}
                    short/{link.shortCode}
                  </a>
                </p>
                <p>
                  ⏰ Expires in: <Countdown expiresAt={link.expiresAt} />
                </p>
              </div>
            ))}
          </section>
        )}
      </div>

      <footer style={styles.footer}>
        &copy; {new Date().getFullYear()} ShortLinker • All links expire 30 minutes after creation.
      </footer>
    </div>
  );
};

export default App;
