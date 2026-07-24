# Tin Coffee API Contract

## 1. Overview

This document defines the API contract for the Tin Coffee website and admin CMS.

The API supports:

- Menu management
- Customer preorder pickup
- Room management
- VIP and conference room booking
- Gallery management
- Notification tracking
- Admin operations

## 2. Base URL

Development:

```text
http://localhost:3000/api
```

Production:

```text
https://your-domain.com/api
```

## 3. General Rules

### 3.1 Content Type

All JSON requests must include:

```http
Content-Type: application/json
```

### 3.2 Date and Time Format

Use ISO 8601 format where possible.

Example:

```text
2026-07-23T15:30:00+07:00
```

Booking date:

```text
2026-07-25
```

Booking time:

```text
14:00
```

### 3.3 Standard Success Response

```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

For list responses:

```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

### 3.4 Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The request data is invalid"
  }
}
```

## 4. HTTP Status Codes

| Status | Meaning |
|---|---|
| `200` | Request completed successfully |
| `201` | Resource created successfully |
| `400` | Invalid request or validation error |
| `401` | Authentication required |
| `403` | User does not have permission |
| `404` | Resource not found |
| `409` | Conflict or duplicate record |
| `500` | Internal server error |

---

# 5. Shared Types

## 5.1 Enums

```ts
export type MenuCategory =
  | "COFFEE"
  | "SIGNATURE"
  | "BAKERY"
  | "FOOD";

export type Temperature = "hot" | "iced";

export type SugarLevel =
  | "none"
  | "less"
  | "regular"
  | "extra";

export type IceLevel =
  | "less"
  | "regular"
  | "extra";

export type OrderStatus =
  | "pending"
  | "preparing"
  | "ready"
  | "completed";

export type RoomType =
  | "SMALL"
  | "CONFERENCE";

export type BookingStatus =
  | "pending"
  | "confirmed"
  | "rejected";

export type GalleryCategory =
  | "interior"
  | "exterior"
  | "menu"
  | "events";

export type NotificationChannel =
  | "telegram"
  | "email";

export type NotificationType =
  | "order_created"
  | "booking_created"
  | "status_changed";

export type NotificationRecipient =
  | "admin"
  | "customer";
```

## 5.2 Generic API Response

```ts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    message: string;
  };
  count?: number;
}
```

---

# 6. Menu API

## 6.1 Get Menu Items

```http
GET /api/menu
```

### Access

Public.

### Query Parameters

| Parameter | Type | Required | Description |
|---|---|---:|---|
| `category` | `MenuCategory` | No | Filter by menu category |
| `available` | `boolean` | No | Filter by availability |
| `isNew` | `boolean` | No | Filter newly added items |

### Example Request

```http
GET /api/menu?category=COFFEE&available=true
```

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "menu_001",
      "name": "Iced Latte",
      "category": "COFFEE",
      "price": 3.5,
      "description": "Espresso with fresh milk",
      "imageUrl": "/images/iced-latte.jpg",
      "available": true,
      "isNew": false,
      "addOns": [
        {
          "_id": "addon_001",
          "name": "Extra Shot",
          "price": 0.5,
          "available": true
        }
      ],
      "createdAt": "2026-07-23T08:00:00.000Z",
      "updatedAt": "2026-07-23T08:00:00.000Z"
    }
  ],
  "count": 1
}
```

## 6.2 Get One Menu Item

```http
GET /api/menu/:id
```

### Access

Public.

### Path Parameters

| Parameter | Type | Required |
|---|---|---:|
| `id` | `string` | Yes |

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "menu_001",
    "name": "Iced Latte",
    "category": "COFFEE",
    "price": 3.5,
    "description": "Espresso with fresh milk",
    "imageUrl": "/images/iced-latte.jpg",
    "available": true,
    "isNew": false,
    "addOns": [],
    "createdAt": "2026-07-23T08:00:00.000Z",
    "updatedAt": "2026-07-23T08:00:00.000Z"
  }
}
```

### Not Found Response

```json
{
  "success": false,
  "error": {
    "code": "MENU_ITEM_NOT_FOUND",
    "message": "Menu item was not found"
  }
}
```

## 6.3 Create Menu Item

```http
POST /api/menu
```

### Access

Admin only.

### Request Type

```ts
export interface CreateMenuAddOnRequest {
  name: string;
  price: number;
  available?: boolean;
}

export interface CreateMenuItemRequest {
  name: string;
  category: MenuCategory;
  price: number;
  description?: string;
  imageUrl?: string;
  available?: boolean;
  isNew?: boolean;
  addOns?: CreateMenuAddOnRequest[];
}
```

### Request Body

```json
{
  "name": "Iced Caramel Latte",
  "category": "COFFEE",
  "price": 3.75,
  "description": "Espresso, milk, and caramel",
  "imageUrl": "/images/caramel-latte.jpg",
  "available": true,
  "isNew": true,
  "addOns": [
    {
      "name": "Extra Shot",
      "price": 0.5,
      "available": true
    }
  ]
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "menu_002",
    "name": "Iced Caramel Latte",
    "category": "COFFEE",
    "price": 3.75,
    "description": "Espresso, milk, and caramel",
    "imageUrl": "/images/caramel-latte.jpg",
    "available": true,
    "isNew": true,
    "addOns": [
      {
        "_id": "addon_002",
        "name": "Extra Shot",
        "price": 0.5,
        "available": true
      }
    ],
    "createdAt": "2026-07-23T09:00:00.000Z",
    "updatedAt": "2026-07-23T09:00:00.000Z"
  },
  "message": "Menu item created successfully"
}
```

## 6.4 Update Menu Item

```http
PATCH /api/menu/:id
```

### Access

Admin only.

### Request Type

```ts
export type UpdateMenuItemRequest =
  Partial<CreateMenuItemRequest>;
```

### Request Body

```json
{
  "price": 4,
  "available": false
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "menu_002",
    "name": "Iced Caramel Latte",
    "category": "COFFEE",
    "price": 4,
    "description": "Espresso, milk, and caramel",
    "imageUrl": "/images/caramel-latte.jpg",
    "available": false,
    "isNew": true,
    "addOns": [],
    "createdAt": "2026-07-23T09:00:00.000Z",
    "updatedAt": "2026-07-23T09:20:00.000Z"
  },
  "message": "Menu item updated successfully"
}
```

## 6.5 Delete Menu Item

```http
DELETE /api/menu/:id
```

### Access

Admin only.

### Success Response

```json
{
  "success": true,
  "message": "Menu item deleted successfully"
}
```

---

# 7. Order API

## 7.1 Create Order

```http
POST /api/orders
```

### Access

Public.

### Request Type

```ts
export interface CreateOrderAddOnRequest {
  addOnId: string;
}

export interface CreateOrderItemRequest {
  menuItemId: string;
  quantity: number;
  temperature?: Temperature;
  sugarLevel?: SugarLevel;
  iceLevel?: IceLevel;
  addOns?: CreateOrderAddOnRequest[];
  note?: string;
}

export interface CreateOrderRequest {
  customerName: string;
  phone: string;
  items: CreateOrderItemRequest[];
  pickupTime: string;
  specialNote?: string;
}
```

### Important Backend Rule

The client should not control:

```text
name
price
add-on name
add-on price
totalAmount
status
createdAt
```

The backend should read the current prices from the database and calculate the total.

### Request Body

```json
{
  "customerName": "Mary",
  "phone": "012345678",
  "items": [
    {
      "menuItemId": "menu_001",
      "quantity": 2,
      "temperature": "iced",
      "sugarLevel": "regular",
      "iceLevel": "regular",
      "addOns": [
        {
          "addOnId": "addon_001"
        }
      ],
      "note": "One drink without straw"
    }
  ],
  "pickupTime": "2026-07-23T15:30:00+07:00",
  "specialNote": ""
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "order_001",
    "customerName": "Mary",
    "phone": "012345678",
    "items": [
      {
        "menuItemId": "menu_001",
        "name": "Iced Latte",
        "price": 3.5,
        "quantity": 2,
        "temperature": "iced",
        "sugarLevel": "regular",
        "iceLevel": "regular",
        "addOns": [
          {
            "addOnId": "addon_001",
            "name": "Extra Shot",
            "price": 0.5
          }
        ],
        "note": "One drink without straw"
      }
    ],
    "pickupTime": "2026-07-23T15:30:00+07:00",
    "totalAmount": 8,
    "status": "pending",
    "specialNote": "",
    "createdAt": "2026-07-23T10:00:00.000Z"
  },
  "message": "Order created successfully"
}
```

## 7.2 Get Orders

```http
GET /api/orders
```

### Access

Admin only.

### Query Parameters

| Parameter | Type | Required |
|---|---|---:|
| `status` | `OrderStatus` | No |
| `date` | `string` | No |
| `phone` | `string` | No |

### Success Response

```json
{
  "success": true,
  "data": [],
  "count": 0
}
```

## 7.3 Get One Order

```http
GET /api/orders/:id
```

### Access

Admin only.

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "order_001",
    "customerName": "Mary",
    "phone": "012345678",
    "items": [],
    "pickupTime": "2026-07-23T15:30:00+07:00",
    "totalAmount": 8,
    "status": "pending",
    "specialNote": "",
    "createdAt": "2026-07-23T10:00:00.000Z"
  }
}
```

## 7.4 Update Order Status

```http
PATCH /api/orders/:id/status
```

### Access

Admin only.

### Request Type

```ts
export interface UpdateOrderStatusRequest {
  status: OrderStatus;
}
```

### Request Body

```json
{
  "status": "preparing"
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "order_001",
    "status": "preparing"
  },
  "message": "Order status updated successfully"
}
```

---

# 8. Room API

## 8.1 Get Rooms

```http
GET /api/rooms
```

### Access

Public.

### Query Parameters

| Parameter | Type | Required |
|---|---|---:|
| `type` | `RoomType` | No |
| `available` | `boolean` | No |

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "room_001",
      "name": "VIP Small Room",
      "type": "SMALL",
      "capacity": 8,
      "price": 15,
      "description": "Private room for small groups",
      "imageUrl": "/images/vip-small.jpg",
      "available": true,
      "createdAt": "2026-07-23T08:00:00.000Z"
    }
  ],
  "count": 1
}
```

## 8.2 Get One Room

```http
GET /api/rooms/:id
```

### Access

Public.

## 8.3 Create Room

```http
POST /api/rooms
```

### Access

Admin only.

### Request Type

```ts
export interface CreateRoomRequest {
  name: string;
  type: RoomType;
  capacity: number;
  price: number;
  description?: string;
  imageUrl?: string;
  available?: boolean;
}
```

### Request Body

```json
{
  "name": "Conference Room",
  "type": "CONFERENCE",
  "capacity": 20,
  "price": 30,
  "description": "Room for meetings and presentations",
  "imageUrl": "/images/conference-room.jpg",
  "available": true
}
```

## 8.4 Update Room

```http
PATCH /api/rooms/:id
```

### Access

Admin only.

### Request Type

```ts
export type UpdateRoomRequest =
  Partial<CreateRoomRequest>;
```

## 8.5 Delete Room

```http
DELETE /api/rooms/:id
```

### Access

Admin only.

---

# 9. Booking API

## 9.1 Create Booking

```http
POST /api/bookings
```

### Access

Public.

### Request Type

```ts
export interface CreateBookingRequest {
  roomId: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  duration: number;
  partySize: number;
  note?: string;
}
```

### Request Body

```json
{
  "roomId": "room_001",
  "customerName": "Mary",
  "phone": "012345678",
  "date": "2026-07-25",
  "time": "14:00",
  "duration": 2,
  "partySize": 8,
  "note": "Birthday meeting"
}
```

### Backend Validation

The backend should check:

- Room exists
- Room is active
- Party size does not exceed room capacity
- Date and time are valid
- Time slot does not overlap an existing confirmed or pending booking

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "booking_001",
    "roomId": "room_001",
    "customerName": "Mary",
    "phone": "012345678",
    "date": "2026-07-25",
    "time": "14:00",
    "duration": 2,
    "partySize": 8,
    "note": "Birthday meeting",
    "status": "pending",
    "createdAt": "2026-07-23T10:20:00.000Z"
  },
  "message": "Booking created successfully"
}
```

### Conflict Response

```json
{
  "success": false,
  "error": {
    "code": "BOOKING_TIME_CONFLICT",
    "message": "The selected room is already booked for this time"
  }
}
```

## 9.2 Get Bookings

```http
GET /api/bookings
```

### Access

Admin only.

### Query Parameters

| Parameter | Type | Required |
|---|---|---:|
| `status` | `BookingStatus` | No |
| `date` | `string` | No |
| `roomId` | `string` | No |
| `phone` | `string` | No |

## 9.3 Get One Booking

```http
GET /api/bookings/:id
```

### Access

Admin only.

## 9.4 Update Booking Status

```http
PATCH /api/bookings/:id/status
```

### Access

Admin only.

### Request Type

```ts
export interface UpdateBookingStatusRequest {
  status: BookingStatus;
}
```

### Request Body

```json
{
  "status": "confirmed"
}
```

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "booking_001",
    "status": "confirmed"
  },
  "message": "Booking status updated successfully"
}
```

---

# 10. Gallery API

## 10.1 Get Gallery Images

```http
GET /api/gallery
```

### Access

Public.

### Query Parameters

| Parameter | Type | Required |
|---|---|---:|
| `category` | `GalleryCategory` | No |

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "gallery_001",
      "url": "/images/interior-1.jpg",
      "caption": "Indoor seating area",
      "category": "interior",
      "displayOrder": 1,
      "createdAt": "2026-07-23T08:00:00.000Z"
    }
  ],
  "count": 1
}
```

## 10.2 Create Gallery Image

```http
POST /api/gallery
```

### Access

Admin only.

### Request Type

```ts
export interface CreateGalleryImageRequest {
  url: string;
  caption?: string;
  category: GalleryCategory;
  displayOrder?: number;
}
```

### Request Body

```json
{
  "url": "/images/interior-2.jpg",
  "caption": "Yellow-themed indoor seating",
  "category": "interior",
  "displayOrder": 2
}
```

## 10.3 Update Gallery Image

```http
PATCH /api/gallery/:id
```

### Access

Admin only.

### Request Type

```ts
export type UpdateGalleryImageRequest =
  Partial<CreateGalleryImageRequest>;
```

## 10.4 Delete Gallery Image

```http
DELETE /api/gallery/:id
```

### Access

Admin only.

---

# 11. Notification API

Notifications are normally generated by the backend after an order or booking event.

The public frontend should not create notification records directly.

## 11.1 Get Notification Logs

```http
GET /api/notifications
```

### Access

Admin only.

### Query Parameters

| Parameter | Type | Required |
|---|---|---:|
| `type` | `NotificationType` | No |
| `channel` | `NotificationChannel` | No |
| `recipient` | `NotificationRecipient` | No |
| `sent` | `boolean` | No |

### Success Response

```json
{
  "success": true,
  "data": [
    {
      "_id": "notification_001",
      "type": "order_created",
      "recipient": "admin",
      "channel": "telegram",
      "payload": {
        "orderId": "order_001",
        "customerName": "Mary"
      },
      "sent": true,
      "sentAt": "2026-07-23T10:01:00.000Z",
      "createdAt": "2026-07-23T10:00:30.000Z"
    }
  ],
  "count": 1
}
```

## 11.2 Retry Failed Notification

Optional endpoint:

```http
POST /api/notifications/:id/retry
```

### Access

Admin only.

### Success Response

```json
{
  "success": true,
  "data": {
    "_id": "notification_001",
    "sent": true,
    "sentAt": "2026-07-23T10:05:00.000Z"
  },
  "message": "Notification sent successfully"
}
```

---

# 12. Recommended Error Codes

| Code | Meaning |
|---|---|
| `VALIDATION_ERROR` | Request data is invalid |
| `INVALID_ID` | Resource ID format is invalid |
| `UNAUTHORIZED` | User is not authenticated |
| `FORBIDDEN` | User lacks permission |
| `MENU_ITEM_NOT_FOUND` | Menu item does not exist |
| `MENU_ITEM_UNAVAILABLE` | Menu item cannot currently be ordered |
| `ADD_ON_NOT_FOUND` | Selected add-on does not exist |
| `ADD_ON_UNAVAILABLE` | Selected add-on is unavailable |
| `ORDER_NOT_FOUND` | Order does not exist |
| `INVALID_ORDER_STATUS` | Status change is invalid |
| `ROOM_NOT_FOUND` | Room does not exist |
| `ROOM_UNAVAILABLE` | Room is disabled |
| `BOOKING_NOT_FOUND` | Booking does not exist |
| `BOOKING_TIME_CONFLICT` | Booking overlaps another booking |
| `PARTY_SIZE_EXCEEDS_CAPACITY` | Party is too large for the room |
| `GALLERY_IMAGE_NOT_FOUND` | Gallery image does not exist |
| `NOTIFICATION_NOT_FOUND` | Notification record does not exist |
| `INTERNAL_SERVER_ERROR` | Unexpected server error |

---

# 13. Suggested Next.js Route Structure

```text
src/app/api/
├── menu/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── orders/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       └── status/
│           └── route.ts
├── rooms/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
├── bookings/
│   ├── route.ts
│   └── [id]/
│       ├── route.ts
│       └── status/
│           └── route.ts
├── gallery/
│   ├── route.ts
│   └── [id]/
│       └── route.ts
└── notifications/
    ├── route.ts
    └── [id]/
        └── retry/
            └── route.ts
```

---

# 14. Public and Admin Access Summary

| Endpoint Group | Public | Admin |
|---|---:|---:|
| View menu | Yes | Yes |
| Create, update, delete menu | No | Yes |
| Create order | Yes | Yes |
| View and update orders | No | Yes |
| View rooms | Yes | Yes |
| Create, update, delete rooms | No | Yes |
| Create booking | Yes | Yes |
| View and update bookings | No | Yes |
| View gallery | Yes | Yes |
| Manage gallery | No | Yes |
| View notification logs | No | Yes |

---

# 15. Important Design Decisions

1. The frontend sends IDs and customer choices.
2. The backend reads current prices from MongoDB.
3. The backend calculates `totalAmount`.
4. The backend generates `_id`, `status`, and timestamps.
5. Orders store menu item names and prices as snapshots.
6. Orders store add-on names and prices as snapshots.
7. Booking conflicts must be checked by the backend.
8. Notification records are created by backend processes.
9. Admin-only endpoints must be protected by authentication.
10. `CartItem` is frontend state and does not require an API or MongoDB collection.
