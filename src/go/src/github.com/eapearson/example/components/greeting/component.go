package greeting

import (
	"github.com/gopherjs/gopherjs/js"
	"github.com/eapearson/gopherjs-ko"
)

// A simple go implementation of a knockout component.

// The model in Model View View-Model. 
// The model is implemented in pure go but note that we do need to rely upon
// knockout observables and not go types.
// At least we have structures!
type Greeting struct {
	greeting *ko.Observable
	name *ko.Observable
}



// The view model is about half go, half js interop code.
// A little bit too much of knockout specific stuff for my taste.
// The view model glues together the model and the view.
func ViewModel(params *js.Object) js.M {
	greeting := &Greeting{
		greeting: ko.NewObservable(""),
		name: ko.NewObservable("")}

	if params.Get("greeting") != js.Undefined {
		greeting.greeting.Set(params.Get("greeting"))
	}

	greeting.name.Set(params.Get("name"))

	return js.M{
		"greeting": greeting.greeting,
		"name": greeting.name}
}

// The template is the view. In this case we are using a simple string.
// Most components are much more complex than this; it isn't clear to me to scale 
// composition of bigger templates. Perhaps using extern, copmiled templates will 
// be fine -- the ftmpl tool we use in main.go does have template including. 
// The tool might need modification in order to generate templates per package...
// Actually, it can just be applied per-directory.
// func Template() string {
// 	return `
// 	<div>
// 		<p>Yes, this is the venerable "Hello World" component!</p>
// 		<span data-bind="{text: greeting}"></span>, <span data-bind="{text: name}"></span>
// 	</div>
// 	`
// }

// Component
// This produces a knockout component definition based on the viewmodel and template
// defined in this package.
// This function produces a javscript object (map). The js.M business is just 
// map[string]interface{}
func Component() js.M {
	return js.M{
		"viewModel": ViewModel,
		"template": T_template()}
}

// Binding 
// The binding function is simply used to produce the knockout binding markup for this component.
// It is optional, but is a convenient way of getting the binding and also normalizes the
// signature. Bindings are much more flexible than this, bue they are something of a lie ...
// the VM may depend on certain characteristics of the params especially, which ad-hoc
// bindings may violate.
func Binding() string {
	return "component: {name: 'greeting', params: {greeting: greeting, name: name}}"
}

// init
// We register the component defined in this package globally.
// Note that this requires cooperation between all components in the app
// they are being used in.
func init() {
	// Register knockout components here.
	ko.Components().Register("greeting", Component()) 
}