// Shared realtime-audio plumbing for the voice pages (Sanne + Pim/Trivia).
// Pure PCM helpers plus a capture pipeline and a playback scheduler. Framework
// agnostic — the React pages wire these to their WebSocket and UI state.

export const TARGET_RATE = 24000; // we send 24 kHz PCM16 upstream
export const SAMPLE_RATE = 24000; // realtime audio comes back at 24 kHz

export function floatTo16BitPCM(input) {
  const out = new Int16Array(input.length);
  for (let i = 0; i < input.length; i++) {
    const s = Math.max(-1, Math.min(1, input[i]));
    out[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return out;
}

export function b64FromBytes(bytes) {
  let binary = '';
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode.apply(null, bytes.subarray(i, i + chunk));
  return btoa(binary);
}

export function bytesFromB64(b64) {
  const binary = atob(b64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export function resample(input, srcRate, dstRate) {
  if (srcRate === dstRate) return input;
  const ratio = srcRate / dstRate;
  const outLen = Math.floor(input.length / ratio);
  const out = new Float32Array(outLen);
  for (let i = 0; i < outLen; i++) {
    const idx = i * ratio;
    const i0 = Math.floor(idx);
    const i1 = Math.min(i0 + 1, input.length - 1);
    const t = idx - i0;
    out[i] = input[i0] * (1 - t) + input[i1] * t;
  }
  return out;
}

// ── Microphone capture → 24 kHz PCM16 base64 frames ──────────────────────────
// onFrame(b64) is called for each captured chunk; shouldSend() gates streaming
// (used for push-to-talk). Returns a handle with async teardown().
export async function createCapture(mediaStream, onFrame, shouldSend) {
  const AC = window.AudioContext || window.webkitAudioContext;
  let audioCtx;
  try {
    audioCtx = new AC();
    if (audioCtx.state === 'suspended') await audioCtx.resume();
  } catch (e) { return null; }

  const srcRate = audioCtx.sampleRate;
  let sourceNode = null;
  let workletNode = null;

  const emit = (float32) => {
    if (shouldSend && !shouldSend()) return;
    const down = resample(float32, srcRate, TARGET_RATE);
    const pcm = floatTo16BitPCM(down);
    onFrame(b64FromBytes(new Uint8Array(pcm.buffer)));
  };

  try {
    await audioCtx.audioWorklet.addModule('/pcm-worklet.js');
    if (audioCtx.state === 'suspended') await audioCtx.resume();
    sourceNode = audioCtx.createMediaStreamSource(mediaStream);
    workletNode = new AudioWorkletNode(audioCtx, 'pcm-capture');
    workletNode.port.onmessage = (e) => emit(e.data);
    sourceNode.connect(workletNode);
    const silent = audioCtx.createGain();
    silent.gain.value = 0;
    workletNode.connect(silent);
    silent.connect(audioCtx.destination);
  } catch (err) {
    // Fallback for browsers without AudioWorklet.
    try {
      sourceNode = audioCtx.createMediaStreamSource(mediaStream);
      const proc = audioCtx.createScriptProcessor(4096, 1, 1);
      proc.onaudioprocess = (ev) => emit(ev.inputBuffer.getChannelData(0));
      sourceNode.connect(proc);
      const silent = audioCtx.createGain();
      silent.gain.value = 0;
      proc.connect(silent);
      silent.connect(audioCtx.destination);
      workletNode = proc;
    } catch (e2) {
      try { await audioCtx.close(); } catch (e3) {}
      return null;
    }
  }

  return {
    async teardown() {
      try { workletNode && workletNode.disconnect(); } catch (e) {}
      try { sourceNode && sourceNode.disconnect(); } catch (e) {}
      try { await audioCtx.close(); } catch (e) {}
    },
  };
}

// ── Playback scheduler — queues 24 kHz PCM16 chunks gaplessly ────────────────
export function createPlayback() {
  const AC = window.AudioContext || window.webkitAudioContext;
  let ctx = null;
  let head = 0;
  const pending = [];
  let ready = false;
  let stopped = false;

  function start() {
    stopped = false;
    try {
      ctx = new AC({ sampleRate: SAMPLE_RATE });
      head = ctx.currentTime;
      ready = true;
    } catch (e) { ctx = null; ready = false; }
  }

  function schedule(int16) {
    if (!ctx) return;
    const float = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) float[i] = int16[i] / 0x8000;
    const buf = ctx.createBuffer(1, float.length, SAMPLE_RATE);
    buf.copyToChannel(float, 0);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    const startAt = Math.max(ctx.currentTime, head);
    src.start(startAt);
    head = startAt + buf.duration;
  }

  function playInt16(int16) {
    if (stopped) return; // dropped after teardown — no orphaned queueing
    if (!ctx || !ready) { pending.push(int16); return; }
    while (pending.length) schedule(pending.shift());
    schedule(int16);
  }

  function playB64(b64) {
    const bytes = bytesFromB64(b64);
    playInt16(new Int16Array(bytes.buffer, bytes.byteOffset, Math.floor(bytes.byteLength / 2)));
  }

  async function stop() {
    stopped = true;
    head = 0; pending.length = 0; ready = false;
    const c = ctx; ctx = null;
    if (c) { try { await c.close(); } catch (e) {} }
  }

  return { start, playInt16, playB64, stop };
}
