require 'sinatra'
require 'json'

module LookyCode
  class Web < Sinatra::Base
    set :root, File.expand_path(File.join(File.dirname(__FILE__), '..', 'data'))

    get '/' do
      @username = 'mephux'
      erb :index
    end

    get '/:user' do
      @username = params[:user] || 'mephux'
      erb :index
    end

  end
end
