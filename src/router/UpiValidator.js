const express = require('express')
const router = express.Router()
const request = require("request"); //requiring request module

router.get("/:upiId", function (req, res) {
    const { upiId } = req.params
    request.post(
        `https://upibankvalidator.com/api/upiValidation?upi=${upiId}`,
        function (error, response, body) {
            if (error) {
                res.status(500).send(error);
            }
            res.send(body);
        }
    );
});

module.exports = router
