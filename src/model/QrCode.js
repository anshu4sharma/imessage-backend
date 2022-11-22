const mongoose = require("mongoose");
const QrCodeSchema = new mongoose.Schema(
    {
        upiId: {
            required: true,
            type: String,
        },
        merchantId: {
            type: String,
            required: true,
        },
    },
    { timestamps: true }
);

const QrCode = new mongoose.model("QrCode", QrCodeSchema);

module.exports = QrCode;
