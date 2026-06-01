# Authentication Service API Specification (`Port 3006`)

This service manages user registration, security credentials, and issues session JSON Web Tokens (JWT).

---

## 1. User Registration

Creates a secure user credential footprint inside `auth_db`.

* **Base URL:** `http://localhost:3006`
* **Endpoint:** `/api/v1/users/register`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`

### Request Body Example
```json
{
  "username": "armaggedon",
  "email": "armaggedon@gmail.com",
  "password": "12345678"
}
```
### Response Payload Example
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTUwMDA2ZTIxOTFlZmMyNWViNjZkNiIsImlhdCI6MTc3OTc2MTE1OCwiZXhwIjoxNzc5ODQ3NTU4fQ.Ow0xKap7YPDXEe3ciqNw82kjBffhV0hi9J3GBfrzIKU",
  "user": {
    "id": "6a150006e2191efc25eb66d6",
    "email": "armaggedon@gmail.com",
    "username": "armaggedon"
  }
}
```
### Error State
### 400 Bad Request
```json
{
  "message": "All fields are required"
}

```
### 404 Not Found
```json
{
  "message": "Username or email already exists"
}
```
### 500 Internal Server Error
```json
{
  "message": "Internal Server Error",
}
```
---

## 2. Login

Validates user credentials against `auth_db` and issues a secure session JSON Web Token (JWT).

* **Base URL:** `http://localhost:3006`
* **Endpoint:** `/api/v1/users/login`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`

### Request Body Example
```json
{
  "email": "starlight@gmail.com",
  "password": "12345678"
}
```
### Response Payload Example
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjZhMTNlZmNmOWFmMTRmMmExMmJiY2JlZiIsImlhdCI6MTc3OTc3MzQxMywiZXhwIjoxNzc5ODU5ODEzfQ.1SdTuSsBCiwLA43C4Xj5FyDPCAC8PHWPtfVP07oEB7Q",
  "user": {
    "id": "6a13efcf9af14f2a12bbcbef",
    "email": "starlight@gmail.com",
    "username": "starlight"
  }
}
```
### Error State
### `400` Bad Request
```json
{
  "message": "Invalid credentials!"
}
```
### `404` Not Found
```json
{
  "message": "User not found!"
}

```
### `500` Internal Server Error
```json
{
  "message": "Internal Server Error",
}
```