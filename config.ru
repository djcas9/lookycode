$:.unshift File.join(File.dirname(__FILE__), '.')
require 'rubygems'
require 'sinatra'
require 'lookycode'

run Sinatra::Application