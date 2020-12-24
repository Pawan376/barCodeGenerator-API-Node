const express = require('express');
const QRCode = require('qrcode');
const Joi = require('joi');
const config = require('./config');

const app = express();
app.set("view engine","ejs");
app.use(express.urlencoded({extended:false}));
app.use(express.json());

app.get('/',(req,res)=>{
    res.render("index");
})
//if data coming from query string
app.get('/qrgenerator',async (req,res)=>{
                const { name,email,message } = req.query;
                const datavalidation = Joi.object({
                    name : Joi.string().min(3).max(20).required(),
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
                    message : Joi.string().min(5).max(100).required()
                });
                
                try {
                    const validdata = await datavalidation.validateAsync({name,email,message});
                    if(!validdata) return res.status(400).json({'message': 'PLEASE ENTER VALID DATA'});
                    const data = `NAME         --> ${name}\nEMAIL        --> ${email}\nMESSAGE  --> ${message}` ;
                    QRCode.toDataURL(data,(error,url)=>{
                        if(error) return res.status(400).json({'message': error.message})
                        return res.render('qr_code',{url});
                    })
                } catch (error) {
                    return res.status(400).json({'message': error.message})
                }
                //console.log(validdata);
        });

//if data coming from body
app.post('/qrgenerator', async (req,res)=>{

                const { name,email,message } = req.body;
                const datavalidation = Joi.object({
                    name : Joi.string().min(3).max(20).required(),
                    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'in'] } }),
                    message : Joi.string().min(5).max(100).required()
                });
                try {
                    const validdata = await datavalidation.validateAsync({name,email,message});
                    if(!validdata) return res.status(400).json({'message': 'PLEASE ENTER VALID DATA'});
                    const data = `NAME         --> ${name}\nEMAIL        --> ${email}\nMESSAGE  --> ${message}` ;
                    QRCode.toDataURL(data,(error,url)=>{
                        if(error) return res.status(400).json({'message': error.message})
                        return res.render('qr_code',{url});
                    })
                } catch (error) {
                    return res.status(400).json({'message': error.message})
                }
        });
       
app.listen(config.PORT,(err,res)=>{
    if(err) return console.log('err :'+err);
    return console.log(`Server is hosted on port ${config.PORT}`);
});