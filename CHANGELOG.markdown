## 3.5.6.3 (August 27, 2012)

* Make the POST URL configurable (#3). Thanks to minaguib (Mina Naguib)
* Make it possible to send extra parameters to the controller (#10). Thanks to minaguib (Mina Naguib)

## 3.5.6.2 (August 20, 2012)

* Portugese translation. Thanks to Hefesto
* Fix for asset compilation. Thanks to ffloyd (Roman Kolesnev)

## 3.5.6.1 (August 9, 2012)

* Russian translation. Thanks to ffloyd (Roman Kolesnev)
* `window.opener` is not always available, so fall back to `window.parent` if needed. Thanks to ffloyd (Roman Kolesnev)

## 3.5.6 (August 2, 2012)

* Relaxed dependency to work with newer tinymce-rails. Thanks to tjoneseng (Tim Jones)
* Fix accessing opener window. Thanks to dpc (Dawid Ciężarkiewicz)

## 3.4.9.1 (April 24, 2012)

* Work with Rails' CSRF protection by copying the token into our form before submitting it

## 3.4.9 (April 5, 2012)

* Document how to use I18n with the gem
* Explicitly require tinymce-rails so tinymce-rails-imageupload can be alone in the gemfile
* Update dependency to tinymce-rails 3.4.9

## 3.4.8.1 (March 7, 2012)

* Added support for setting height and width for the inserted image

## 3.4.8 (February 29, 2012)

* Initial release
