import React from 'react';

export default async function setLocalStream(
  videoRef: React.MutableRefObject<HTMLVideoElement | null>
): Promise<MediaStream | undefined> {
  // if (!videoRef || (videoRef.srcObject && videoRef.paused)) return;
  if (!videoRef.current) return;
  if (videoRef.current.srcObject) return videoRef.current.srcObject as MediaStream;

  const stream = await navigator.mediaDevices.getUserMedia({
    video: true,
    audio: true,
  });

  videoRef.current.srcObject = stream;
  videoRef.current.play();

  return stream;
}
