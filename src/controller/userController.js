import User from "../model/User.model.js";

export const getAllUser = async (req, res) => {
  try {
    const allUsers = await User.find({});
    res.json(allUsers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Logged Change Service
export const logedinUser = async (req, res) => {
  try {
    const {id, fname, name, email, role, bookings, } = req.user;
    const newData = {
      id,
      fname,
      name,
      email,
      role,
      bookings,
      
    };

    res.json(newData);

    // return responseReturn(false, 'successLoggedInGet', newData);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
