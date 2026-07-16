import 'package:dio/dio.dart';
import 'api_client.dart';

class CartApi {
  final Dio _dio = ApiClient.instance;

  Future<Map<String, dynamic>> getCart() async {
    final response = await _dio.get('/cart');
    return response.data;
  }

  Future<Map<String, dynamic>> addToCart(
      String serviceId, String selectedDate, String selectedTime) async {
    final response = await _dio.post('/cart/items', data: {
      'serviceId': serviceId,
      'selectedDate': selectedDate,
      'selectedTime': selectedTime,
    });
    return response.data;
  }

  Future<Map<String, dynamic>> updateCartItem(
      String itemId, String selectedDate, String selectedTime) async {
    final response = await _dio.patch('/cart/items/$itemId', data: {
      'selectedDate': selectedDate,
      'selectedTime': selectedTime,
    });
    return response.data;
  }

  Future<void> removeCartItem(String itemId) async {
    await _dio.delete('/cart/items/$itemId');
  }
}