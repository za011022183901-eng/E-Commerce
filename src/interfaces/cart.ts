import { products } from "./products"

export interface CartResponce {
  status: string
  message?:string
  numOfCartItems: number
  cartId: string
  data: Data
}

export interface Data {
  _id: string
  cartOwner: string
  products: item[]
  createdAt: string
  updatedAt: string
  __v: number
  totalCartPrice: number
}

export interface item {
  count: number
  _id: string
  product: products
  price: number
}
