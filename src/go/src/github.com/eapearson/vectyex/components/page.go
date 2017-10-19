package components

import (
	"github.com/gopherjs/vecty"
	"github.com/gopherjs/vecty/elem"
)

type Page struct {
	vecty.Core
	Title string `vecty:"prop"`
}

func (h *Page) Restore(prev vecty.Component) {
	if old, ok := prev.(*Page); ok {
		h.Title = old.Title
	}
}

func (h *Page) Render() *vecty.HTML {
	return elem.Body(
		elem.Heading1(
			vecty.Text(h.Title),
		),
		elem.Div(
			vecty.Text("This is the page view"),
		),
		elem.Div(
			&Hello{Greeting: "hi from the insde"},
		),
	)
}
