


export interface classifiedItemInterface{
      item_name:string,
      item_desc:string,
      item_location:{ long:number, lat:number},
      item_views:number,
      item_features: string[],
      item_contact: ClassifiedContactInterface,
      item_category:string,
      timestamp:number,
      item_id:string,
      item_images:string[],
      item_cost:string,
      country_code:string,
      sub_category:string,
      geohash:string
}


export interface ClassifiedContactInterface{
    user_name:string,
    user_email:string,
    user_tel:string,
    user_photo:string,
}


export interface ReviewItemInterface{
     rating:number,
     photoUrl:string,
     username:string,
     text:string,
     timestamp:number,
     id:string,
     email:string
}