// Package app is generated with ftmpl {{{v0.3.1}}}, do not edit!!!! */
package app

import (
	"bytes"
	"errors"
	"fmt"
	"html"
	"os"
)

func init() {
	_ = fmt.Sprintf
	_ = errors.New
	_ = os.Stderr
	_ = html.EscapeString
}

// TMPLERRlayout evaluates a template layout.tmpl
func TMPLERRlayout(c1 string, c2 string) (string, error) {
	_template := "layout.tmpl"
	_escape := html.EscapeString
	var _ftmpl bytes.Buffer
	_w := func(str string) { _, _ = _ftmpl.WriteString(str) }
	_, _, _ = _template, _escape, _w

	_w(`<p>Hi, let's go!</p>

<p>Below is a simple "greeting" component.</p>

<div data-bind="`)
	_w(fmt.Sprintf(`%s`, _escape(c1)))
	_w(`"></div>

<p>TODO: develop the most efficient way of generating markup in go. Literal strings are "ok".</p>

<p>TODO: develop more examples, to flesh out use cases.</p>

<p>Here is another one, a simple counter...</p>

<div data-bind="`)
	_w(fmt.Sprintf(`%s`, _escape(c2)))
	_w(`"></div>`)

	return _ftmpl.String(), nil
}

// T_layout evaluates a template layout.tmpl
func T_layout(c1 string, c2 string) string {
	html, err := TMPLERRlayout(c1, c2)
	if err != nil {
		_, _ = os.Stderr.WriteString("Error running template layout.tmpl:" + err.Error())
	}
	return html
}
