//import HelloWorld from '../components/HelloWorld'
import Login from '../Login/Login.vue'
import User from '../User/User.vue'
import Menu from '../Menu/Menu.vue'
import Auth from '../Auth/Auth.vue'
import Dictionaries from '../Dictionaries/Dictionaries.vue'
import Index from '../index/HelloWorld.vue'
import Region from '../Region/Region.vue'
import Gather from '../Gather/Gather.vue'
import Accounts from '../Accounts/Accounts.vue'
import Gatheruser from '../Gatheruser/Gatheruser.vue'
export const routes = [

    {path: '/', name: "Login", component: Login},
    {
        path: '/home', name: "Index", component: Index, children: [

        {path: '/home/user', name: "User", component: User},

        {path: '/home/menu', name: "Menu", component: Menu},

        {path: '/home/role', name: "Auth", component: Auth},

        {path: '/home/dict', name: "Dictionaries", component: Dictionaries},

        {path: '/home/dept', name: "Region", component: Region},

        {path: '/home/info', name: "Gather", component: Gather},

        {path: '/home/wxMenu', name: "Accounts", component: Accounts},

        {path: '/home/collectionUser', name: "Gatheruser", component: Gatheruser},
    ]
    },

]