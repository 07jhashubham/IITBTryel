import { defineConfig } from "vite";
import restart from "vite-plugin-restart";

export default defineConfig({
  root: "src/", // Source files (typically where index.html is)
  publicDir: "../static/", // Path from "root" to static assets (files that are served as they are)
  server: {
    host: true, // Open to local network and display URL
    open: !("SANDBOX_URL" in process.env || "CODESANDBOX_HOST" in process.env), // Open if it's not a CodeSandbox
    https: {
      key: `-----BEGIN PRIVATE KEY-----
MIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDaN9GKP99Dm1U6
vbFqqroZwP3ym30baEMuKbCedwDf2FEF26ZEtHmeb0UmQ/n/YL/zZjzPB356/0sm
Tx9BTBntf+ARc88v5sur7avUdbSlWeBGEjlsINlLCqqgxKsZOV2/NN1IQvNDHuIj
V8XNbC2srstfMkQoy0honRIe99ThORgk6UWJRcsnsR2/r9ZgrzQS5SF8IXVXVNa9
/akn4HDL1spqfU3Dv3t4KHeNEUZGoz2+cns/P7BMju8OOVNqwp3oid1d498P3/99
I26FgorARp6h1xbQ0TNeoq6MHohz/hSk/95xHuAa68k5DPXDODxWdikgz/9XtKGH
aIrvH2DnAgMBAAECggEAeglbYxCDYMC+8mHhlYCzIPIAUyxH1AsD/w4LmyN8VrMX
5MnI+4Veuo8JwfOkHQDTeGCFw1YyksCxG1SGazMPEPZBriDxDp3o61a4kNHe29Ye
ibFpcaIRQ1lMwSobcbjWR7ddxSrD9paP6yoMEezcwkTisXNgENxWu0KUPsNkxyrp
gTnUHwCZ7HF4BcnUxS14KChVuyPY0HSOUg0zuA4xZ8eEM9miXJe5s61zMRw31fiN
u3meTs+MUYYynvk9V2+ademaUARH6Jn9Guls4TuyzHnA5B8yct+TLMSlUEburh/8
4tz9ed2A2xmMGd5haE2dUf2nnaJ/meOGV0cUco+32QKBgQDwj4UmoosWcJrRGxIA
KfJserPO+7cmnXx8lJrfCHdgHmIzYfk49YJXeTR7U3hBr9pYGU+kuZncFaBQrryn
nUi2rwSTTZ+yitfINvnxczf4ZiSJsdJixVNH8YoHhVQO+ZBk3yyTPpwhVR3+K1AM
YfxLq7fPDZQqjPKqs6ACffX2qwKBgQDoOTQOTLIGOj63mXoQTm2eWhLJFhar/CRs
3NtT8CNMN1mWPAQar2vYjqZ9YlD2jFjD3cmRFUjFAEzkOhA61vZBH1rq/TNcrHgQ
y6UZngLhI7JbeJIV77haqeoK02/an1o6FHJ5mvf1iUquF34KHOF2K5XdG6ZMhdZ2
hJDUwq/utQKBgElXqIPf+MHtsPXh5/oOz++M9Xc8vVlTmJmvAQzQ2vx+Jvh9fWuF
Rqj+tiaHi1mTkOFdTi/tumAkY81ViQUdagbwk1eJyg+4TxOm10trEnx0P92PTpJ4
kOyVUrz6RGeQZRqsBD4cT6PF/K/6apxr32z+vLqu7CaQ9Idg3n8EAlKjAoGBAM7Y
fRSrnfrMEKcrDr3Njfh5lLgGc8VXfv50ruwSPu6ZcrPN234FeNNZJNUUKLejBUHZ
oLwZMEtBXDwBuAkhBhG1ox8iz4ghm4SiT/oEc94kFK9DMyRU9WnUZUKlWMFsJUsM
gXbt4SWU168//6V0WiMO6ZscEMGiiQfiRrssetbtAoGBALEdm5TuXWojlUGYBZFi
8J+Bex8cnZ4+ZVOcVX6BSPrUT8DF+iZX7KJ4VSollhBs/J9+/vzofuyvJ1p3+Z73
p32iAtLqI8L2LnG4eFxz3yyycilANvvNuyiqhWbNl7MAcslc74pDeWQ27fsAFw9D
0TET+g6Hgnw5RuBPOsOcnQOk
-----END PRIVATE KEY-----
`,
      cert: `-----BEGIN CERTIFICATE-----
MIIDYDCCAkgCCQDeU1vjkuLT1DANBgkqhkiG9w0BAQsFADByMQswCQYDVQQGEwJJ
bjELMAkGA1UECAwCTWgxDDAKBgNVBAcMA011bTEMMAoGA1UECgwDSUlUMQwwCgYD
VQQLDANCb20xDDAKBgNVBAMMA0poYTEeMBwGCSqGSIb3DQEJARYPbG9jYWxAZ21h
aWwuY29tMB4XDTI0MDcxMDA5MTM0NFoXDTI1MDcxMDA5MTM0NFowcjELMAkGA1UE
BhMCSW4xCzAJBgNVBAgMAk1oMQwwCgYDVQQHDANNdW0xDDAKBgNVBAoMA0lJVDEM
MAoGA1UECwwDQm9tMQwwCgYDVQQDDANKaGExHjAcBgkqhkiG9w0BCQEWD2xvY2Fs
QGdtYWlsLmNvbTCCASIwDQYJKoZIhvcNAQEBBQADggEPADCCAQoCggEBANo30Yo/
30ObVTq9sWqquhnA/fKbfRtoQy4psJ53AN/YUQXbpkS0eZ5vRSZD+f9gv/NmPM8H
fnr/SyZPH0FMGe1/4BFzzy/my6vtq9R1tKVZ4EYSOWwg2UsKqqDEqxk5Xb803UhC
80Me4iNXxc1sLayuy18yRCjLSGidEh731OE5GCTpRYlFyyexHb+v1mCvNBLlIXwh
dVdU1r39qSfgcMvWymp9TcO/e3god40RRkajPb5yez8/sEyO7w45U2rCneiJ3V3j
3w/f/30jboWCisBGnqHXFtDRM16iroweiHP+FKT/3nEe4BrryTkM9cM4PFZ2KSDP
/1e0oYdoiu8fYOcCAwEAATANBgkqhkiG9w0BAQsFAAOCAQEAVD5baxhTX1vCNjwm
xqZN+IGsBATQ2EPtoKOOfwUVH3uzEFCf+f9dgru2eehgmixfYjxP70kTmrp+TsJS
32OPtQPWu+LCR91yZh3Im3ULOw45WQ10ZY7rNpaaGPzFR9l9X1ievBRUraEanWzy
+KhNHqneot5jidAN67o+xqIqNwmC56/UxgBYrWxNAmBrV1DU0bbpV57SRBnAFj/I
RKV6ygKkWcYcw8RRM5mTRoWTGSk/7Hds+12xlIgT8DrMkNQMYzLz0JxAgmJijJn4
1gO9uOkUdNGjczKPiXOJqCUX5287Wkmw7XuraIuHzvca7hZJiV7JJSBYDsticgjL
/D3HCg==
-----END CERTIFICATE-----
`,
    },
  },
  build: {
    outDir: "../dist", // Output in the dist/ folder
    emptyOutDir: true, // Empty the folder first
    sourcemap: true, // Add sourcemap
  },
  plugins: [
    restart({ restart: ["../static/**"] }), // Restart server on static file change
  ],
});
