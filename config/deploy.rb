set :application, "lookycode"
set :domain, 'lookycode.com'
role :app, domain
role :web, domain
role :db,  domain

set :user, 'deploy'
set :deploy_to, "/var/www/apps/#{application}"
set :use_sudo, true

set :scm, :git
set :repository, "git@github.com:mephux/#{application}.git"
set :branch, "master"

namespace :deploy do
  
  desc "Restarting mod_rails with restart.txt"
  task :restart do
    run "touch #{current_path}/tmp/restart.txt"
  end

  [:start, :stop].each do |t|
    desc "#{t} task is a no-op with mod_rails"
    task t, :roles => :app do ; end
  end
  
end


after 'deploy:update', 'deploy:restart'
