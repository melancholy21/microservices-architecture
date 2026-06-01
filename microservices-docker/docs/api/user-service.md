# User Service API Specification (`Port 3010`)

This service anchors global account states, role designations, and application interface preference profiles inside `user_db`.

---

## 1. Initialize Account Settings

Establishes a default configuration and permissions map for a newly registered identity. 

* **Base URL:** `http://localhost:3010`
* **Endpoint:** `/api/v1/user-profiles/initialize`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
* **Auth Requirement:** None (Open System Route)

### Request Body Example
```json
{
  "authUserId": "6a13efcf9af14f2a12bbcbef",
  "role": "admin",
  "preferences": {
    "theme": "dark",
    "language": "en"
  }
}
```
### Request Payload Example
```json
{
  "message": "Global account state initialized",
  "configuration": {
    "authUserId": "6a13efcf9af14f2a12bbcbef",
    "role": "admin",
    "accountStatus": "active",
    "preferences": {
      "theme": "dark",
      "language": "en"
    },
    "_id": "6a154a8275d7b92586dd1a88",
    "createdAt": "2026-05-26T07:23:46.498Z",
    "updatedAt": "2026-05-26T07:23:46.498Z",
    "__v": 0
  }
}
```
### Error Scenario
### `400` Bad Request (Missing Identity Parameter)
```json
{
  "message": "Authentication primary key string missing"
}
```
### `500` Internal Server Error 
```json
{
  "message": "Internal Server Error"
}
```

---

## 2. Fetch My Interface Settings

Establishes a default configuration and permissions map for a newly registered identity. 

* **Base URL:** `http://localhost:3010`
* **Endpoint:** `/api/v1/user-profiles/me`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`

### Request Body Example
None (Extracted directly from token payload)
### Request Payload Example
```json
{
  "preferences": {
    "theme": "dark",
    "language": "en"
  },
  "_id": "6a1505869b2a08b92b26d873",
  "authUserId": "6a150006e2191efc25eb66d6",
  "role": "client",
  "accountStatus": "active",
  "createdAt": "2026-05-26T02:29:26.465Z",
  "updatedAt": "2026-05-26T02:29:26.465Z",
  "__v": 0
}
```
### Error Scenario
### `401` Unauthorized (Session Token Missing or Expired)
```json
{
  "message": "Unauthorized: Access Token Missing"
}
```
### `404` Not Found
```json
{
  "message": "Account configurations not found for this profile"
}
```
### `500` Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## 3. Administrative Override

Elevated internal endpoint allowing system administrators to modify core privileges or lock a target account lifecycle state.

* **Base URL:** `http://localhost:3010`
* **Endpoint:** `/api/v1/user-profiles/admin/override/:targetAuthUserId`
* **Method:** `PUT`
* **Headers:** * `Content-Type: application/json`
  * `Authorization: Bearer <JWT_TOKEN>`

### Request Body Example
```json
{
  "role": "staff",
  "accountStatus": "active"
}
```
### Request Payload Example
```json
{
  "message": "Account parameters modified successfully",
  "updatedAccount": {
    "preferences": {
      "theme": "dark",
      "language": "en"
    },
    "_id": "6a15526042e640b5fafc50ad",
    "authUserId": "6a13f0709af14f2a12bbcbf0",
    "role": "staff",
    "accountStatus": "active",
    "createdAt": "2026-05-26T07:57:20.581Z",
    "updatedAt": "2026-05-26T08:01:18.214Z",
    "__v": 0
  }
}
```
### Error Scenario
### `401` Unauthorized (Invalid Session Key)
```json
{
  "message": "Unauthorized: Token verification failed"
}
```
### `403` Forbidden (Insufficient Role Privileges - RBAC Trigger)
```json
{
  "message": "Forbidden: You do not have permission to execute this action"
}
```
### `500` Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```