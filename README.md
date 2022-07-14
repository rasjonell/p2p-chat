# WebRTC P2P Video/Audio Chat

Check out the live app at https://rasjonell-p2p.netlify.app

## Using a Local Peer Discovery Server

By default the app uses `PeerJS` cloud peer discovery server.

In order to use a local Peer Discovery Server you need to install `peerjs` server:

```sh
$ npm install peer -g
```

Then run it locally:

```sh
$ peerjs --port 9000 --key peerjs --path /myapp

  Started PeerServer on ::, port: 9000, path: /myapp (v. 0.3.2)
```

Then you need to change the `PeerContext` connection in `contexts/peers/index.tsx`:

```diff
- const [peer] = useState(new Peer());

+ const [peer] = useState(new Peer({ host: 'localhost', port: 9000, path: '/myapp' }));
```

## Enabling HTTPS

In order to use `MediaDevices` you must have an HTTPS connects.

To enable HTTPS on the project root run:

```sh
openssl req -x509 -newkey rsa:2048 -keyout keytmp.pem -out cert.pem -days 365
```

Then:

```sh
openssl rsa -in keytmp.pem -out key.pem
```

Finally, change the `start` script in `package.json`:

```diff
- "start": "react-scripts start"
+ "start": "export HTTPS=true&&SSL_CRT_FILE=cert.pem&&SSL_KEY_FILE=key.pem react-scripts start",
```

Now you can run `yarn start` and have fun!

## To Do

- [] Fix `call.on('close')` event not being
- [] Enable username identification
- [] Persist usernames per device
