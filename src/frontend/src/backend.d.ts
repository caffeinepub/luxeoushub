import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ProductView {
    id: bigint;
    amazonUrl: string;
    title: string;
    sectionTags: Array<string>;
    imageUrl: string;
    badge?: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    amazonUrl: string;
    title: string;
    sectionTags: Array<string>;
    imageUrl: string;
    badge?: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(title: string, imageUrl: string, amazonUrl: string, sectionTags: Array<string>, badge: string | null): Promise<Product>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getAllProducts(): Promise<Array<ProductView>>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProductById(id: bigint): Promise<ProductView | null>;
    getProductsBySection(section: string): Promise<Array<ProductView>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    healthCheck(): Promise<string>;
    isCallerAdmin(): Promise<boolean>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(id: bigint, title: string, imageUrl: string, amazonUrl: string, sectionTags: Array<string>, badge: string | null): Promise<void>;
}
