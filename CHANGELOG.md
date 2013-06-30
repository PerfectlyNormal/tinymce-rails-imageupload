# 4.0.0 / unreleased

* Rewrite the plugin to work with TinyMCE 4. TinyMCE 3.x is supported in the
  tinymce3-branch.

# 3.5.8.5 / 2013-05-07

* Depend on tinymce-rails ~> 3.5.8.1 for the asset tasks. Thanks to joshcrews (Josh Crews)
  This should solve the issue with asset precompilation (#15).
* Add Simplified Chinese (zh-cn) translations. Thanks to inntran (Yinchuan Song)

# 3.5.8.4 / 2013-04-23

* Make the plugin work in IE8 and IE9 again. Thanks to pomartel (Pierre Olivier Martel)
* Add German translations. Thanks to pomartel (Pierre Olivier Martel)
* Add Spanish translations. Thanks to pomartel (Pierre Olivier Martel)

# 3.5.8.3 / 2013-03-18

* Add option for assigning class to img tag. Thanks to nathanshox (Nathan Shaughnessy)
* Add alt attribute to img tag and input for user to set it. Thanks to nathanshox (Nathan Shaughnessy)

# 3.5.8.2 / 2013-03-11

* Added fr-FR translations. Thanks to pompombidou (Harold Simpson)

# 3.5.8.1 / 2013-02-08

* Added pt-BR translations. Thanks to klebervirgilio (Kleber Correia)
* Start signing the gem with rubygems-openpgp (https://github.com/grant-olson/rubygems-openpgp)
  * My signing key is available at https://eastblue.org/blag/contact/

# 3.5.8.0 / 2013-02-01

* Tested with tinymce-rails 3.5.8
* Handle errors from the server, both in the JSON, and from the server (HTTP 5xx and so on)
* Don't submit the form without a file selected (fixes #1)
* Display a spinner when uploading (fixes #2)

# 3.5.6.4 / 2012-12-10

* Convert CoffeeScript to JavaScript to avoid depending on CoffeeScript (#19). Thanks to sobrinho (Gabriel Sobrinho)

# 3.5.6.3 / 2012-08-27

* Make the POST URL configurable (#3). Thanks to minaguib (Mina Naguib)
* Make it possible to send extra parameters to the controller (#10). Thanks to minaguib (Mina Naguib)

# 3.5.6.2 / 2012-08-20

* Portugese translation. Thanks to Hefesto
* Fix for asset compilation. Thanks to ffloyd (Roman Kolesnev)

# 3.5.6.1 / 2012-08-09

* Russian translation. Thanks to ffloyd (Roman Kolesnev)
* `window.opener` is not always available, so fall back to `window.parent` if needed. Thanks to ffloyd (Roman Kolesnev)

# 3.5.6 / 2012-08-02

* Relaxed dependency to work with newer tinymce-rails. Thanks to tjoneseng (Tim Jones)
* Fix accessing opener window. Thanks to dpc (Dawid Ciężarkiewicz)

# 3.4.9.1 / 2012-04-24

* Work with Rails' CSRF protection by copying the token into our form before submitting it

# 3.4.9 / 2012-04-05

* Document how to use I18n with the gem
* Explicitly require tinymce-rails so tinymce-rails-imageupload can be alone in the gemfile
* Update dependency to tinymce-rails 3.4.9

# 3.4.8.1 / 2012-03-07

* Added support for setting height and width for the inserted image

# 3.4.8 / 2012-02-29

* Initial release
