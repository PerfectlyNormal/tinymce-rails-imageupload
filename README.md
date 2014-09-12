# IMPORTANT NOTE:
This version is being rewritten to work with TinyMCE 4.x, and is
currently not very tested. Use at your own risk, feedback welcome. For the stable version targetting TinyMCE 3, see
the [tinymce3 branch](https://github.com/PerfectlyNormal/tinymce-rails-imageupload/tree/tinymce3)

# tinymce-rails-imageupload

Simple plugin for TinyMCE that allows uploading images and inserting.
It makes no assumptions about how you store the images, it simply POSTs to a
URL and expects JSON back (see the Setup section).

This plugin started as a copy of work done by [Peter Shoukry](http://77effects.com/),
but has since mutated into something entirely different.

Support for TinyMCE 3 is currently available in the [tinymce3 branch](https://github.com/PerfectlyNormal/tinymce-rails-imageupload/tree/tinymce3).
The master branch is targetting TinyMCE 4.x.

## Demo

A small demo app demonstrating a working setup for Rails 3.2 ([demo](http://murmuring-lowlands-1342.herokuapp.com/), [source](https://github.com/PerfectlyNormal/tinymce-rails-imageupload-demo3)), and for Rails 4 ([demo](http://murmuring-lowlands-7502.herokuapp.com/), [source](https://github.com/PerfectlyNormal/tinymce-rails-imageupload-demo)) is available for study.

## Requirements

* Rails >= 3.1
* TinyMCE4 using the advanced theme

## Setup

### Add the gem to your Gemfile

    gem 'tinymce-rails-imageupload', '~> 4.0.0.beta'
    
    # or use git
    
    gem 'tinymce-rails-imageupload', github: 'PerfectlyNormal/tinymce-rails-imageupload'

### Set up TinyMCE as you would normally, but in the call to `.tinymce()`, add

    plugins: "uploadimage"
    # toolbar option must include "uploadimage" somewhere to have the button appear

and the rest should happen automatically.

### Set up upload URL and handler

The plugin defaults to POSTing to `/tinymce_assets`. You may modify it by
supplying the option `uploadimage_form_url` in the call to `.tinymce()`

Routing to your controller must be done manually.
Set it up using something similar in `routes.rb`:

    post '/tinymce_assets' => 'tinymce_assets#create'

The plugin will relay option `uploadimage_hint` in the call to `.tinymce()`
to the POSTed URL as param `hint`. You may use this to relay any hints
you wish (for example, blog post ID #) to the controller.

This action gets called with a file parameter creatively called `file`,
and must respond with JSON, containing the URL to the image.

The JSON has to be returned with a content type of "text/html" to work, which
is hopefully going to be fixed ([issue #7](https://github.com/PerfectlyNormal/tinymce-rails-imageupload/issues/7)).

Example:

    class TinymceAssetsController < ApplicationController
      def create
        # Take upload from params[:file] and store it somehow...
        # Optionally also accept params[:hint] and consume if needed

        render json: {
          image: {
            url: view_context.image_url(image)
          }
        }, content_type: "text/html"
      end
    end

If the JSON response contains a `width` and/or `height` key,
those will be used in the inserted HTML (`<img src="..." width="..." height="...">`),
but if those are not present, the inserted HTML is just `<img src="...">`.

### Default class for img tag

By default the plugin doesn't assign any class to the img tag.
You can set the class(es) by supplying the `uploadimage_default_img_class`
option in the call to `.tinymce()`.

`class="..."` will only be added to the img tag if a default is specified.
Otherwise the inserted HTML is just `<img src="...">`.

## Asset Pipeline

Several people have had trouble with asset precompilation using the asset pipeline, both for the locales, and the plugin itself.

Depending on your version of Rails, and the alignment of the moon, it might work out of the box, or you'll have to add something like this in your configuration:

`config.assets.precompile += %w( tinymce/plugins/uploadimage/plugin.js tinymce/plugins/uploadimage/langs/en.js )`

Obviously adjust depending on the language or languages you want to use.

Since TinyMCE doesn't know about the asset pipeline however, you could just place it under `public/`, and that should probably work as well. As with all things Rails and assets related, YMMV.

## Error handling

To notify the uploader that an error occurred, return JSON containing an
`error` key with a `message`. The message gets show in a paragraph with the
ID `error_message`, and the input label gets the class `invalid`.

Example response:

    "{"error": {
      "message": "Invalid file type. Only .jpg, .png and .gif allowed"
    }}"

## Internationalization

I18n is taken care of by `tinymce-rails`.
This gem includes strings for `en`, `de`, `es`, `fr`, `nb`, `pt`, `pt_BR`,
`ru` and `zh-cn`.
To add your own language, create the files `<code>.js` in
`app/assets/javascripts/tinymce/plugins/uploadimage/langs` in your
application, or fork the gem and add your own translations there.

The format and available strings are listed below:

### nb.js

    tinyMCE.addI18n('nb', {
      'Insert an image from your computer': 'Sett inn et bilde fra datamaskinen',
      'Insert image': "Sett inn bilde",
      'Choose an image': "Velg et bilde",
      'You must choose a file': "Du m\u00e5 velge en fil",
      'Got a bad response from the server': "Fikk et ugyldig svar fra serveren",
      "Didn't get a response from the server": "Fikk ikke svar fra serveren",
      'Insert': "Sett inn",
      'Cancel': "Avbryt",
      'Image description': "Alternativ tekst for bilde",
    });

## Versioning

The major, minor and patch version of this gem will be mirroring the
release of `tinymce-rails` it is tested against.

## Signing

This gem is signed using [rubygems-openpgp](https://github.com/grant-olson/rubygems-openpgp) using [my personal key](https://eastblue.org/blag/contact/), and the fingerprint is also included below.

    pub   4096R/CCFBB9EF 2013-02-01 [expires: 2017-02-01]
          Key fingerprint = 6077 34FC 32B6 6041 BF06  43F2 205D 9784 CCFB B9EF
    uid                  Per Christian Bechström Viken <perchr@northblue.org>
    uid                  [jpeg image of size 6240]
    sub   4096R/13C6EED7 2013-02-01 [expires: 2017-02-01]

## Licensing

The plugin is released under the MIT license.

TinyMCE is released under the LGPL Version 2.1.

The icon used for the button comes from the icon set Silk from famfamfam,
released under the [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/)
