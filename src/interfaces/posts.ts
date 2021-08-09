export interface PostInterface{
  
     images:string[],
     title:string,
     location:string,
     category:string | `sport`| `business` | `entertainment`| `family`| `health` | `politics` | `religion` | `science`,
     timestamp:number
     description:string;
     author_name:string,
     author_url:string
     id:string,
     email:string

}

export interface commentInterface {

     author_name:string;
      photoUrl:string;
      description:string;
      timestamp:number;
      subcomments:undefined|commentInterface[],
      id:string
     
}

export interface reactionInterface{
     likes:string[],
     dislikes:string[],
     shares:string[],
     views:string[]
}


