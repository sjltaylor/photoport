namespace :samples do
  task single_id: :environment do
    Samples.new.single_id
  end
end
