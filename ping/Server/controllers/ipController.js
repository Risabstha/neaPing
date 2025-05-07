import Ip from "../models/ipModel.js";


export const createIp = async (req, res) => {
  try {
    const { ip, name, province } = req.body;

    if (!ip || !name || !province) {
      return res.status(400).json({ message: "All fields are required" });
    }


    // Check if an IP record with the same `ip` or `name` already exists
    const existingIp = await Ip.findOne({
      $or: [{ ip }, { name }]
    });

    if (existingIp) {
      return res.status(400).json({
        message: "An entry with the same IP or name already exists.",
      });
    }

    const newIp = new Ip({
      ip,
      name,
      province,
      user: req.user.id, // Associate with logged-in user
    });

    const savedIp = await newIp.save();
    res.status(201).json(savedIp);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Get all IP records
export const getIp = async (req, res) => {
  try {
    const ips = await Ip.find().sort({ _id: -1 }); // newest first
    res.status(200).json(ips);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete an IP record by ID
export const deleteIp = async (req, res) => {
  const ipId = req.params.id;

  try {
    const ipRecord = await Ip.findById(ipId);
    if (!ipRecord) {
      return res.status(404).json({ message: "IP record not found" });
    }

    await ipRecord.deleteOne();
    res.status(200).json({ message: "IP record deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error, unable to delete IP record", error: err.message });
  }
};

// Update an IP record by ID
export const updateIp = async (req, res) => {
  const { ip, name, province } = req.body;

  if (!ip || !name || !province) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const updatedIp = await Ip.findByIdAndUpdate(req.params.id, { ip, name, province }, { new: true });
    if (!updatedIp) {
      return res.status(404).json({ message: "IP record not found" });
    }

    res.status(200).json(updatedIp);
  } catch (error) {
    res.status(500).json({ message: "Server error, unable to update IP record", error: error.message });
  }
};
