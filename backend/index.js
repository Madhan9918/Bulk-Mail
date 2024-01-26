const express = require("express")
const cors = require("cors")
//Install NodeMailer
const nodemailer = require("nodemailer");
const mongoose = require("mongoose")

const app = express()
app.use(cors(
    {
        origin: ["https://deploy-mern-1whq.vercel.app"],
        methods: ["POST", "GET"],
        credentials: true
    }
))
app.use(express.json())

mongoose.connect("mongodb+srv://madhanarjun5:Madhan12345@cluster0.9hl9kpj.mongodb.net/passkey?retryWrites=true&w=majority")
    .then(function () { console.log("Database Connected") })
    .catch(function () { console.log("Failed to Connect") })

const credential = mongoose.model("credential", {}, "bulkmail")

app.get("/",function(req,res){
    res.json("Hello")
})

app.post("/sendemail", function (req, res) {

    var msg = req.body.msg
    var emailList = req.body.emailList
    console.log(msg)

    credential.find()
        .then(function (data) {
            const transporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
                    user: data[0].toJSON().user,
                    pass: data[0].toJSON().pass,
                },
            });
            new Promise(async function (resolve, reject) {
                try {
                    for (i = 0; i < emailList.length; i++) {
                        await transporter.sendMail
                            (
                                {
                                    from: "madhanarjun5@gmail.com",
                                    to: emailList[i],
                                    subject: "A message from Bulk Mail App",
                                    text: msg
                                }
                            )
                        console.log("Email sent to: " + emailList[i])
                    }
                    resolve("Success")
                }
                catch (error) {
                    reject("Failed")
                }
            })
                .then(function () {
                    res.send(true)
                })
                .catch(function () {
                    res.send(false)
                })

        })
        .catch(function (error) { console.log(error)})
})

app.listen(5000, function () {
    console.log("server started...")
})