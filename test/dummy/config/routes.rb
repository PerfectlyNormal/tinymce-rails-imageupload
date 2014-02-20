Dummy::Application.routes.draw do
  post '/tinymce_assets' => 'tinymce_assets#create'
  
  root to: 'application#editor'
end
