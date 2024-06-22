const unauthorized = (res) => {
    return res.status(401).send('Unauthorized')
}
const forbidden = (res) => {
    return res.status(403).send('Incorrect data')
}
const notfound = (res) => {
    return res.status(404).send('No Data')
}



module.exports = {
    unauthorized, forbidden
}