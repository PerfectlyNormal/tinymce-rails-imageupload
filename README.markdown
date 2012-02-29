# tinymce-rails-imageupload

Simple plugin for TinyMCE that allows uploading images and inserting.
It makes no assumptions about how you store the images, but it POSTs to a URL and expects JSON back (see the Setup section).

## Requirements

  * Rails >= 3.1
  * TinyMCE using the advanced theme

## Setup

Add the gem to your Gemfile

    gem 'tinymce-rails-imageupload', '~> 3.4.8'

Set up TinyMCE as you would normally, but in the call to `.tinymce()`, add

    plugins: "uploadimage"
    # theme_advanced_buttonsX must include "uploadimage" somewhere to have the button appear

and the rest should happen automatically.

The plugin POSTs to `/tinymce_assets` by default, which is currently not configurable.
Set it up using something similar in `routes.rb`

    post '/tinymce_assets' => 'tinymce_assets#create'

This action gets called with a file parameter creatively called `file`, and must respond with JSON, containing the URL to the image. Example:

    class TinymceAssetsController < ApplicationController
      def create
        # Take upload from params[:file] and store it somehow...

        render json: {
          image: {
            url: view_context.image_url(image)
          }
        }
      end
    end

## Versioning

The version of this gem will be mirroring the release of `tinymce-rails` it is tested against.

## Licensing

The plugin is released under the MIT license.
TinyMCE is released under the LGPL Version 2.1.