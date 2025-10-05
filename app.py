import sounddevice as sd
import numpy as np
from scipy.io.wavfile import write
import requests
import io
import json




ELEVEN_API_KEY = ("Your API Key")


# Audio settings
SAMPLE_RATE = 44100  # ElevenLabs accepts common formats like 44100 Hz
DURATION = 10        # seconds of recording


def record_audio(duration=DURATION, fs=SAMPLE_RATE):
   """Record audio from microphone and return as BytesIO WAV."""
   print(f" Recording for {duration} seconds... Speak naturally!")
   audio = sd.rec(int(duration * fs), samplerate=fs, channels=1, dtype="int16")
   sd.wait()
   wav_io = io.BytesIO()
   write(wav_io, fs, audio)
   wav_io.seek(0)
   print(" Recording finished.")
   return wav_io


def clone_voice(name, wav_io, description="Instant cloned voice"):
   """Clone voice instantly using ElevenLabs Instant Voice Cloning API."""
   url = "https://api.elevenlabs.io/v1/voices/add"
   headers = {
       "xi-api-key": ELEVEN_API_KEY,
   }


   data = {
       "name": name,
       "description": description,
       "labels": json.dumps({"accent": "user", "source": "mic"}),
   }


   files = {
       "files": ("voice_sample.wav", wav_io, "audio/wav")
   }


   print(" Uploading to ElevenLabs...")
   response = requests.post(url, headers=headers, data=data, files=files)


   if response.status_code == 200:
       result = response.json()
       voice_id = result.get("voice_id")
       print(f" Voice cloned successfully! Voice ID: {voice_id}")
       return voice_id
   else:
       print(" Error cloning voice:", response.status_code, response.text)
       return None


def main():
   print(" Welcome to Instant Voice Cloner!")
   print("You’ll record a short sample (default 10 seconds).")
   input("Press Enter to start recording...")


   wav_io = record_audio()
   name = input(" Enter a name for your new voice: ")


   voice_id = clone_voice(name, wav_io)
   if voice_id:
       print(f" Voice '{name}' created successfully!")
       print(f" Voice ID: {voice_id}")
   else:
       print(" Voice cloning failed. Check your API key or try again.")


if __name__ == "__main__":
   main()
