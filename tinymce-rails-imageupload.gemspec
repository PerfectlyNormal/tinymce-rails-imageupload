# encoding: utf-8
$:.push File.expand_path("../lib", __FILE__)
require "tinymce-rails-imageupload/version"

Gem::Specification.new do |s|
  s.name        = "tinymce-rails-imageupload"
  s.version     = Tinymce::Rails::Imageupload::VERSION
  s.authors     = ["Per Christian B. Viken"]
  s.email       = ["perchr@northblue.org"]
  s.homepage    = ""
  s.summary     = %q{TODO: Write a gem summary}
  s.description = %q{TODO: Write a gem description}

  s.files         = `git ls-files`.split("\n")
  s.test_files    = `git ls-files -- {test,spec,features}/*`.split("\n")
  s.require_paths = ["lib"]

  s.add_dependency "railties", ">= 3.1"
  s.add_development_dependency "bundler", "~> 1.0.0"
  s.add_development_dependency "rails",   ">= 3.1"
end
