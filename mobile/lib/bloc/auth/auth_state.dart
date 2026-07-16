import 'package:equatable/equatable.dart';

// Just a quick data blueprint for our user's info.
// We make it Equatable too so Flutter knows if the profile data actually changed!
class UserProfile extends Equatable {
  final String id;
  final String fullName;
  final String emailAddress;

  const UserProfile({
    required this.id,
    required this.fullName,
    required this.emailAddress,
  });

  // A handy constructor to easily convert the server's raw map into this clean object
  factory UserProfile.fromMap(Map<String, dynamic> map) {
    return UserProfile(
      id: map['_id'] ?? '',
      fullName: map['name'] ?? 'Guest User',
      emailAddress: map['email'] ?? '',
    );
  }

  // Telling Equatable to look at these fields to see if two profiles are identical
  @override
  List<Object?> get props => [id, fullName, emailAddress];
}

// ---------------------------------------------------------------------------
// Auth States
// ---------------------------------------------------------------------------

abstract class AuthState extends Equatable {
  const AuthState();

  @override
  List<Object?> get props => [];
}

// Just booted up the app, nothing has happened yet
class AuthInitial extends AuthState {}

// Checking credentials or waiting on the server... spinner time!
class AuthLoading extends AuthState {}

// They're in! We've got their token and their clean custom profile object
class AuthSuccess extends AuthState {
  final String authToken;
  final UserProfile userProfile; // <-- Look Ma, a custom class!

  const AuthSuccess({required this.authToken, required this.userProfile});

  @override
  List<Object?> get props => [authToken, userProfile];
}

// Drat. Something broke. Here's why:
class AuthFailure extends AuthState {
  final String failureMessage;

  const AuthFailure({required this.failureMessage});

  @override
  List<Object?> get props => [failureMessage];
}

// Back to square one, user hit sign out
class AuthLoggedOut extends AuthState {}