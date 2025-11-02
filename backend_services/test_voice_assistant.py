import os
import sys

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from backend_services.voice_assistant import voice_chat

def test_voice_chat_flow():
    # Construct the absolute path to the audio file
    audio_file_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', 'frontend_dashboard', 'assets', 'audio', 'voice_reference.wav'))

    try:
        with open(audio_file_path, "rb") as audio_file:
            audio_data = audio_file.read()
    except FileNotFoundError:
        print(f"Error: Audio file not found at {audio_file_path}")
        return

    print("Audio file read successfully. Calling voice_chat...")
    transcribed_text, audio_response = voice_chat(audio_data)

    if transcribed_text:
        print(f"Transcribed text: {transcribed_text}")
    else:
        print("Transcription failed.")

    if audio_response:
        response_file_path = os.path.join(os.path.dirname(__file__), 'test_audio_response.mp3')
        with open(response_file_path, "wb") as audio_file:
            audio_file.write(audio_response)
        print(f"Audio response saved to {response_file_path}")
    else:
        print("No audio response received.")

if __name__ == "__main__":
    test_voice_chat_flow()
