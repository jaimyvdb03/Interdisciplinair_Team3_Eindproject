// Streams every captured frame (including silence) so the upstream server-side
// VAD can detect end-of-turn. Dropping silent frames breaks turn-taking.
class PcmCapture extends AudioWorkletProcessor {
  constructor() {
    super();
    this.bufferSize = 2048;
    this.buffer = new Float32Array(this.bufferSize);
    this.offset = 0;
  }
  process(inputs) {
    const input = inputs[0];
    if (!input || !input[0]) return true;
    const channel = input[0];
    for (let i = 0; i < channel.length; i++) {
      this.buffer[this.offset++] = channel[i];
      if (this.offset >= this.bufferSize) {
        this.port.postMessage(this.buffer.slice(0, this.bufferSize));
        this.offset = 0;
      }
    }
    return true;
  }
}
registerProcessor('pcm-capture', PcmCapture);
