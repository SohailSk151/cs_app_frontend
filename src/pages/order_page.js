import { useState, useEffect} from "react";
import { useParams } from "react-router-dom";

export default function OrderPage() {
    const { id } = useParams();
    const [order, setOrder] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:4000/api/orders/${id}`)
            .then((res) => res.json())
            .then((result) => {
                //console.log("Fetched order:", result);
                setOrder(result.data || null);
            })
            .catch(console.error);
    }, [id]);

    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <div className = "container border rounded p-4 mt-4 hover-shadow">
                <h2>Order Details for {order.id}</h2>
                <p className="mx-4"><strong>Billing Name:</strong> {order.billingAddress ? `${order.billingAddress.firstName} ${order.billingAddress.lastName}` : "N/A"}</p>
                <p className="mx-4"><strong>Phone:</strong> {order.billingAddress ? order.billingAddress.phone : "N/A"}</p>
                <p className="mx-4"><strong>Fulfillment Status:</strong> {order.displayFulfillmentStatus}</p>
                <p className="mx-4"><strong>Financial Status:</strong> {order.displayFinancialStatus}</p>
            </div>
        </>
    );
}