import 'package:dio/dio.dart';
import 'package:shared_preferences/shared_preferences.dart';

class ApiClient {
  static const String baseUrl = 'http://10.0.2.2:3000';

  static final Dio _networkClient = Dio(
    BaseOptions(
      baseUrl: baseUrl,
      connectTimeout: const Duration(seconds: 10),
      receiveTimeout: const Duration(seconds: 10),
      headers: {'Content-Type': 'application/json'},
    ),
  );

  // attach token to every request automatically
  static Future<void> setupInterceptors() async {
    _networkClient.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final localStorage = await SharedPreferences.getInstance();
          final savedToken = localStorage.getString('access_token');

          if (savedToken != null) {
            options.headers['Authorization'] = 'Bearer $savedToken';
          }
          return handler.next(options);
        },
        onError: (error, handler) {
          // handle errors globally
          return handler.next(error);
        },
      ),
    );
  }

  static Dio get instance => _networkClient;
}