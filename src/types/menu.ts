export type MenuCategory = "COFFEE" | "SIGNATURE" | "BAKERY" | "FOOD";



export interface MenuAddOn {
  _id: string;
  name: string;
  price: number;
  available: boolean;
}

// Represent a menu item in the database
export interface MenuItem {
  _id: string;
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
