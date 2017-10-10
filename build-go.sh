export GOPATH=$GOPATH:`pwd`/src/go
export PATH=$PATH:${GOPATH//://bin:}/bin
echo "go path? ${GOPATH}"
gopherjs build github.com/eapearson/example -o src/plugin/iframe_root/apps/example.js