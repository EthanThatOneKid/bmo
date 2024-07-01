export async function GET(request: Request) {
  const text = new URL(request.url).searchParams.get("text");
  if (text === null) {
    return new Response("Missing text", { status: 400 });
  }

  const response = await synthesizeSpeech(text);
  const data = await response.json();
  if (!response.ok) {
    return new Response("Failed to synthesize speech", { status: 500 });
  }

  // The audio data bytes encoded as specified in the request, including the
  // header for encodings that are wrapped in containers (e.g. MP3, OGG_OPUS).
  // For LINEAR16 audio, we include the WAV header. Note: as with all bytes
  // fields, protobuffers use a pure binary representation, whereas JSON
  // representations use base64.
  const blob = new Blob(
    [Uint8Array.from(atob(data.audioContent), (c) => c.charCodeAt(0))],
    { type: "audio/mpeg" }
  );
  return new Response(blob, {
    headers: {
      "Content-Type": "audio/mpeg",
      "Content-Disposition": 'attachment; filename="speech.mp3"',
    },
  });
}

async function synthesizeSpeech(text: string) {
  if (process.env.GOOGLE_TTS_API_KEY === undefined) {
    throw new Error("GOOGLE_TTS_API_KEY is not set");
  }

  const url = new URL(
    "https://texttospeech.googleapis.com/v1beta1/text:synthesize"
  );
  url.searchParams.append("key", process.env.GOOGLE_TTS_API_KEY);
  return fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    // https://cloud.google.com/text-to-speech/docs/reference/rest/v1beta1/text/synthesize#request-body
    body: JSON.stringify({
      input: { text },
      voice: { languageCode: "en-US", ssmlGender: "NEUTRAL" },
      audioConfig: { audioEncoding: "MP3" },
    }),
  });
}
