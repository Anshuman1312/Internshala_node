const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const studentModel = new mongoose.Schema({
   firstname:{
   type:String,
   required:[true,"First Name is required"],
   maxLength:[7,"First Name should not exceed more than 7 characters"],
   },
   lastname:{
    type:String,
    required:[true,"Last Name is required"],
    maxLength:[10,"Last Name should not exceed more than 7 characters"],
    },
   contact:{
    type:String,
    maxLength:[10,"Contact should not exceed more than 10 characters"],
    minLength:[10,"Contact should be atleast more than 9 characters"],
    },
   city:{
    type:String,
    maxLength:[7,"City Name should not exceed more than 7 characters"],
    },
   gender:{
    type:String,
    enum: ["Male", "Female", "Others"]
   },
   email:{
    type:String,
    required:[true,"Email is required"],
    match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'],
    unique:true
   },
   password: {
    type:String,
    select:false,
    maxLength:[15,"Password should not exceed more than 15 characters"],
    minLength:[3,"Password should have atleast 3 characters"],
    //match:[/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/]
   },
   resetPasswordToken : {
    type:String,
    default:"0"
   },
   avatar:{
    type: Object,
    default:{
        fileId:"",
        url:"https://images.unsplash.com/photo-1682905926517-6be3768e29f0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxlZGl0b3JpYWwtZmVlZHwxfHx8ZW58MHx8fHx8"
    },
    },
    resume:{
        education:[],
        jobs: [],
        internships:[],
        responsibilities: [],
        courses: [],
        projects: [],
        skills: [],
        accomplishments: [],
   },
   internships:[ 
    {type: mongoose.Schema.Types.ObjectId, ref:"internships"}
                ],
   jobs: [
    {type: mongoose.Schema.Types.ObjectId, ref:"jobs"}
        ],
    },
    {timestamps: true}
);

studentModel.pre("save", function(){
    if(!this.isModified("password")){
        return;
    }

    let salt = bcrypt.genSaltSync(10)
    this.password = bcrypt.hashSync(this.password, salt)
})

studentModel.methods.comparepassword = function(password){
    return bcrypt.compareSync(password, this.password);
}

studentModel.methods.getjwttoken = function(){
    return jwt.sign({id: this._id}, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE})
}

module.exports = mongoose.model("Student", studentModel);