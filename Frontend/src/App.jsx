import { useState, useEffect } from "react";
import "./App.css";

const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

export default function App() {

    const [theme, setTheme] = useState(() => {
        const saved = localStorage.getItem("theme");
        if (saved === "light" || saved === "dark") return saved;
        return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    });

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((t) => (t === "light" ? "dark" : "light"));


    const [units, setUnits] = useState("metric");


    const [gender, setGender] = useState("Male");
    const [age, setAge] = useState(30);

    const [heightCm, setHeightCm] = useState(170);
    const [weightKg, setWeightKg] = useState(70);
    const [bodyTempC, setBodyTempC] = useState(39.0);


    const [heightFt, setHeightFt] = useState(5);
    const [heightIn, setHeightIn] = useState(7);
    const [weightLbs, setWeightLbs] = useState(154);
    const [bodyTempF, setBodyTempF] = useState(102.2);


    const [duration, setDuration] = useState(20);
    const [heartRate, setHeartRate] = useState(105);


    const [errors, setErrors] = useState({});


    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(false);
    const [apiError, setApiError] = useState("");
    const [activeTab, setActiveTab] = useState("chart");
    const [hoveredPoint, setHoveredPoint] = useState(null);


    const validateField = (name, val) => {
        let err = "";
        const num = Number(val);
        if (val === "" || isNaN(num)) {
            err = "Required field";
        } else if (name === "age") {
            if (num < 10 || num > 85) err = "Age must be between 10 and 85";
        } else if (name === "heightCm") {
            if (num < 120 || num > 220) err = "Height must be between 120 and 220 cm";
        } else if (name === "heightFt") {
            if (num < 3 || num > 7) err = "3 to 7 ft";
        } else if (name === "heightIn") {
            if (num < 0 || num > 11) err = "0 to 11 in";
        } else if (name === "weightKg") {
            if (num < 30 || num > 200) err = "Weight must be between 30 and 200 kg";
        } else if (name === "weightLbs") {
            if (num < 66 || num > 440) err = "Weight must be between 66 and 440 lbs";
        } else if (name === "duration") {
            if (num < 1 || num > 120) err = "Duration must be between 1 and 120 mins";
        } else if (name === "heartRate") {
            if (num < 50 || num > 220) err = "Heart rate must be between 50 and 220 bpm";
        } else if (name === "bodyTempC") {
            if (num < 36.0 || num > 42.0) err = "Temp must be between 36.0 and 42.0 °C";
        } else if (name === "bodyTempF") {
            if (num < 96.8 || num > 107.6) err = "Temp must be between 96.8 and 107.6 °F";
        }
        setErrors((prev) => ({ ...prev, [name]: err }));
        return err;
    };

    const validateAll = () => {
        const newErrors = {};
        const check = (name, val) => {
            const err = validateField(name, val);
            if (err) newErrors[name] = err;
        };

        check("age", age);
        if (units === "metric") {
            check("heightCm", heightCm);
            check("weightKg", weightKg);
            check("bodyTempC", bodyTempC);
        } else {
            check("heightFt", heightFt);
            check("heightIn", heightIn);
            check("weightLbs", weightLbs);
            check("bodyTempF", bodyTempF);
        }
        check("duration", duration);
        check("heartRate", heartRate);

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };


    const handleUnitSwitch = (newUnit) => {
        if (newUnit === units) return;
        setErrors({});
        if (newUnit === "imperial") {
            const totalInches = heightCm / 2.54;
            setHeightFt(Math.floor(totalInches / 12));
            setHeightIn(Math.round(totalInches % 12));
            setWeightLbs(Math.round(weightKg * 2.20462));
            setBodyTempF(+((bodyTempC * 9) / 5 + 32).toFixed(1));
        } else {
            const totalInches = heightFt * 12 + heightIn;
            setHeightCm(Math.round(totalInches * 2.54));
            setWeightKg(Math.round(weightLbs / 2.20462));
            setBodyTempC(+(((bodyTempF - 32) * 5) / 9).toFixed(1));
        }
        setUnits(newUnit);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateAll()) return;

        setLoading(true);
        setApiError("");
        setResult(null);


        const finalHeight = units === "metric" ? heightCm : (heightFt * 12 + heightIn) * 2.54;
        const finalWeight = units === "metric" ? weightKg : weightLbs / 2.20462;
        const finalTemp = units === "metric" ? bodyTempC : ((bodyTempF - 32) * 5) / 9;

        try {
            const res = await fetch(`${API_URL}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    gender,
                    age: Number(age),
                    height: Number(finalHeight),
                    weight: Number(finalWeight),
                    duration: Number(duration),
                    heart_rate: Number(heartRate),
                    body_temp: Number(finalTemp),
                }),
            });
            if (!res.ok) throw new Error("Server error");
            const data = await res.json();
            setResult(data.calories);

            setTimeout(() => {
                document.getElementById("results-card")?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        } catch (err) {
            setApiError("Could not get a prediction. Please verify the API is running at " + API_URL);
        } finally {
            setLoading(false);
        }
    };


    const currentWeightKg = units === "metric" ? weightKg : weightLbs / 2.20462;
    const currentHeightCm = units === "metric" ? heightCm : (heightFt * 12 + heightIn) * 2.54;


    const bmr = Math.round(
        gender === "Male"
            ? 10 * currentWeightKg + 6.25 * currentHeightCm - 5 * age + 5
            : 10 * currentWeightKg + 6.25 * currentHeightCm - 5 * age - 161
    );


    const restingBurn = Math.round(bmr * (duration / 1440));
    const netActiveBurn = result ? Math.max(0, Math.round(result - restingBurn)) : 0;
    const burnRate = result ? (result / duration).toFixed(1) : 0;

    const maxHR = 220 - age;
    const hrPct = Math.min(100, Math.round((heartRate / maxHR) * 100));

    const zonesConfig = [
        {
            id: 1,
            label: "Zone 1",
            name: "Warmup & Recovery",
            minPct: 50,
            maxPct: 60,
            minBpm: Math.round(maxHR * 0.5),
            maxBpm: Math.round(maxHR * 0.6),
            color: "#38bdf8",
            fuel: "85% Fat / 15% Carbohydrates",
            benefit: "Active recovery, joint mobility & aerobic baseline conditioning.",
        },
        {
            id: 2,
            label: "Zone 2",
            name: "Fat Burn Zone",
            minPct: 60,
            maxPct: 70,
            minBpm: Math.round(maxHR * 0.6),
            maxBpm: Math.round(maxHR * 0.7),
            color: "#22c55e",
            fuel: "65% Fat / 35% Carbohydrates",
            benefit: "Peak fat oxidation, mitochondrial biogenesis & endurance capacity.",
        },
        {
            id: 3,
            label: "Zone 3",
            name: "Aerobic Cardio",
            minPct: 70,
            maxPct: 80,
            minBpm: Math.round(maxHR * 0.7),
            maxBpm: Math.round(maxHR * 0.8),
            color: "#eab308",
            fuel: "50% Fat / 50% Carbohydrates",
            benefit: "Cardiovascular efficiency, heart stroke volume expansion & stamina.",
        },
        {
            id: 4,
            label: "Zone 4",
            name: "Anaerobic Threshold",
            minPct: 80,
            maxPct: 90,
            minBpm: Math.round(maxHR * 0.8),
            maxBpm: Math.round(maxHR * 0.9),
            color: "#f97316",
            fuel: "20% Fat / 80% Carbohydrates",
            benefit: "Lactate threshold tolerance and high-intensity fatigue resistance.",
        },
        {
            id: 5,
            label: "Zone 5",
            name: "Peak VO2 Max",
            minPct: 90,
            maxPct: 100,
            minBpm: Math.round(maxHR * 0.9),
            maxBpm: maxHR,
            color: "#ef4444",
            fuel: "95% Glycogen & Phosphagens",
            benefit: "Peak power output, sprinting speed & maximum oxygen uptake (VO2 max).",
        },
    ];

    const currentZone = zonesConfig.find((z) => hrPct <= z.maxPct) || zonesConfig[4];


    const bananas = result ? (result / 105).toFixed(1) : 0;
    const pizza = result ? (result / 285).toFixed(1) : 0;
    const coffee = result ? (result / 120).toFixed(1) : 0;
    const avocado = result ? (result / 240).toFixed(1) : 0;


    const timelineData = (() => {
        if (!result) return [];
        const steps = 6;
        const pts = [];
        for (let i = 0; i <= steps; i++) {
            const t = Math.round((duration / steps) * i);
            const p = i / steps;

            const cal = Math.round(Math.pow(p, 0.95) * result);
            const rest = Math.round(p * restingBurn);
            pts.push({ minute: t, calories: cal, resting: rest, pct: Math.round(p * 100) });
        }
        return pts;
    })();

    const svgW = 560;
    const svgH = 220;
    const padL = 50;
    const padR = 25;
    const padT = 25;
    const padB = 35;
    const chartW = svgW - padL - padR;
    const chartH = svgH - padT - padB;

    const maxChartCal = result ? Math.max(50, Math.ceil((result * 1.15) / 50) * 50) : 100;
    const getX = (m) => padL + (duration > 0 ? (m / duration) * chartW : 0);
    const getY = (c) => svgH - padB - (c / maxChartCal) * chartH;

    const lineD = timelineData.reduce((acc, pt, idx) => {
        const x = getX(pt.minute);
        const y = getY(pt.calories);
        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");

    const areaD = lineD ? `${lineD} L ${getX(duration)} ${svgH - padB} L ${getX(0)} ${svgH - padB} Z` : "";

    const restLineD = timelineData.reduce((acc, pt, idx) => {
        const x = getX(pt.minute);
        const y = getY(pt.resting);
        return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, "");

    return (
        <div className="app-page">

            <header className="navbar">
                <div className="nav-container">
                    <div className="brand">
                        <span className="brand-icon">🔥</span>
                        <div className="brand-text">
                            <strong>Calories Burned</strong>

                        </div>
                    </div>
                    <button
                        type="button"
                        className="theme-btn"
                        onClick={toggleTheme}
                        aria-label="Toggle dark/light mode"
                    >
                        {theme === "light" ? "🌙 Dark" : "☀️ Light"}
                    </button>
                </div>
            </header>


            <main className="main-wrapper">

                <section className="intro-section">
                    <h1 className="main-title">Calories Burned Calculator</h1>
                    <p className="main-desc">
                        Estimate exercise caloric expenditure using machine learning based on biometrics and workout intensity.
                    </p>
                </section>

                <div className="calculator-layout">

                    <div className="calc-card">

                        <div className="unit-tabs">
                            <button
                                type="button"
                                className={`unit-tab ${units === "imperial" ? "active" : ""}`}
                                onClick={() => handleUnitSwitch("imperial")}
                            >
                                Imperial (ft, lbs, °F)
                            </button>
                            <button
                                type="button"
                                className={`unit-tab ${units === "metric" ? "active" : ""}`}
                                onClick={() => handleUnitSwitch("metric")}
                            >
                                Metric (cm, kg, °C)
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} noValidate className="calc-form">

                            <div className="form-group">
                                <label className="form-label">Gender</label>
                                <div className="gender-toggle-group">
                                    <button
                                        type="button"
                                        className={`gender-btn ${gender === "Male" ? "selected" : ""}`}
                                        onClick={() => setGender("Male")}
                                    >
                                        <span className="gender-icon">👨</span> Male
                                    </button>
                                    <button
                                        type="button"
                                        className={`gender-btn ${gender === "Female" ? "selected" : ""}`}
                                        onClick={() => setGender("Female")}
                                    >
                                        <span className="gender-icon">👩</span> Female
                                    </button>
                                </div>
                            </div>


                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label className="form-label" htmlFor="age">Age</label>
                                    <div className={`input-with-badge ${errors.age ? "input-error" : ""}`}>
                                        <input
                                            id="age"
                                            type="number"
                                            value={age}
                                            onChange={(e) => {
                                                setAge(e.target.value);
                                                validateField("age", e.target.value);
                                            }}
                                        />
                                        <span className="input-badge">years</span>
                                    </div>
                                    {errors.age && <span className="field-error">{errors.age}</span>}
                                </div>

                                {units === "metric" ? (
                                    <div className="form-group flex-1">
                                        <label className="form-label" htmlFor="height">Height</label>
                                        <div className={`input-with-badge ${errors.heightCm ? "input-error" : ""}`}>
                                            <input
                                                id="height"
                                                type="number"
                                                value={heightCm}
                                                onChange={(e) => {
                                                    setHeightCm(e.target.value);
                                                    validateField("heightCm", e.target.value);
                                                }}
                                            />
                                            <span className="input-badge">cm</span>
                                        </div>
                                        {errors.heightCm && <span className="field-error">{errors.heightCm}</span>}
                                    </div>
                                ) : (
                                    <div className="form-group flex-1">
                                        <label className="form-label">Height</label>
                                        <div className="split-inputs">
                                            <div className={`input-with-badge ${errors.heightFt ? "input-error" : ""}`}>
                                                <input
                                                    type="number"
                                                    value={heightFt}
                                                    onChange={(e) => {
                                                        setHeightFt(e.target.value);
                                                        validateField("heightFt", e.target.value);
                                                    }}
                                                />
                                                <span className="input-badge">ft</span>
                                            </div>
                                            <div className={`input-with-badge ${errors.heightIn ? "input-error" : ""}`}>
                                                <input
                                                    type="number"
                                                    value={heightIn}
                                                    onChange={(e) => {
                                                        setHeightIn(e.target.value);
                                                        validateField("heightIn", e.target.value);
                                                    }}
                                                />
                                                <span className="input-badge">in</span>
                                            </div>
                                        </div>
                                        {(errors.heightFt || errors.heightIn) && (
                                            <span className="field-error">{errors.heightFt || errors.heightIn}</span>
                                        )}
                                    </div>
                                )}
                            </div>


                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label className="form-label" htmlFor="weight">Weight</label>
                                    <div className={`input-with-badge ${(errors.weightKg || errors.weightLbs) ? "input-error" : ""}`}>
                                        {units === "metric" ? (
                                            <input
                                                id="weight"
                                                type="number"
                                                value={weightKg}
                                                onChange={(e) => {
                                                    setWeightKg(e.target.value);
                                                    validateField("weightKg", e.target.value);
                                                }}
                                            />
                                        ) : (
                                            <input
                                                id="weight"
                                                type="number"
                                                value={weightLbs}
                                                onChange={(e) => {
                                                    setWeightLbs(e.target.value);
                                                    validateField("weightLbs", e.target.value);
                                                }}
                                            />
                                        )}
                                        <span className="input-badge">
                                            {units === "metric" ? "kg" : "lbs"}
                                        </span>
                                    </div>
                                    {(errors.weightKg || errors.weightLbs) && (
                                        <span className="field-error">{errors.weightKg || errors.weightLbs}</span>
                                    )}
                                </div>

                                <div className="form-group flex-1">
                                    <label className="form-label" htmlFor="duration">Workout Duration</label>
                                    <div className={`input-with-badge ${errors.duration ? "input-error" : ""}`}>
                                        <input
                                            id="duration"
                                            type="number"
                                            value={duration}
                                            onChange={(e) => {
                                                setDuration(e.target.value);
                                                validateField("duration", e.target.value);
                                            }}
                                        />
                                        <span className="input-badge">mins</span>
                                    </div>
                                    {errors.duration ? (
                                        <span className="field-error">{errors.duration}</span>
                                    ) : (
                                        <span className="field-hint">Active exercise session length</span>
                                    )}
                                </div>
                            </div>


                            <div className="form-row">
                                <div className="form-group flex-1">
                                    <label className="form-label" htmlFor="heart_rate">Average Heart Rate</label>
                                    <div className={`input-with-badge ${errors.heartRate ? "input-error" : ""}`}>
                                        <input
                                            id="heart_rate"
                                            type="number"
                                            value={heartRate}
                                            onChange={(e) => {
                                                setHeartRate(e.target.value);
                                                validateField("heartRate", e.target.value);
                                            }}
                                        />
                                        <span className="input-badge">bpm</span>
                                    </div>
                                    {errors.heartRate ? (
                                        <span className="field-error">{errors.heartRate}</span>
                                    ) : (
                                        <span className="field-hint">Typically 90 to 170 bpm during exercise</span>
                                    )}
                                </div>

                                <div className="form-group flex-1">
                                    <label className="form-label" htmlFor="body_temp">Body Temperature</label>
                                    <div className={`input-with-badge ${(errors.bodyTempC || errors.bodyTempF) ? "input-error" : ""}`}>
                                        {units === "metric" ? (
                                            <input
                                                id="body_temp"
                                                type="number"
                                                step="0.1"
                                                value={bodyTempC}
                                                onChange={(e) => {
                                                    setBodyTempC(e.target.value);
                                                    validateField("bodyTempC", e.target.value);
                                                }}
                                            />
                                        ) : (
                                            <input
                                                id="body_temp"
                                                type="number"
                                                step="0.1"
                                                value={bodyTempF}
                                                onChange={(e) => {
                                                    setBodyTempF(e.target.value);
                                                    validateField("bodyTempF", e.target.value);
                                                }}
                                            />
                                        )}
                                        <span className="input-badge">
                                            {units === "metric" ? "°C" : "°F"}
                                        </span>
                                    </div>
                                    {(errors.bodyTempC || errors.bodyTempF) ? (
                                        <span className="field-error">{errors.bodyTempC || errors.bodyTempF}</span>
                                    ) : (
                                        <span className="field-hint">
                                            Typically {units === "metric" ? "37.5 to 40.5 °C" : "99.5 to 105.0 °F"} during workouts
                                        </span>
                                    )}
                                </div>
                            </div>


                            <div className="submit-section">
                                <button type="submit" className="calculate-btn" disabled={loading}>
                                    {loading ? "Calculating Expenditure..." : "Calculate Calories Burned →"}
                                </button>
                                <p className="btn-disclaimer">Estimate only, not medical advice.</p>
                            </div>
                        </form>
                    </div>


                    {apiError && (
                        <div className="alert-card error-card">
                            <strong>Error:</strong> {apiError}
                        </div>
                    )}

                    {result !== null && (
                        <div id="results-card" className="results-container">

                            <div className="hero-stat-card">
                                <span className="hero-subtitle">YOUR ESTIMATED WORKOUT BURN</span>
                                <div className="hero-main-stat">
                                    <span className="stat-number">{result}</span>
                                    <span className="stat-unit">calories</span>
                                </div>
                                <div className="hero-chips">
                                    <span className="hero-chip"> {burnRate} kcal/min</span>
                                    <span className="hero-chip"> {duration} min duration</span>
                                    <span className="hero-chip"> {heartRate} bpm avg</span>
                                </div>
                            </div>


                            <div className="results-tab-bar">
                                <button
                                    type="button"
                                    className={`res-tab-btn ${activeTab === "chart" ? "active" : ""}`}
                                    onClick={() => setActiveTab("chart")}
                                >
                                    📈 Burn Timeline
                                </button>
                                <button
                                    type="button"
                                    className={`res-tab-btn ${activeTab === "zones" ? "active" : ""}`}
                                    onClick={() => setActiveTab("zones")}
                                >
                                    🎯 Heart Rate Zones
                                </button>
                                <button
                                    type="button"
                                    className={`res-tab-btn ${activeTab === "food" ? "active" : ""}`}
                                    onClick={() => setActiveTab("food")}
                                >
                                    🍕 Food Equivalents
                                </button>
                                <button
                                    type="button"
                                    className={`res-tab-btn ${activeTab === "targets" ? "active" : ""}`}
                                    onClick={() => setActiveTab("targets")}
                                >
                                    ⏱️ Calorie Targets
                                </button>
                            </div>


                            {activeTab === "chart" && (
                                <div className="tab-pane">
                                    <div className="chart-header">
                                        <div>
                                            <h3 className="chart-title">Cumulative Calorie Burn Over Time</h3>
                                            <p className="chart-subtitle">
                                                Visualizing active workout expenditure vs. baseline resting metabolic rate (BMR).
                                            </p>
                                        </div>
                                        <div className="chart-legend">
                                            <span className="legend-item">
                                                <span className="legend-dot active-burn"></span> Active Workout Burn
                                            </span>
                                            <span className="legend-item">
                                                <span className="legend-dot resting-burn"></span> Resting Baseline (BMR)
                                            </span>
                                        </div>
                                    </div>


                                    <div className="svg-chart-wrapper">
                                        <svg viewBox={`0 0 ${svgW} ${svgH}`} className="timeline-svg">
                                            <defs>

                                                <linearGradient id="burnGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#f97316" stopOpacity="0.45" />
                                                    <stop offset="100%" stopColor="#f97316" stopOpacity="0.0" />
                                                </linearGradient>

                                                <linearGradient id="restGrad" x1="0" y1="0" x2="0" y2="1">
                                                    <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.15" />
                                                    <stop offset="100%" stopColor="#38bdf8" stopOpacity="0.0" />
                                                </linearGradient>
                                            </defs>


                                            {[0, 0.33, 0.66, 1].map((pct, idx) => {
                                                const calVal = Math.round(maxChartCal * pct);
                                                const yPos = getY(calVal);
                                                return (
                                                    <g key={idx} className="chart-grid-line">
                                                        <line
                                                            x1={padL}
                                                            y1={yPos}
                                                            x2={svgW - padR}
                                                            y2={yPos}
                                                            stroke="var(--border-color)"
                                                            strokeDasharray="4 4"
                                                            strokeWidth="1"
                                                        />
                                                        <text
                                                            x={padL - 8}
                                                            y={yPos + 4}
                                                            textAnchor="end"
                                                            className="chart-axis-label"
                                                        >
                                                            {calVal}
                                                        </text>
                                                    </g>
                                                );
                                            })}


                                            {timelineData.map((pt, idx) => {
                                                const xPos = getX(pt.minute);
                                                return (
                                                    <text
                                                        key={idx}
                                                        x={xPos}
                                                        y={svgH - 12}
                                                        textAnchor="middle"
                                                        className="chart-axis-label"
                                                    >
                                                        {pt.minute}m
                                                    </text>
                                                );
                                            })}


                                            {areaD && <path d={areaD} fill="url(#burnGrad)" />}


                                            {restLineD && (
                                                <path
                                                    d={restLineD}
                                                    fill="none"
                                                    stroke="#38bdf8"
                                                    strokeWidth="2"
                                                    strokeDasharray="4 4"
                                                />
                                            )}


                                            {lineD && (
                                                <path
                                                    d={lineD}
                                                    fill="none"
                                                    stroke="#f97316"
                                                    strokeWidth="3.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            )}


                                            {timelineData.map((pt, idx) => {
                                                const cx = getX(pt.minute);
                                                const cy = getY(pt.calories);
                                                const isHovered = hoveredPoint?.minute === pt.minute;
                                                return (
                                                    <g
                                                        key={idx}
                                                        className="chart-point-group"
                                                        onMouseEnter={() => setHoveredPoint(pt)}
                                                        onMouseLeave={() => setHoveredPoint(null)}
                                                    >

                                                        {isHovered && (
                                                            <circle
                                                                cx={cx}
                                                                cy={cy}
                                                                r="12"
                                                                fill="#f97316"
                                                                fillOpacity="0.25"
                                                            />
                                                        )}

                                                        <circle
                                                            cx={cx}
                                                            cy={cy}
                                                            r={isHovered ? "6" : "4.5"}
                                                            fill="#ffffff"
                                                            stroke="#f97316"
                                                            strokeWidth="3"
                                                            style={{ cursor: "pointer", transition: "all 0.2s" }}
                                                        />
                                                    </g>
                                                );
                                            })}
                                        </svg>


                                        {hoveredPoint && (
                                            <div
                                                className="chart-tooltip"
                                                style={{
                                                    left: `${((getX(hoveredPoint.minute) - 10) / svgW) * 100}%`,
                                                    top: `${Math.max(10, ((getY(hoveredPoint.calories) - 60) / svgH) * 100)}%`,
                                                }}
                                            >
                                                <div className="tooltip-title">Minute {hoveredPoint.minute}</div>
                                                <div className="tooltip-row">
                                                    <span>Burned:</span> <strong>{hoveredPoint.calories} kcal</strong>
                                                </div>
                                                <div className="tooltip-row resting-row">
                                                    <span>BMR Baseline:</span> <strong>{hoveredPoint.resting} kcal</strong>
                                                </div>
                                                <div className="tooltip-net">
                                                    Net Active: +{hoveredPoint.calories - hoveredPoint.resting} kcal
                                                </div>
                                            </div>
                                        )}
                                    </div>


                                    <div className="chart-stat-strip">
                                        <div className="strip-item">
                                            <span className="strip-label">Total Burn</span>
                                            <span className="strip-val">{result} kcal</span>
                                        </div>
                                        <div className="strip-item">
                                            <span className="strip-label">Burn Velocity</span>
                                            <span className="strip-val">{burnRate} kcal/min</span>
                                        </div>
                                        <div className="strip-item">
                                            <span className="strip-label">Net Exercise Burn</span>
                                            <span className="strip-val">+{netActiveBurn} kcal</span>
                                        </div>
                                        <div className="strip-item">
                                            <span className="strip-label">Resting BMR Share</span>
                                            <span className="strip-val">~{restingBurn} kcal</span>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {activeTab === "zones" && (
                                <div className="tab-pane">
                                    <div className="zone-dashboard">
                                        <div className="zone-header">
                                            <div>
                                                <h3 className="chart-title">5-Stage Heart Rate Training Zones</h3>
                                                <p className="chart-subtitle">
                                                    Based on your estimated Maximum Heart Rate of <strong>{maxHR} bpm</strong> (220 - Age).
                                                </p>
                                            </div>
                                            <div className="current-zone-badge" style={{ backgroundColor: currentZone.color }}>
                                                {currentZone.label}: {currentZone.name}
                                            </div>
                                        </div>


                                        <div className="zone-meter-wrapper">

                                            <div
                                                className="zone-marker-pin"
                                                style={{
                                                    left: `${Math.min(97, Math.max(3, hrPct))}%`,
                                                    borderColor: currentZone.color,
                                                }}
                                            >
                                                <span className="marker-arrow" style={{ borderTopColor: currentZone.color }}></span>
                                                <span className="marker-label">
                                                    {heartRate} bpm ({hrPct}%)
                                                </span>
                                            </div>


                                            <div className="multi-zone-bar">
                                                {zonesConfig.map((z) => (
                                                    <div
                                                        key={z.id}
                                                        className={`zone-segment ${currentZone.id === z.id ? "active-segment" : ""}`}
                                                        style={{ backgroundColor: z.color }}
                                                        title={`${z.label}: ${z.name} (${z.minBpm}-${z.maxBpm} bpm)`}
                                                    >
                                                        <span className="segment-code">{z.label}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>


                                        <div className="active-zone-focus-card" style={{ borderLeftColor: currentZone.color }}>
                                            <div className="focus-card-top">
                                                <h4 style={{ color: currentZone.color }}>
                                                    {currentZone.name} ({currentZone.minBpm} – {currentZone.maxBpm} bpm)
                                                </h4>
                                                <span className="focus-intensity-tag">
                                                    {hrPct}% Intensity
                                                </span>
                                            </div>
                                            <p className="focus-desc">{currentZone.benefit}</p>
                                            <div className="focus-fuel-strip">
                                                <span className="fuel-label">Primary Energy Substrate:</span>
                                                <span className="fuel-value">{currentZone.fuel}</span>
                                            </div>
                                        </div>


                                        <div className="stat-grid" style={{ marginTop: "16px" }}>
                                            <div className="metric-box">
                                                <span className="metric-label">Basal Metabolic Rate (BMR)</span>
                                                <span className="metric-value">{bmr} kcal/day</span>
                                                <span className="metric-subtext">
                                                    What your body expends resting 24/7. During this {duration}-minute window at rest, you would burn ~{restingBurn} kcal. Your workout yielded <strong>+{netActiveBurn} kcal</strong> of net active burn.
                                                </span>
                                            </div>
                                            <div className="metric-box">
                                                <span className="metric-label">Estimated Water Replacement</span>
                                                <span className="metric-value">
                                                    ~{Math.round(duration * (heartRate / 100) * 15)} ml
                                                </span>
                                                <span className="metric-subtext">
                                                    Recommended fluid intake post-exercise to restore hydration levels based on elevated core temp and heart rate.
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {activeTab === "food" && (
                                <div className="tab-pane">
                                    <p className="tab-desc">
                                        Burning <strong>{result} calories</strong> is roughly equivalent to burning off:
                                    </p>
                                    <div className="food-grid">
                                        <div className="food-card">
                                            <span className="food-icon">🍌</span>
                                            <span className="food-qty">{bananas}</span>
                                            <span className="food-name">Bananas (~105 kcal each)</span>
                                        </div>
                                        <div className="food-card">
                                            <span className="food-icon">🍕</span>
                                            <span className="food-qty">{pizza}</span>
                                            <span className="food-name">Pizza Slices (~285 kcal each)</span>
                                        </div>
                                        <div className="food-card">
                                            <span className="food-icon">☕</span>
                                            <span className="food-qty">{coffee}</span>
                                            <span className="food-name">Lattes (~120 kcal each)</span>
                                        </div>
                                        <div className="food-card">
                                            <span className="food-icon">🥑</span>
                                            <span className="food-qty">{avocado}</span>
                                            <span className="food-name">Avocados (~240 kcal each)</span>
                                        </div>
                                    </div>
                                </div>
                            )}


                            {activeTab === "targets" && (
                                <div className="tab-pane">
                                    <p className="tab-desc">
                                        Estimated workout duration required to hit common calorie goals at your current intensity:
                                    </p>
                                    <div className="targets-table-wrap">
                                        <table className="targets-table">
                                            <thead>
                                                <tr>
                                                    <th>Target Burn</th>
                                                    <th>Est. Duration</th>
                                                    <th>Equivalent Milestone</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><strong>150 kcal</strong></td>
                                                    <td>{Math.round(150 / (result / duration))} minutes</td>
                                                    <td>Quick active snack burn</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>300 kcal</strong></td>
                                                    <td>{Math.round(300 / (result / duration))} minutes</td>
                                                    <td>Standard daily fitness target</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>500 kcal</strong></td>
                                                    <td>{Math.round(500 / (result / duration))} minutes</td>
                                                    <td>High-energy conditioning session</td>
                                                </tr>
                                                <tr>
                                                    <td><strong>750 kcal</strong></td>
                                                    <td>{Math.round(750 / (result / duration))} minutes</td>
                                                    <td>Endurance athlete threshold</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>


                <section className="faq-section">
                    <h2 className="faq-heading">Frequently Asked Questions</h2>
                    <div className="faq-grid">
                        <div className="faq-card">
                            <h3>How is my calorie expenditure predicted?</h3>
                            <p>
                                Our model uses an ensemble <strong>Random Forest Regressor</strong> trained on thousands of exercise sessions. It evaluates the relationship between your demographic stats (Age, Gender, Body Mass) and workout variables (Duration, Heart Rate, and Body Temperature).
                            </p>
                        </div>
                        <div className="faq-card">
                            <h3>Why does Heart Rate matter so much?</h3>
                            <p>
                                Heart rate directly mirrors the rate of oxygen consumption. As intensity climbs into Zone 3 and above, the metabolic rate spikes, demanding rapid energy production and higher caloric burn per minute.
                            </p>
                        </div>
                        <div className="faq-card">
                            <h3>What is the difference between BMR and Exercise Burn?</h3>
                            <p>
                                <strong>Basal Metabolic Rate (BMR)</strong> is the baseline energy needed to sustain life at total rest. Your exercise burn represents energy consumed over and above this baseline.
                            </p>
                        </div>
                        <div className="faq-card">
                            <h3>How can I maximize fat oxidation?</h3>
                            <p>
                                Working out in <strong>Zone 2 (60% to 70% of Maximum Heart Rate)</strong> utilizes fat as the primary fuel source, making it ideal for aerobic base building and prolonged energy expenditure.
                            </p>
                        </div>
                    </div>
                </section>
            </main>


            <footer className="site-footer">
                <div className="footer-content">
                    <p>Made with <span className="heart">❤️</span> by Vikram</p>
                    <p className="disclaimer">
                        Calculations are estimates for educational and fitness planning purposes based on machine learning modeling.
                    </p>
                </div>
            </footer>
        </div>
    );
}
