// commands.js - Voice Command Configuration
// Add your custom voice commands here!

const VOICE_COMMANDS = {
  // ===== SCROLLING COMMANDS =====
  scroll_up: {
    triggers: ["up", "scroll up", "go up"],
    description: "Scroll page up",
    action: () => {
      window.scrollBy({ top: -200, behavior: "smooth" });
    }
  },
  
  scroll_down: {
    triggers: ["down", "scroll down", "go down"],
    description: "Scroll page down",
    action: () => {
      window.scrollBy({ top: 200, behavior: "smooth" });
    }
  },
  
  scroll_left: {
    triggers: ["left", "scroll left", "go left"],
    description: "Scroll page left",
    action: () => {
      window.scrollBy({ left: -200, behavior: "smooth" });
    }
  },
  
  scroll_right: {
    triggers: ["right", "scroll right", "go right"],
    description: "Scroll page right",
    action: () => {
      window.scrollBy({ left: 200, behavior: "smooth" });
    }
  },
  
  scroll_to_top: {
    triggers: ["top", "scroll to top", "go to top"],
    description: "Scroll to top of page",
    action: () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  },
  
  scroll_to_bottom: {
    triggers: ["bottom", "scroll to bottom", "go to bottom"],
    description: "Scroll to bottom of page",
    action: () => {
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
    }
  },
  
  // ===== TAB COMMANDS =====
  open_new_tab: {
    triggers: ["new tab", "open tab", "open new tab"],
    description: "Open a new tab",
    action: () => {
      chrome.runtime.sendMessage({ action: "open_new_tab" }, (response) => {
        console.log(" New tab opened");
      });
    }
  },
  
  close_tab: {
    triggers: ["close tab", "close this tab", "close current tab"],
    description: "Close current tab",
    action: () => {
      chrome.runtime.sendMessage({ action: "close_tab" }, (response) => {
        console.log(" Tab closed");
      });
    }
  },
  
  close_other_tabs: {
    triggers: ["close other tabs", "close all other tabs"],
    description: "Close all tabs except current",
    action: () => {
      chrome.runtime.sendMessage({ action: "close_other_tabs" }, (response) => {
        if (response && response.closed) {
          console.log(` Closed ${response.closed} tabs`);
        }
      });
    }
  },
  
  duplicate_tab: {
    triggers: ["duplicate tab", "duplicate this tab", "copy tab"],
    description: "Duplicate current tab",
    action: () => {
      chrome.runtime.sendMessage({ action: "duplicate_tab" }, (response) => {
        console.log(" Tab duplicated");
      });
    }
  },
  
  // ===== PAGE COMMANDS =====
  refresh_page: {
    triggers: ["refresh", "reload", "refresh page", "reload page"],
    description: "Refresh the current page",
    action: () => {
      window.location.reload();
    }
  },
  
  go_back: {
    triggers: ["back", "go back", "previous page"],
    description: "Go back to previous page",
    action: () => {
      window.history.back();
    }
  },
  
  go_forward: {
    triggers: ["forward", "go forward", "next page"],
    description: "Go forward to next page",
    action: () => {
      window.history.forward();
    }
  },
  
  // ===== ZOOM COMMANDS =====
  zoom_in: {
    triggers: ["zoom in", "bigger", "increase zoom"],
    description: "Zoom in (increase page size)",
    action: () => {
      document.body.style.zoom = (parseFloat(document.body.style.zoom || 1) + 0.1).toString();
    }
  },
  
  zoom_out: {
    triggers: ["zoom out", "smaller", "decrease zoom"],
    description: "Zoom out (decrease page size)",
    action: () => {
      document.body.style.zoom = (parseFloat(document.body.style.zoom || 1) - 0.1).toString();
    }
  },
  
  reset_zoom: {
    triggers: ["reset zoom", "normal zoom", "default zoom"],
    description: "Reset zoom to 100%",
    action: () => {
      document.body.style.zoom = "1";
    }
  },
  
  // ===== EXAMPLE: ADD YOUR OWN COMMANDS BELOW =====
  // Template for adding new commands:
  /*
  your_command_name: {
    triggers: ["phrase 1", "phrase 2", "phrase 3"],
    description: "What this command does",
    action: () => {
      // Your JavaScript code here
      console.log("Command executed!");
    }
  },
  */
};

// Export for use in content.js
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VOICE_COMMANDS;
}
