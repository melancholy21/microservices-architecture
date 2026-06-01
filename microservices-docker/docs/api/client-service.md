# Client Management Service API Specification (`Port 3007`)

This service manages real-world client profiles and business contact information linked to an underlying authentication identity.

---

## 1. Create Client Profile

Establishes a new client contact profile inside `client_db`. This is triggered automatically during user onboarding.

* **Base URL:** `http://localhost:3007`
* **Endpoint:** `/api/v1/clients`
* **Method:** `POST`
* **Headers:** `Content-Type: application/json`

### Request Body Example
```json
{
  "authUserId": "6a13efcf9af14f2a12bbcbef",
  "firstName": "Starlight",
  "lastName": "Jenkins",
  "companyName": "Compound V",
  "phoneNumber": "+639123456789"
}
```
### Request Payload Example
```json
{
  "message": "Profile created successfully",
  "profile": {
    "authUserId": "6a13efcf9af14f2a12bbcbef",
    "firstName": "Starlight",
    "lastName": "Jenkins",
    "companyName": "Compound V",
    "phoneNumber": "+639123456789",
    "status": "active",
    "_id": "6a1538ba8213ca4bbee0875d",
    "createdAt": "2026-05-26T06:07:54.692Z",
    "updatedAt": "2026-05-26T06:07:54.692Z",
    "__v": 0
  }
}
```
### Error Scenario
### `400` Bad Request (Missing Required Fields)
```json
{
  "message": "First name, last name, and phone number are required"
}
```
### `400` Bad Request (Duplicate Identity Link)
```json
{
  "message": "A client profile already exists for this user account"
}
```
### `500` Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```
---

## 2. Fetch Client Profile

Retrieves the specific personal information block belonging to a user by mapping their core authentication ID string.

* **Base URL:** `http://localhost:3007`
* **Endpoint:** `/api/v1/clients/:authUserId`
* **Method:** `GET`
* **Headers:** `Content-Type: application/json`

### Request Body Example
None (Passed via URL parameter)
### Response Payload Example
```json
{
  "_id": "6a1538ba8213ca4bbee0875d",
  "authUserId": "6a13efcf9af14f2a12bbcbef",
  "firstName": "Starlight",
  "lastName": "Jenkins",
  "companyName": "Compound V",
  "phoneNumber": "+639123456789",
  "status": "active",
  "createdAt": "2026-05-26T06:07:54.692Z",
  "updatedAt": "2026-05-26T06:07:54.692Z",
  "__v": 0
}
```
### Error Scenario
### `404` Not Found (Profile Missing)
```json
{
  "message": "Client profile record not found"
}
```
### `500` Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```

---

## 3. Update Client Profile

Modifies customizable profile properties inside client_db.

* **Base URL:** `http://localhost:3007`
* **Endpoint:** `/api/v1/clients/:authUserId`
* **Method:** `PUT`
* **Headers:** `Content-Type: application/json`

### Request Body Example
```json
{
  "firstName": "Leeroy",
  "lastName": "Jenkins"
}
```
### Request Payload Example
```json
{
  "message": "Profile updated successfully",
  "updatedProfile": {
    "_id": "6a1538ba8213ca4bbee0875d",
    "authUserId": "6a13efcf9af14f2a12bbcbef",
    "firstName": "Leeroy",
    "lastName": "Jenkins",
    "companyName": "Compound V",
    "phoneNumber": "+639123456789",
    "status": "active",
    "createdAt": "2026-05-26T06:07:54.692Z",
    "updatedAt": "2026-05-26T06:24:51.739Z",
    "__v": 0
  }
}
```
### Error Scenario
### `404` Not Found (Record Missing)
```json
{
  "message": "Target client profile record not found"
}
```
### `500` Internal Server Error
```json
{
  "message": "Internal Server Error"
}
```