export GOPATH=$GOPATH:`pwd`
export PATH=$PATH:${GOPATH//://bin:}/bin
echo "go path? ${GOPATH}"
gopherjs build -m github.com/eapearson/example -o ../plugin/iframe_root/apps/example.js 
