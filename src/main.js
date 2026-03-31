import app from "./app.js";
import { db } from "./lib/db.js";

export const conn = db();

function main() {
    const PORT = process.env.PORT || 8888;
    app.listen(PORT, function () {
        console.log(`app listening on port ${PORT}`);
    });
}

main();
