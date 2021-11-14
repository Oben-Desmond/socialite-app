

export interface Advert{
   title:string,
   author_id:string,
   author_name:string,
   company_id:string,
   company_name:string,
   link:string,
   action_text:string,
   image_url:string,
   video?:string,
   views:number,
   clicks:number,
   upload_timestamp:number,
   approve_timestamp?:number,
   location:{
       long:number,
       lat:number,
   },
   geohash:string,
   country:string,
   disapproved_message?:string,
   id:string
}

export interface AdReaction{
    views:{
        view_id:string

    }[],
    clicks:{
        view_id:string

    }[]
}
