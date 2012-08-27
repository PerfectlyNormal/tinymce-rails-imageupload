# tinymce-rails-imageupload

  Simple plugin for TinyMCE that allows uploading images and inserting.
  It makes no assumptions about how you store the images, but it POSTs to a URL and expects JSON back (see the Setup section).

  This plugin borrows heavily from work done by [Peter Shoukry](http://77effects.com/).

  The icon used for the button comes from the icon set [Silk by famfamfam](http://www.famfamfam.com/lab/icons/silk/)

## Requirements

  * Rails >= 3.1
  * TinyMCE using the advanced theme and jQuery

## Setup

### Add the gem to your Gemfile

    gem 'tinymce-rails-imageupload', '~> 3.5.6.3'

### Set up TinyMCE as you would normally, but in the call to `.tinymce()`, add

    plugins: "uploadimage"
    # theme_advanced_buttonsX must include "uploadimage" somewhere to have the button appear

  and the rest should happen automatically.

### Set up upload URL and handler

  The plugin defaults to POSTing to `/tinymce_assets`.  You may modify it by supplying option `uploadimage_form_url` in the call to `.tinymce()`

  Routing to your controller must be done manually.  Set it up using something similar in `routes.rb`:

    post '/tinymce_assets' => 'tinymce_assets#create'

  The plugin will relay option `uploadimage_hint` in the call to `.tinymce()` to the POSTed URL as param `hint`.  You may use this to relay any hints you wish (for example, blog post ID #) to the controller.

  This action gets called with a file parameter creatively called `file`, and must respond with JSON, containing the URL to the image.

  The JSON has to be returned with a content type of "text/html" to work, which is going to be fixed as soon as possible ([issue #7](https://github.com/PerfectlyNormal/tinymce-rails-imageupload/issues/7)).

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

  If the JSON response contains a `width` and/or `height` key, those will be used in the inserted HTML (`<img src="..." width="..." height="...">`), but if those are not present, the inserted HTML is just `<img src="...">`.

## Internationalization

I18n is taken care of by `tinymce-rails`. This gem includes strings for english, norwegian, russian and portugese.
To add your own language, create the files `<code>.js` and `<code>_dlg.js` in `vendor/assets/javascripts/tinymce/plugins/uploadimage/langs` in your application,
or fork the gem and add your own translations there.

The available strings are listed below:

### en.js

    tinyMCE.addI18n('en.uploadimage', {
      desc: 'Insert an image from your computer'
    });

### en_dlg.js

    tinyMCE.addI18n('en.uploadimage_dlg', {
      title: 'Insert image',
      header: "Insert image",
      input:  "Choose an image",
      insert: "Insert",
      cancel: "Cancel"
    });

## Versioning

The version of this gem will be mirroring the release of `tinymce-rails` it is tested against.

## Licensing

The plugin is released under the MIT license.

TinyMCE is released under the LGPL Version 2.1.

The icon used for the button comes from the icon set Silk from famfamfam, released under the [Creative Commons Attribution 3.0 License](http://creativecommons.org/licenses/by/3.0/)
