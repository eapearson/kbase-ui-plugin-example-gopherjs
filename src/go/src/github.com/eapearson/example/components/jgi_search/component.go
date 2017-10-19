package jgi_search

import (
	"github.com/eapearson/gopherjs-ko"
	"github.com/gopherjs/gopherjs/js"
)

// first define the core model, which may use 

// key based queries are always just strings which are in turn
// elastic search simple text syntax.
type KeyQuery struct {
	key string
	query string
}


// filter queries on the other hand can take three forms:
// simple string, an exact match
// comma separated list of integer values in a string - let's not support that
// array of integer values
// an integer value (?)
// nah, let us simplify that to an array of strings, an array of ints


// FilterValue is a value that may be passed to the search engine
// as a filter expression. Currently suported are an array of
// strings or array of ints.
type FilterValue interface {
	Get() *js.Object
}

type FilterString []string
func (v *FilterString) Get() *js.Object {
	return v
}

type FilterInt string
func (v *FilterInt) Get() *js.Object {
	return v
}

type FilterQuery struct {
	key string
	value FilterValue
}

// SortSpec defines the sorting conditions for a single
// field, identify by its key path.
type SortSpec struct {
	key string
	ascending bool
}

type Search struct {
	freeText string
	keyQuery []string
	filterQuery []string
	sorting []SortSpec
	page int16
	limit int16
	includePrivate bool
	includePublic bool
}

type Searchx struct {
	text    *ko.Observable
	results *ko.ObservableArray
}

// The view model sits between the view and this module.
// Knockout creates an instance of this view model based on the
// parameters passed to the component.
// All future updates to the VM are through these params (if they are
// observable, and they should be), through View elements which are
// connected to ui input elements in the template, or through independent
// means set up here, such as listeeners, pollers, remote queries.
func ViewModel(params *js.Object) js.M {
	search := &Search{
	text: ko.NewObservable(nil),
	results: ko.NewObservableArray()}




