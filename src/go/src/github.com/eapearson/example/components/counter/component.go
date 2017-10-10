package counter

import (
	"github.com/gopherjs/gopherjs/js"
	"github.com/eapearson/gopherjs-ko"
)

// Counter
// In this example, we model a simple integer counter, with 
// actions to increment and decrement the counter value.

// Counter
// The struct we use to model contains any observables we need to have
// in the VM
type Counter struct {
	count *ko.Observable;
}

// Increment
// Note that our functions are implemented as methods on the 
// VM's struct. This is because when they are provided in the VM,
// they are methods on an instance of the VM, and their invocation
// will naturally capture the counter reference.
// In js knockout, one would rely upon the function capturing the 
// context in which it is called -- which depends upon where in the 
// markup it is located.
// The practice here binds the function call much more to the data itself
// although of course one could do that as well in js.
func (counter *Counter) Increment() {
	counter.count.Set(counter.count.Get().Int() + 1)
}

func (counter *Counter) Decrement() {
	counter.count.Set(counter.count.Get().Int() - 1)
}

func ViewModel(params *js.Object) js.M {
	counter := &Counter{
		count: ko.NewObservable(0)}

	return js.M{
		"count": counter.count,
		"doIncrement": counter.Increment,
		"doDecrement": counter.Decrement}
}

func Component() js.M {
	return js.M{
		"viewModel": ViewModel, 
		"template": T_template()}
}

func Binding() string {
	return "component: {name: 'counter', params: {}}"
}

func init() {
	ko.Components().Register("counter", Component())
}