# Voice Controlling Project Documentation

This document explains the structure and purpose of each file in the Voice Controlling project.

## Project Overview

This project combines voice recognition, AI-powered voice cloning, and browser automation to create a comprehensive voice control system. It includes a Python backend for voice cloning and a browser extension for voice commands.

## Main Directory Files

### `app.py`
**Purpose**: Main Flask web application server
- Handles voice cloning using ElevenLabs API
- Provides endpoints for voice recording and cloning
- Serves the web interface for voice management
- Records audio from microphone and processes it for ElevenLabs API

**Key Features**:
- Audio recording with sounddevice
- WAV file processing with scipy
- ElevenLabs API integration for instant voice cloning

### `assistant.py`
**Purpose**: AI assistant functionality with voice capabilities
- Integrates Google Gemini AI for conversational responses
- Text-to-speech using ElevenLabs API
- Voice activity detection and audio processing
- Conversation management and context handling

**Key Features**:
- Google Generative AI integration
- ElevenLabs text-to-speech
- Audio playback and voice response system

### `requirements.txt`
**Purpose**: Python dependencies specification
- Lists all required Python packages with versions
- Includes Flask, sounddevice, numpy, scipy, requests, python-dotenv, and google-generativeai

### `.env`
**Purpose**: Environment variables configuration
- Stores API keys for ElevenLabs and Google Gemini
- Contains sensitive configuration data

### `COMMANDS_GUIDE.md`
**Purpose**: Documentation for voice commands
- Explains how to use the voice control system
- Lists available voice commands for browser automation

### `testing.html`
**Purpose**: Testing interface for voice functionality
- Provides a simple web interface for testing voice features
- Used for development and debugging voice commands

### `desktop.ini`
**Purpose**: Windows system file (can be ignored)
- Desktop configuration file created by Windows

## Extension Directory (`/extension/`)

### `manifest.json`
**Purpose**: Browser extension configuration
- Defines extension permissions and metadata
- Specifies content scripts and background scripts
- Configures extension behavior and capabilities

**Key Features**:
- Manifest V3 format
- Permissions for storage, scripting, activeTab, tabs
- Host permissions for all websites
- Content scripts for voice command injection

### `content.js`
**Purpose**: Main content script for voice command processing
- Injects voice control interface into web pages
- Handles speech recognition and command execution
- Creates floating control panel for voice interaction

**Key Features**:
- Web Speech API integration
- Floating UI panel creation
- Real-time speech recognition
- Command matching and execution

### `commands.js`
**Purpose**: Voice command definitions and handlers
- Contains all available voice commands
- Defines triggers and actions for each command
- Handles scrolling, navigation, and interaction commands

**Key Features**:
- Scroll commands (up, down, left, right, top, bottom)
- Tab management (new tab, close tab, switch tab)
- Page interaction (refresh, back, forward)
- Custom command definitions

### `background.js`
**Purpose**: Background service worker for the extension
- Handles extension lifecycle events
- Manages persistent functionality
- Coordinates between different extension components

### `popup.html` & `popup.js`
**Purpose**: Extension popup interface
- Provides quick access to extension settings
- Simple UI for toggling voice recognition
- Status display for current voice state

### `recorder.html` & `recorder.js`
**Purpose**: Audio recording interface
- Dedicated interface for voice sample recording
- Processes audio for voice cloning
- Handles audio upload and processing

## Templates Directory (`/templates/`)

### `index.html`
**Purpose**: Main web interface for voice cloning
- User-friendly interface for recording voice samples
- Voice ID management and selection
- Integration with Flask backend for voice cloning

**Key Features**:
- Audio recording interface
- Voice ID input and management
- Real-time voice cloning feedback

## Hidden Directories

### `.idea/`
**Purpose**: PyCharm IDE configuration (development files)
- Project settings and configuration for PyCharm
- Can be ignored for deployment

### `.venv/`
**Purpose**: Python virtual environment
- Isolated Python environment for dependencies
- Contains installed packages and Python binaries

## How It All Works Together

1. **Voice Cloning**: Use `app.py` or the web interface (`templates/index.html`) to record and clone voices using ElevenLabs API
2. **AI Assistant**: `assistant.py` provides conversational AI capabilities with voice responses
3. **Browser Control**: The extension (`/extension/`) injects voice control into web pages for hands-free navigation
4. **Voice Commands**: `commands.js` defines what voice commands do (scrolling, tab management, etc.)

## Setup Instructions

1. Install dependencies: `pip install -r requirements.txt`
2. Set up API keys in `.env` file
3. Run the Flask app: `python app.py`
4. Load the browser extension from the `/extension/` directory
5. Access the web interface at `http://localhost:5000`

This project creates a complete voice-controlled environment combining AI, voice cloning, and browser automation.
