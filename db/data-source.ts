import { DataSource, DataSourceOptions } from "typeorm";
import { config } from "dotenv";
import { User } from "src/users/entities/user.entity";
import { Hotel } from "src/hotels/entities/hotel.entity";
import { Room } from "src/rooms/entities/room.entity";
import { Booking } from "src/booking/entities/booking.entity";
import { Review } from "src/reviews/entities/review.entity";
import { Payment } from "src/payment/entities/payment.entity";

// dotenv config
config({ path: '.env' });

// data source options
export const dataSourceOptions: DataSourceOptions = {
    type: 'postgres',
    url: process.env.DATABASE_URL,
    entities: [User, Hotel, Room, Booking , Review , Payment],
    migrations: ["dist/db/migrations/*.js"]
}

const dataSource = new DataSource(dataSourceOptions);
export default dataSource;