require 'rubygems'
require 'sinatra'
require 'rest_client'
require 'json'

VERSION = '0.1.0'

set :root, File.expand_path(File.join(File.dirname(__FILE__)))

get '/' do
  @username = 'mephux'
  erb :index
end

get '/:user' do
  @username = params[:user] || 'mephux'
  erb :index
end

get '/fetch/:user' do
  url = "https://api.github.com/users/#{params[:user]}/repos"
  RestClient.get(url).to_json
end