# encoding: utf-8
$:.push File.expand_path("../lib", __FILE__)
require "tinymce-rails-imageupload/version"

Gem::Specification.new do |s|
  s.name        = "tinymce-rails-imageupload"
  s.version     = Tinymce::Rails::Imageupload::VERSION
  s.authors     = ["Per Christian B. Viken"]
  s.email       = ["perchr@northblue.org"]
  s.homepage    = "http://eastblue.org/oss"
  s.summary     = %q{TinyMCE plugin for taking image uploads in Rails >= 3.2}
  s.description = %q{TinyMCE plugin for taking image uploads in Rails >= 3.2. Image storage is handled manually, so works with everything.}

  s.files         = [Dir["app/assets/javascripts/tinymce/plugins/uploadimage/**/*.js"],
                     Dir["lib/**/*.rb"],
                     "lib/tasks/tinymce-uploadimage-assets.rake",
                     "CHANGELOG.md",
                     "LICENSE",
                     "README.md",
                    ].flatten
  s.test_files    = []
  s.require_paths = ["lib"]

  s.license = "MIT"

  s.add_runtime_dependency     "railties",      ">= 3.2", "< 6"
  s.add_runtime_dependency     "tinymce-rails", "~> 4.0"
  s.add_development_dependency "bundler",       "~> 1.0"
  s.add_development_dependency "rails",         ">= 3.1"
end
