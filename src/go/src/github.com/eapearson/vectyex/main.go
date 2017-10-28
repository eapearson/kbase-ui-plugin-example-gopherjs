package main

import (
	"github.com/eapearson/vectyex/comm"
	"github.com/eapearson/vectyex/components"
	"github.com/gopherjs/vecty"
)

func main() {

	comm.Start()

	// receive 'start'

	vecty.SetTitle("JGI Search | KBase Example App in GopherJS/vecty")
	p := &components.Page{Title: "My Page! Mine Mine!"}
	vecty.RenderBody(p)
}
