import dotEnv from 'dotenv'
dotEnv.config()
import app from "./src/app.js";

const PORT = process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})