
type VoiceRecognitionOptions = {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
};

class VoiceRecognitionService {
  private recognition: SpeechRecognition | null = null;
  private isListening: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
      }
    }
  }

  public start({ onResult, onError }: VoiceRecognitionOptions): boolean {
    if (!this.recognition) {
      onError("Speech recognition is not supported in this browser");
      return false;
    }

    if (this.isListening) {
      return true;
    }

    try {
      this.recognition.onresult = (event) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript;
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          onResult(finalTranscript, true);
        } else if (interimTranscript) {
          onResult(interimTranscript, false);
        }
      };

      this.recognition.onerror = (event) => {
        onError(`Speech recognition error: ${event.error}`);
      };

      this.recognition.start();
      this.isListening = true;
      return true;
    } catch (error) {
      onError(`Error initializing speech recognition: ${error}`);
      return false;
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
      this.isListening = false;
    }
  }

  public isSupported(): boolean {
    return !!this.recognition;
  }
}

const voiceRecognitionService = new VoiceRecognitionService();
export default voiceRecognitionService;
