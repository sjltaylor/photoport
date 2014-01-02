class UserService
  def create_user(context={})
    User.create.tap {|user| user.collections.create }
  end
  def show_default_data(context={})
    user = context[:user]
    user.collections.create if user.collections.empty?
    return user.collections.first
  end
end
