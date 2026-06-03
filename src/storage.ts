import type { RegisteredUser, User, Product, Order } from './types';

const KEYS = {
  USERS: 'sewarion_users',
  SESSION: 'sewarion_session',
  PRODUCTS: 'sewarion_products',
  ORDERS: 'sewarion_orders',
  INITIALIZED: 'sewarion_initialized',
};

// ─── Users (registered accounts) ───

export function getUsers(): RegisteredUser[] {
  try {
    const raw = localStorage.getItem(KEYS.USERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveUsers(users: RegisteredUser[]): void {
  localStorage.setItem(KEYS.USERS, JSON.stringify(users));
}

export function findUserByEmail(email: string): RegisteredUser | undefined {
  return getUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

export function registerUser(user: RegisteredUser): { success: boolean; error?: string } {
  const existing = findUserByEmail(user.email);
  if (existing) {
    return { success: false, error: 'Email sudah terdaftar. Silakan login.' };
  }
  const users = getUsers();
  users.push(user);
  saveUsers(users);
  return { success: true };
}

export function updateRegisteredUser(email: string, updates: Partial<RegisteredUser>): void {
  const users = getUsers();
  const idx = users.findIndex((u) => u.email.toLowerCase() === email.toLowerCase());
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...updates };
    saveUsers(users);
  }
}

// ─── Simple password hashing (not cryptographically secure, but fine for demo) ───

export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'sewarion_salt_2026');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// ─── Session (currently logged-in user) ───

export function getCurrentSession(): User | null {
  try {
    const raw = localStorage.getItem(KEYS.SESSION);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCurrentSession(user: User): void {
  localStorage.setItem(KEYS.SESSION, JSON.stringify(user));
}

export function clearSession(): void {
  localStorage.removeItem(KEYS.SESSION);
}

// ─── Products ───

export function getProducts(): Product[] {
  try {
    const raw = localStorage.getItem(KEYS.PRODUCTS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveProducts(products: Product[]): void {
  localStorage.setItem(KEYS.PRODUCTS, JSON.stringify(products));
}

export function addProduct(product: Product): void {
  const products = getProducts();
  products.unshift(product);
  saveProducts(products);
}

// ─── Orders ───

export function getOrders(userEmail?: string): Order[] {
  try {
    const raw = localStorage.getItem(KEYS.ORDERS);
    const allOrders: Order[] = raw ? JSON.parse(raw) : [];
    if (userEmail) {
      return allOrders.filter((o) => o.userEmail === userEmail);
    }
    return allOrders;
  } catch {
    return [];
  }
}

export function getAllOrders(): Order[] {
  try {
    const raw = localStorage.getItem(KEYS.ORDERS);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOrders(orders: Order[]): void {
  localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
}

export function addOrderToStorage(order: Order): void {
  const orders = getAllOrders();
  orders.unshift(order);
  saveOrders(orders);
}

export function updateOrderStatus(orderId: string, status: Order['status'], updates?: Partial<Order>): void {
  const orders = getAllOrders();
  const idx = orders.findIndex((o) => o.id === orderId);
  if (idx !== -1) {
    orders[idx] = { ...orders[idx], status, ...updates };
    saveOrders(orders);
  }
}

// ─── Booked dates for availability check ───

export function getBookedDatesForProduct(productId: string): { start: string; end: string }[] {
  const orders = getAllOrders();
  return orders
    .filter((o) => o.product.id === productId && (o.status === 'paid' || o.status === 'pending'))
    .map((o) => ({ start: o.startDate, end: o.endDate }));
}

// ─── Initialization check ───

export function isInitialized(): boolean {
  return localStorage.getItem(KEYS.INITIALIZED) === 'true';
}

export function markInitialized(): void {
  localStorage.setItem(KEYS.INITIALIZED, 'true');
}
