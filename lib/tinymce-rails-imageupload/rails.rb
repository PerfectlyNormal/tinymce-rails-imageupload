module Tinymce
  module Rails
    module Imageupload
      class Engine < ::Rails::Engine
        initializer 'TinymceRailsImageupload.assets_pipeline' do |app|
          app.config.assets.precompile << "tinymce/plugins/uploadimage/editor_plugin.js"     
        end
      end
    end
  end
end