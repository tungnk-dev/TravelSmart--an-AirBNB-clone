class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception

  helper_method :logged_in?, :current_user

  def logged_in?
    !!current_user
  end

  def current_user
    return nil unless session[:session_token]
    @current_user ||= User.find_by_session_token(session[:session_token])
  end

  def login_user!(user)
    user.reset_session_token!
    session[:session_token] = user.session_token
    @current_user = user
  end

  def require_logged_in
    render json: {base: ["invalid credentials"]}, status: 401 if !current_user
  end

  #We make the current_user nil so that if we try to sign out when
  #we are logged in, this does not work
  def logout_user!
    current_user.reset_session_token!
    session[:session_token] = nil
    @current_user = nil
  end

end
