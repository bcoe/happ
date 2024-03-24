import 'dotenv/config';
import { listen } from './api.mjs';

await listen(process.env.PORT);
