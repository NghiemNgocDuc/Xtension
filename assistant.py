import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write
import requests
import io
import json
import google.generativeai as genai


# 🔑 API keys
ELEVEN_API_KEY = "Your API Key"
GEMINI_API_KEY = "Your API Key"


# 🎛 Settings
SAMPLE_RATE = 16000  # ElevenLabs requirement
DURATION = 5  # seconds per recording


# ⚙️ Configure Gemini
genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("models/gemini-2.5-flash")


def record_audio(duration=DURATION, fs=SAMPLE_RATE):
   """Record audio from the microphone."""
   print("[MIC] Listening...")
   audio = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype="int16")
   sd.wait()
   return audio


def transcribe_audio(audio):
   """Send recorded audio to ElevenLabs Speech-to-Text API."""
   wav_io = io.BytesIO()
   write(wav_io, SAMPLE_RATE, audio)
   wav_io.seek(0)


   response = requests.post(
       "https://api.elevenlabs.io/v1/speech-to-text",
       headers={
           "xi-api-key": ELEVEN_API_KEY,
       },
       data={
           "model_id": "scribe_v1",
       },
       files={
           "file": ("audio.wav", wav_io, "audio/wav"),
       },
   )


   if response.status_code == 200:
       result = json.loads(response.text)
       return result.get("text", "").strip()
   else:
       print("[ERROR]", response.text)
       return None


def one_sentence_reply(user_input):
   """Generate a one-sentence reply using Gemini 2.5 Flash."""
   prompt = f"Respond in exactly one sentence: {user_input}"
   response = model.generate_content(prompt)
   return response.text.strip()


def speak_text(text, voice_id="CHOOSE YOUR VOICE ID"): # Choose a voice ID from the ElevenLabs website
   """Convert text to speech using ElevenLabs TTS and play it."""
   url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
   headers = {
       "xi-api-key": ELEVEN_API_KEY,
       "Content-Type": "application/json"
   }
   payload = {
       "text": text,
       "voice_settings": {
           "stability": 0.7,
           "similarity_boost": 0.7
       }
   }


   response = requests.post(url, headers=headers, data=json.dumps(payload))
   if response.status_code == 200:
       audio_data = io.BytesIO(response.content)
       import soundfile as sf
       data, samplerate = sf.read(audio_data, dtype="int16")
       sd.play(data, samplerate)
       sd.wait()
   else:
       print("[ERROR TTS]", response.text)




def main():
   print(" Speak now! Say 'stop' to exit.\n")
   while True:
       audio = record_audio()
       text = transcribe_audio(audio)


       if text:
           print("You said:", text)


           if "stop" in text.lower():
               print(" Stopping.")
               break


           # Only trigger Gemini if "gemini" keyword is found
           if "gemini" in text.lower():
               reply = one_sentence_reply(text)
               print("Gemini:", reply)
               speak_text(reply)


if __name__ == "__main__":
   main()

