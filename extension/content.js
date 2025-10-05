// ===== Floating Control Panel =====
const panel = document.createElement("div");
panel.id = "vgc-panel";
panel.style.cssText = `
  position: fixed;
  top: 20px;
  left: 20px;
  background: rgba(0,0,0,0.85);
  color: white;
  padding: 12px;
  border-radius: 8px;
  z-index: 2147483647; /* above everything */
  font-family: Arial, sans-serif;
  font-size: 14px;
  pointer-events: auto;
  max-width: 250px;
`;

// Generate command hints from VOICE_COMMANDS
const commandHints = Object.values(VOICE_COMMANDS)
  .slice(0, 6) // Show first 6 commands as examples
  .map(cmd => cmd.triggers[0])
  .join('", "');

panel.innerHTML = `
  <strong>Voice Controller</strong><br>
  <button id="vgc-toggle" style="width:100%;padding:6px;margin-top:6px;">Start Listening</button>
  <div id="vgc-status" style="margin-top:8px;font-size:11px;color:#4ade80;">Ready</div>
  <div style="margin-top:8px;font-size:11px;color:#ccc;">
    Examples: "${commandHints}"<br>
    <span style="color:#888;">+ ${Object.keys(VOICE_COMMANDS).length - 6} more commands</span>
  </div>
  <button id="voice-btn" style="width:100%;padding:6px;margin-top:8px;">voices</button>
`;

document.body.appendChild(panel);

// ===== Voice Recognition Setup =====
let recognizing = false;
let recognition;

if ("webkitSpeechRecognition" in window) {
  recognition = new webkitSpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = false;
  recognition.lang = "en-US";

  recognition.onresult = (event) => {
    const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    console.log(" Heard:", transcript);
    
    // Update status display
    const statusEl = document.getElementById("vgc-status");
    if (statusEl) {
      statusEl.textContent = `Heard: "${transcript}"`;
      statusEl.style.color = "#60a5fa";
    }

    // Check all commands for matching triggers
    let commandExecuted = false;
    for (const [commandName, command] of Object.entries(VOICE_COMMANDS)) {
      for (const trigger of command.triggers) {
        if (transcript.includes(trigger)) {
          console.log(` Executing command: ${commandName}`);
          try {
            command.action();
            commandExecuted = true;
            if (statusEl) {
              statusEl.textContent = `✓ ${command.description}`;
              statusEl.style.color = "#4ade80";
            }
            break;
          } catch (error) {
            console.error(` Error executing ${commandName}:`, error);
            if (statusEl) {
              statusEl.textContent = `Error: ${commandName}`;
              statusEl.style.color = "#ef4444";
            }
          }
        }
      }
      if (commandExecuted) break;
    }

    // Debug logging
    console.log(` Transcript: "${transcript}", commandExecuted: ${commandExecuted}, includes gemini: ${transcript.includes("gemini")}`);

    // Special handling for "gemini" keyword - turn green but do nothing

    if (!commandExecuted && statusEl) {
      statusEl.textContent = `Unknown: "${transcript}"`;
      statusEl.style.color = "#fbbf24";
      setTimeout(() => {
        statusEl.textContent = "Listening...";
        statusEl.style.color = "#4ade80";
      }, 2000);
    }
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error:", event.error);
  };
} else {
  console.warn(" Web Speech API not supported in this browser.");
}

// ===== Button Toggle =====
const toggleBtn = document.getElementById("vgc-toggle");

toggleBtn.onclick = () => {
  const statusEl = document.getElementById("vgc-status");
  
  if (!recognition) {
    alert("Speech Recognition not supported in this browser.");
    return;
  }

  if (!recognizing) {
    recognition.start();
    recognizing = true;
    toggleBtn.innerText = "Stop Listening";
    toggleBtn.style.background = "#ef4444";
    if (statusEl) {
      statusEl.textContent = "Listening...";
      statusEl.style.color = "#4ade80";
    }
    console.log(" Voice recognition started");
  } else {
    recognition.stop();
    recognizing = false;
    toggleBtn.innerText = "Start Listening";
    toggleBtn.style.background = "";
    if (statusEl) {
      statusEl.textContent = "Ready";
      statusEl.style.color = "#4ade80";
    }
    console.log(" Voice recognition stopped");
  }
};

// ===== Voice Button Handler =====
const voiceBtn = document.getElementById("voice-btn");

voiceBtn.onclick = () => {
  window.open("http://127.0.0.1:5000/", "_blank");
  console.log(" Voice button clicked - opening http://127.0.0.1:5000/");
};
