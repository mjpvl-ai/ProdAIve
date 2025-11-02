from google.cloud import speech
from google.cloud import texttospeech
import requests

def transcribe_audio(audio_data):
    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(content=audio_data)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.WEBM_OPUS,
        sample_rate_hertz=48000,
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)

    if not response.results:
        return None

    return response.results[0].alternatives[0].transcript

def synthesize_speech(text):
    client = texttospeech.TextToSpeechClient()

    synthesis_input = texttospeech.SynthesisInput(text=text)

    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US", ssml_gender=texttospeech.SsmlVoiceGender.NEUTRAL
    )

    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3
    )

    response = client.synthesize_speech(
        input=synthesis_input, voice=voice, audio_config=audio_config
    )

    return response.audio_content

def voice_chat(audio_data):
    transcribed_text = transcribe_audio(audio_data)

    if not transcribed_text:
        return None, None

    response = requests.post(
        "http://127.0.0.1:8001/api/agent_chat",
        json={"message": transcribed_text, "history": []},
    )

    if response.status_code != 200:
        return None, None

    chat_response = response.json()
    response_text = chat_response.get("text")

    if not response_text:
        return transcribed_text, None

    audio_response = synthesize_speech(response_text)

    return transcribed_text, audio_response
