package main

import (
	"github.com/eapearson/vectyex/components"
	"github.com/gopherjs/vecty"
)

func main() {
	vecty.SetTitle("JGI Search | KBase Example App in GopherJS/vecty")
	p := &components.Page{Title: "My Page!"}
	vecty.RenderBody(p)
}
