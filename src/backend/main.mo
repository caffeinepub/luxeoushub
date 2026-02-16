import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";

import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type Product = {
    id : Nat;
    title : Text;
    imageUrl : Text;
    amazonUrl : Text;
    sectionTags : [Text];
    badge : ?Text;
  };

  type ProductView = {
    id : Nat;
    title : Text;
    imageUrl : Text;
    amazonUrl : Text;
    sectionTags : [Text];
    badge : ?Text;
  };

  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  var nextProductId = 4;
  let products = Map.empty<Nat, Product>();

  // User profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Product read operations - open to all users including guests
  public query ({ caller }) func getProductsBySection(section : Text) : async [ProductView] {
    products.values().toArray().filter(
      func(product) {
        product.sectionTags.find(
          func(tag) { tag == section }
        ) != null;
      }
    );
  };

  public query ({ caller }) func getAllProducts() : async [ProductView] {
    products.values().toArray();
  };

  public query ({ caller }) func getProductById(id : Nat) : async ?ProductView {
    products.get(id);
  };

  // Product management operations - restricted to sellers (users) and admins
  public shared ({ caller }) func addProduct(title : Text, imageUrl : Text, amazonUrl : Text, sectionTags : [Text], badge : ?Text) : async Product {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized sellers/admins can create products");
    };
    let newProduct : Product = {
      id = nextProductId;
      title;
      imageUrl;
      amazonUrl;
      sectionTags;
      badge;
    };
    products.add(nextProductId, newProduct);
    nextProductId += 1;
    newProduct;
  };

  public shared ({ caller }) func updateProduct(id : Nat, title : Text, imageUrl : Text, amazonUrl : Text, sectionTags : [Text], badge : ?Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized sellers/admins can update products");
    };
    switch (products.get(id)) {
      case (null) { Runtime.trap("Product not found.") };
      case (?_) {
        let updatedProduct : Product = {
          id;
          title;
          imageUrl;
          amazonUrl;
          sectionTags;
          badge;
        };
        products.add(id, updatedProduct);
      };
    };
  };

  public shared ({ caller }) func deleteProduct(id : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only authorized sellers/admins can delete products");
    };
    if (not products.containsKey(id)) {
      Runtime.trap("Product not found.");
    };
    products.remove(id);
  };

  // Health check query - open to all users including guests
  public query ({ caller }) func healthCheck() : async Text {
    "OK";
  };
};
