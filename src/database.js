const mongoose= require('mongoose');

mongoose.connect('mongodb://127.0.0.1/notes-app-db', {
    useNewUrlParser: true
})
.then(db => console.log('db connected'))
.catch(err => console.error(err));