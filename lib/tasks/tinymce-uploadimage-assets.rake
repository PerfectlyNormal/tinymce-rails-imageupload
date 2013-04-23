assets_task = Rake::Task.task_defined?('assets:precompile:primary') ? 'assets:precompile:primary' : 'assets:precompile'

Rake::Task[assets_task].enhance do
  require "tinymce/rails/asset_installer"

  config   = Rails.application.config
  target   = File.join(Rails.public_path, config.assets.prefix)
  manifest = config.assets.manifest

  assets = Pathname.new(File.expand_path(File.join(File.dirname(__FILE__),
    "../../vendor/assets/javascripts/tinymce/plugins/uploadimage")))
  TinyMCE::Rails::AssetInstaller::ASSETS = assets
  TinyMCE::Rails::AssetInstaller.new(target, manifest).install
end