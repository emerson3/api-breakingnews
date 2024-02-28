import mongoose from 'mongoose';

const connectDatabase = () => {
    console.log("Conectando no banco de Dados.")

    mongoose.connect(
        process.env.MONGODB_URI,
        { useNewURLParser: true, useUnifiedTopology: true }
    )
        .then(() => console.log("Banco conectado."))
        .catch((error) => console.log(error))
}

export default connectDatabase;