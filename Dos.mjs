import mongoose from 'mongoose';
import Document from './Doc.mjs';

const dosSchema = new mongoose.Schema({
    id : {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    }, 
    proprietaire: {
        type: String,
        required: true
    },
    documents: {
        type: [Document.schema],
        required: false
    }
});

export default mongoose.model('Dos', dosSchema);