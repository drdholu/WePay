import { Appbar } from "../components/AppBar";
import { Balance } from "../components/Balance";
import { Users } from "../components/Users";



const Dashboard = () => {
    return ( 
        <div className="">
            <Appbar />
            <Balance />
            <Users />
        </div>
     );
}
export default Dashboard