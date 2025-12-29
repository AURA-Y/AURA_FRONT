import { useEffect, useState, useRef } from "react";

export function useNoiseGate(
  sourceStream: MediaStream | null,
  threshold = 0.02,
  attack = 0.1,
  release = 0.5
) {
  const [processedStream, setProcessedStream] = useState<MediaStream | null>(null);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const destNodeRef = useRef<MediaStreamAudioDestinationNode | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastUiUpdate = useRef<number>(0);

  useEffect(() => {
    if (!sourceStream) {
      setProcessedStream(null);
      return;
    }

    const audioTrack = sourceStream.getAudioTracks()[0];
    if (!audioTrack) {
      setProcessedStream(sourceStream); // No audio to process
      return;
    }

    // Initialize AudioContext
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    const ctx = new AudioContextClass();
    audioContextRef.current = ctx;

    // Create Nodes
    const sourceNode = ctx.createMediaStreamSource(sourceStream);
    const gainNode = ctx.createGain();
    const destNode = ctx.createMediaStreamDestination();
    const analyser = ctx.createAnalyser();

    // Config Analyser
    analyser.fftSize = 512;
    gainNode.gain.value = 0; // Start muted

    // Connect Graph: Source -> Analyser -> Gain -> Destination
    // Note: Analyser doesn't modify audio, usually tap it from source
    // But we need to gate the output.
    sourceNode.connect(analyser);
    sourceNode.connect(gainNode);
    gainNode.connect(destNode);

    sourceNodeRef.current = sourceNode;
    gainNodeRef.current = gainNode;
    destNodeRef.current = destNode;
    analyserRef.current = analyser;

    // Combine processed audio with original video (if any)
    const newStream = destNode.stream;
    const originalVideoTracks = sourceStream.getVideoTracks();
    originalVideoTracks.forEach((track) => newStream.addTrack(track));

    setProcessedStream(newStream);

    // Gate Logic
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let lastSpokeTime = 0;

    const process = () => {
      // Analyze current volume
      analyser.getByteFrequencyData(dataArray);
      let sum = 0;
      for (let i = 0; i < bufferLength; i++) {
        sum += dataArray[i] * dataArray[i];
      }
      const rms = Math.sqrt(sum / bufferLength);
      const normalizedVol = rms / 255; // 0.0 to 1.0

      const now = ctx.currentTime;

      // Throttle UI updates for speaking state to ~10fps (100ms)
      if (now - lastUiUpdate.current > 0.1) {
        const currentlySpeaking = normalizedVol > threshold;
        setIsSpeaking((prev) => {
          // Only update if state actually changed to avoid unnecessary re-renders
          return prev !== currentlySpeaking ? currentlySpeaking : prev;
        });
        lastUiUpdate.current = now;
      }

      if (normalizedVol > threshold) {
        // Open Gate (Attack)
        gainNode.gain.cancelScheduledValues(now);
        gainNode.gain.setTargetAtTime(1, now, attack);
        lastSpokeTime = now;
      } else if (now - lastSpokeTime > release) {
        // Close Gate (Release)
        // If silence duration passed release time, fade out
        gainNode.gain.setTargetAtTime(0, now, release / 5); // Faster fade out once decided
      }

      rafRef.current = requestAnimationFrame(process);
    };

    process();

    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (ctx.state !== "closed") ctx.close();
    };
  }, [sourceStream, threshold, attack, release]);

  return { stream: processedStream, isSpeaking };
}
