const express = require('express');
const router = express.Router();
const database = require('../config/database');
const upload = require('../controller/foto/multer');
const fs = require('fs');
const path = require('path');

router.post('/produk_foto/upload/add', upload.array('foto', 5), async(req, res) => { 
    try {
        req.files.forEach(async x => {
            await database('foto_produk').insert(
              {
                id_produk : req.body.id_produk,
                foto : x.filename
                }
            )
        });
        return res.status(200).json({
            status: 1,
            message: "Success",
        })
    } catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        });
        
    }
})
router.post('/produk_foto/upload/edit', upload.single('foto'),async(req, res) => {
    try {
        const result = await database("foto_produk").select('*').where('id_foto_produk', req.body.id_foto_produk).first();        
        if (result) {
            if (!req.file) {
                await database.from("foto_produk").update({
                    id_produk : req.body.id_produk
               }).where('id_foto_produk', req.body.id_foto_produk);

               return res.status(200).json({
                   status: 1,
                   message: "Success",
               })
           } else {
            await database.from("foto_produk").update({
                id_foto_produk : req.body.id_foto_produk,
                foto : req.file.filename
            }).where('id_foto_produk', req.body.id_foto_produk);
            
            fs.unlink(path.join(__dirname + '/foto') + result.foto, (err) => {
                if (err) {
                    return res.status(200).json({
                        status: 1,
                        message: "Success",
                        error : err   
                })
            } else {
                return res.status(200).json({
                    status: 1,
                    message: "Success"
                })
             }
          });
        }
    } else {
            return res.status(400).json({
                status: 0,
                message: "Data not found",
            })
        }          
} catch (error) {
        return res.status(500).json({
            status:0,
            message: error.message
        })
    }
})
router.delete('/produk_foto/upload/delete/:id_foto_produk', async(req, res) => {
    const result = await database("foto_produk").select('*').where('id_foto_produk', req.params.id_foto_produk).first();
    if (result) {    
        await database('foto_produk').where('id_foto_produk', req.params.id_foto_produk).delete();
    fs.unlink(path.join(__dirname + '/foto') + result.foto, (err) => {
        if (err) {
            return res.status(200).json({
                status: 1,
                message: "Success",
                error : err   
        })
    } else {
        return res.status(200).json({
            status: 1,
            message: "Success"
            })
        }
    });
    }else {
    return res.status(400).json({
        status: 0,
        message: "Data not found",
        })
    }
})


module.exports = router;