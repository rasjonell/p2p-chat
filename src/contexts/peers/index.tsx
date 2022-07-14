import { createContext, PropsWithChildren, useEffect, useState } from 'react';

import Peer from 'peerjs';

type Maybe<T> = T | null;

interface PeerContextData {
  id: Maybe<string>;
  peer: Maybe<Peer>;
}

export const PeersContext = createContext<PeerContextData>({
  id: null,
  peer: null,
});

const PeersContextProvider: React.FC<PropsWithChildren> = (props) => {
  const [id, setId] = useState<Maybe<string>>(null);
  const [peer] = useState(new Peer());

  useEffect(() => {
    peer.on('open', (newId: string) => {
      setId(newId);
    });
  }, [peer]);

  return <PeersContext.Provider value={{ id, peer }} {...props} />;
};

export default PeersContextProvider;
