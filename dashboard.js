const CONFIG = {
    hmi_url: "http://54.147.206.110",
    username: "operator",
    password: "Winter2025!"
};

let sessionActive = false;

async function login() {
    const formData = new URLSearchParams();
    formData.append("username", CONFIG.username);
    formData.append("password", CONFIG.password);

    try {
        await fetch(`${CONFIG.hmi_url}/login`, {
            method: "POST",
            body: formData,
            credentials: "include"
        });
        sessionActive = true;
    } catch (e) {
        setStatus("unreachable");
    }
}

async function fetchTelemetry() {
    if (!sessionActive) await login();

    try {
        const resp = await fetch(`${CONFIG.hmi_url}/api/telemetry`, {
            credentials: "include"
        });

        if (resp.status === 401) {
            sessionActive = false;
            await login();
            return;
        }

        const data = await resp.json();
        updateCards(data);
        setStatus("online");
    } catch (e) {
        setStatus("unreachable");
    }
}

async function fetchAlarms() {
    try {
        const resp = await fetch(`${CONFIG.hmi_url}/api/alarms`, {
            credentials: "include"
        });
        const data = await resp.json();
        updateAlarms(data.alarms || {});
    } catch (e) {
        document.getElementById("alarms-list").textContent = "Could not reach HMI.";
    }
}

function updateCards(data) {
    const fields = {
        "tank1":    data.tank_1_level,
        "tank2":    data.tank_2_level,
        "pressure": data.separator_pressure,
        "temp":     data.heater_temp,
        "flow":     data.flow_rate
    };
    for (const [id, val] of Object.entries(fields)) {
        const el = document.querySelector(`#${id} .value`);
        if (el) el.textContent = val ?? "--";
    }
}

function updateAlarms(alarms) {
    const list = document.getElementById("alarms-list");
    const active = Object.entries(alarms).filter(([, v]) => v).map(([k]) => k);
    list.innerHTML = active.length
        ? active.map(k => `<div class="alarm">${k}</div>`).join("")
        : "<span style='color:#666'>No active alarms</span>";
}

function setStatus(state) {
    const el = document.getElementById("status");
    el.textContent = state === "online" ? "● ONLINE" : "● UNREACHABLE";
    el.style.color = state === "online" ? "#4caf50" : "#cc3300";
}

fetchTelemetry();
fetchAlarms();
setInterval(fetchTelemetry, 5000);
setInterval(fetchAlarms, 10000);
