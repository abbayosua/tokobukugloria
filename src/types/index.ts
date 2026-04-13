// Book types
export interface Book {
  id: string;
  title: string;
  slug: string;
  author: string;
  description: string;
  price: number;
  discountPrice: number | null;
  coverImage: string;
  isbn: string | null;
  publisher: string | null;
  publishYear: number | null;
  pages: number | null;
  language: string;
  stock: number;
  isFeatured: boolean;
  isBestseller: boolean;
  isNew: boolean;
  categoryId: string;
  category: Category;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string | null;
  image: string;
  link: string | null;
  isActive: boolean;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  id: string;
  quantity: number;
  bookId: string;
  book: Book;
}

export interface Cart {
  id: string;
  items: CartItem[];
}
