require "#{File.dirname(__FILE__)}/lib/web"

module LookyCode
  VERSION = '0.1.0'
end

LookyCode::Web.run! :port => 3000