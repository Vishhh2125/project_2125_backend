import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"

const app = express()


app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://project-2125-frontend-n0gqjx812-vishhh2125s-projects.vercel.app"
  ],
  credentials: true
}));

app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(express.static("public"))
app.use(cookieParser())

// routes import
import userRouter from './routes/user.routes.js'
import chargingStationRouter from "./routes/chargingStation.routes.js" // <-- add this line

// routes declaration
app.use("/api/v1/users", userRouter)
app.use("/api/v1/charging-stations", chargingStationRouter) // <-- add this line

// http://localhost:8000/api/v1/users/register

export { app }
