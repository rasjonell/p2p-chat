import { ChangeEventHandler, useCallback, useContext, useEffect, useRef, useState } from 'react';

import { FaRegCopy } from 'react-icons/fa';

import { MediaConnection } from 'peerjs';
import { PeersContext } from './contexts/peers';
import setLocalStream from './helpers/setLocalStream';

import './App.css';

export default function App() {
  const { peer, id } = useContext(PeersContext);
  const localVideo = useRef<HTMLVideoElement | null>(null);
  const remoteVideo = useRef<HTMLVideoElement | null>(null);
  const [calleeId, setCalleeId] = useState<string | null>(null);
  const [currentCall, setCurrentCall] = useState<MediaConnection | null>(null);

  const endCall = useCallback(() => {
    if (!(currentCall && remoteVideo.current)) return;

    currentCall.close();
    setCurrentCall(null);

    remoteVideo.current.srcObject = null;
  }, [currentCall]);

  useEffect(() => {
    if (!(peer && localVideo.current)) return;

    setLocalStream(localVideo);

    peer.on('call', async (call) => {
      const stream = await setLocalStream(localVideo);

      const acceptsTheCall = window.confirm(`Accept call from ${call.peer}?`);
      if (!acceptsTheCall) return call.close();

      call.answer(stream);
      setCurrentCall(call);

      call.on('stream', (remoteStream) => {
        console.log(remoteStream);
        if (!remoteVideo.current) return;

        remoteVideo.current.srcObject = remoteStream;
        remoteVideo.current.play();
      });

      // Doesn't work: https://github.com/peers/peerjs/issues/636
      call.on('close', endCall);
    });
  }, [endCall, peer]);

  const handleCalleeIdChange: ChangeEventHandler<HTMLInputElement> = ({ target: { value } }) => {
    setCalleeId(value);
  };

  const copyId = () => {
    if (!id) return;
    navigator.clipboard.writeText(id);
  };

  const callUser = async () => {
    const stream = await setLocalStream(localVideo);

    if (!(stream && peer && calleeId)) return;

    if (calleeId === id) {
      return alert('cannot call yourself');
    }

    const call = peer.call(calleeId, stream);

    call.on('stream', (stream) => {
      if (!remoteVideo.current) return;

      remoteVideo.current.srcObject = stream;
      remoteVideo.current.play();
    });

    call.on('close', endCall);
    call.on('iceStateChanged', (state) => {
      if (['closed', 'disconnected'].includes(state)) {
        endCall();
      }
    });

    setCurrentCall(call);
  };

  return (
    <div>
      <h1>WebRTC Video Chat</h1>
      {!currentCall ? (
        <>
          <h4>Share your ID to get a call</h4>
          <div className="peer-id">
            <pre>
              {id ? (
                <span className="peer-id-span">
                  {id} <FaRegCopy className="clickable-icon" onClick={copyId} />
                </span>
              ) : (
                'loading ...'
              )}
            </pre>
          </div>
        </>
      ) : null}

      <div className="buttons">
        <input type="text" onChange={handleCalleeIdChange} placeholder="Enter Your Peer's ID" />

        {currentCall ? (
          <button className="button" onClick={endCall}>
            End Call
          </button>
        ) : (
          <button
            onClick={callUser}
            disabled={!calleeId}
            className={`${calleeId ? 'button' : 'disabled'}`}
          >
            Call
          </button>
        )}
      </div>

      <div className="videos">
        <div>
          <video ref={localVideo} />
          <h3>You - {peer?.id?.split('-')[0]}</h3>
        </div>
        <div>
          <video ref={remoteVideo} />
          <h3>{currentCall ? currentCall.peer.split('-')[0] : 'Your Peer'}</h3>
        </div>
      </div>
    </div>
  );
}
