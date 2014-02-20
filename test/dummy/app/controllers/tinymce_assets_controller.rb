class TinymceAssetsController < ApplicationController
  respond_to :json

  def create
    img = Image.create params.permit(:file, :alt, :hint)
    
    render json: {
      image: img
    }, layout: false, content_type: "text/html"
  end
end
