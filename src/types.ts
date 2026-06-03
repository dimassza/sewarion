export interface Product {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
  location: string;
  locationDetail: string;
  image: string;
  images?: string[];
  isAvailable: boolean;
  description?: string;
  specs?: string[];
  features?: string[];
  ownerId?: string;
  isPromoted?: boolean;
}

export interface User {
  fullName: string;
  email: string;
  isLoggedIn: boolean;
  trustScore: number;
  totalRentals: string;
  isKycVerified: boolean;
  avatarUrl?: string;
  ktpImage?: string;
  selfieImage?: string;
  nikNumber?: string;
  phoneNumber?: string;
}

export interface RegisteredUser {
  fullName: string;
  email: string;
  passwordHash: string;
  trustScore: number;
  totalRentals: string;
  isKycVerified: boolean;
  avatarUrl?: string;
  ktpImage?: string;
  selfieImage?: string;
  nikNumber?: string;
  registeredAt: string;
  phoneNumber?: string;
}

export interface Message {
  id?: string;
  sender_email: string;
  receiver_email: string;
  content: string;
  order_id?: string;
  created_at?: string;
}

export interface Notification {
  id?: string;
  user_email: string;
  sender_name: string;
  content: string;
  is_read: boolean;
  created_at?: string;
}

export interface Order {
  id: string;
  product: Product;
  durationDays: number;
  startDate: string;
  endDate: string;
  paymentMethod: string;
  totalPayment: number;
  status: 'pending' | 'paid' | 'completed' | 'expired';
  userEmail?: string;
  createdAt?: string;
  shippingMethod?: string;
  shippingAddress?: string;
  shippingFee?: number;
  lateDays?: number;
  lateHours?: number;
  lateFee?: number;
  lateFeePaid?: boolean;
  actualReturnDate?: string;
}

export type ViewState =
  | { type: 'home' }
  | { type: 'product-detail'; productId: string }
  | { type: 'checkout'; productId: string; totalDays?: number; startDate?: string; endDate?: string }
  | { type: 'payment-pending'; order: Order }
  | { type: 'login' }
  | { type: 'register' }
  | { type: 'kyc' }
  | { type: 'mulai-menyewakan' }
  | { type: 'history' }
  | { type: 'favorites' }
  | { type: 'profile' };

export interface AppContextType {
  currentView: ViewState;
  navigate: (view: ViewState) => void;
  user: User;
  setUser: (user: User) => void;
  products: Product[];
  setProducts: (products: Product[]) => void;
  orders: Order[];
  addOrder: (order: Order) => void;
  updateOrder: (orderId: string, status: Order['status'], updates?: Partial<Order>) => void;
  logout: () => void;
  favorites: string[];
  toggleFavorite: (productId: string) => void;
  theme?: 'light' | 'dark';
  toggleTheme?: () => void;
}
