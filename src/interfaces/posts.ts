export interface PostInterface {

     images: string[],
     title: string,
     location: string,
     timestamp: number
     description: string;
     author_name: string,
     author_url: string
     id: string,
     email: string,
     likes?:string[],
     dislikes?:string[],
     coords?:number[],
     geohash?:string

}


export interface commentInterface {

     author_name: string;
     photoUrl: string;
     description: string;
     timestamp: number;
     subcomments: undefined | commentInterface[],
     id: string

}

export interface reactionInterface {
     likes: string[],
     dislikes: string[],
     shares: string[],
     views: string[]
}


