import { useEffect, useState } from "react";
import { HiCheckCircle, HiOutlineClock } from "react-icons/hi2";
import Navbar from "../../components/Navbar";
import { useCart } from "../../context/CartContext";
import { getMyOrders } from "../../services/order.service";

const steps = [
  { key: "placed", label: "Order Placed" },
  { key: "preparing", label: "Preparing" },
  { key: "out_for_delivery", label: "Out for Delivery" },
  { key: "delivered", label: "Delivered" },
];


const Order = () => {

  const { cartCount } = useCart();

  const [orders,setOrders] = useState([]);


  useEffect(()=>{

    fetchOrders();

  },[]);



  async function fetchOrders(){

    try{

      const data = await getMyOrders();
      
      setOrders(data.orders || []);

    }catch(error){

      console.log(error);

    }

  }



  return (
    <div className="min-h-screen bg-white">

      <Navbar cartCount={cartCount}/>


      <div className="w-[95%] max-w-4xl mx-auto mt-10 pb-20">


      <h2 className="text-3xl font-bold mb-8">
        Your Orders
      </h2>



      {
        orders.length===0 ?

        <p className="text-gray-400 text-center py-20">
          No orders found
        </p>

        :

        orders.map((order)=>{


          const activeStepIndex =
          steps.findIndex(
            s=>s.key===order.status
          );



          return (

          <div
          key={order._id}
          className="border rounded-2xl p-6 mb-6 shadow-sm"
          >


          <div className="flex justify-between mb-6">

          <div>
          <h3 className="font-bold text-lg">
          Order #{order._id.slice(-6)}
          </h3>

          <p className="text-gray-500 text-sm">
          {new Date(order.createdAt).toDateString()}
          </p>

          </div>


          <div className="text-orange-500">
          <HiOutlineClock/>
          </div>


          </div>




          <div className="flex mb-8">

          {
          steps.map((step,i)=>(

          <div
          key={step.key}
          className="flex-1 text-center"
          >

          <div
          className={
          `mx-auto w-9 h-9 rounded-full flex items-center justify-center
          ${
          i<=activeStepIndex
          ?
          "bg-orange-500 text-white"
          :
          "bg-gray-200"
          }`
          }
          >

          {
          i<=activeStepIndex
          ?
          <HiCheckCircle/>
          :
          i+1
          }

          </div>


          <p className="text-xs mt-2">
          {step.label}
          </p>


          </div>


          ))
          }


          </div>




          {
          order.items.map(item=>(

          <div
          key={item._id}
          className="flex gap-4 mb-3"
          >

          <img
          src={item.food?.imageUrl}
          className="w-14 h-14 rounded-xl object-cover"
          />


          <div>

          <p className="font-semibold">
          {item.food?.name}
          </p>

          <p>
          Qty {item.quantity}
          </p>

          </div>


          </div>

          ))
          }



          <hr className="my-4"/>


          <div className="flex justify-between font-bold">

          <span>
          Total
          </span>

          <span>
          ₹{order.totalAmount}
          </span>


          </div>



          </div>


          )


        })


      }


      </div>


    </div>
  )

}


export default Order;