class UserService
  def create_user(context={})
    User.create.tap {|user| user.collections.create }
  end
end
