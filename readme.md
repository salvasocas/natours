# Natours Application

Built using node.js, express, mongoDB and mongoose
https://natours-i8eu.onrender.com

## Local setup with your own database

1. Create or edit `config.env` at the project root.
2. Set your database URI.

For MongoDB Atlas:

```
DATABASE=mongodb+srv://<USER>:<PASSWORD>@<CLUSTER>.mongodb.net/natours?retryWrites=true&w=majority
DATABASE_PASSWORD=your-atlas-password
```

For local MongoDB:

```
DATABASE_LOCAL=mongodb://127.0.0.1:27017/natours
```

3. Install dependencies:

```
npm install
```

4. Import seed data from `dev-data/data`:

```
npm run data:import
```

Optional: delete all imported data:

```
npm run data:delete
```

5. Start the app:

```
npm run dev
```
