import 'package:dio/dio.dart';
import 'api_client.dart';

class ServicesApi {
  final Dio _dio = ApiClient.instance;

  Future<Map<String, dynamic>> fetchServices({
    int pageNumber = 1,
    int itemsPerPage = 10,
    String? categoryFilter,
    String? searchQuery,
  }) async {
    final queryParameters = {
      'page': pageNumber,
      'limit': itemsPerPage,
      if (category != null) 'category': categoryFilter,
      if (search != null) 'search': searchQuery,
    };

    final response = await _dio.get('/services', queryParameters: queryParameters);
    return response.data;
  }

  Future<Map<String, dynamic>> fetchServiceById(String serviceId) async {
    final response = await _dio.get('/services/$serviceId');
    return response.data;
  }
}