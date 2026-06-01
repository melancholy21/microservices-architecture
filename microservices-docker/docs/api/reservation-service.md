# Reservation Service API Specification (`Port 3009`)

This service manages event booking allocations, scheduling availability, and transaction lifecycle flags inside `reservation_db`.

---

## 1. Place a Reservation

Locks down a specific event schedule slot. The identity of the creator is automatically extracted downstream via the decoded session payload.

* **Base URL:** `http://localhost:3009`
* **Endpoint:** `/api/v1/reservations`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`
  * `Authorization: Bearer <JWT_TOKEN>`

### Request Body Example
```json
{
  "eventTitle": "Ultra Birthday Celebration",
  "reservationDate": "2026-11-20T19:00:00.000Z",
  "numberOfGuests": 150,
  "recipientEmail": "starlight@gmail.com"
}
```
### Request Payload Example
```json
{
  "message": "Reservation placed successfully",
  "booking": {
    "authUserId": "6a150006e2191efc25eb66d6",
    "eventTitle": "Ultra Birthday Celebration",
    "reservationDate": "2026-11-20T19:00:00.000Z",
    "numberOfGuests": 150,
    "status": "confirmed",
    "_id": "6a153fa83a4081c9dfa47f58",
    "createdAt": "2026-05-26T06:37:28.069Z",
    "updatedAt": "2026-05-26T06:37:28.069Z",
    "__v": 0
  }
}
```
### Error Scenario
### `401` Unauthorized (Token Missing or Expired)
```json
{
  "message": "Unauthorized: Access Token Missing"
}
```
### `400` Bad Request (Validation Limits Swapped)
```json
{
  "message": "Event title, reservation date, and a valid guest headcount are required"
}
```
### `500` Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```
## 2. Fetch User's Reservations

Queries the database cluster to compile a historical list collection matching an explicit user identity reference.

* **Base URL:** `http://localhost:3009`
* **Endpoint:** `/api/v1/reservations/user/:authUserId`
* **Method:** `GET`
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`

### Request Body Example
```json
None (Passed via URL parameter)
```
### Request Payload Example
```json
{
  "_id": "6a153fa83a4081c9dfa47f58",
  "authUserId": "6a150006e2191efc25eb66d6",
  "eventTitle": "Ultra Birthday Celebration",
  "reservationDate": "2026-11-20T19:00:00.000Z",
  "numberOfGuests": 150,
  "status": "confirmed",
  "createdAt": "2026-05-26T06:37:28.069Z",
  "updatedAt": "2026-05-26T06:37:28.069Z",
  "__v": 0
}
```
### Error Scenario
### `401` Unauthorized (Invalid Signature)
```json
{
  "message": "Unauthorized: Token verification failed"
}
```
### `500` Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```
## 3. Cancel a Reservations

Alters the processing status flag of an active schedule allocation record to "cancelled".

* **Base URL:** `http://localhost:3009`
* **Endpoint:** `/api/v1/reservations/cancel/:id`
* **Method:** `PUT`
* **Headers:** `Authorization: Bearer <JWT_TOKEN>`

### Request Body Example
None (Passed via URL target parameter)
### Request Payload Example
```json
{
  "message": "Reservation cancelled successfully",
  "cancelledBooking": {
    "_id": "6a150276f10e9e73efc75135",
    "authUserId": "6a150006e2191efc25eb66d6",
    "eventTitle": "Birthday Celebration",
    "reservationDate": "2026-11-20T19:00:00.000Z",
    "numberOfGuests": 25,
    "status": "cancelled",
    "createdAt": "2026-05-26T02:16:22.647Z",
    "updatedAt": "2026-05-26T07:02:41.574Z",
    "__v": 0
  }
}
```
### Error Scenario
### `404` Not Found (Target Missing)
```json
{
  "message": "Target reservation not found"
}
```
### `500` Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```