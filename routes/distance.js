const express = require('express');
const axios = require('axios'); // Import axios
const router = express.Router();

async function getCoordinates(pincode) {
    try {
        const response = await axios.get(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = response.data;
        if (data && data[0] && data[0].PostOffice && data[0].PostOffice[0]) {
            const postOffice = data[0].PostOffice[0];
            const latitude = parseFloat(postOffice.Latitude);
            const longitude = parseFloat(postOffice.Longitude);
            console.log(latitude, longitude);
            return { latitude, longitude };
        } else {
            throw new Error('Invalid pincode');
        }
    } catch (error) {
        console.error(error);
        throw new Error('Error fetching coordinates');
    }
}

// Function to calculate distance using Haversine formula
function haversine(lat1, lon1, lat2, lon2) {
    const R = 6371; // Radius of the Earth in kilometers
    const dLat = toRadians(lat2 - lat1);
    const dLon = toRadians(lon2 - lon1);
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
}

// Function to convert degrees to radians
function toRadians(degrees) {
    return degrees * (Math.PI / 180);
}

// Route to calculate distance between two pincodes using Haversine formula the api is get "http://localhost:3000/api/distance/:pincode1/:pincode2"
router.get('/distance/:pincode1/:pincode2', async (req, res) => {
    const { pincode1, pincode2 } = req.params;
    try {
        console.log(pincode1, pincode2);
        const coordinates1 = await getCoordinates(pincode1);
        const coordinates2 = await getCoordinates(pincode2);
        const distance = haversine(coordinates1.latitude, coordinates1.longitude, coordinates2.latitude, coordinates2.longitude);
        res.json({ distance: distance.toFixed(2) });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;
