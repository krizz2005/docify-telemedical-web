require("dotenv").config();
const Subscription = require("../database/Subscription");
const dayjs = require("dayjs");
const Razorpay = require("razorpay");
const crypto = require("crypto");

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const planDetails = {
    "Standard": { price: 99900, duration: 180 }, // price in paise
    "Premium": { price: 199900, duration: 365 },
};

// --- Helper to activate subscription ---
const activateSubscription = async (patientId, plan) => {
    const { duration } = planDetails[plan] || { duration: 30 }; // Default for Free plan
    const startDate = new Date();
    const endDate = dayjs(startDate).add(duration, "day").toDate();

    // Use findOneAndUpdate with upsert to create or update the subscription
    const subscription = await Subscription.findOneAndUpdate(
        { patientId },
        {
            plan,
            startDate,
            endDate,
            status: "active",
        },
        { new: true, upsert: true }
    );
    return subscription;
};


// --- Create Razorpay Order ---
exports.createSubscriptionOrder = async (req, res) => {
    try {
        const { plan } = req.body;
        const patientId = req.user.id;

        // *** THE FIX IS HERE ***
        if (plan === "Free") {
            // Check if the user has ever had a subscription before
            const existingSubscription = await Subscription.findOne({ patientId });
            if (existingSubscription) {
                return res.status(403).json({ error: "The Free plan is only available for new users." });
            }
            const subscription = await activateSubscription(patientId, "Free");
            return res.json({ success: true, message: "Free plan activated!", subscription });
        }

        const planInfo = planDetails[plan];
        if (!planInfo) {
            return res.status(400).json({ error: "Invalid plan selected." });
        }

        const options = {
            amount: planInfo.price,
            currency: "INR",
            receipt: `sub_${crypto.randomBytes(8).toString("hex")}`,
        };

        const order = await razorpay.orders.create(options);
        res.json({ key: process.env.RAZORPAY_KEY_ID, order });

    } catch (err) {
        console.error("Error creating subscription order:", err);
        res.status(500).json({ error: "Could not initiate subscription." });
    }
};

// --- Verify Payment & Activate Subscription ---
exports.verifySubscription = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan } = req.body;
        const patientId = req.user.id;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
          .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
          .update(body.toString())
          .digest("hex");
    
        if (expectedSignature !== razorpay_signature) {
          return res.status(400).json({ success: false, message: "Payment verification failed." });
        }
        
        // After successful payment, activate the subscription for Standard and Premium plans
        const subscription = await activateSubscription(patientId, plan);
        res.json({ success: true, message: `Successfully subscribed to ${plan} plan!`, subscription });

    } catch (err) {
        console.error("Error verifying payment:", err);
        res.status(500).json({ error: "Failed to verify payment and activate subscription." });
    }
};


// --- Get Patient's Subscription ---
exports.getMySubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ patientId: req.user.id });
        res.json(subscription);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch subscription" });
    }
};

// --- Admin: Get All Subscriptions ---
exports.getAllSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find().populate("patientId", "name email");
        res.json(subscriptions);
    } catch (err) {
        res.status(500).json({ error: "Failed to fetch subscriptions" });
    }
};

