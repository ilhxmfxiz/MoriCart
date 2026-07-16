import 'package:dio/dio.dart';
import 'api_client.dart';

class BookingsApi {
  // Using a more natural name for our network client
  final Dio _httpClient = ApiClient.instance;

  // Handles the checkout process when a user is ready to pay
  Future<Map<String, dynamic>> checkout(String paymentMethod) async {
    try {
      // Sending over the payment choice the user picked
      final response = await _httpClient.post(
        '/bookings/checkout',
        data: {'paymentMethod': paymentMethod},
      );
      return response.data;
    } on DioException catch (e) {
      // Something went sideways during the checkout process
      throw Exception('Ah, looks like the checkout failed. Details: ${e.message}');
    }
  }

  // Grabs all the bookings tied to the logged-in user
  Future<List<dynamic>> getMyBookings() async {
    try {
      final response = await _httpClient.get('/bookings');
      return response.data;
    } on DioException catch (e) {
      // Couldn't fetch the list from the server
      throw Exception('We couldn\'t load your bookings right now. Please try again. (${e.message})');
    }
  }

  // Fetches the details for one specific booking
  Future<Map<String, dynamic>> getBookingById(String bookingId) async {
    try {
      final response = await _httpClient.get('/bookings/$bookingId');
      return response.data;
    } on DioException catch (e) {
      // Probably an invalid ID or network hiccup
      throw Exception('Couldn\'t find any booking with ID $bookingId. Error: ${e.message}');
    }
  }

  // Let's the user cancel an existing booking
  Future<Map<String, dynamic>> cancelBooking(String bookingId) async {
    try {
      // Hitting the cancel endpoint for this specific booking ID
      final response = await _httpClient.post('/bookings/$bookingId/cancel');
      return response.data;
    } on DioException catch (e) {
      // Something stopped the cancellation from going through
      throw Exception('Oops, we weren\'t able to cancel that booking. Technical bit: ${e.message}');
    }
  }
}