source "https://rubygems.org"
# You may use http://rbenv.org/ or https://rvm.io/ to install and use this version
ruby '>= 2.7.4'

gem 'concurrent-ruby', '1.3.4'
gem "fastlane", "2.210.1"
gem 'cocoapods', '>= 1.11.3'
gem 'activesupport', '~> 7.0', '<= 7.0.8'

plugins_path = File.join(File.dirname(__FILE__), 'fastlane', 'Pluginfile')
eval_gemfile(plugins_path) if File.exist?(plugins_path)
