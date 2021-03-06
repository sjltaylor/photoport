Photoport::Application.routes.draw do
  mount JasmineRails::Engine => '/jasmine' if defined?(JasmineRails)

  root :to => 'landing#index'
  get 'status' => 'status#index'

  get 'who_are_you'  => 'identities#hello', as: :hello
  get 'seeya' => 'identities#goodbye', as: :goodbye
  post 'identify' => 'identities#identify'

  resources :collections do
    resources :photos, only: [:create, :show, :destroy] do
      collection do
        get 'edit'
      end
    end
  end

  # resources :collections, only: [] do
  #
  # end

  # get  'samples/:sample_name' => 'samples#show'

  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  # root :to => 'welcome#index'

  # See how all your routes lay out with "rake routes"

  get '*missing_route' => 'application#render_404'
end
