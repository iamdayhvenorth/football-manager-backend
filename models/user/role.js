const mongoose = require("mongoose")

const RoleSchema = new mongoose.Schema({
  role: {
      type: String,
      required: true,
      enum: ["Admin", "Manager", "Sales Representative"],
      default: "Sales Representative"
  },
},{timestamps: true})


const Role = mongoose.model("Role", RoleSchema)
module.exports = Role

