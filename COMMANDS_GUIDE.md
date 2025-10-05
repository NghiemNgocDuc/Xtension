# Voice Commands Guide

## Available Commands

Your extension now supports **15+ voice commands** out of the box!

### Scrolling Commands
- **"up"** / "scroll up" / "go up" - Scroll page up
- **"down"** / "scroll down" / "go down" - Scroll page down
- **"left"** / "scroll left" / "go left" - Scroll page left
- **"right"** / "scroll right" / "go right" - Scroll page right
- **"top"** / "scroll to top" / "go to top" - Scroll to top of page
- **"bottom"** / "scroll to bottom" / "go to bottom" - Scroll to bottom of page

### Tab Commands
- **"new tab"** / "open tab" / "open new tab" - Open a new tab
- **"close tab"** / "close this tab" / "close current tab" - Close current tab
- **"close other tabs"** / "close all other tabs" - Close all tabs except current
- **"duplicate tab"** / "duplicate this tab" / "copy tab" - Duplicate current tab

### Page Commands
- **"refresh"** / "reload" / "refresh page" / "reload page" - Refresh the current page
- **"back"** / "go back" / "previous page" - Go back to previous page
- **"forward"** / "go forward" / "next page" - Go forward to next page

### Zoom Commands
- **"zoom in"** / "bigger" / "increase zoom" - Zoom in (increase page size)
- **"zoom out"** / "smaller" / "decrease zoom" - Zoom out (decrease page size)
- **"reset zoom"** / "normal zoom" / "default zoom" - Reset zoom to 100%

---

##  How to Add Your Own Commands

Adding custom voice commands is super easy! Just edit the `commands.js` file.

### Step 1: Open commands.js
Navigate to: `extension/commands.js`

### Step 2: Add Your Command
Scroll to the bottom of the `VOICE_COMMANDS` object and add your command using this template:

```javascript
your_command_name: {
  triggers: ["phrase 1", "phrase 2", "phrase 3"],
  description: "What this command does",
  action: () => {
    // Your JavaScript code here
    console.log("Command executed!");
  }
},
```

### Step 3: Examples

#### Example 1: Click a Button
```javascript
click_play_button: {
  triggers: ["play", "start video", "play video"],
  description: "Click the play button",
  action: () => {
    const playBtn = document.querySelector('button[aria-label="Play"]');
    if (playBtn) playBtn.click();
  }
},
```

#### Example 2: Navigate to a Website
```javascript
open_google: {
  triggers: ["open google", "go to google", "google"],
  description: "Open Google in new tab",
  action: () => {
    chrome.runtime.sendMessage({ 
      action: "open_new_tab", 
      url: "https://www.google.com" 
    });
  }
},
```

#### Example 3: Fill a Form Field
```javascript
fill_search: {
  triggers: ["search for cats", "find cats"],
  description: "Search for cats",
  action: () => {
    const searchBox = document.querySelector('input[type="search"]');
    if (searchBox) {
      searchBox.value = "cats";
      searchBox.dispatchEvent(new Event('input', { bubbles: true }));
    }
  }
},
```

#### Example 4: Toggle Dark Mode
```javascript
toggle_dark_mode: {
  triggers: ["dark mode", "toggle dark mode", "night mode"],
  description: "Toggle dark mode",
  action: () => {
    document.body.classList.toggle('dark-mode');
    document.body.style.filter = 
      document.body.style.filter === 'invert(1)' ? '' : 'invert(1)';
  }
},
```

#### Example 5: Take a Screenshot (requires additional permissions)
```javascript
take_screenshot: {
  triggers: ["screenshot", "take screenshot", "capture screen"],
  description: "Take a screenshot",
  action: () => {
    chrome.runtime.sendMessage({ action: "take_screenshot" });
  }
},
```

---

## Tips for Creating Commands

1. **Multiple Triggers**: Add multiple ways to say the same command for better recognition
   ```javascript
   triggers: ["close tab", "close this", "shut this tab"]
   ```

2. **Be Specific**: Use specific phrases to avoid conflicts
   ```javascript
   // Good
   triggers: ["scroll to top"]
   
   // Avoid (too generic, might trigger accidentally)
   triggers: ["top"]
   ```

3. **Test Your Commands**: 
   - Reload the extension after making changes
   - Open the browser console (F12) to see command execution logs
   - Say your trigger phrase and check if it executes

4. **Use Console Logs**: Add logs to debug your commands
   ```javascript
   action: () => {
     console.log("My command is running!");
     // your code here
   }
   ```

5. **Error Handling**: Wrap risky code in try-catch
   ```javascript
   action: () => {
     try {
       // your code
     } catch (error) {
       console.error("Command failed:", error);
     }
   }
   ```

---

##  Reloading After Changes

After editing `commands.js`:
1. Go to `chrome://extensions/`
2. Find "Voice Game Controller"
3. Click the **Reload** button ()
4. Refresh any open tabs where you want to use the new commands

---

##  Using the Extension

1. Click the extension icon to open the popup
2. On any webpage, you'll see a floating control panel
3. Click **"Start Listening"** to begin voice recognition
4. Speak your commands clearly
5. Watch the status indicator show what was heard and executed

---

##  Troubleshooting

**Command not working?**
- Check the browser console (F12) for errors
- Make sure your trigger phrase is in the `triggers` array
- Verify the extension is reloaded after changes

**Voice not recognized?**
- Speak clearly and at a normal pace
- Check your microphone permissions
- Try different trigger phrases

**Tab commands not working?**
- Make sure the `tabs` permission is in `manifest.json`
- Check the background.js console for errors

---

##  Advanced: Background Script Commands

Some commands need to run in the background script (like opening/closing tabs). 

To add a background command:

1. Add the handler in `background.js`:
```javascript
if (msg && msg.action === "your_action") {
  // Your code here
  sendResponse({ success: true });
  return true;
}
```

2. Call it from `commands.js`:
```javascript
your_command: {
  triggers: ["your phrase"],
  description: "What it does",
  action: () => {
    chrome.runtime.sendMessage({ action: "your_action" }, (response) => {
      console.log("Done!", response);
    });
  }
}
```

---

Happy voice commanding! 
