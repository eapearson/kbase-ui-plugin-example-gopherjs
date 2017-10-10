// Package greeting is generated with ftmpl {{{v0.3.1}}}, do not edit!!!! */
package greeting

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

// TMPLERRtemplate evaluates a template template.tmpl
func TMPLERRtemplate() (string, error) {
	_template := "template.tmpl"
	_escape := html.EscapeString
	var _ftmpl bytes.Buffer
	_w := func(str string) { _, _ = _ftmpl.WriteString(str) }
	_, _, _ = _template, _escape, _w

	_w(`<div>
    <p>Yes, this is the venerable "Hello World" component!</p>
    <span data-bind="{text: greeting}"></span>, <span data-bind="{text: name}"></span>
</div>`)

	return _ftmpl.String(), nil
}

// T_template evaluates a template template.tmpl
func T_template() string {
	html, err := TMPLERRtemplate()
	if err != nil {
		_, _ = os.Stderr.WriteString("Error running template template.tmpl:" + err.Error())
	}
	return html
}
