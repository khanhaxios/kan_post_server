import express from 'express';
import {randomUUID} from "crypto";
import hasher from "crypto";
import {Account} from "../models/account.model.js";

const accountRouter = express.Router();

export function removeVietnameseTones(str) {
    str = str.toLowerCase(); // Chuyển thành chữ thường
    str = str.normalize('NFD').replace(/[\u0300-\u036f]/g, ''); // Loại bỏ dấu tiếng Việt
    str = str.replace(/đ/g, 'd'); // Thay thế 'đ' thành 'd'
    str = str.replace(/\s+/g, ''); // Xóa khoảng trắng giữa các từ
    return str;
}

accountRouter.post('/create', async (req, res) => {
    const [name, hash] = [req.body.name, req.body.hash];
    const username = removeVietnameseTones(name);
    const data = username + randomUUID() + hash;
    const exitUser = await Account.findOne({username: username});
    if (exitUser) {
        res.status(400).json({message: 'Tài khoản đã tồn tại!'});
        return;
    }
    const newHash = hasher.createHash('sha256').update(data).digest('hex')
    const newUser = new Account({
        username: username,
        name: name,
        hash: newHash,
        tickets: 2000
    });
    await newUser.save();
    res.status(200).json({message: "create new user successfully", data: newHash});
});
accountRouter.post('/login', async (req, res) => {
    const [hash] = [req.body.hash];
    const user = await Account.findOne({hash: hash});
    if (user) {
        res.status(200).json(user);
    } else {
        res.status(404).json({message: "User not found!"});
    }
});
export default accountRouter;