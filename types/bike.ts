export interface BikeType {


  id?: string;



  slug: string;



  name: string;



  brand: string;



  price: number | string;



  year: string;



  km: string;



  owner?: string;



  phone?: string;



  location: string;



  description?: string;



  image?: string;



  images?: string[];




  featured?: boolean;



  verified?: boolean;



  status?: 
    | "Available"
    | "Pending"
    | "Sold"
    | string;




  createdAt?: any;



}






// Backward compatibility
// Some components import { Bike }

export type Bike = BikeType;