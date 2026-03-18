import mongoose from "mongoose"

type ConnectionObject = {
    isConnected?: number;
};

const connection: ConnectionObject= {};

async function dbConnect(): Promise<void>{
    if(connection.isConnected){
        console.log('Database Already Connected!');
        return;
    }

    try {
        //trying to connect to the db
        const db = await mongoose.connect(process.env.MONGODB_URI || '',{});

        connection.isConnected = db.connections[0].readyState;
        //0->disconnected , 1->connected , 2->connecting , 3->disconnecting

        console.log('Database is now connected successfully!');
    }
    catch(error){
        console.error('Database connection failed!',error);

        //Gracefully exit
        process.exit(1);//Bad practice: May need to handle later!
    }
}

export default dbConnect;