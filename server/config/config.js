// Port
process.env.PORT = process.env.PORT || 3000;

// Environment
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

// DB
//  - Development: mongodb://localhost:27017/demo
//  - Production: mongodb+srv://admin:Admin1234@cluster0-olv1d.mongodb.net/test

let urlMongoDb;

if (process.env.NODE_ENV === 'dev') {
    urlMongoDb = 'mongodb://localhost:27017/demo';
}
else {
    urlMongoDb = 'mongodb+srv://admin:pass@cluster0-olv1d.mongodb.net/test';
}

process.env.URL_DB = urlMongoDb;

// JWT

process.env.JWT_EXPIRATION = 60 * 60 * 24 * 30;
process.env.JWT_SEED = process.env.JWT_SEED || 'SECRET_FOR_JWT_DEMO';
