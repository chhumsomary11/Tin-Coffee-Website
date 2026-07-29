// One item inside a customer's order
// Includes all customization choices

export type Temperature = "hot" | "iced";
export type SugarLevel = "none" | "less" | "regular" | "extra";
export type IceLevel = "less" | "regular" | "extra";
export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export interface OrderItem {
  _id: string;
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
