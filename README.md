# md-chips
Material Design Chips (subset) implementation, with MDL and jQuery.

# Example
* Link: http://rawgit.com/matheuscscp/md-chips/master/chips.html
* Source: https://github.com/matheuscscp/md-chips/blob/master/chips.html

# Installation
Include MDL and jQuery, as in the example above.

# Markup
```html
<div class="md-chip" data-title="chip1"></div>
<div class="md-chip" data-title="chip2">chip2 description</div>
<div class="md-chips" data-label="Tags" data-name="tags" data-deny-arbitrary-input>
  <div class="md-chip" data-title="tag1"></div>
  <div class="md-chip" data-title="tag2">tag2 description</div>
  <div class="md-chips__option" data-title="opt1"></div>
  <div class="md-chips__option" data-title="opt2">opt2 description</div>
</div>
```
* `md-chip` class: create a chip. Outside an `md-chips` element, creates a simple undeletable chip.
* `data-title` attribute: text of the chip, or an option's title.
* HTML inside `md-chip` or `md-chips__option` elements: chip/option description.
* `md-chips` class: creates an input field with deletable chips.
* `data-label` attribute: `md-chips` input placeholder.
* `data-name` attribute: name attribute for inputs of an `md-chips` element (will be an array).
* `data-deny-arbitrary-input` flag attribute: include to allow input only from `md-chips` options.
* `md-chips__option` class: create an option for `md-chips`.

# API
* Call `init_md_chips()` after your document is ready.
* Call `render_md_chips_options(jquery, json_array)` to update your options. `jquery` should be a jQuery object with class `md-chips` and `array` should be an array of objects with the fields `title` and `desc`.
* Call `render_md_chips_loading_options(jquery)` to show the "loading options" placeholder.
* Call `hook_md_chips_input(jquery)` to hook input events and update your options dynamically.
* `list_md_chips(jquery)` returns an array of strings containing the current chips.
* `md_chips_input_value(jquery)` returns the current input value.
* `list_md_chips_options(jquery)` returns an array of strings containing the current options.
