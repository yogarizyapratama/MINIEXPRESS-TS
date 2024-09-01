import { MiniFramework } from './framework/MiniFramework';

export default function runMinex() {
    const app = new MiniFramework();

    const PORT = process.env.PORT || 3000

    app.start(PORT, {
        dbName :'sequelize',
        config : {}
    });

    if (process.env.USE_SEQUELIZE!) {
        // set true if you want to reconfigure database, dont set it true in production!!!
        // Set true untuk memaksa reset tabel.
        app.syncDB(false);
    }
}

runMinex()