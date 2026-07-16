import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:shared_preferences/shared_preferences.dart';
import '../../core/api/auth_api.dart';
import 'auth_event.dart';
import 'auth_state.dart';

class AuthBloc extends Bloc<AuthEvent, AuthState> {
  final AuthApi _authApi = AuthApi();

  AuthBloc() : super(AuthInitial()) {
    on<LoginRequested>(_handleLogin);
    on<SignupRequested>(_handleSignup);
    on<LogoutRequested>(_handleLogout);
  }

  Future<void> _handleLogin(
      LoginRequested event, Emitter<AuthState> updateUi) async {
    updateUi(AuthLoading());
    try {
      final response = await _authApi.login(event.email, event.password);

      // save token locally
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', response['accessToken']);

      updateUi(AuthSuccess(
        accessToken: response['accessToken'],
        userInfo: response['userInfo'],
      ));
    } catch (exception) {
      updateUi(AuthFailure(errorMessage: 'Wrong email or password. Try again!'));
    }
  }

  Future<void> _handleSignup(
      SignupRequested event, Emitter<AuthState> emit) async {
    updateUi(AuthLoading());
    try {
      final response =
          await _authApi.signup(event.name, event.email, event.password);

      // save token after signup too
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('access_token', response['accessToken']);

      updateUi(AuthSuccess(
        accessToken: response['accessToken'],
        userInfo: response['userInfo'],
      ));
    } catch (exception) {
      updateUi(AuthFailure(errorMessage: 'Signup failed. Please try again!'));
    }
  }

  Future<void> _handleLogout(
      LogoutRequested event, Emitter<AuthState> updateUi) async {
    // clear saved token
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('access_token');
    updateUi(AuthLoggedOut());
  }
}