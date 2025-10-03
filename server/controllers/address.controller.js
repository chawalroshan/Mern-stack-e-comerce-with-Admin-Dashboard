import AddressModel from "../models/address.model.js";
import User from "../models/user.model.js";
import mongoose from "mongoose";

export async function addAddressController(request, response) {
    try {
        const { address_line, city, state, pincode, country, mobile } = request.body;
        const userId = request.userId;

        if (!userId) {
            return response.status(401).json({
                message: "Unauthorized: missing userId",
                error: true,
                success: false
            });
        }

        if (!address_line || !city || !state || !pincode || !country || !mobile) {
            return response.status(400).json({
                message: "All fields are required",
                error: true,
                success: false
            });
        }

        const address = new AddressModel({
            address_line,
            city,
            state,
            pincode,
            country,
            mobile,
            userId
        });

        const saveAddress = await address.save();

        await User.findByIdAndUpdate(
            userId,
            { $push: { address_details: saveAddress._id } },
            { new: true }
        );

        return response.status(200).json({
            message: "Address added successfully",
            error: false,
            success: true,
            data: saveAddress
        });
    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}

export async function getAddressController(request, response) {
    try {
        const { userId } = request.query;

        if (!userId) {
            return response.status(400).json({
                message: "userId is required",
                error: true,
                success: false
            });
        }

        const user = await User.findById(userId)
            .populate({
                path: 'address_details',
                model: 'address'
            });

        if (!user) {
            return response.status(404).json({
                message: "User not found",
                error: true,
                success: false
            });
        }

        return response.status(200).json({
            message: "Address fetched successfully",
            data: user.address_details || [],
            error: false,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Something went wrong",
            error: true,
            success: false
        });
    }
}

