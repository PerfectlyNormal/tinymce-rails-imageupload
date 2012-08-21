module Tinymce
  module Rails
    module Imageupload
      class Engine < ::Rails::Engine
        initializer 'TinymceRailsImageupload.assets_pipeline' do |app|
          app.config.assets.precompile << "tinymce/plugins/uploadimage/editor_plugin.js"
          app.config.assets.precompile << "tinymce/plugins/uploadimage/langs/en.js"
          app.config.assets.precompile << "tinymce/plugins/uploadimage/langs/en_dlg.js"
          app.config.assets.precompile << "tinymce/plugins/uploadimage/langs/nb.js"
          app.config.assets.precompile << "tinymce/plugins/uploadimage/langs/nb_dlg.js"
          app.config.assets.precompile << "tinymce/plugins/uploadimage/langs/pt.js"
          app.config.assets.precompile << "tinymce/plugins/uploadimage/langs/pt_dlg.js"
          app.config.assets.precompile << "tinymce/plugins/uploadimage/langs/ru.js"
          app.config.assets.precompile << "tinymce/plugins/uploadimage/langs/ru_dlg.js"
        end
      end
    end
  end
end