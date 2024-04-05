const cloudinary = require("cloudinary").v2;

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.CLOUD_API_KEY,
//   api_secret: process.env.CLOUD_SECRET,
//   secure: true,
// });

cloudinary.config({
  cloud_name: "dht5ihnjf",
  api_key: "982913932889921",
  api_secret: "kZOCl7_WSyiAdr6nUqmR-yPmIQ0",
});

module.exports = cloudinary;
