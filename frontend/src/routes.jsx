export default {
    route: {
        path: "/",
        name: "Root",
        routes: [{
            path:"/request",
            name: "Requests Forms",
            routes:[
                {path:"/request-slip",name:"By Slip"},
                 {path:"/request-contract",name:"By Contract"}
            ]
        }]
    },
    location: {
        pathname: "/",
    },
}