const unauthorized = (res) => {
    return res.status(401).send('Unauthorized')
}
const forbidden = (res) => {
    return res.status(403).send('Incorrect data')
}


module.exports = {
    unauthorized, forbidden
}