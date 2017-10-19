export GOPATH=$GOPATH:`pwd`
export PATH=$PATH:${GOPATH//://bin:}/bin
echo "go path? ${GOPATH}"
gopherjs build github.com/eapearson/vectyex -o ../plugin/iframe_root/apps/vectyex.js
