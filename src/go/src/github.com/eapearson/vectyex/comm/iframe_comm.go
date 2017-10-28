package comm

import (
	"encoding/json"
	"net/url"

	"honnef.co/go/js/console"
	"honnef.co/go/js/dom"
)

// IFrameParams represents the data packet placed on the iframe
type IFrameParams struct {
	FrameID    string `json:"frameId"`
	ParentHost string `json:"parentHost"`
}

// ReadyMessage is sent when the main function for the app has determined
// that it can safely proceed.
type ReadyMessage struct {
	Name    string `json:"name"`
	FrameID string `json:"frameId"`
	From    string `json:"from"`
	ID      string `json:"id"`
}

// Comm represents a way of sending and receiving messages
type Comm interface {
	Send(message string)
}

// IFrameComm is an implementation of communication from an iframe to
// a host window.
type IFrameComm struct {
	ready  bool
	window dom.Window
	host   string
}

// Send will, er, send a message to window in the iframe comm
func (comm IFrameComm) Send(message interface{}) {
	msg, err := json.Marshal(message)

	if err != nil {
		panic("Can't create message message!!")
	}
	comm.window.PostMessage(string(msg), comm.host, nil)
}

// Start is called to
func Start() {
	// extract the frameId off our container, and the host from the dom
	// send 'ready' to host.
	frameEl := dom.GetWindow().FrameElement()
	if frameEl == nil {
		panic("No frameElement!")
	}

	// The initial params are deposited by the host int the "data-params" attribute
	// of the iframe element. This is all we need to kick of a session.
	rawParams := frameEl.GetAttribute("data-params")
	parsedParams, err := url.QueryUnescape(rawParams)
	if err != nil {
		panic("Error decoding frame params")
	}

	var params IFrameParams
	err = json.Unmarshal([]byte(parsedParams), &params)
	if err != nil {
		panic("No frame params!")
	}

	comm := IFrameComm{
		window: dom.GetWindow().Parent(),
		host:   params.ParentHost,
	}

	comm.Send(ReadyMessage{
		Name:    "ready",
		FrameID: params.FrameID,
		From:    params.FrameID,
		ID:      "someid",
	})

	dom.GetWindow().AddEventListener("message", false, func(ev dom.Event) {
		console.Log("Got event inside!")
		console.Log(ev)
	})
}
