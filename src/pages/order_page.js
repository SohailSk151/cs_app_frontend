import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const StatusBadge = ({ value, type }) => {
    const styles = {
        fulfillment: {
            fulfilled: "bg-green-100 text-green-700",
            partial: "bg-yellow-100 text-yellow-700",
            unfulfilled: "bg-red-100 text-red-700",
        },
        payment: {
            paid: "bg-green-100 text-green-700",
            pending: "bg-yellow-100 text-yellow-700",
            refunded: "bg-red-100 text-red-700",
        },
    };

    const key = value?.toLowerCase() || "";
    const cls = styles[type][key] || "bg-gray-100 text-gray-700";

    return (
        <span className={`px-2 py-1 text-xs font-medium rounded-full ${cls}`}>
            {value || "-"}
        </span>
    );
};

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
        <div className="min-h-screen bg-gray-100 p-6">
            {/* Order Header */}
            <div className="container rounded p-4 mt-4 hover-shadow w-[95%] mx-5 flex items-center gap-3">
                <h2>{order.name}</h2>
                <span>
                    <StatusBadge
                        type="fulfillment"
                        value={order.displayFulfillmentStatus}
                    />
                </span>
                <span>
                    <StatusBadge
                        value={order.displayFinancialStatus}
                        type="payment"
                    />
                </span>
            </div>

            <div className="flex items-center gap-6 font-mono">
                {/* Billing and Shipping Details */}
                <div className="container rounded-lg p-4 mx-5 bg-white w-[75%] flex justify-space-between gap-10  shadow-sm hover:shadow-md transition flex justify-between">
                    <div className="container bg-white ">
                        <h2>Billing Details</h2>
                        <p className="mx-4"><strong>Name:</strong> {order.billingAddress ? `${order.billingAddress.firstName} ${order.billingAddress.lastName}` : "N/A"}</p>
                        <p className="mx-4"><strong>Phone:</strong> {order.billingAddress ? order.billingAddress.phone : "N/A"}</p>
                        <p>Email: {order.email ? order.email : "N/A"}</p>
                        <p className="mx-4"><strong>Address:</strong> {order.billingAddress ? `${order.billingAddress.address1} ${order.billingAddress.address2}` : "N/A"}</p>
                        <p className="mx-4">{order.billingAddress ? `${order.billingAddress.formattedArea} ${order.billingAddress.zip}` : "N/A"}</p>
                    </div>
                    <hr className="border-gray-300 mx-4" />
                    <div className="container bg-white">
                        <h2>Shipping Details</h2>
                        <p className="mx-4"><strong>Name:</strong> {order.shippingAddress ? `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}` : "N/A"}</p>
                        <p className="mx-4"><strong>Phone:</strong> {order.shippingAddress ? order.shippingAddress.phone : "N/A"}</p>
                        <p>Email: {order.email ? order.email : "N/A"}</p>
                        <p className="mx-4"><strong>Address:</strong> {order.shippingAddress ? `${order.shippingAddress.address1} ${order.shippingAddress.address2}` : "N/A"}</p>
                        <p className="mx-4">{order.shippingAddress ? `${order.shippingAddress.formattedArea} ${order.shippingAddress.zip}` : "N/A"}</p>
                    </div>
                </div>

                {/* Order Notes */}
                <div className="mx-5 w-[35%] rounded-lg bg-white p-4 shadow-sm hover:shadow-md transition flex justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">
                            Order Notes
                        </h2>
                        <p className="mt-2 ml-4 text-sm text-gray-600">
                            No notes available.
                        </p>
                        <input type="text" className="w-[175%] border rounded-lg mt-4 p-1" placeholder="Add a note here" />
                    </div>
                </div>

            </div>

            { /* Product Details*/}
            <div className="font-mono container rounded-lg p-4 mx-5 mt-6 bg-white w-[62%] shadow-sm hover:shadow-md transition">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                    Products in this Order
                </h2>

                <div className="flex gap-6">
                    <figure>
                        <img
                            src="/One-Year-Filter-Combo-Pack-4.jpg"
                            alt="One Year Combo Pack"
                            className="w-50 rounded-lg"
                        />
                    </figure>

                    <div className="flex gap-10">
                        <div>
                            <h1><strong>One Year Filter Combo Pack</strong></h1>
                            <p><i>90xxxxxxxx</i></p>
                            <p>Discount</p>
                            <p>Shipping</p>
                            <p>Taxes</p>
                            <p>Total</p>
                        </div>
                        <div className="justify-end text-right">
                            <span>${order.subtotalPrice} </span>
                            <span> x </span>
                            <span> 1</span>
                            <div className="mt-7">
                                <span>${order.totalDiscounts}</span><br />
                                <span> +${order.totalShippingPrice}</span><br />
                                <span> +${order.totalTax}</span><br />
                                <span><strong>${order.totalPrice}</strong></span><br />
                                <div className="text-green-600 font-medium">Paid</div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-4 mt-6 justify-end mr-20">
                    <button className="border rounded-lg px-5 py-2 bg-white text-black cursor-pointer hover:bg-red-500 hover:text-white ">Refund</button>
                    <button className="border rounded-lg px-5 py-2 bg-gray-500 text-white cursor-pointer">Cancel the order</button>
                </div>
            </div>


        </div>
    );
}