package main

import (
	"log"

	"github.com/eapearson/example/app"
	"github.com/eapearson/example/components/counter"
	"github.com/eapearson/example/components/greeting"
	"github.com/eapearson/gopherjs-ko"
	"github.com/gopherjs/gopherjs/js"
	"honnef.co/go/js/dom"
)

func main() {
	log.Println("hi, we are ready to proceed!!!")

	log.Println("should have something in the dom??")

	root := dom.GetWindow().Document().QuerySelector("#app")

	// Main layout markup is loaded from a precompiled template.
	layout := app.T_layout(greeting.Binding(), counter.Binding())

	// layout := `
	// <p>Hi, let's go!</p>
	// <p>Below is a simple "greeting" component.</p>
	// <div data-bind="component: {name: 'greeting', params: {greeting: greeting, name: name}}"></div>
	// <p>TODO: develop the most efficient way of generating markup in go. Literal strings are "ok".</p>
	// <p>TODO: develop more examples, to flesh out use cases.</p>
	// `

	// Simply set the root markup.
	root.SetInnerHTML(layout)

	// And apply the initial bindings.
	// All other embededd components will cascade from here.
	ko.ApplyBindings(js.M{"greeting": "Hello",
		"name": "Erik"}, root)
}
