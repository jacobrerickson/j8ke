import { connect } from 'mongoose'
console.log("skipping db connection")
// connect(process.env.DB_URL!).then(() => {
//     console.log('Connected to MongoDB')
// }).catch((err) => {
//     console.log('Failed to connect to MongoDB: ', err.message)
// })