// middlewares/errorHandler.js
module.exports = (err, req, res, next) => {
    console.error(err);
    res.status(500).json({
        success: false,
        message: "Server error"
    });
};