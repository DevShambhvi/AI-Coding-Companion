import React from 'react';
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const SpeechInput: React.FC<{ onTranscript: (text: string) => void }> = ({ onTranscript }) => {
  const { transcript, listening, resetTranscript } = useSpeechRecognition();

  const handleStartListening = () => {
    SpeechRecognition.startListening({ continuous: true });
  };

  const handleStopListening = () => {
    SpeechRecognition.stopListening();
    onTranscript(transcript);
  };

  return (
    <div>
      <button onClick={handleStartListening} disabled={listening}>
        Start Listening
      </button>
      <button onClick={handleStopListening} disabled={!listening}>
        Stop Listening
      </button>
      <button onClick={resetTranscript}>Clear</button>
      <p>Transcript: {transcript}</p>
    </div>
  );
};

export default SpeechInput;
