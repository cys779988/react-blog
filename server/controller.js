const model = require('./model');

module.exports = {
    needs: () => upload,
    api : {
        getData : (req, res) => {
            model.api.getData( data => {
                console.log('연결성공')
                return res.send(data)
            })
        },
        addData : (req, res) => {

        },
        modifyData : (req, res) => {

        },
        deleteData : (req, res) => {

        },
    }
}