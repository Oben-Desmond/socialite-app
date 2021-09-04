

export const maincategories: { name: string, url: string }[] = [
    {
        name: `Vehicles`,
        url: `https://images.unsplash.com/photo-1514316454349-750a7fd3da3a?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8Y2Fyc3xlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
    },
    {
        name: 'Cell Phones',
        url: `https://images.unsplash.com/photo-1569183091671-696402586b9c?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8cGhvbmVzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`
    },
    {
        name: `Home, Garden & Tools`,
        url: `https://images.unsplash.com/photo-1526381805515-3fec2d69e7cc?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NXx8c3BhZGV8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`
    },
     {
        name:'Property',
        url: `https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MXx8YXBhcnRtZW50fGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`,
    },
    {
        name:'Sports & Outdoors',
        url:`https://images.unsplash.com/photo-1609674248079-e9242e48c06b?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGd5bSUyMGR1bWJlbGx8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`
    },{
        name:'Hobbies & Interests',
        url:`https://images.unsplash.com/photo-1598653222000-6b7b7a552625?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8bXVzaWNhbCUyMGluc3RydW1lbnR8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60`
    },
    {
        name:'Fashion & Beauty',
        url:`https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixid=MnwxMjA3fDB8MHxzZWFyY2h8M3x8c2hvZXxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60`
    },{
        name:'Farming',
        url:`https://images.unsplash.com/photo-1535090042247-30387644aec5?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8ZmFybSUyMHRvb2xzfGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60`
    },
    {
        name:'Construction',
        url:`https://images.unsplash.com/photo-1509453721491-c3af5961df76?ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTB8fGNvbnN0cnVjdGlvbnxlbnwwfHwwfHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60`
    },
    {
        name:'Jobs & Work',
        url:`https://images.unsplash.com/photo-1490367532201-b9bc1dc483f6?ixid=MnwxMjA3fDB8MHxzZWFyY2h8NHx8c3VpdCUyMGNhc2V8ZW58MHx8MHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=400&q=60`
    }

]
//about adding sub catgories to classifieds page
export const subcategories: any = {
    Vehicles: [`Cars & Batteries`,
        `Car Parts & Accessories`,
        `Motorcycles & Scooters`,
        `Trucks & Commercial Vehicles`,
        `Caravans & Trailers`,
        `Boats & Aviation`
    ],
    'Electronics': [
        `Cell Phones`,
        'TV,Audio & Visual',
        'Computers & Laptops',
        'Gaming',
        'Hardware & Accessories',
        'Cameras',
        'Tablets',
    ],
    'Home, Garden & Tools': [
        `Furniture & Decor`,
        `Homeware & Appliances`,
        `Tools & DIY`,
        `Garden & Braai`,
    ],

    'Property': [
        `Houses & Flats for rent`,
        `Rooms for rent & Shared`,
        `Houses & Flats for sale`,
        `Land`,
        `Offices, Shops & Commercial`,
        `B & B`
    ],
    'Sports & Outdoors': [
        `Outdoor Equipment`,
        `Bicycles`,
        `Gym & Fitness`,
        `Sports Equipment`
    ],
    'Hobbies & Interests': [
        `Toys & Games`,
        `Musical Instruments`,
        `Art & Rare Items`,
        `Books`
    ],
    'Fashion & Beauty': [
        `Clothing & Shoes`,
        `Jewellery & Accessories`,
        `Health, Beauty & Cosmetics`,
    ],
    'Farming': [
        `Farming Equipment & Vehicles`,
        `Livestock`,
        `Industrial Equipment`,
        `Feeds, Supplements & Seeds`,
    ],
    'Other Services': [
        `Construction`,
        `Event Planning`,
        `Transport`,
        `Installations & Repairs`,
        `Babysitters`,
        `Home Improvement`,
        `Domestic worker & Cleaning`
    ],

    'Jobs & Work': [
        `Available Jobs`,
        `Work needed`
    ]


}