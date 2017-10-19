package components

import (
	"github.com/gopherjs/vecty"
	"github.com/gopherjs/vecty/elem"
	"github.com/gopherjs/vecty/prop"
)

type Hi struct {
	vecty.Core
	Greeting string `vecty:"prop"`
}

func (h *Hi) Restore(prev vecty.Component) {
	if old, ok := prev.(*Hi); ok {
		h.Greeting = old.Greeting
	}
}

func (h *Hi) Render() *vecty.HTML {
	return elem.Body(
		elem.Div(
			vecty.Markup(
				prop.Value(h.Greeting),
			),
		),
	)
}
