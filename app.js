
const express= require("express");
const path = require("path")
const mongoose = require('mongoose');
const bodyParser= require("body-parser")
const userRoutes= require("./routes/userRouter")
const passwordRoutes= require("./routes/passwordRoutes")
const expenseRoutes = require('./routes/expenseRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const premiumFeatureRoutes = require('./routes/premiumFeature')



const app=express();

var cors= require("cors");


app.use(cors({
    //origin: `http://localhost:${process.env.PORT || 3000}`,  // Allow only one domain for cors
    origin:"*",
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow all methods 
  allowedHeaders: ['Content-Type', 'Authorization'], 
  }));
app.use(bodyParser.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname,"Public")));



app.use("/user",userRoutes); 
app.use("/user",expenseRoutes); 
app.use("/api",expenseRoutes)
app.use('/api', paymentRoutes); 
app.use('/premium', premiumFeatureRoutes)
app.use("/password",passwordRoutes)


//serving html files
app.get('*', (req, res) => {
    const requestedUrl = req.url;
    console.log('Requested URL:', requestedUrl);
    console.log('Current directory:', __dirname);

    if (requestedUrl.startsWith('/views/')) {
        
        const filePath = path.join(__dirname, 'views', requestedUrl.slice(7)+'.html');
        console.log('Serving file from path:', filePath);

        
        res.sendFile(filePath, (err) => {
            if (err) {
                console.error('Error serving file:', err); 
                res.status(404).send('File Not Found');
            }
        });
    } 
    
    else{
        
        if(requestedUrl.startsWith('/css/')) {
        
        const publicPath = path.join(__dirname, 'Public', requestedUrl+'.css'); 
        console.log('Serving file from path:', publicPath);
        res.sendFile(publicPath, (err) => { 
            
            if (err) {
                console.error('Error serving file:', err); 
                res.status(404).send('File Not Found');
            }
        });  
    }
    else {
        
        const publicPath = path.join(__dirname, 'Public','js', requestedUrl+'.js');
        console.log('Serving file from path:', publicPath);
        res.sendFile(publicPath, (err) => {
            
            if (err) {
                console.error('Error serving file:', err); 
                res.status(404).send('File Not Found'); 
            }
        });  
    }
}
});


mongoose.connect('mongodb://admin:admin1234@ac-xeqrfuv-shard-00-00.0lljc5f.mongodb.net:27017,ac-xeqrfuv-shard-00-01.0lljc5f.mongodb.net:27017,ac-xeqrfuv-shard-00-02.0lljc5f.mongodb.net:27017/?ssl=true&retryWrites=true&w=majority&appName=Cluster0&authSource=admin&replicaSet=atlas-sxwo5o-shard-0', {
    useNewUrlParser: true,  
    useUnifiedTopology: true 
  })
.then(result=>{
    console.log('Database synced!'); 
    app.listen(process.env.PORT || 3000,()=>{console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`)});
})
.catch(err=>{
    console.log(err) 
}); 