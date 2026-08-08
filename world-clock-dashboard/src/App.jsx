import { useEffect, useMemo, useState } from "react";
import "./App.css";

const TIME_ZONES = [
  {
    id: "india",
    city: "Mumbai",
    country: "India",
    zone: "Asia/Kolkata",
    flag: "🇮🇳",
  },
  {
    id: "new-york",
    city: "New York",
    country: "USA",
    zone: "America/New_York",
    flag: "🇺🇸",
  },
  {
    id: "london",
    city: "London",
    country: "UK",
    zone: "Europe/London",
    flag: "🇬🇧",
  },
  {
    id: "dubai",
    city: "Dubai",
    country: "UAE",
    zone: "Asia/Dubai",
    flag: "🇦🇪",
  },
  {
    id: "singapore",
    city: "Singapore",
    country: "Singapore",
    zone: "Asia/Singapore",
    flag: "🇸🇬",
  },
  {
    id: "tokyo",
    city: "Tokyo",
    country: "Japan",
    zone: "Asia/Tokyo",
    flag: "🇯🇵",
  },
  {
    id: "sydney",
    city: "Sydney",
    country: "Australia",
    zone: "Australia/Sydney",
    flag: "🇦🇺",
  },
  {
    id: "paris",
    city: "Paris",
    country: "France",
    zone: "Europe/Paris",
    flag: "🇫🇷",
  },
  {
    id: "los-angeles",
    city: "Los Angeles",
    country: "USA",
    zone: "America/Los_Angeles",
    flag: "🇺🇸",
  },
  {
    id: "berlin",
    city: "Berlin",
    country: "Germany",
    zone: "Europe/Berlin",
    flag: "🇩🇪",
  },
];

const ACCENTS = [
  "#6366f1",
  "#8b5cf6",
  "#06b6d4",
  "#10b981",
  "#f59e0b",
  "#ef4444",
  "#ec4899",
];

function formatTime(date, zone, seconds = true) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "2-digit",
    minute: "2-digit",
    second: seconds ? "2-digit" : undefined,
    hour12: false,
  }).format(date);
}

function formatDate(date, zone) {
  return new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

function getParts(date, zone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hour12: false,
  }).formatToParts(date);

  const result = {};

  parts.forEach((part) => {
    if (part.type !== "literal") {
      result[part.type] = Number(part.value);
    }
  });

  return {
    hour: result.hour % 12,
    minute: result.minute,
    second: result.second,
  };
}

function getOffset(date, zone) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: zone,
    timeZoneName: "longOffset",
  }).formatToParts(date);

  const offset = parts.find((p) => p.type === "timeZoneName");

  return offset?.value?.replace("GMT", "UTC") || "UTC";
}

function AnalogClock({ date, zone }) {
  const { hour, minute, second } = getParts(date, zone);

  const secondAngle = second * 6;
  const minuteAngle = minute * 6 + second * 0.1;
  const hourAngle = hour * 30 + minute * 0.5;

  return (
    <div className="analog-clock">
      <div className="clock-ring">
        {Array.from({ length: 12 }).map((_, index) => (
          <span
            key={index}
            className={`clock-mark ${
              index % 3 === 0 ? "major-mark" : ""
            }`}
            style={{
              transform: `rotate(${index * 30}deg) translateY(-137px)`,
            }}
          />
        ))}

        <div
          className="clock-hand hour-hand"
          style={{ transform: `rotate(${hourAngle}deg)` }}
        />

        <div
          className="clock-hand minute-hand"
          style={{ transform: `rotate(${minuteAngle}deg)` }}
        />

        <div
          className="clock-hand second-hand"
          style={{ transform: `rotate(${secondAngle}deg)` }}
        />

        <div className="clock-center" />

        <span className="clock-number number-12">12</span>
        <span className="clock-number number-3">3</span>
        <span className="clock-number number-6">6</span>
        <span className="clock-number number-9">9</span>
      </div>
    </div>
  );
}

function DigitalClock({ date, zone }) {
  const time = formatTime(date, zone);

  const [h, m, s] = time.split(":");

  return (
    <div className="digital-clock">
      <span>{h}</span>
      <b>:</b>
      <span>{m}</span>
      <b>:</b>
      <span>{s}</span>
    </div>
  );
}

function TimeZoneCard({ location, date, onRemove, isMain }) {
  return (
    <div className={`timezone-card ${isMain ? "main-zone" : ""}`}>
      <div className="zone-header">
        <div className="country-info">
          <span className="flag">{location.flag}</span>

          <div>
            <h3>{location.city}</h3>
            <p>{location.country}</p>
          </div>
        </div>

        {!isMain && (
          <button
            className="remove-button"
            onClick={() => onRemove(location.id)}
            title="Remove timezone"
          >
            ×
          </button>
        )}
      </div>

      <DigitalClock date={date} zone={location.zone} />

      <div className="zone-date">
        {formatDate(date, location.zone)}
      </div>

      <div className="zone-footer">
        <span>{getOffset(date, location.zone)}</span>

        <span className="live-indicator">
          <i />
          LIVE
        </span>
      </div>
    </div>
  );
}

function AlarmPanel({ alarms, setAlarms }) {
  const [time, setTime] = useState("");
  const [label, setLabel] = useState("");
  const [enabled, setEnabled] = useState(true);

  const addAlarm = () => {
    if (!time) return;

    const alarm = {
      id: Date.now(),
      time,
      label: label || "Alarm",
      enabled,
      triggered: false,
    };

    setAlarms((previous) => [...previous, alarm]);

    setTime("");
    setLabel("");
  };

  const deleteAlarm = (id) => {
    setAlarms((previous) =>
      previous.filter((alarm) => alarm.id !== id)
    );
  };

  const toggleAlarm = (id) => {
    setAlarms((previous) =>
      previous.map((alarm) =>
        alarm.id === id
          ? { ...alarm, enabled: !alarm.enabled }
          : alarm
      )
    );
  };

  return (
    <section className="panel alarm-panel">
      <div className="panel-title">
        <div>
          <span className="eyebrow">SMART ALERTS</span>
          <h2>Alarm Center</h2>
        </div>

        <div className="alarm-icon">⏰</div>
      </div>

      <div className="alarm-form">
        <div className="input-group">
          <label>Time</label>
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
          />
        </div>

        <div className="input-group">
          <label>Label</label>
          <input
            type="text"
            placeholder="Morning workout"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <button className="primary-button" onClick={addAlarm}>
          + Add Alarm
        </button>
      </div>

      <div className="alarm-list">
        {alarms.length === 0 ? (
          <div className="empty-state">
            <span>🔕</span>
            <p>No alarms configured</p>
          </div>
        ) : (
          alarms.map((alarm) => (
            <div className="alarm-item" key={alarm.id}>
              <div className="alarm-time">
                {alarm.time}
              </div>

              <div className="alarm-details">
                <strong>{alarm.label}</strong>
                <small>
                  {alarm.enabled ? "Alarm enabled" : "Alarm disabled"}
                </small>
              </div>

              <button
                className={`toggle ${
                  alarm.enabled ? "active" : ""
                }`}
                onClick={() => toggleAlarm(alarm.id)}
              >
                <span />
              </button>

              <button
                className="delete-alarm"
                onClick={() => deleteAlarm(alarm.id)}
              >
                ×
              </button>
            </div>
          ))
        )}
      </div>
    </section>
  );
}

function App() {
  const [date, setDate] = useState(new Date());

  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("clock-theme") !== "light";
  });

  const [accent, setAccent] = useState(() => {
    return localStorage.getItem("clock-accent") || "#6366f1";
  });

  const [selectedZones, setSelectedZones] = useState(() => {
    const saved = localStorage.getItem("clock-zones");

    return saved
      ? JSON.parse(saved)
      : ["india", "new-york", "london", "dubai"];
  });

  const [alarms, setAlarms] = useState(() => {
    const saved = localStorage.getItem("clock-alarms");

    return saved ? JSON.parse(saved) : [];
  });

  const [showAddZone, setShowAddZone] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setDate(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "clock-theme",
      darkMode ? "dark" : "light"
    );
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("clock-accent", accent);
  }, [accent]);

  useEffect(() => {
    localStorage.setItem(
      "clock-zones",
      JSON.stringify(selectedZones)
    );
  }, [selectedZones]);

  useEffect(() => {
    localStorage.setItem(
      "clock-alarms",
      JSON.stringify(alarms)
    );
  }, [alarms]);

  const mainLocation = TIME_ZONES.find(
    (zone) => zone.id === "india"
  );

  const currentTime = formatTime(
    date,
    mainLocation.zone
  );

  const currentDate = formatDate(
    date,
    mainLocation.zone
  );

  const availableZones = useMemo(() => {
    return TIME_ZONES.filter(
      (zone) => !selectedZones.includes(zone.id)
    );
  }, [selectedZones]);

  const addZone = (id) => {
    if (!selectedZones.includes(id)) {
      setSelectedZones((previous) => [
        ...previous,
        id,
      ]);
    }

    setShowAddZone(false);
  };

  const removeZone = (id) => {
    setSelectedZones((previous) =>
      previous.filter((zoneId) => zoneId !== id)
    );
  };

  useEffect(() => {
    const checkAlarms = () => {
      const indiaTime = new Intl.DateTimeFormat(
        "en-GB",
        {
          timeZone: "Asia/Kolkata",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }
      ).format(date);

      setAlarms((previous) =>
        previous.map((alarm) => {
          if (
            alarm.enabled &&
            alarm.time === indiaTime &&
            !alarm.triggered
          ) {
            triggerAlarm(alarm);

            return {
              ...alarm,
              triggered: true,
            };
          }

          if (alarm.time !== indiaTime) {
            return {
              ...alarm,
              triggered: false,
            };
          }

          return alarm;
        })
      );
    };

    checkAlarms();
  }, [date]);

  const triggerAlarm = (alarm) => {
    try {
      const AudioContext =
        window.AudioContext ||
        window.webkitAudioContext;

      const context = new AudioContext();

      const oscillator =
        context.createOscillator();

      const gain = context.createGain();

      oscillator.connect(gain);
      gain.connect(context.destination);

      oscillator.frequency.value = 880;
      oscillator.type = "sine";

      gain.gain.setValueAtTime(
        0.3,
        context.currentTime
      );

      gain.gain.exponentialRampToValueAtTime(
        0.01,
        context.currentTime + 1
      );

      oscillator.start();
      oscillator.stop(context.currentTime + 1);

      if ("Notification" in window) {
        if (Notification.permission === "granted") {
          new Notification("World Clock Alarm", {
            body: alarm.label,
          });
        }
      }
    } catch (error) {
      console.log("Alarm sound unavailable.");
    }
  };

  const requestNotificationPermission = async () => {
    if ("Notification" in window) {
      await Notification.requestPermission();
    }
  };

  return (
    <div
      className={`app ${darkMode ? "dark" : "light"}`}
      style={{
        "--accent": accent,
        "--accent-soft": `${accent}20`,
      }}
    >
      <header className="topbar">
        <div className="brand">
          <div className="brand-icon">
            ◷
          </div>

          <div>
            <h1>Chronos</h1>
            <span>WORLD TIME SYSTEM</span>
          </div>
        </div>

        <div className="header-actions">
          <div className="status">
            <span />
            SYSTEM ONLINE
          </div>

          <button
            className="theme-button"
            onClick={() => setDarkMode(!darkMode)}
          >
            {darkMode ? "☀" : "☾"}
          </button>
        </div>
      </header>

      <main className="dashboard">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">
              PRIMARY TIMEZONE
            </span>

            <h2>
              Your global time,
              <br />
              <span>perfectly synchronized.</span>
            </h2>

            <p>
              Monitor time across the world's major
              cities with a professional real-time
              clock dashboard.
            </p>

            <div className="hero-time">
              <strong>{currentTime}</strong>
              <span>IST</span>
            </div>

            <div className="hero-date">
              {currentDate}
            </div>
          </div>

          <AnalogClock
            date={date}
            zone={mainLocation.zone}
          />
        </section>

        <section className="stats-grid">
          <div className="stat-card">
            <span>ACTIVE ZONES</span>
            <strong>{selectedZones.length}</strong>
            <small>World locations</small>
          </div>

          <div className="stat-card">
            <span>UTC OFFSET</span>
            <strong>
              {getOffset(date, mainLocation.zone)}
            </strong>
            <small>Primary timezone</small>
          </div>

          <div className="stat-card">
            <span>ALARMS</span>
            <strong>{alarms.length}</strong>
            <small>Configured alerts</small>
          </div>

          <div className="stat-card">
            <span>STATUS</span>
            <strong className="online">
              LIVE
            </strong>
            <small>Real-time synchronization</small>
          </div>
        </section>

        <section className="section-header">
          <div>
            <span className="eyebrow">
              WORLD CLOCK
            </span>

            <h2>Global Time Zones</h2>
          </div>

          <div className="zone-actions">
            <div className="accent-picker">
              {ACCENTS.map((color) => (
                <button
                  key={color}
                  className={
                    accent === color ? "selected" : ""
                  }
                  style={{ background: color }}
                  onClick={() => setAccent(color)}
                />
              ))}
            </div>

            <button
              className="primary-button"
              onClick={() =>
                setShowAddZone(!showAddZone)
              }
            >
              + Add Zone
            </button>
          </div>
        </section>

        {showAddZone && (
          <div className="zone-selector">
            <div className="selector-header">
              <strong>Add Time Zone</strong>

              <button
                onClick={() => setShowAddZone(false)}
              >
                ×
              </button>
            </div>

            <div className="zone-options">
              {availableZones.length === 0 ? (
                <p>
                  All available time zones are already
                  added.
                </p>
              ) : (
                availableZones.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => addZone(zone.id)}
                  >
                    <span>{zone.flag}</span>
                    <span>
                      <strong>{zone.city}</strong>
                      <small>
                        {zone.country}
                      </small>
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        <section className="timezone-grid">
          {selectedZones.map((zoneId) => {
            const location = TIME_ZONES.find(
              (zone) => zone.id === zoneId
            );

            if (!location) return null;

            return (
              <TimeZoneCard
                key={zoneId}
                location={location}
                date={date}
                isMain={zoneId === "india"}
                onRemove={removeZone}
              />
            );
          })}
        </section>

        <div className="bottom-grid">
          <AlarmPanel
            alarms={alarms}
            setAlarms={setAlarms}
          />

          <section className="panel settings-panel">
            <div className="panel-title">
              <div>
                <span className="eyebrow">
                  SYSTEM
                </span>

                <h2>Dashboard Controls</h2>
              </div>

              <span className="settings-icon">
                ⚙
              </span>
            </div>

            <div className="settings-list">
              <div className="setting-row">
                <div>
                  <strong>Dark Interface</strong>
                  <small>
                    Use the professional dark theme
                  </small>
                </div>

                <button
                  className={`toggle ${
                    darkMode ? "active" : ""
                  }`}
                  onClick={() =>
                    setDarkMode(!darkMode)
                  }
                >
                  <span />
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <strong>Browser Notifications</strong>
                  <small>
                    Receive alarm notifications
                  </small>
                </div>

                <button
                  className="permission-button"
                  onClick={
                    requestNotificationPermission
                  }
                >
                  Enable
                </button>
              </div>

              <div className="setting-row">
                <div>
                  <strong>Live Synchronization</strong>
                  <small>
                    Updates every second
                  </small>
                </div>

                <span className="live-badge">
                  ACTIVE
                </span>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer>
        <span>
          CHRONOS WORLD TIME SYSTEM
        </span>

        <span>
          React • Real-Time Engine • Intl API
        </span>
      </footer>
    </div>
  );
}

export default App;