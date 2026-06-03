import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';

export default function Videocall() {
  const { roomId } = useParams();
  const jitsiContainer = useRef(null);

  useEffect(() => {
    const domain = 'meet.jit.si';
    const options = {
      roomName: roomId,
      parentNode: jitsiContainer.current,
      width: '100%',
      height: 600,
    };
    const api = new window.JitsiMeetExternalAPI(domain, options);
    return () => api.dispose();
  }, [roomId]);

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Video Call Room: {roomId}</h2>
      <div ref={jitsiContainer}></div>
    </div>
  );
}
