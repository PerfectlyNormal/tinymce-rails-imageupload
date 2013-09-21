module Tinymce
  module Rails
    module Imageupload
      class Engine < ::Rails::Engine
        initializer 'TinymceRailsImageupload.assets_pipeline' do |app|
          app.config.assets.precompile << "tinymce/plugins/uploadimage/*"
          app.config.assets.precompile << "tinymce/plugins/imagegallery/*"
        end
      end
    end
  end
end