import { IconCircleDottedLetterR } from '@tabler/icons-react'
import { lazy } from 'react'

// import Slip from '@/pages/request/slip'

const modules = import.meta.glob('/src/pages/**/*.jsx')

const safeLazy = (path) => {
    const loader = modules[path]

    if (!loader) {
        return () => <div>🚧 Page is not implemented</div>
    }

    return lazy(loader)
}

export default {
    route: {
        path: "/",
        name: "Root",

        routes: [{
            path: "/request",
            name: "REQUESTS FORMS",
            icon: <IconCircleDottedLetterR />,
            routes: [
                { path: "/request-slip", name: "Slip", component: safeLazy('/src/pages/request/slip.jsx') },
                { path: "/request-contract", name: "Contract", component: safeLazy('/src/pages/request/contract.jsx') }
            ]
        }]
    },
    location: {
        pathname: "/",
    },
}