const functions = require("firebase-functions");
const serviceAccount = require("./service-account.json");
const { initializeApp, cert } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');

const app = initializeApp({
    credential: cert(serviceAccount)
})
const auth = getAuth(app)

exports.protectedEndpoint = functions.https.onRequest(async (request, response) => {
    try {
        const xApiToken = request.headers['x-api-token']
        const decodedToken = await auth.verifyIdToken(xApiToken)
        response.send({ decodedToken });
    } catch (ex) {
        response.status(403).json({
            error: "'x-api-token' header is required!"
        })
    }
});
