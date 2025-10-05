// recorder.js
// Runs in extension window context which has permission to use the mic.
// Records 2s chunks and sends to ElevenLabs STT. Sends resulting text to active tab.

let mediaRecorder = null;
let streamRef = null;
const CHUNK_MS = 2000;

const statusEl = () => document.getElementById("status");
const keyInput = () => document.getElementById("api-key");
const startBtn = () => document.getElementById("start");
const stopBtn = () => document.getElementById("stop");

async function loadStoredKey() {
  chrome.storage.local.get("elevenLabsKey", (data) => {
    if (data && data.elevenLabsKey) {
      keyInput().value = data.elevenLabsKey;
    }
  });
}

function setStatus(t) {
  const el = statusEl();
  if (el) el.textContent = t;
}

async function startRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") return;
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    streamRef = stream;
    mediaRecorder = new MediaRecorder(stream, { mimeType: "audio/webm" });

    mediaRecorder.ondataavailable = async (ev) => {
      const blob = ev.data;
      if (!blob || blob.size === 0) return;
      setStatus("Sending audio to STT...");
      try {
        const transcript = await sendBlobToElevenLabs(blob);
        setStatus(`Heard: ${transcript || "<no text>"}`);
        if (transcript && transcript.trim()) {
          // send transcript to currently active tab
          chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            if (tabs && tabs[0]) {
              chrome.tabs.sendMessage(tabs[0].id, { action: "transcript", text: transcript });
            }
          });
        }
      } catch (err) {
        console.error("STT error:", err);
        setStatus("STT error: " + (err.message || err));
      }
    };

    mediaRecorder.onstart = () => setStatus("Recording...");
    mediaRecorder.onstop = () => setStatus("Stopped");

    // start a continuous loop of record-2s, stop, send, start...
    mediaRecorder.start(CHUNK_MS);
    startBtn().disabled = true;
    stopBtn().disabled = false;

  } catch (err) {
    console.error("Mic error", err);
    setStatus("Microphone error: " + (err.message || err));
  }
}

function stopRecording() {
  if (mediaRecorder && mediaRecorder.state === "recording") {
    mediaRecorder.stop();
  }
  if (streamRef) {
    streamRef.getTracks().forEach(t => t.stop());
    streamRef = null;
  }
  mediaRecorder = null;
  startBtn().disabled = false;
  stopBtn().disabled = true;
  setStatus("Idle");
}

async function sendBlobToElevenLabs(blob) {
  const key = keyInput().value.trim();
  if (!key) throw new Error("API key missing. Save it in the field above or in the popup.");

  // Convert webm blob to a form acceptable by the STT endpoint
  const form = new FormData();
  // ElevenLabs accepts audio/wav or audio/webm; we'll send webm
  form.append("file", blob, "audio.webm");
  form.append("model_id", "scribe_v1");

  const resp = await fetch("https://api.elevenlabs.io/v1/speech-to-text", {
    method: "POST",
    headers: {
      "xi-api-key": key
    },
    body: form
  });

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`HTTP ${resp.status}: ${txt}`);
  }

  const json = await resp.json();
  // response format expected: { text: "..." } but confirm from actual API
  const text = json.text || json.transcript || (json?.results?.[0]?.text) || "";
  return text;
}

// UI wiring
document.addEventListener("DOMContentLoaded", () => {
  loadStoredKey();

  document.getElementById("save-key").addEventListener("click", () => {
    const k = keyInput().value.trim();
    chrome.storage.local.set({ elevenLabsKey: k }, () => {
      setStatus("API key saved");
    });
  });

  startBtn().addEventListener("click", async () => {
    setStatus("Requesting microphone...");
    await startRecording();
  });

  stopBtn().addEventListener("click", () => {
    stopRecording();
  });

  // When the MediaRecorder stops recording the 2s segment, we need to restart it to keep continuous streaming.
  // To achieve continuous sending: use onstop to restart. But we used mediaRecorder.start(CHUNK_MS) which fires ondataavailable periodically,
  // so we don't need to repeatedly stop/start manually.
});
