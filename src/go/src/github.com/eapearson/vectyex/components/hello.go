package components

import (
	"github.com/gopherjs/vecty"
	"github.com/gopherjs/vecty/elem"
)

type Hello struct {
	vecty.Core
	Greeting string `vecty:"prop"`
}

func (h *Hello) Restore(prev vecty.Component) {
	if old, ok := prev.(*Hello); ok {
		h.Greeting = old.Greeting
	}
}

func (h *Hello) Render() *vecty.HTML {
	return elem.Div(
		vecty.Text(h.Greeting),
	)
}
