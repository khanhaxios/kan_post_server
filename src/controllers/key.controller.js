import express from 'express';
import {Key} from '../models/key.model.js'

const keyRouter = express.Router();

keyRouter.post('/check-key/:code', async (req, res) => {
    const code = req.params.code;
    if (code) {
        // check code
        const result = await Key.findByCode(code);
        if (!result) {
            res.status(400).json({error: 'Invalid key'});
            return;
        }
        if (!result.canUse) {
            return res.status(400).json({error: 'Invalid key'});
        }
        return res.status(200).json({hash: result.hash});
    }
});
keyRouter.post('/new-key', async (req, res) => {
    // check code
    const result = await Key.generateNewKey();
    if (!result) {
        res.status(400).json({error: 'Invalid key'});
        return;
    }
    if (!result.canUse) {
        return res.status(400).json({error: 'Invalid key'});
    }
    return res.status(200).json({code: result.code});
});
export default keyRouter;