export type MenuCategory = "COFFEE" | "SIGNATURE" | "BAKERY" | "FOOD";

export type Temperature = "hot" | "iced";
export type SugarLevel = "none" | "less" | "regular" | "extra";
export type IceLevel = "less" | "regular" | "extra";
export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export interface MenuAddOn {
  _id: string;
  name: string;
  price: number;
  available: boolean;
}

// Represent a menu item in the database
export interface MenuItem {
  _id: string;
  itemId: string; // Human-readable ID like "menu_001"
  name: string;
  category: MenuCategory;
  price: number;
  description: string;
  imageUrl?: string;
  available: boolean;
  isNew: boolean;
  addOns?: MenuAddOn[];
  createdAt?: string;
  updatedAt?: string;
}

// One item inside a customer's order
// Includes all customization choices
export interface OrderItem {
  menuItemId: string;
  name: string; // snapshot at time of order
  price: number; // snapshot at time of order
  quantity: number;
  temperature: Temperature;
  sugarLevel: SugarLevel;
  iceLevel: IceLevel;
  addOns: { addOnId: string; name: string; price: number }[];
  note: string;
}

// Represents a customer's order that includes all the OrderItems they have chosen
export interface Order {
  _id: string;
  customerName: string;
  phone: string;
  items: OrderItem[];
  pickupTime: string;
  totalAmount: number;
  status: OrderStatus;
  specialNote: string;
  createdAt: string;
}

export type RoomType = "SMALL" | "CONFERENCE";
export type BookingStatus = "pending" | "confirmed" | "rejected";

export interface Room {
  _id: string;
  name: string;
  type: RoomType;
  capacity: number;
  price: number;
  description: string;
  imageUrl?: string;
  available: boolean;
  createdAt: string;
}

export interface Booking {
  _id: string;
  roomId: string;
  customerName: string;
  phone: string;
  date: string;
  time: string;
  duration: number;
  partySize: number;
  note?: string;
  status: BookingStatus;
  createdAt: string;
}

export interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
  temperature: Temperature;
  sugarLevel: SugarLevel;
  iceLevel: IceLevel;
  addOns: { addOnId: string; name: string; price: number }[];
  note: string;
}

// Gallery
export type GalleryCategory = "interior" | "exterior" | "menu" | "events";

export interface GalleryImage {
  _id: string;
  url: string;
  caption?: string;
  category: GalleryCategory;
  displayOrder: number;
  createdAt: string;
}

// Notifications
export type NotificationChannel = "telegram" | "email";
export type NotificationType =
  | "order_created"
  | "booking_created"
  | "status_changed";
export type NotificationRecipient = "admin" | "customer";

export interface Notification {
  _id: string;
  type: NotificationType;
  recipient: NotificationRecipient;
  channel: NotificationChannel;
  payload: Record<string, any>;
  sent: boolean;
  sentAt?: string;
  createdAt: string;
}

export interface SiteSetting {
  _id: string;
  key: string;
  value: string;
  description?: string;
  updatedAt: string;
}

export interface Admin {
  _id: string;
  username: string;
  email: string;
  passwordHash: string;
  role: "admin" | "super_admin";
  createdAt: string;
  updatedAt: string;
}

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
